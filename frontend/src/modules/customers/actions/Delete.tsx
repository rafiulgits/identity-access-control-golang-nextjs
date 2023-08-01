import { useCustomers } from "@/store/data/customer";
import { DeleteFilled } from "@ant-design/icons";
import { message, Popconfirm, Button } from "antd";
import { useState } from "react";

interface Props {
  customerId: number;
}

export const CustomerDeleteAction = (props: Props) => {
  const { remove } = useCustomers();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const err = await remove(props.customerId);
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
      <Button loading={isDeleting} type="text" danger>
        {!isDeleting && <DeleteFilled />}
      </Button>
    </Popconfirm>
  );
};
