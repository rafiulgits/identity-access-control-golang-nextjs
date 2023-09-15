import { Button, Card, Form, message } from "antd";
import { UserUpdateForm } from "../forms/UserUpdate";
import { UserDto, UserUpdateDto } from "@/models/user";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useUsers } from "@/store/data/user";

interface Props {
  user: UserDto;
}
export const UserUpdateAction = (props: Props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useUsers();

  useEffect(() => {
    setDefaultValues();
  }, [props.user]);

  const setDefaultValues = () => {
    form.setFieldsValue({
      name: props.user.name,
      policyIds: props.user.policies.map((p) => p.policyId),
    });
  };

  const handleClose = () => {
    form.resetFields();
    setDefaultValues();
  };

  const handleSubmit = async (data: UserUpdateDto) => {
    setIsLoading(true);
    data.id = props.user.id;
    const err = await update(data);
    if (err) {
      message.error(err.message);
    } else {
      message.success("User Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  return (
    <Card
      title="User Profile & Permissions"
      extra={
        <Button
          type="primary"
          loading={isLoading}
          icon={<SaveOutlined />}
          onClick={form.submit}
        >
          Save User
        </Button>
      }
    >
      <UserUpdateForm form={form} onSubmit={handleSubmit} />
    </Card>
  );
};
