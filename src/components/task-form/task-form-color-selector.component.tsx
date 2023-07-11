import { Box, Popover } from "@mui/material";
import { useState, useRef, useCallback } from "react";
import { ColorSchemes } from "../../constants/card-color-scheme";

const ColorSelection = (props: {
  colors: string[];
  onSelection: (color: string) => void;
}) => {
  const { colors, onSelection } = props;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: "200px",
        height: "50px",
      }}
    >
      {colors.map((color, index) => {
        return (
          <button
            key={index}
            className="color-chip"
            style={{ background: color }}
            onClick={() => onSelection(color)}
          ></button>
        );
      })}
    </Box>
  );
};

export const FormColorSelector = (props: {
  defaultColor: string;
  onSelection: (color: string) => void;
}) => {
  const { defaultColor, onSelection } = props;
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState(defaultColor);
  const colorsRef = useRef(
    Object.entries(ColorSchemes).map((entry) => entry[0])
  );
  const colorButtonRef = useRef<HTMLButtonElement | null>(null);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleSelection = useCallback(
    (color: string) => {
      setColor(color);
      onSelection(color);
      handleClose();
    },
    [handleClose, onSelection]
  );

  return (
    <>
      <button
        onClick={handleOpen}
        type="button"
        ref={colorButtonRef}
        className="color-chip"
        style={{
          background: color,
          marginLeft: "15px",
        }}
      ></button>
      <Popover
        open={open}
        anchorEl={colorButtonRef.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ColorSelection
          colors={colorsRef.current}
          onSelection={handleSelection}
        />
      </Popover>
    </>
  );
};
