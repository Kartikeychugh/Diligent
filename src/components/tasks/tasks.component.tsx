import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";

export const Tasks = () => {
  const dispatch = useAppDispatch();
  // const items = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch({ type: "SUBSCRIBE_TO_TASKS" });
  }, [dispatch]);

  return (
    <>
      {/* {Object.entries(items).map((entry, index) => {
        return (
          <div key={index}>
            <span>{entry[1].title}</span>
          </div>
        );
      })} */}
    </>
  );
};
