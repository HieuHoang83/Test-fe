import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";

type ContactFormProps = {
  visible: boolean;
  onCancel: () => void;
  customerId: string; // truyền từ ngoài vào
  onSubmit: (values: {
    name: string;
    email: string;
    note: string;
    position: string;
    customerId: string;
  }) => void;
};

const ContactForm: React.FC<ContactFormProps> = ({
  visible,
  onCancel,
  customerId,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields(); // reset mỗi lần mở form
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const submitValues = {
        ...values,
        customerId,
      };

      await onSubmit(submitValues);
      message.success("Gửi thông tin liên hệ thành công");
      form.resetFields();
      onCancel();
    } catch (error) {
      message.error("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <Modal
      open={visible}
      title="Thêm liên hệ mới"
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Gửi"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên người liên hệ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input placeholder="Nguyễn Văn C" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input placeholder="nguyenvanc@example.com" />
        </Form.Item>

        <Form.Item
          label="Chức vụ"
          name="position"
          rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}
        >
          <Input placeholder="Trưởng phòng kinh doanh" />
        </Form.Item>

        <Form.Item
          label="Ghi chú"
          name="note"
          rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
        >
          <Input.TextArea placeholder="Liên hệ phụ trách hợp đồng năm 2025" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactForm;
