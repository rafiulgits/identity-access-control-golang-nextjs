import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { useVendors } from "@/store/data/vendor";
import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState } from "react";
import { VendorUpsertForm } from "../forms/Upsert";
import { useErrorsAlert } from "@/components/ErrorsAlert";

export const VendorCreateAction = () => {
  const { visible, toggle } = useToggle();
  const { add } = useVendors();
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
      message.success("Vendor Created");
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
        Create Vendor
      </Button>
      <FormModal
        title="Create Vendor"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <VendorUpsertForm onSubmit={handleCreate} form={form} />
      </FormModal>
    </>
  );
};
