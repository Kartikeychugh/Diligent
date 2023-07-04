import "./App.css";
import { Box, LinearProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { useEffect } from "react";
import { LOGIN_STATE, loginUserAsync } from "./features/firebase/firebase-auth";
import { Layout } from "./components";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const { auth_state } = useAppSelector((state) => state.auth);
  const disptach = useAppDispatch();

  useEffect(() => {
    if (auth_state === LOGIN_STATE.LOGGED_OUT) disptach(loginUserAsync());
  }, [auth_state, disptach]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box style={{ width: "100%", padding: 20 }}>
        {auth_state === LOGIN_STATE.LOGGED_IN ? (
          <Layout />
        ) : auth_state === LOGIN_STATE.ERROR ? (
          "Error"
        ) : (
          <LinearProgress />
        )}
      </Box>
    </LocalizationProvider>
  );
}

export default App;
