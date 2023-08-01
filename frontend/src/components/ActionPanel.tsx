import { Card, Col, Row, Typography } from "antd";
import { ReactNode } from "react";

interface Props {
  title?: string | React.ReactNode;
  rightActions?: Array<ReactNode>;
  leftActions?: Array<ReactNode>;
}

export const ActionPanel = (props: Props) => {
  return (
    <Card>
      <Typography.Text>
        {typeof props.title === "string" ? (
          <h3>{props.title}</h3>
        ) : (
          <>{props.title}</>
        )}
      </Typography.Text>
      <Row gutter={[16, 16]} justify="space-between">
        <Col>
          {props.leftActions && (
            <Row gutter={[12, 12]} justify="start">
              {props.leftActions.map((node, idx) => (
                <Col key={idx}>{node}</Col>
              ))}
            </Row>
          )}
        </Col>
        <Col style={{ justifyContent: "right" }}>
          {props.rightActions && (
            <Row gutter={[12, 12]} justify="end">
              {props.rightActions.map((node, idx) => (
                <Col key={idx}>{node}</Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Card>
  );
};
