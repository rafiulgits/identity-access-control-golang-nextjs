import { useToggle } from "@/hooks";
import { Button, Form, message } from "antd";
import { PolicyUpsertForm } from "../forms/Upsert";
import { PlusOutlined } from "@ant-design/icons";
import { usePolicies } from "@/store/data/policy";
import { FormModal } from "@/components/FormModal";
import { useState } from "react";
import { useErrorsAlert } from "@/components/ErrorsAlert";
import { PolicyUpsertDto } from "@/models/policy";

export const PolicyCreateAction = () => {
  const { toggle, visible } = useToggle();
  const [form] = Form.useForm();
  const { add } = usePolicies();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  const handleCreate = async (values: PolicyUpsertDto) => {
    setIsLoading(true);
    const err = await add(values);
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
    toggle();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={toggle}>
        Create Policy
      </Button>
      <FormModal
        title="Create Policy"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <PolicyUpsertForm form={form} onSubmit={handleCreate} />
      </FormModal>
    </>
  );
};
