import { useCallback, useEffect, useState } from "react";
import { IconButton, Box, Paper } from "@mui/material";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";

import { useAppDispatch, useAppSelector } from "../../config";
import { ColorSchemes } from "../../constants";
import { TaskForm, IFormValues } from "../task-form";
import {
  fetchTodoAction,
  deleteTodoAction,
  updateTodoAction,
} from "../../features";

export const TaskCard = (props: { taskId: string }) => {
  const { taskId } = props;
  const task = useAppSelector((state) => state.todos[taskId]);

  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!task) {
      dispatch(fetchTodoAction(taskId));
    }
  }, [dispatch, task, taskId]);

  const toggleEditMode = useCallback(() => {
    setEditMode((s) => !s);
  }, []);

  const handleDiscardAction = useCallback(() => {
    toggleEditMode();
  }, [toggleEditMode]);

  const handleUpdateAction = useCallback(
    (values: IFormValues) => {
      if (!task) return;
      dispatch(updateTodoAction({ id: task.id, changes: values }));
      toggleEditMode();
    },
    [task, dispatch, toggleEditMode]
  );

  const handleDeleteAction = useCallback(() => {
    if (!task) return;
    dispatch(deleteTodoAction(task));
  }, [dispatch, task]);

  if (!task) return null;

  return editMode ? (
    <TaskForm
      task={task}
      primaryAction="Update Task"
      secondaryAction="Discard"
      onPrimaryAction={handleUpdateAction}
      onSecondaryAction={handleDiscardAction}
    />
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: ColorSchemes[task.color].normal,
        padding: "5px 5px 5px 10px",
        boxSizing: "border-box",
        color: ColorSchemes[task.color].color,
        borderLeft: `10px solid ${ColorSchemes[task.color].dark}`,
        transition: "500ms all",
        flexWrap: "nowrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "bolder",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ letterSpacing: "1.2px" }}>{task.title}</span>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            flexGrow: 1,
          }}
        >
          <IconButton
            sx={{ fontSize: "20px" }}
            aria-label="open in full"
            onClick={toggleEditMode}
          >
            <EditIcon
              fontSize="inherit"
              sx={{ color: ColorSchemes[task.color].color }}
            />
          </IconButton>
          <IconButton
            sx={{ fontSize: "20px" }}
            aria-label="close"
            onClick={handleDeleteAction}
          >
            <CloseSharpIcon
              fontSize="inherit"
              sx={{ color: ColorSchemes[task.color].color }}
            />
          </IconButton>
        </Box>
      </Box>
      {task.description && (
        <Box
          sx={{
            letterSpacing: "2px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "12px",
            // background: ColorSchemes[task.color].dark,
            maxHeight: "50px",
          }}
        >
          <span style={{ padding: "0px" }}>{task.description}</span>
        </Box>
      )}
      <Box
        sx={{
          marginTop: "5px",
          letterSpacing: "0.5px",
          fontSize: "10px",
          color: ColorSchemes[task.color].color,
        }}
      >
        Due on: {new Date(task.dueDate).toLocaleDateString()}
      </Box>
    </Box>
  );
};
