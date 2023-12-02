import { Box, LinearProgress } from "@mui/material";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../config";
import { LOGIN_STATE, loginButtonClick, selectAuthState } from "../../features";

import "./login-screen.css";

export const LoginScreen = () => {
  const disptach = useAppDispatch();
  const auth_state = useAppSelector(selectAuthState);
  const handleLoginButtonClick = useCallback(() => {
    disptach(loginButtonClick());
  }, [disptach]);

  return (
    <>
      {auth_state === LOGIN_STATE.LOGGING && (
        <LinearProgress sx={{ position: "absolute", width: "100%" }} />
      )}{" "}
      <Box
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(125,182,214,0.5) 77%)",
        }}
      >
        <Box
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="./icon.png"
            alt="rer"
            style={{
              objectFit: "contain",
              width: "calc(100% - 50px)",
              minWidth: "200px",
              maxWidth: "500px",
            }}
          />
        </Box>
        <Box
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            paddingLeft: 50,
            // background: "rgba(125, 182, 214, 0.2)",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span className="title">Diligent</span>
            <button
              className="primary-button login-button"
              onClick={handleLoginButtonClick}
            >
              Log in
            </button>
          </Box>
        </Box>
      </Box>
    </>
  );
};
