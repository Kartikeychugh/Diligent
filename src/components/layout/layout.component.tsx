import { TaskForm } from "../task-form";
import { Box } from "@mui/material";
import { Tasks } from "../tasks";
import { NavBar } from "../navbar";
import { FormHead, IFormValues } from "../task-form";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../../config";
import { TodoItem } from "../../models";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { addTodoAction } from "../../features";

const NewTaskForm = (props: {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [top, setTop] = useState(0);
  const dispatch = useAppDispatch();

  const toggleForm = useCallback(() => {
    if (!ref.current) return;
    setTop(
      top === ref.current.clientHeight + 10 ? 0 : ref.current.clientHeight + 10
    );
  }, [top]);

  const handleAddAction = useCallback(
    (values: IFormValues) => {
      const item = new TodoItem(
        "",
        values.title,
        values.description,
        serverTimestamp() as Timestamp,
        values.dueDate,
        values.done,
        values.color
      );
      dispatch(addTodoAction(item));
      toggleForm();
    },
    [toggleForm, dispatch]
  );

  return (
    <Box
      sx={{
        position: "relative",
        bottom: `${top}px`,
        height: "30px",
        padding: "10px",
        width: "100%",

        transition: "200ms all",
        boxSizing: "border-box",
      }}
    >
      <FormHead onHeadClick={toggleForm} />
      <TaskForm
        ref={ref}
        primaryAction="Add Task"
        secondaryAction="Discard"
        onPrimaryAction={handleAddAction}
        onSecondaryAction={toggleForm}
      />
    </Box>
  );
};

export const Layout = () => {
  return (
    <Box
      sx={{
        minWidth: "350px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        boxSizing: "border-box",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {/* <TaskEditor id="sdwritTCOhsHQzSy9CLw" /> */}
      <NavBar />
      <Tasks />
      <NewTaskForm />
    </Box>
  );
};
