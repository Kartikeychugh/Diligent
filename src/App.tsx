import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import { useAppDispatch, useAppSelector } from "./config";
import { Layout, LoginScreen } from "./components";
import { LOGIN_STATE, appLoaded, selectAuthState } from "./features";

import "./App.css";

function App() {
  const auth_state = useAppSelector(selectAuthState);
  const disptach = useAppDispatch();
  useEffect(() => {
    disptach(appLoaded());
  }, [disptach]);
  return (
    <Box
      style={{
        boxSizing: "border-box",
        height: "100vh",
        width: "100%",
      }}
    >
      {auth_state === LOGIN_STATE.UNKNOWN ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : auth_state === LOGIN_STATE.LOGGED_IN ? (
        <Layout />
      ) : auth_state === LOGIN_STATE.ERROR ? (
        "Error"
      ) : (
        <LoginScreen />
      )}
    </Box>
  );
}

export default App;
