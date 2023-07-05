import { Box } from "@mui/material";
import "./navbar.css";
import { useAppDispatch } from "../../app/hooks";
import { useCallback } from "react";
import { logoutUserAsync } from "../../features/auth";

export const NavBar = () => {
  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    dispatch(logoutUserAsync());
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "50px",
        justifyContent: "end",
        padding: "0px 10px 0 10px",
        boxSizing: "border-box",
      }}
    >
      <button className="primary-button logout-button" onClick={logout}>
        Log out
      </button>
    </Box>
  );
};
