import { Modal, ModalProps } from "antd";
import { SpinC } from "./lib";

interface Props extends ModalProps {
  loading?: boolean;
  errors?: React.ReactNode;
}

export const FormModal = (props: Props) => {
  const { errors, loading, children, ...restProps } = props;
  return (
    <Modal
      okButtonProps={{ type: "primary", disabled: loading }}
      cancelButtonProps={{ disabled: loading }}
      centered={true}
      okText="Save"
      maskClosable={false}
      {...restProps}
    >
      <SpinC spinning={loading ?? false}>
        {errors}
        {children}
      </SpinC>
    </Modal>
  );
};
