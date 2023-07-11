import { Box } from "@mui/material";
import { ForwardedRef, forwardRef } from "react";

export const FormTitle = forwardRef(
  (
    props: {
      defaultValue?: string;
      onChange: React.ChangeEventHandler<HTMLInputElement>;
    },
    ref: ForwardedRef<HTMLInputElement | null>
  ) => {
    const { defaultValue = "", onChange } = props;
    return (
      <Box className="task-title-container">
        <input
          defaultValue={defaultValue}
          style={{ backgroundColor: "transparent" }}
          ref={ref}
          className="task-title"
          type="text"
          placeholder="Title"
          onChange={onChange}
        />
      </Box>
    );
  }
);
