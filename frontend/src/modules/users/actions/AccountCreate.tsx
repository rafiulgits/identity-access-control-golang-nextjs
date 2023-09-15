import { Button, Form, Modal, message } from "antd";
import { AccountUpsertDto, UserDto } from "@/models/user";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useUsers } from "@/store/data/user";
import { AccountUpsertForm } from "../forms/AccountUpsert";
import { useToggle } from "@/hooks";

interface Props {
  user: UserDto;
}
export const AccountCreateAction = (props: Props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { addAccount } = useUsers();
  const { visible, toggle } = useToggle();

  const handleClose = () => {
    form.resetFields();
    toggle();
  };

  const handleSubmit = async (data: AccountUpsertDto) => {
    setIsLoading(true);
    data.userId = props.user.id;
    const err = await addAccount(data);
    if (err) {
      message.error(err.message);
    } else {
      message.success("Account Created");
      handleClose();
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={toggle}
        icon={<PlusOutlined />}
        type="primary"
        loading={isLoading}
      >
        New Account
      </Button>
      <Modal
        centered
        open={visible}
        title="Account Create"
        okText="Save"
        okButtonProps={{ type: "primary" }}
        onOk={form.submit}
        onCancel={handleClose}
      >
        <AccountUpsertForm form={form} onSubmit={handleSubmit} />
      </Modal>
    </>
  );
};
