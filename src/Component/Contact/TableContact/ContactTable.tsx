"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, message, Pagination, Spin, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Contact } from "@/interface/InterfaceContact";

import classNames from "classnames/bind";
import styles from "./ContactTable.module.scss";
import ContactForm from "../ContactForm/ContactForm";
import { ActionButton } from "@/Component/Button/ButtonAction/ActionButton";
const cx = classNames.bind(styles);

const LoadingTab = () => (
  <div className={cx("loadingWrapper")}>
    {" "}
    <Spin spinning size="large" />{" "}
  </div>
);

interface ContactTableProps {
  customerId: string;
}

export default function ContactTable({ customerId }: ContactTableProps) {
  const [form] = Form.useForm();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [modalMode, setModalMode] = useState<"create" | "update" | null>(null);

  const fetchContacts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const url = `http://localhost:8000/api/v1/contact/customer/${customerId}?page=${page}&limit=6`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.statusCode === 200) {
          setContacts(json.data.contacts);
          setCurrentPage(json.data.currentPage);
          setTotalItems(json.data.totalItems);
        } else {
          message.error(json.message || "Lỗi tải liên hệ");
        }
      } catch {
        message.error("Lỗi kết nối API");
      } finally {
        setLoading(false);
      }
    },
    [customerId]
  );

  useEffect(() => {
    if (customerId) fetchContacts(currentPage);
  }, [fetchContacts, currentPage, customerId]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/contact/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Xóa thất bại");
      message.success("Xóa liên hệ thành công");
      fetchContacts(currentPage);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSubmit = async (values: Contact) => {
    const isUpdate = modalMode === "update";
    const url = isUpdate
      ? `http://localhost:8000/api/v1/contact/${selectedContact?.id}`
      : `http://localhost:8000/api/v1/contact`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, customerId }),
      });
      const result = await res.json();

      if (res.ok) {
        message.success(
          isUpdate ? "Cập nhật thành công" : "Thêm liên hệ thành công"
        );
        setModalMode(null);
        setSelectedContact(null);
        fetchContacts(currentPage);
      } else {
        message.error(result.message || "Thao tác thất bại");
      }
    } catch {
      message.error("Đã có lỗi xảy ra");
    }
  };

  const columns: ColumnsType<Contact> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className={cx("actionButtons")}>
          <ActionButton
            text="Chỉnh sửa"
            color="#52c41a"
            onClick={() => {
              setSelectedContact(record);
              form.setFieldsValue(record);
              setModalMode("update");
            }}
          />
          <ActionButton
            text="Xóa"
            color="#ff4d4f"
            onClick={() =>
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa liên hệ này?",
                okText: "Xóa",
                cancelText: "Hủy",
                centered: true,
                onOk: () => handleDelete(record.id),
              })
            }
          />
        </div>
      ),
    },
  ];

  return (
    <div className={cx("wrapper")}>
      {loading ? (
        <LoadingTab />
      ) : (
        <div className={cx("tableContainer")}>
          <div className={cx("searchWrapper")}>
            <button
              className={cx("btnAddContact")}
              onClick={() => setModalMode("create")}
            >
              Thêm liên hệ
            </button>
            {/* <Input.Search
              placeholder="Tìm kiếm theo tên, email..."
              allowClear
              enterButton="Tìm"
              size="middle"
              style={{ width: 300 }}
              onSearch={handleSearch}
            /> */}
          </div>

          <Table
            className={cx("table")}
            columns={columns}
            dataSource={contacts}
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
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* <ContactForm
        visible={modalMode !== null}
        customerId={customerId}
        onCancel={() => {
          setModalMode(null);
          setSelectedContact(null);
        }}
        onSubmit={handleSubmit}
      /> */}
    </div>
  );
}
