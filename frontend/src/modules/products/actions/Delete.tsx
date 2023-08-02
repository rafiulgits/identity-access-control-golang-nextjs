import { useProducts } from "@/store/data/product";
import { DeleteFilled } from "@ant-design/icons";
import { message, Popconfirm, Button } from "antd";
import { useState } from "react";

interface Props {
  productId: number;
}

export const ProductDeleteAction = (props: Props) => {
  const { remove } = useProducts();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const err = await remove(props.productId);
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
