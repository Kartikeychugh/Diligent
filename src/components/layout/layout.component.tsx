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
          width: "100%",
          height: "calc(100% - 50px)",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <NewItemForm />
        <Box sx={{ height: "calc(100% - 201px)" }}>
          <Tasks />
        </Box>
      </Box>
    </>
  );
};
