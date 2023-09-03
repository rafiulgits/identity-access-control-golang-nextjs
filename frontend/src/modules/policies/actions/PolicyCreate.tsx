import { useToggle } from "@/hooks";
import { Button, Form, Modal } from "antd";
import { PolicyUpsertForm } from "../forms/Upsert";
import { permissionIndex } from "@/util/values";
import { PlusOutlined } from "@ant-design/icons";

const permissions: Record<string, number> = {
  read: 1,
  write: 0,
  update: 2,
  delete: 3,
};

export const PolicyCreateAction = () => {
  const { toggle, visible } = useToggle();
  const [form] = Form.useForm();

  const handleCreate = (values: any) => {
    values["permissions"].forEach((perm: any) => {
      let access = ["0", "0", "0", "0"];
      perm["permission"].forEach((p: string) => {
        access[permissionIndex[p]] = "1";
      });
      perm["access"] = access.join("");
      delete perm["permission"];
    });

    console.log(values);
  };

  const handleClose = () => {
    form.resetFields();
    toggle();
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={toggle}>
        Create Policy
      </Button>
      <Modal
        centered
        open={visible}
        title="Create Policy"
        okText="Create"
        onOk={form.submit}
        onCancel={handleClose}
      >
        <PolicyUpsertForm form={form} onSubmit={handleCreate} />
      </Modal>
    </>
  );
};
