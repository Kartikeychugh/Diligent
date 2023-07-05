import { NewItemForm } from "../form";
import { Box } from "@mui/material";
import { Tasks } from "../tasks";
import { NavBar } from "../navbar";

export const Layout = () => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <NewItemForm />
        <Tasks />
      </Box>
    </>
  );
};
