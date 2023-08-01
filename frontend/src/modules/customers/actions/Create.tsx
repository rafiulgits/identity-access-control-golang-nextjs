import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { useCustomers } from "@/store/data/customer";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState } from "react";
import { CustomerUpsertForm } from "../forms/Upsert";
import { useErrorsAlert } from "@/components/ErrorsAlert";

export const CustomerCreateAction = () => {
  const { visible, toggle } = useToggle();
  const { add } = useCustomers();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  const handleCreate = async (data: any) => {
    setIsLoading(true);
    const err = await add(data);
    if (err) {
      message.error(err.message);
      if (err.isResponseError()) {
        errorAlert.showError(
          err.message,
          err.asResponseError().getFieldErrorMessages()
        );
      }
    } else {
      message.success("Customer Created");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    form.resetFields();
    errorAlert.hideError();
    toggle();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={toggle}>
        Create Customer
      </Button>
      <FormModal
        title="Create Customer"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <CustomerUpsertForm onSubmit={handleCreate} form={form} />
      </FormModal>
    </>
  );
};
