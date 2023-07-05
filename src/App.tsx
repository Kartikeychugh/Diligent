import { Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";

import { Layout } from "./components";
import { LOGIN_STATE, authInit } from "./features/auth";
import { LoginScreen } from "./components/login-screen/login-screen.component";
import "./App.css";

function App() {
  const { auth_state } = useAppSelector((state) => state.auth);
  const disptach = useAppDispatch();

  useEffect(() => {
    disptach(authInit());
  }, [disptach]);

  return (
    <Box style={{ boxSizing: "border-box", height: "100vh" }}>
      {auth_state === LOGIN_STATE.UNKNOWN ? null : auth_state ===
        LOGIN_STATE.LOGGED_IN ? (
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
