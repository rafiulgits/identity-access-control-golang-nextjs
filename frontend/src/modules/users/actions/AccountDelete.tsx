import { AccountDto } from "@/models/user";
import { useUsers } from "@/store/data/user";
import { DeleteFilled } from "@ant-design/icons";
import { message, Popconfirm, Button } from "antd";
import { useState } from "react";

interface Props {
  account: AccountDto;
}

export const AccountDeleteAction = (props: Props) => {
  const { removeAccount } = useUsers();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const err = await removeAccount(props.account.userId, props.account.id);
    if (err) {
      message.error(err.message);
    } else {
      message.success("Deleted");
    }
    setIsDeleting(false);
  };

  return (
    <Popconfirm
      okText="Confirm"
      onConfirm={handleDelete}
      title="Delete Confirmation"
      okButtonProps={{ danger: true }}
      description="Are you sure to delete?"
    >
      <Button loading={isDeleting} type="text" danger icon={<DeleteFilled />} />
    </Popconfirm>
  );
};
