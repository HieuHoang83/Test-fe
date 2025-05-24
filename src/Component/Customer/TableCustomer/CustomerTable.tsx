"use client";
import React, { useEffect, useState } from "react";
import { Table, message, Pagination, Spin, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";

import { Customer } from "@/interface/InterfaceCustomer";

import classNames from "classnames/bind";
import styles from "./CustomerTable.module.scss";
import { GetCustomerResponse } from "@/interface/InterfaceGetApiResponse";
import ContactLink from "@/Component/Button/ContactLink/LinkButton";
import { ActionButton } from "@/Component/Button/ButtonAction/ActionButton";
import UserUpdateForm from "../Userform/UserForm";
const cx = classNames.bind(styles);

const LoadingTab = () => {
  return (
    <div className={cx("loadingWrapper")}>
      <Spin spinning={true} size="large" />
    </div>
  );
};

export default function CustomerTable() {
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);

  const fetchCustomers = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const baseUrl = search
        ? `http://localhost:8000/api/v1/user/search?query=${search}&page=${page}&limit=6`
        : `http://localhost:8000/api/v1/user?page=${page}&limit=6`;

      const res = await fetch(baseUrl);
      const json: GetCustomerResponse = await res.json();
      console.log(json);
      if (json.statusCode === 200) {
        setData(json.data.customers);
        setCurrentPage(json.data.currentPage);
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

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/user/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Xóa thất bại");
      }
      message.success("Xóa khách hàng thành công!");
      fetchCustomers(currentPage);
    } catch (error: any) {
      message.error(error.message || "Xóa thất bại");
    }
  };

  const handleUpdateSuccess = (updatedUser: Customer) => {
    setData((prevData) =>
      prevData.map((user) =>
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const handleUserUpdate = async (values: Customer) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/user/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();

      if (result.statusCode === 200) {
        message.success("Cập nhật người dùng thành công!");
        handleUpdateSuccess(result.data);
        setIsUpdateModalVisible(false);
      } else {
        message.error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi cập nhật");
    }
  };

  const handleUserCreate = async (values: Customer) => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      console.log(result);
      if (result.statusCode === 201) {
        message.success("Tạo người dùng thành công!");
        setData((prev) => [result.data, ...prev]);
        setIsCreateModalVisible(false);
      } else {
        message.error(result.message || "Tạo người dùng thất bại");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra khi tạo người dùng");
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchCustomers(1, value);
  };

  useEffect(() => {
    fetchCustomers(currentPage);
  }, []);

  const sharedHeaderCellProps = {
    className: cx("headerCell"),
  };

  const sharedCellProps = {
    className: cx("cell"),
  };

  const columns: ColumnsType<Customer> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      className: cx("col-name"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: cx("col-email"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      className: cx("col-phone"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      className: cx("col-company"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Liên hệ",
      key: "contact",
      className: cx("col-contact"),
      render: (_, record) => (
        <ContactLink href={`/contact/${record.id}`}>Liên hệ</ContactLink>
      ),
      onHeaderCell: () => ({
        className: cx("headerCellaction"),
      }),
      onCell: () => ({
        className: cx("centeredCell"),
      }),
    },
    {
      title: "Hành động",
      key: "action",
      className: cx("col-action"),
      render: (_, record) => (
        <div className={cx("actionButtons")}>
          <ActionButton
            text="Chỉnh sửa"
            color="#52c41a"
            onClick={() => {
              setSelectedUser(record);
              form.setFieldsValue(record);
              setIsUpdateModalVisible(true);
            }}
          />
          <ActionButton
            text="Xóa"
            color="#ff4d4f"
            onClick={() => {
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa khách hàng này?",
                okText: "Xóa",
                cancelText: "Hủy",
                centered: true,
                onOk: () => handleDelete(record.id),
              });
            }}
          />
        </div>
      ),
      onHeaderCell: () => ({
        className: cx("headerCellaction"),
      }),
      onCell: () => sharedCellProps,
    },
  ];

  const onPageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    fetchCustomers(page);
  };

  return (
    <div className={cx("wrapper")}>
      <>
        {loading ? (
          <LoadingTab />
        ) : (
          <div className={cx("tableContainer")} style={{ maxWidth: "100%" }}>
            <div className={cx("searchWrapper")}>
              <button
                onClick={() => setIsCreateModalVisible(true)}
                className={cx("btnAddCustom")}
              >
                Thêm khách hàng
              </button>
              <Input.Search
                placeholder="Tìm kiếm theo tên, email..."
                allowClear
                enterButton="Tìm"
                size="middle"
                style={{ width: 300 }}
                onSearch={handleSearch}
              />
            </div>
            <Table
              className={cx("table")}
              columns={columns}
              dataSource={data}
              rowKey="id"
              pagination={false}
              scroll={{ x: "max-content" }}
            />
            <div className={cx("paginationWrapper")}>
              <Pagination
                current={currentPage}
                pageSize={6}
                total={totalItems}
                showSizeChanger={false}
                onChange={onPageChange}
              />
            </div>
          </div>
        )}

        <UserUpdateForm
          visible={isCreateModalVisible}
          onCancel={() => {
            setIsCreateModalVisible(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUserCreate}
        />
        <UserUpdateForm
          visible={isUpdateModalVisible}
          onCancel={() => {
            setIsUpdateModalVisible(false);
            setSelectedUser(null);
          }}
          onSubmit={handleUserUpdate}
          user={selectedUser}
        />
      </>
    </div>
  );
}
