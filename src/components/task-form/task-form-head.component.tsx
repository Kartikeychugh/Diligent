import { Box } from "@mui/material";

export const FormHead = (props: { onHeadClick: () => void }) => {
  const { onHeadClick } = props;
  return (
    <Box
      onClick={onHeadClick}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "30px",
        boxSizing: "border-box",
        cursor: "pointer",
        zIndex: 999,
      }}
    >
      <Box
        sx={{
          width: "200px",
          height: "10px",
          background: "rgba(191, 67, 67, 1)",
          borderRadius: "10px",
        }}
      ></Box>
    </Box>
  );
};
