"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  message,
  Pagination,
  Spin,
  Modal,
  Form,
  Input,
  Button,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { GetApiResponse } from "@/interface/InterfaceGetApiResponse";
import { Customer } from "@/interface/InterfaceCustomer";
import { ActionButton } from "../Button/ActionButton";
import UserUpdateForm from "./UserUpdateForm";

const sharedHeaderStyle: React.CSSProperties = {
  backgroundColor: "#fafafa",
  fontWeight: 600,
  fontSize: 14,
  textAlign: "left",
  border: "2px solid #f0f0f0",
  borderRadius: "0px 0px 0 0",
  padding: "12px",
  whiteSpace: "normal",
  wordBreak: "break-word",
};
const sharedCellStyle: React.CSSProperties = {
  border: "2px solid #f0f0f0",
  padding: "12px",
  whiteSpace: "normal",
  wordBreak: "break-word",
};
const LoadingTab = () => {
  return (
    <div
      style={{
        width: "100%",
        borderCollapse: "collapse",
        minHeight: "508px ",
        paddingBottom: "50px",
        border: "2px solid #f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin spinning={true} size="large" />
    </div>
  );
};
export default function CustomerTable() {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCustomers = async (page = 1, limit = 7) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/user?page=${page}&limit=8`
      );
      const json: GetApiResponse = await res.json();

      if (json.statusCode === 200) {
        setData(json.data.customers);
        setCurrentPage(json.data.currentPage);
        setPageSize(limit);
        setTotalItems(json.data.totalItems);
      } else {
        message.error(json.message || "Lỗi khi tải dữ liệu khách hàng");
      }
    } catch {
      message.error("Lỗi kết nối API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, pageSize);
  }, []);
  const handleUpdateSuccess = (updatedUser: Customer) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };
  const onPageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
    fetchCustomers(page, pageSize || 8);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: "20%",
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({ style: sharedCellStyle }),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({ style: sharedCellStyle }),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "10%",
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({ style: sharedCellStyle }),
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      width: "20%",
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({ style: sharedCellStyle }),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: "12%",
      render: (_, record) => (
        <button
          onClick={() => alert(`Liên hệ với ${record.name}`)}
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
            margin: "0 auto",
          }}
        >
          Liên hệ
        </button>
      ),
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({
        style: {
          border: "2px solid #f0f0f0",
          padding: "12px",
          textAlign: "center",
        },
      }),
    },
    {
      title: "Hành động",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 22, justifyContent: "center" }}>
          <ActionButton
            text="Chỉnh sửa"
            color="#52c41a"
            onClick={() => {
              setSelectedUser(record);
              form.setFieldsValue(record); // gán dữ liệu vào form
              setIsModalVisible(true);
            }}
          />
          <button
            onClick={() => alert(`Xóa ${record.name}`)}
            style={{
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            Xóa
          </button>
        </div>
      ),
      onHeaderCell: () => ({ style: sharedHeaderStyle }),
      onCell: () => ({ style: sharedCellStyle }),
    },
  ];

  // Component hiển thị skeleton bảng trong khi loading

  return (
    <div
      style={{
        padding: 20,
        width: "90%",
        display: "flex",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      {loading ? (
        <LoadingTab />
      ) : (
        <div
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <Table
            style={{
              width: "100%",
              minHeight: "530px",
            }}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={onPageChange}
              style={{ marginTop: 15, textAlign: "right" }}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      <UserUpdateForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        user={selectedUser}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
