import { Button, Form, Modal, message } from "antd";
import { AccountDto, AccountUpsertDto } from "@/models/user";
import { EditFilled } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useUsers } from "@/store/data/user";
import { AccountUpsertForm } from "../forms/AccountUpsert";
import { useToggle } from "@/hooks";

interface Props {
  account: AccountDto;
}
export const AccountUpdateAction = (props: Props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { updateAccount } = useUsers();
  const { visible, toggle } = useToggle();

  useEffect(() => {
    setDefaultValues();
  }, [props.account]);

  const setDefaultValues = () => {
    form.setFieldsValue(props.account);
  };

  const handleClose = () => {
    form.resetFields();
    setDefaultValues();
    toggle();
  };

  const handleSubmit = async (data: AccountUpsertDto) => {
    setIsLoading(true);
    data.id = props.account.id;
    data.userId = props.account.userId;
    const err = await updateAccount(data);
    if (err) {
      message.error(err.message);
    } else {
      message.success("Account Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={toggle}
        icon={<EditFilled />}
        type="text"
        loading={isLoading}
      />
      <Modal
        centered
        open={visible}
        title="Account Update"
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
