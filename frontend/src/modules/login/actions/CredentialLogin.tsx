import { Button, Form } from "antd";
import { LoginForm } from "../forms/Login";
import { AuthApi } from "@/apis/auth";

export const CredentialLoginAction = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (value: any) => {
    try {
      const res = await AuthApi.credentialLogin(value);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <LoginForm form={form} onSubmit={handleSubmit} />
      <Button block type="primary" onClick={form.submit}>
        Login
      </Button>
    </div>
  );
};
