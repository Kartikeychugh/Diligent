import { useEffect, useState } from "react";
import { TodoItem } from "../../models";
import { Services } from "../../services";

export const TaskEditor = (props: { id: string }) => {
  const { id } = props;
  const [task, setTask] = useState<TodoItem | null>(null);

  useEffect(() => {
    const unsubscribe = (async () => {
      const service = await Services.TaskStoreService;
      return service.watchTaskChanges(id, (qs) => {
        const data = qs.data();
        if (!data) return;
        setTask(
          new TodoItem(
            data.id,
            data.title,
            data.description,
            data.createdOn,
            data.dueData,
            data.done,
            data.color
          )
        );
      });
    })();

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, [id]);

  return <div>{task?.title}</div>;
};
