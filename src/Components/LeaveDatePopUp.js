import React, { useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "@material-ui/core";
import axios from "axios";
const LeaveDatePopUp = ({ datePop, setDatePop, number }) => {
  const timeRef = useRef();
  const dateRef = useRef();
  const handleClose = () => setDatePop(false);
  const handleSubmit = () => {
    if (timeRef.current.value && dateRef.current.value) {
      axios
        .post(
          "https://europe-west1-parkingtlv103.cloudfunctions.net/api/updateparktime",
          { date: dateRef.current.value, time: timeRef.current.value },
          { params: { parkingNumber: number } }
        )
        .then((m) => console.log(m))
        .catch((e) => console.log(e));
    }
    handleClose();
  };

  return (
    <>
      <Modal show={datePop} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            ניתן להוסיף זמן עזיבה כדי שאנשים ידעו אם שווה להם לחסום אותך 😉
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="timeContainer">
            <div>
              <label htmlFor="id">בחר תאריך</label>
            </div>
            <input id="date" type="date" ref={dateRef} />
            <div>
              <label htmlFor="time">בחר שעה</label>
            </div>
            <input id="time" type="time" ref={timeRef} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" variant="contained" onClick={handleSubmit}>
            הוסף
          </Button>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LeaveDatePopUp;
