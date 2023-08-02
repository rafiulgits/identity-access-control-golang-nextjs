import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { useProducts } from "@/store/data/product";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState } from "react";
import { ProductUpsertForm } from "../forms/Upsert";
import { useErrorsAlert } from "@/components/ErrorsAlert";

export const ProductCreateAction = () => {
  const { visible, toggle } = useToggle();
  const { add } = useProducts();
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
      message.success("Product Created");
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
        Create Product
      </Button>
      <FormModal
        title="Create Product"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <ProductUpsertForm onSubmit={handleCreate} form={form} />
      </FormModal>
    </>
  );
};
