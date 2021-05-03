import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import img from "./images/parking.jpg";
import google from "./images/google.png";
import { Button } from "@material-ui/core";
import { storage } from "./firebase";
import firebase, { auth } from "./firebase";
import WhatsAppPop from "./Components/WhatsAppPop";
import SignInPopUp from "./Components/SignInPopUp";
import AlreadyParkingPopUp from "./Components/AlreadyParkingPopUp";
import LeaveDatePopUp from "./Components/LeaveDatePopUp";
//eslint-disable-next-line
import style from "bootstrap/dist/css/bootstrap.css";
function App() {
  const [parking, setParking] = useState([]);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  // const [parked, setParked] = useState(false);
  //eslint-disable-next-line
  const [phone, setPhone] = useState("");
  const [show, setShow] = useState(false);
  const [number, setNumber] = useState();
  const [signPop, setSignPop] = useState(false);
  const [alreadyParking, setAlreadyParking] = useState(false);
  //eslint-disable-next-line
  const [date, setDate] = useState();
  //eslint-disable-next-line
  const [time, setTime] = useState();
  const [datePop, setDatePop] = useState(false);
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const signInWithGoogle = async () => {
    let phone;
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      auth
        .signInWithPopup(googleProvider)
        .then((res) => {
          const docRef = storage.collection("users").doc(res.user.uid);
          docRef.get().then((doc) => {
            if (doc.exists) {
              // setParked(doc.data().parked);
              setPhone(doc.data().phone);
            } else {
              let phone = prompt("הכנס מספר טלפון:");
              if (
                !phone ||
                phone.match(/^[0-9]+$/) == null ||
                phone.length !== 10
              ) {
                alert("מספר טלפון לא חוקי");
                auth.signOut();
                return;
              }
              if (isNaN(phone) || !phone || phone.length !== 10) {
                auth.signOut();
                return;
              }
              axios
                .post(
                  "https://europe-west1-parkingtlv103.cloudfunctions.net/api/signup",
                  {
                    name: res.user.displayName,
                    id: res.user.uid,
                    parked: false,
                    phone: phone,
                  }
                )
                .then(() => console.log("נרשם בהצלחה"))
                .catch((e) => {
                  auth.signOut();
                  alert(e);
                });
              // docRef.set({
              //   name: res.user.displayName,
              //   id: res.user.uid,
              //   parked: false,
              //   phone: phone,
              // });
              //setParked(false);
            }
            setUser(res.user.displayName);
            setUserId(res.user.uid);
            setPhone(phone);
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  };

  useEffect(() => {
    // if (auth.currentUser) {
    //   console.log("We remember this user");
    //   setUser(auth.currentUser.displayName);
    //   setUserId(auth.currentUser.uid);
    //   setPhone(auth.currentUser.phone);
    //   const docRef = storage.collection("users").doc(auth.currentUser.uid);
    //   docRef.get().then((doc) => {
    //     if (doc.exists) setParked(doc.data().parked);
    //   });
    // }
    // async function fetchButtons() {
    //   const res = await axios
    //     .get(
    //       "https://europe-west1-parkingtlv103.cloudfunctions.net/api/buttons"
    //     )
    //     .catch((e) => console.log(e));
    // }
    //fetchButtons();
    storage
      .collection("parkings")
      .orderBy("number", "asc")
      .onSnapshot((docs) => {
        let tempParking = [];
        docs.forEach((doc) => {
          const data = doc.data();
          tempParking.push(data);
        });
        setParking(tempParking);
      });
  }, []);
  const flipParking = async (parkingNumber) => {
    setNumber(parkingNumber);
    if (!user) {
      setSignPop(true);
      return;
    }
    let res = await storage
      .collection("parkings")
      .doc(`${parkingNumber}`)
      .get();
    res = res.data();
    if (!res) return;
    const parked = await axios
      .get(
        "https://europe-west1-parkingtlv103.cloudfunctions.net/api/userparkstatus",
        { params: { userId } }
      )
      .then((res) => res.data);
    if (parked === "User not found") {
      alert("Error. User not found");
      auth.signOut();
      return;
    }
    console.log(parked);
    if (res.color === "primary") {
      if (parked) {
        setAlreadyParking(true);
        return;
      }
      // axios
      //   .get(
      //     "https://europe-west1-parkingtlv103.cloudfunctions.net/api/updateuserpark",
      //     { params: { parked: true, userId } }
      //   )
      //   .then((m) => console.log(m))
      //   .catch((e) => console.log(e));
      //storage.collection("users").doc(userId).update({ parked: true });
      // setParked(true);
      res.color = "secondary";
      res.user = user;
      res.userId = userId;
      setDatePop(true);
    } else if (res.color === "secondary" && res.userId !== userId) {
      setShow(true);
      return;
    } else if (res.color === "secondary") {
      // setParked(false);
      //storage.collection("users").doc(userId).update({ parked: false });
      // axios
      //   .get(
      //     "https://europe-west1-parkingtlv103.cloudfunctions.net/api/updateuserpark",
      //     { params: { parked: false, userId } }
      //   )
      //   .then((m) => console.log(m))
      //   .catch((e) => console.log(e));
      res.color = "primary";
      res.user = "";
      res.userId = "";
      res.time = "";
      res.date = "";
    }
    axios
      .post(
        "https://europe-west1-parkingtlv103.cloudfunctions.net/api/setparking",
        res,
        { params: { parkingNumber, userId } }
      )
      .then((m) => console.log(m))
      .catch((e) => console.log(e));
    //storage.collection("parkings").doc(parkingNumber).set(res);
  };

  const getDate = (time) => {
    const temp = time.split("-");
    return `${temp[2]}/${temp[1]}/${temp[0]}`;
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>מצא חניה</h1>
      </header>
      <div className="parking">
        <img src={img} alt="parking" />
      </div>
      <div className="login-buttons">
        {!user ? (
          <button className="login-provider-button" onClick={signInWithGoogle}>
            <img src={google} alt="google icon" />
          </button>
        ) : (
          <h2 className="userDisplay">שלום {user}</h2>
        )}
      </div>
      <div className="parking-buttons">
        {parking.map((btn) => (
          <Button
            id={`n${btn.number}`}
            className="parking-button"
            variant="contained"
            key={btn.number}
            style={{
              maxWidth: "25%",
              height: 130,
              margin: "0px!important",
            }}
            m={0}
            color={btn.color}
            onClick={() => flipParking(btn.number)}
          >
            {btn.user ? (
              <div>
                <p className="user">
                  <b>חניה מס': {btn.number}</b>
                  <br></br>
                  {btn.user}
                </p>
                {btn.time && btn.date && (
                  <p className="date">
                    עוזב/ת בתאריך: {getDate(btn.date)} בשעה: {btn.time}
                  </p>
                )}
              </div>
            ) : (
              <p style={{ fontSize: "2rem" }}>{btn.number}</p>
            )}
          </Button>
        ))}
      </div>
      {show && <WhatsAppPop setShow={setShow} number={number} show={show} />}
      {signPop && <SignInPopUp setSignPop={setSignPop} signPop={signPop} />}
      {alreadyParking && (
        <AlreadyParkingPopUp
          setAlreadyParking={setAlreadyParking}
          alreadyParking={alreadyParking}
        />
      )}
      {datePop && (
        <LeaveDatePopUp
          datePop={datePop}
          setDatePop={setDatePop}
          setDate={setDate}
          setTime={setTime}
          number={number}
        />
      )}
    </div>
  );
}

export default App;
