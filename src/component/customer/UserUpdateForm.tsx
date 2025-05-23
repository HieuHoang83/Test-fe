import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { Customer } from "@/interface/InterfaceCustomer";

interface UserUpdateFormProps {
  visible: boolean;
  onCancel: () => void;
  onUpdateSuccess: (updatedUser: Customer) => void; // <-- nhận tham số ở đây
  user: Customer | null;
}

const UserUpdateForm: React.FC<UserUpdateFormProps> = ({
  visible,
  onCancel,
  onUpdateSuccess,
  user,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await fetch(
        `http://localhost:8000/api/v1/user/${user?.id}`,
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
        onUpdateSuccess(result?.data);
        onCancel();
      } else {
        message.error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra khi cập nhật");
    }
  };

  return (
    <Modal
      visible={visible}
      title="Cập nhật thông tin người dùng"
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Công ty" name="company">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserUpdateForm;
