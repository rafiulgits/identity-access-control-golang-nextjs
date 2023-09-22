import { Button, Form } from "antd";
import { LoginForm } from "../forms/Login";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";

export const CredentialLoginAction = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { error, callbackUrl } = router.query;
  const { status } = useSession();

  const getLoginSuccessRedirectUrl = () => {
    if (callbackUrl && typeof callbackUrl === "string") {
      return callbackUrl;
    }
    return "/profile";
  };

  const handleLogin = async (data: any) => {
    const res = await signIn("credential", {
      ...data,
      callbackUrl: getLoginSuccessRedirectUrl(),
      redirect: false,
    });

    if (res) {
      if (res.ok) {
        router.push(res.url!);
      } else {
        router.push(`/auth/login?error=${res.error}`, undefined, {
          shallow: true,
        });
      }
    }
  };

  return (
    <div>
      <LoginForm form={form} onSubmit={handleLogin} />
      <Button block type="primary" onClick={form.submit}>
        Login
      </Button>
    </div>
  );
};
