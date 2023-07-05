import { useRef, useCallback, FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addTaskAsync, formError } from "../../features/form";
import "./form.css";

export const NewItemForm = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const inputDateRef = useRef<HTMLInputElement | null>(null);
  const [showError, setShowError] = useState(false);
  const error = useAppSelector((state) => state.form.error);

  const disptach = useAppDispatch();

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (error) {
        disptach(formError(""));
        setShowError(false);
      }
    },
    [disptach, error]
  );

  const addTask = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();

      if (!inputRef.current?.value) {
        disptach(formError("Title is empty"));
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }

      disptach(
        addTaskAsync({
          title: inputRef.current.value,
          description: textFieldRef.current?.value || "",
          done: false,
          dueDate: inputDateRef.current?.value || "",
        })
      );
      if (inputRef.current) inputRef.current.value = "";
      if (textFieldRef.current) textFieldRef.current.value = "";
    },
    [disptach]
  );

  return (
    <form onSubmit={addTask}>
      <div style={{ display: "flex", flexDirection: "column", width: "600px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            boxShadow: "0 0 20px #e3e3e3",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <div className="task-title-container">
            <input
              ref={inputRef}
              className="task-title"
              type="text"
              placeholder="Title"
              onChange={onTitleChange}
            />
          </div>

          <textarea
            ref={textFieldRef}
            className="task-description"
            placeholder="Describe your task"
            rows={5}
          />
          <div
            className="task-button-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              height: "30px",
            }}
          >
            <input
              ref={inputDateRef}
              className="task-due-date"
              type="date"
              defaultValue=""
            />
            <button type="submit" className="primary-button add-task-button">
              Add Task
            </button>
          </div>
        </div>
        {showError && error && <div className="form-errors">{error}</div>}
      </div>
    </form>
  );
};
