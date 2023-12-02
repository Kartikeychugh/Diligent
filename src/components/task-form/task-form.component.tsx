import {
  useRef,
  useCallback,
  FormEvent,
  useState,
  forwardRef,
  ForwardedRef,
} from "react";
import { Box, Paper } from "@mui/material";

import { FormColorSelector } from "./task-form-color-selector.component";
import { FormTitle } from "./task-form-title.component";
import { FormDescription } from "./task-form-description.component";

import { useAppDispatch, useAppSelector, AppDispatch } from "../../config";
import { TodoItem } from "../../models";
import { selectFormError, formError } from "../../features";
import { ColorSchemes } from "../../constants";

import "./task-form.css";

export interface IFormValues {
  title: string;
  description: string;
  dueDate: number;
  color: string;
  done: boolean;
}

export const TaskForm = forwardRef(
  (
    props: {
      task?: TodoItem;
      primaryAction: string;
      secondaryAction?: string;
      onPrimaryAction?: (values: IFormValues) => void;
      onSecondaryAction?: (values: IFormValues) => void;
    },
    ref: ForwardedRef<HTMLDivElement | null>
  ) => {
    const {
      task,
      primaryAction,
      secondaryAction,
      onSecondaryAction = () => {},
      onPrimaryAction = () => {},
    } = props;

    const inputTitleRef = useRef<HTMLInputElement>(null);
    const textFieldDescriptionRef = useRef<HTMLTextAreaElement>(null);
    const inputDateRef = useRef<HTMLInputElement>(null);

    const [showError, setShowError] = useState(false);
    const [color, setColor] = useState(task?.color || "white");

    const dispatch = useAppDispatch();
    const error = useAppSelector(selectFormError);

    const createFormState = useCallback((): IFormValues => {
      return {
        title: inputTitleRef.current?.value || "",
        description: textFieldDescriptionRef.current?.value || "",
        done: false,
        dueDate: new Date(inputDateRef.current?.value || "").getTime(),
        color,
      };
    }, [color]);

    const handleSelection = useCallback((color: string) => {
      setColor(color);
    }, []);

    const onTitleChange = useCallback(() => {
      if (error) {
        setShowError(false);
      }
    }, [error]);

    const isEditMode = !!task;

    const handleResetFormAction = useCallback(
      (e?: FormEvent<HTMLButtonElement>) => {
        e?.preventDefault();

        const formReady =
          !!inputTitleRef.current &&
          !!inputDateRef.current &&
          !!textFieldDescriptionRef.current;

        if (!formReady) return;

        inputTitleRef.current.value = "";
        inputDateRef.current.value = "";
        textFieldDescriptionRef.current.value = "";
      },
      []
    );

    const handleSecondaryAction = useCallback(
      (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSecondaryAction(createFormState());
        handleResetFormAction();
      },
      [handleResetFormAction, onSecondaryAction, createFormState]
    );

    const handlePrimaryAction = useCallback(
      (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const formReady =
          !!inputTitleRef.current &&
          !!inputDateRef.current &&
          !!textFieldDescriptionRef.current;
        if (!formReady) return;

        if (!inputTitleRef.current.value) {
          return displayError("Title is empty", dispatch, setShowError);
        }

        if (!inputDateRef.current.value) {
          return displayError("Due date is empty", dispatch, setShowError);
        }

        onPrimaryAction(createFormState());
        handleResetFormAction();
      },
      [handleResetFormAction, onPrimaryAction, createFormState, dispatch]
    );

    return (
      <Paper
        ref={ref}
        elevation={3}
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 10,
          padding: 10,
          boxSizing: "border-box",
          zIndex: 1,
        }}
      >
        <form>
          <FormTitle
            defaultValue={task?.title}
            ref={inputTitleRef}
            onChange={onTitleChange}
          />
          <FormDescription
            defaultValue={task?.description}
            ref={textFieldDescriptionRef}
          />
          <Box sx={{ display: "flex", alignItems: "center", height: "30px" }}>
            <Box
              className="task-button-container"
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                flexGrow: 1,
              }}
            >
              <input
                ref={inputDateRef}
                className="task-due-date"
                type="date"
                defaultValue={
                  isEditMode
                    ? new Date(task.dueDate).toISOString().substring(0, 10)
                    : ""
                }
                style={{ height: "100%" }}
              />
              <FormColorSelector
                onSelection={handleSelection}
                defaultColor={
                  isEditMode ? task.color : ColorSchemes.white.normal
                }
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                height: "100%",
                justifyContent: "end",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              {secondaryAction && (
                <button
                  type="submit"
                  className="secondary-button add-task-button"
                  onClick={handleSecondaryAction}
                >
                  {secondaryAction}
                </button>
              )}
              <button
                type="submit"
                className="primary-button add-task-button"
                onClick={handlePrimaryAction}
              >
                {primaryAction}
              </button>
            </Box>
          </Box>
        </form>
        {showError && error && <div className="form-errors">{error}</div>}
      </Paper>
    );
  }
);

function displayError(
  error: string,
  dispatch: AppDispatch,
  setShowError: React.Dispatch<React.SetStateAction<boolean>>
) {
  dispatch(formError(error));
  setShowError(true);
  setTimeout(() => {
    setShowError(false);
  }, 3000);
  return;
}
