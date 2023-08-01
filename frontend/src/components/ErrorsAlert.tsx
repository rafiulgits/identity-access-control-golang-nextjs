import { WarningFilled } from "@ant-design/icons";
import { Alert, List } from "antd";
import { useState } from "react";

interface Props {
  title: string;
  errorList: string[];
}

export const ErrorsAlert = (props: Props) => {
  return (
    <Alert
      type="error"
      showIcon
      message={props.title}
      description={
        props.errorList.length > 0 && (
          <List
            size="small"
            dataSource={props.errorList}
            renderItem={(e, i) => (
              <List.Item key={i}>
                <WarningFilled style={{ color: "red" }} /> {e}
              </List.Item>
            )}
          />
        )
      }
    />
  );
};

export const useErrorsAlert = () => {
  const [title, setTitle] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const [view, setView] = useState(false);

  const errors = () => {
    if (!view) {
      return <></>;
    }

    return (
      <>
        <ErrorsAlert title={title ?? "Error"} errorList={messages} />
        <br />
      </>
    );
  };

  const hideError = () => {
    setMessages([]);
    setTitle(undefined);
    setView(false);
  };

  const showError = (errorTitle: string, errorMessages: string[]) => {
    setMessages(errorMessages);
    setTitle(errorTitle);
    setView(true);
  };

  return {
    errors,
    showError,
    hideError,
  };
};
