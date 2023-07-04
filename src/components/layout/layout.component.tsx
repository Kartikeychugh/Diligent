import { NewItemForm } from "../new-item-form";
import { Box } from "@mui/material";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <NewItemForm />
    </Box>
  );
};
