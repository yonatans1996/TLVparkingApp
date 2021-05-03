import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "@material-ui/core";
function SignInPopUp({ setSignPop, signPop }) {
  const handleClose = () => setSignPop(false);
  return (
    <>
      <Modal show={signPop} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>יש צורך בהתחברות לפני</Modal.Title>
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

export default SignInPopUp;
