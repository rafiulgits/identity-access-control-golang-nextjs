import { useErrorsAlert } from "@/components/ErrorsAlert";
import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { ProductDto, ProductUpsertDto } from "@/models/product";
import { EditFilled } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState, useEffect } from "react";
import { ProductUpsertForm } from "../forms/Upsert";
import { useProducts } from "@/store/data/product";

interface Props {
  product: ProductDto;
}

export const ProductUpdateAction = (props: Props) => {
  const { visible, toggle } = useToggle();
  const { update } = useProducts();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  useEffect(() => {
    form.setFieldsValue(props.product);
  }, [props.product]);

  const handleUpdate = async (data: ProductUpsertDto) => {
    setIsLoading(true);
    data.id = props.product.id;
    const err = await update(data);
    if (err) {
      message.error(err.message);
      if (err.isResponseError()) {
        errorAlert.showError(
          err.message,
          err.asResponseError().getFieldErrorMessages()
        );
      }
    } else {
      message.success("Product Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    form.setFieldsValue(props.product);
    errorAlert.hideError();
    toggle();
  };

  return (
    <>
      <Button type="text" onClick={toggle}>
        <EditFilled />
      </Button>
      <FormModal
        title="Update Product"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <ProductUpsertForm onSubmit={handleUpdate} form={form} />
      </FormModal>
    </>
  );
};
