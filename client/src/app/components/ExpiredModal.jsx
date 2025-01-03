import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "purple",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ExpiredModal(shouldShow) {
  const [open, setOpen] = useState(shouldShow);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h4">
            authorization error
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            please log in again
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
