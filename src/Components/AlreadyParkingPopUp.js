import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "@material-ui/core";
function AlreadyParkingPopUp({ setAlreadyParking, alreadyParking }) {
  const handleClose = () => setAlreadyParking(false);
  return (
    <>
      <Modal show={alreadyParking} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>ניתן לתפוס חניה אחת בלבד</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AlreadyParkingPopUp;
