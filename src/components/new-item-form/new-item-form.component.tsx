import { useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, Button, Input, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { FormState, addTaskAsync } from "../../features/form";

export const NewItemForm = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const formState = useAppSelector((state) => state.form.formState);
  const disptach = useAppDispatch();

  const addTask = useCallback(() => {
    disptach(
      addTaskAsync({
        title: inputRef.current?.value || "",
        description: textFieldRef.current?.value || "",
        done: false,
      })
    );
    if (inputRef.current) inputRef.current.value = "";
    if (textFieldRef.current) textFieldRef.current.value = "";
  }, [disptach]);

  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "500px",
        boxShadow: "0 0 5px grey",
        borderRadius: "10px",
        padding: 2,
      }}
    >
      <Input
        sx={{ fontSize: "15px", fontWeight: 600 }}
        placeholder="Title"
        inputRef={inputRef}
        size="small"
      />
      <TextField
        sx={{
          marginTop: "10px",
          padding: 0,
          fontWeight: 600,
          "& .MuiOutlinedInput-root": {
            padding: 0,
            fontSize: "15px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        inputRef={textFieldRef}
        multiline
        rows={4}
        placeholder="Describe your task"
        size="small"
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <DatePicker
          label="Due date"
          slotProps={{ textField: { size: "small" } }}
        />
        <Button
          variant="outlined"
          color={formState === FormState.SUCCESS ? "success" : "primary"}
          disabled={formState === FormState.BUSY}
          sx={{
            opacity: 1,
            width: "fit-content",
            fontWeight: "bolder",
            borderRadius: "10px",
          }}
          onClick={addTask}
        >
          Add Task
        </Button>
      </Box>
    </Stack>
  );
};
