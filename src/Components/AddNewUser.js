import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "@material-ui/core";
function AddNewUser({ setNewUserPopup, car, level }) {
  const handleClose = () => setNewUserPopup(false);
  return (
    <>
      <Modal show={true} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            פעולה זאת מותרת מרמה {level} <img width={30} src={car} alt="car" />{" "}
            בלבד
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            סגור <img width={30} src={car} alt="car" />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNewUser;
