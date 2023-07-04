import { serverTimestamp } from "firebase/firestore";
import { useRef, useCallback } from "react";
import { FirebaseStoreService } from "../../services";
import { useAppSelector } from "../../app/hooks";
import { Box, Button, Input, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  TodoItem,
  todoItemConverter,
} from "../../models/todo-item/todo-item.model";

export const NewItemForm = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textFieldRef = useRef<HTMLInputElement | null>(null);
  const fbss = FirebaseStoreService.getInstance();
  const { userId } = useAppSelector((state) => state.auth);

  const addTask = useCallback(() => {
    const colRef = fbss
      .getCollectionRef("users", [userId, "items"])
      .withConverter(todoItemConverter);

    fbss.addDocument(
      colRef,
      new TodoItem(
        inputRef.current?.value || "",
        textFieldRef.current?.value || "",
        serverTimestamp(),
        false
      )
    );
    if (inputRef.current) inputRef.current.value = "";
    if (textFieldRef.current) textFieldRef.current.value = "";
  }, [fbss, userId]);

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
