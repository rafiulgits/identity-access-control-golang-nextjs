import { useErrorsAlert } from "@/components/ErrorsAlert";
import { FormModal } from "@/components/FormModal";
import { useToggle } from "@/hooks";
import { VendorDto, VendorUpsertDto } from "@/models/vendor";
import { EditFilled } from "@ant-design/icons";
import { Form, message, Button } from "antd";
import { useState, useEffect } from "react";
import { VendorUpsertForm } from "../forms/Upsert";
import { useVendors } from "@/store/data/vendor";

interface Props {
  vendor: VendorDto;
}

export const VendorUpdateAction = (props: Props) => {
  const { visible, toggle } = useToggle();
  const { update } = useVendors();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  useEffect(() => {
    form.setFieldsValue(props.vendor);
  }, [props.vendor]);

  const handleUpdate = async (data: VendorUpsertDto) => {
    setIsLoading(true);
    data.id = props.vendor.id;
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
      message.success("Vendor Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    form.setFieldsValue(props.vendor);
    errorAlert.hideError();
    toggle();
  };

  return (
    <>
      <Button type="text" onClick={toggle}>
        <EditFilled />
      </Button>
      <FormModal
        title="Update Vendor"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <VendorUpsertForm onSubmit={handleUpdate} form={form} />
      </FormModal>
    </>
  );
};
