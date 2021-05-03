import React from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "@material-ui/core";
import axios from "axios";
const LeaveDatePopUp = ({ datePop, setDatePop, setDate, setTime, number }) => {
  const handleClose = () => setDatePop(false);
  const handleSubmit = () => {
    setDate(date);
    setTime(time);
    if (time && date) {
      axios
        .post(
          "https://europe-west1-parkingtlv103.cloudfunctions.net/api/updateparktime",
          { date, time },
          { params: { parkingNumber: number } }
        )
        .then((m) => console.log(m))
        .catch((e) => console.log(e));
      //storage.collection("parkings").doc(number).update({ date, time });
    }
    handleClose();
  };
  let date;
  let time;
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
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => (date = e.target.value)}
            />
            <div>
              <label htmlFor="time">בחר שעה</label>
            </div>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => (time = e.target.value)}
            />
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
