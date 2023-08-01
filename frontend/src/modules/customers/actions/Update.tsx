import { useErrorsAlert } from "@/components/ErrorsAlert";
import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { CustomerDto, CustomerUpsertDto } from "@/models/customer";
import { EditFilled } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState, useEffect } from "react";
import { CustomerUpsertForm } from "../forms/Upsert";
import { useCustomers } from "@/store/data/customer";

interface Props {
  customer: CustomerDto;
}

export const CustomerUpdateAction = (props: Props) => {
  const { visible, toggle } = useToggle();
  const { update } = useCustomers();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  useEffect(() => {
    form.setFieldsValue(props.customer);
  }, [props.customer]);

  const handleUpdate = async (data: CustomerUpsertDto) => {
    setIsLoading(true);
    data.id = props.customer.id;
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
      message.success("Customer Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    form.setFieldsValue(props.customer);
    errorAlert.hideError();
    toggle();
  };

  return (
    <>
      <Button type="text" onClick={toggle}>
        <EditFilled />
      </Button>
      <FormModal
        title="Update Customer"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <CustomerUpsertForm onSubmit={handleUpdate} form={form} />
      </FormModal>
    </>
  );
};
