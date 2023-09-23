import { useEffect } from "react";

interface RedirectProps {
  to: string;
}

export const Redirect = (props: RedirectProps) => {
  useEffect(() => {
    if (window !== undefined) {
      window.location.replace(props.to);
    }
  });

  return <></>;
};
