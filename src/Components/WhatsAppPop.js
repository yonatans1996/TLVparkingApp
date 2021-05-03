import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { storage } from "../firebase";
import { Button } from "@material-ui/core";
import axios from "axios";
function WhatsAppPop({ setShow, number, show }) {
  const [personParkingInfo, setPersonParkingInfo] = useState({});
  const [parkingInfo, setParkingInfo] = useState({});
  const handleClose = () => setShow(false);
  const handleWhatsApp = async () => {
    let parkingPhone;
    parkingPhone = personParkingInfo.phone.substring(1);
    window.location.assign(`https://wa.me/+972${parkingPhone}`);
    setShow(true);
  };
  const handleCall = async () => {
    window.location.assign(`tel:${personParkingInfo.phone}`);
  };
  const getDate = (date) => {
    if (!date) return "לא הוכנס";
    const temp = date.split("-");
    return `${temp[2]}/${temp[1]}/${temp[0]}`;
  };
  const getTime = (time) => {
    if (!time) return "לא הוכנס";
    return time;
  };
  useEffect(() => {
    const getPersonInfo = async () => {
      // const personId = await storage
      //   .collection("parkings")
      //   .doc(number)
      //   .get()
      //   .then((res) => res.data().userId);
      // let parkingData = await storage
      //   .collection("users")
      //   .doc(personId)
      //   .get()
      //   .then((res) => res.data());
      const parkingData = await axios
        .get(
          "https://europe-west1-parkingtlv103.cloudfunctions.net/api/parkinguser",
          {
            params: {
              parkingNumber: number,
            },
          }
        )
        .catch((e) => alert(e));
      setPersonParkingInfo(parkingData.data);
    };
    const getParkingInfo = async () => {
      storage
        .collection("parkings")
        .doc(`${number}`)
        .get()
        .then((res) => setParkingInfo(res.data()));
    };
    getPersonInfo();
    getParkingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>החניה תפוסה</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>שם החונה: {parkingInfo && parkingInfo.user}</p>
          <p>תאריך עזיבה: {parkingInfo && getDate(parkingInfo.date)} </p>
          <p> שעת עזיבה: {parkingInfo && getTime(parkingInfo.time)} </p>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "flex-start" }}>
          <p style={{ textAlign: "right" }}>תרצה לדבר עם בעל הרכב?</p>
          <div className="modalButtons">
            <Button
              color="primary"
              variant="contained"
              onClick={handleWhatsApp}
            >
              שלח הודעה בוואצאפ
            </Button>
            <Button color="primary" variant="contained" onClick={handleCall}>
              חייג
            </Button>
            <Button color="secondary" variant="contained" onClick={handleClose}>
              סגור
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WhatsAppPop;
