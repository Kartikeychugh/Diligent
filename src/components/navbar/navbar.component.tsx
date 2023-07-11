import { Box } from "@mui/material";
import "./navbar.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCallback } from "react";
import { logoutButtonClick } from "../../features/auth";

export const NavBar = () => {
  const dispatch = useAppDispatch();
  const name = useAppSelector((state) => state.auth.user.name);
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
      <button
        className="logout-button primary-button"
        onClick={handleLogoutButtonClick}
      >
        Log out
      </button>
    </Box>
  );
};
