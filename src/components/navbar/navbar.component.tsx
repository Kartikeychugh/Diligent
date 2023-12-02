import { useCallback } from "react";
import { Box } from "@mui/material";

import { useAppDispatch, useAppSelector } from "../../config";
import { logoutButtonClick, selectUsername } from "../../features";

import "./navbar.css";

export const NavBar = () => {
  const dispatch = useAppDispatch();
  const name = useAppSelector(selectUsername);

  const handleLogoutButtonClick = useCallback(() => {
    dispatch(logoutButtonClick());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "50px",
        justifyContent: "stretch",
        padding: "10px 10px 10px 10px",
        boxSizing: "border-box",
      }}
    >
      <Box sx={{ width: "100%", fontWeight: "bold" }}>Hello {name}!</Box>
      <button className="add-task-button">+</button>
      <button
        className="logout-button primary-button"
        onClick={handleLogoutButtonClick}
      >
        Log out
      </button>
    </Box>
  );
};
