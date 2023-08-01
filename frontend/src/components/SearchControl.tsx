import { Input } from "antd";
import React, { CSSProperties } from "react";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
  onSearch: (e: string) => void;
  placeholder?: string;
  style?: CSSProperties;
}

export const SearchControl = (props: Props) => {
  return (
    <Input
      style={props.style}
      prefix={<SearchOutlined style={{ color: "var(--brandGreen)" }} />}
      onChange={(val) => props.onSearch(val.target.value)}
      allowClear
      placeholder={props.placeholder}
    />
  );
};
