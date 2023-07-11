import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { IconButton, Box, Paper } from "@mui/material";
import { TodoItem } from "../../models";
import { ColorSchemes } from "../../constants/card-color-scheme";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  taskDeleted,
  taskRendered,
  taskUnrendered,
  taskUpdated,
} from "../../features/tasks";
import { TaskForm } from "../task-form";
import EditIcon from "@mui/icons-material/Edit";
import { IFormValues } from "../task-form/task-form.component";

export const TaskCard = (props: { task: TodoItem }) => {
  const { task } = props;
  const [editMode, setEditMode] = useState(false);
  const dispatch = useAppDispatch();

  const toggleEditMode = useCallback(() => {
    setEditMode((s) => !s);
  }, []);

  const handleDiscardAction = useCallback(() => {
    toggleEditMode();
  }, [toggleEditMode]);

  const handleUpdateAction = useCallback(
    (values: IFormValues) => {
      dispatch(taskUpdated({ id: task.id, ...values }));
      toggleEditMode();
    },
    [toggleEditMode, dispatch, task.id]
  );

  const handleDeleteAction = useCallback(() => {
    dispatch(taskDeleted(task.id));
  }, [dispatch, task.id]);

  useEffect(() => {
    dispatch(taskRendered(task.id));
    return () => {
      dispatch(taskUnrendered(task.id));
    };
  }, [dispatch, task.id]);

  return editMode ? (
    <TaskForm
      task={task}
      primaryAction="Update Task"
      secondaryAction="Discard"
      onPrimaryAction={handleUpdateAction}
      onSecondaryAction={handleDiscardAction}
    />
  ) : (
    <Paper sx={{ display: "flex" }} elevation={8} key={task.id}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: ColorSchemes[task.color].normal,
          borderRadius: "5px",
          padding: "20px",
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
              fontSize: "20px",
              fontWeight: "bolder",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ letterSpacing: "1.2px" }}>{task.title}</span>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "end", flexGrow: 1 }}>
            <IconButton aria-label="open in full" onClick={toggleEditMode}>
              <EditIcon sx={{ color: ColorSchemes[task.color].color }} />
            </IconButton>
            <IconButton aria-label="open in full">
              <OpenInNewIcon sx={{ color: ColorSchemes[task.color].color }} />
            </IconButton>
            <IconButton aria-label="close" onClick={handleDeleteAction}>
              <CloseSharpIcon sx={{ color: ColorSchemes[task.color].color }} />
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
              fontSize: "13px",
              background: ColorSchemes[task.color].dark,
              maxHeight: "50px",
            }}
          >
            <span style={{ padding: "5px" }}>{task.description}</span>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
