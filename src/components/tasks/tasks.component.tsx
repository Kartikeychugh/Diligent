import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  Card,
  CardHeader,
  IconButton,
  CardContent,
  Typography,
  Box,
  Popover,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TodoItem } from "../../models";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

// import { ExpandMore } from "@mui/icons-material";

const TaskMenu = () => {
  return (
    <Box sx={{ width: "200px", bgcolor: "background.paper" }}>
      <List>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" secondary="ewrwes" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />
    </Box>
  );
};

const TaskCard = (props: { task: TodoItem }) => {
  const { task } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <Card sx={{ width: "100%", marginTop: "5px" }}>
      <CardHeader
        action={
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={task.title}
        subheader={"Due on: " + new Date(task.dueDate).toDateString()}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleClose}
      >
        <TaskMenu />
      </Popover>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export const Tasks = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.tasks.items);

  useEffect(() => {
    dispatch({ type: "FETCH_NEXT_TASKS" });
  }, [dispatch]);

  return (
    <Box
      onScroll={(e) => {
        const htmlEle = e.target as HTMLElement;
        if (
          htmlEle.clientHeight + htmlEle.scrollTop - htmlEle.scrollHeight ===
          0
        ) {
          dispatch({ type: "FETCH_NEXT_TASKS" });
        }
      }}
      sx={{ width: "590px", height: "100%", overflow: "scroll" }}
    >
      {items.map((entry, index) => {
        return (
          <Box key={entry.id}>
            {((index > 0 &&
              new Date(entry.dueDate).toDateString() !==
                new Date(
                  Object.entries(items)[index - 1][1].dueDate
                ).toDateString()) ||
              index === 0) && (
              <Divider sx={{ fontSize: "12px", margin: "10px 0 10px 0" }}>
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
