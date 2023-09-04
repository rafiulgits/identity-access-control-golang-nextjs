import { useToggle } from "@/hooks";
import { Button, Form, message } from "antd";
import { PolicyUpsertForm } from "../forms/Upsert";
import { EditFilled } from "@ant-design/icons";
import { usePolicies } from "@/store/data/policy";
import { FormModal } from "@/components/FormModal";
import { useEffect, useState } from "react";
import { useErrorsAlert } from "@/components/ErrorsAlert";
import { PolicyDto, PolicyUpsertDto } from "@/models/policy";

interface Props {
  policy: PolicyDto;
}

export const PolicyUpdateAction = (props: Props) => {
  const { toggle, visible } = useToggle();
  const [form] = Form.useForm();
  const { update } = usePolicies();
  const [isLoading, setIsLoading] = useState(false);
  const errorAlert = useErrorsAlert();

  useEffect(() => {
    form.setFieldsValue(props.policy);
  }, [props]);

  const handleUpdate = async (policy: PolicyUpsertDto) => {
    setIsLoading(true);
    policy.id = props.policy.id;
    const err = await update(policy);
    if (err) {
      message.error(err.message);
      if (err.isResponseError()) {
        errorAlert.showError(
          err.message,
          err.asResponseError().getFieldErrorMessages()
        );
      }
    } else {
      message.success("Policy Updated");
      handleClose();
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    form.resetFields();
    form.setFieldsValue(props.policy);
    toggle();
  };

  return (
    <>
      <Button type="primary" icon={<EditFilled />} onClick={toggle} />
      <FormModal
        destroyOnClose
        title="Update Policy"
        open={visible}
        onCancel={handleClose}
        onOk={form.submit}
        errors={errorAlert.errors()}
        loading={isLoading}
      >
        <PolicyUpsertForm form={form} onSubmit={handleUpdate} />
      </FormModal>
    </>
  );
};
