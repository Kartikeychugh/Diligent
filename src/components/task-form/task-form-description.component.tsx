import { ForwardedRef, forwardRef } from "react";

export const FormDescription = forwardRef(
  (
    props: { defaultValue?: string },
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const { defaultValue = "" } = props;
    return (
      <textarea
        defaultValue={defaultValue}
        style={{ backgroundColor: "transparent", width: "100%" }}
        ref={ref}
        className="task-description"
        placeholder="Describe your task"
        rows={5}
      />
    );
  }
);
