import { useVendors } from "@/store/data/vendor";
import { DeleteFilled } from "@ant-design/icons";
import { message, Popconfirm, Button } from "antd";
import { useState } from "react";

interface Props {
  vendorId: number;
}

export const VendorDeleteAction = (props: Props) => {
  const { remove } = useVendors();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const err = await remove(props.vendorId);
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
