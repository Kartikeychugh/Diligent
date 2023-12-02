import { useCallback, useEffect } from "react";
import { Box } from "@mui/material";

import { TaskCard } from "./tasks-card.component";
import { useAppDispatch, useAppSelector } from "../../config";
import { fetchViewAction, updateViewAction } from "../../features";
import { Draggable } from "../draggable";

export const Tasks = () => {
  const dispatch = useAppDispatch();
  const { items, name } = useAppSelector((state) => state.view);

  useEffect(() => {
    dispatch(fetchViewAction(name));
  }, [dispatch, name]);

  const handleOrderChange = useCallback(
    (order: string[]) => {
      dispatch(updateViewAction(order));
    },
    [dispatch]
  );

  return (
    <Box
      component="div"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "500px",
        height: "100%",
        overflow: "scroll",
        padding: "10px",
        boxSizing: "border-box",
      }}
    >
      <Draggable
        stop={false}
        onOrderChange={handleOrderChange}
        items={items}
        renderProp={(id) => <TaskCard key={id} taskId={id.toString()} />}
      />
    </Box>
  );
};
