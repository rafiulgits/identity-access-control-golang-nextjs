import { useToggle } from "@/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, message } from "antd";
import { UserCreateForm } from "../forms/Create";
import { UserCreateDto } from "@/models/user";
import { FormModal } from "@/components/FormModal";
import { useUsers } from "@/store/data/user";
import { useState } from "react";
import { useErrorsAlert } from "@/components/ErrorsAlert";

export const UserCreateAction = () => {
  const { toggle, visible } = useToggle();
  const { add } = useUsers();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  const handleCreate = async (data: UserCreateDto) => {
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
      message.success("User Created");
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
      <Button onClick={toggle} icon={<PlusOutlined />} type="primary">
        Create User
      </Button>
      <FormModal
        title="Create User"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <UserCreateForm form={form} onSubmit={handleCreate} />
      </FormModal>
    </>
  );
};
