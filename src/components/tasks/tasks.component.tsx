import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Box, Divider } from "@mui/material";
import { TaskCard } from "./tasks-card.component";
import { fetchNextTasks } from "../../features/tasks";
import { shallowEqual } from "react-redux";

export const Tasks = () => {
  const dispatch = useAppDispatch();
  const orderedItems = useAppSelector(
    (state) => state.tasks.orderedItems,
    (a, b) => {
      const res = shallowEqual(a, b);
      console.log(a, b, res);
      return res;
    }
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observerCallback = useCallback(
    (e: Element) => {
      if (!e) return;
      observerRef.current = new IntersectionObserver(
        (entries, o) => {
          if (entries[0].isIntersecting) {
            dispatch(fetchNextTasks());
            o.unobserve(entries[0].target);
          }
        },
        {
          root: e,
          threshold: [0.1],
          rootMargin: "10px 0px 0px 0px",
        }
      );
    },
    [dispatch]
  );

  const setObserver = useCallback(
    (el: Element, index: number) => {
      if (el && observerRef.current && index === orderedItems.length - 1) {
        observerRef.current.observe(el);
      }
    },
    [orderedItems.length]
  );

  useEffect(() => {
    dispatch(fetchNextTasks());
  }, [dispatch]);

  return (
    <Box
      component="div"
      ref={observerCallback}
      sx={{
        width: "100%",
        height: "100%",
        overflow: "scroll",
        padding: "0px 20px 20px 20px",
        boxSizing: "border-box",
      }}
    >
      {orderedItems.map((entry, index) => {
        const showDivider =
          (index > 0 &&
            new Date(entry.dueDate).toDateString() !==
              new Date(orderedItems[index - 1].dueDate).toDateString()) ||
          index === 0;

        return (
          <Box
            sx={{ marginTop: "15px" }}
            key={entry.id}
            ref={(el) => setObserver(el as Element, index)}
          >
            {showDivider && (
              <Divider
                light
                sx={{
                  fontWeight: "bold",
                  fontSize: "12px",
                  margin: "10px 0 10px 0",
                }}
              >
                {new Date(entry.dueDate).toDateString()}
              </Divider>
            )}
            <TaskCard task={entry} />
          </Box>
        );
      })}
    </Box>
  );
};
