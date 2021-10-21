import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import img from "./images/parking.jpg";
import car0 from "./images/waze-baby.png";
import car1 from "./images/waze-grown-up.png";
import car3 from "./images/waze-knight.png";
import car4 from "./images/waze-royalty.png";
import car2 from "./images/waze-warrior.png";
import google from "./images/google.png";
import { Button } from "@material-ui/core";
import { storage } from "./firebase";
import firebase, { auth } from "./firebase";
import WhatsAppPop from "./Components/WhatsAppPop";
import SignInPopUp from "./Components/SignInPopUp";
import AlreadyParkingPopUp from "./Components/AlreadyParkingPopUp";
import LeaveDatePopUp from "./Components/LeaveDatePopUp";
import Spinner from "react-bootstrap/Spinner";
import ProgressBar from "./Components/ProgressBar";
//eslint-disable-next-line
//     "@ideasio/add-to-homescreen-react": "^1.0.7",
import style from "bootstrap/dist/css/bootstrap.css";
//import AddNewUser from "./Components/AddNewUser";
function App() {
  const [parking, setParking] = useState([]);
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [show, setShow] = useState(false);
  const [number, setNumber] = useState();
  const [signPop, setSignPop] = useState(false);
  const [alreadyParking, setAlreadyParking] = useState(false);
  const [datePop, setDatePop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState();
  const [levelLoaded, setLevelLoaded] = useState(false);
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const signInWithGoogle = async () => {
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
      auth
        .signInWithPopup(googleProvider)
        .then((res) => {
          const docRef = storage.collection("users").doc(res.user.uid);
          docRef.get().then((doc) => {
            if (!doc.exists) {
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
                    phone: phone,
                    level: 0,
                  }
                )
                .then(() => {
                  console.log("נרשם בהצלחה");
                  setUser(res.user.displayName);
                  setUserId(res.user.uid);
                  setLevel(0);
                  setLevelLoaded(true);
                  localStorage.setItem("uid", res.user.uid);
                  localStorage.setItem("username", res.user.displayName);
                  localStorage.setItem("level", 0);
                })
                .catch((e) => {
                  alert("פלאפון לא שמור במערכת");
                  auth.signOut();
                });
            } else {
              setUser(res.user.displayName);
              setUserId(res.user.uid);
              localStorage.setItem("uid", res.user.uid);
              localStorage.setItem("username", res.user.displayName);
              getUserLevel(res.user.uid);
            }
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  };

  const getUserLevel = async (userId) => {
    axios
      .get("https://europe-west1-parkingtlv103.cloudfunctions.net/api/level", {
        params: { userId },
      })
      .then((res) => {
        setLevel(res.data);
        setLevelLoaded(true);
        localStorage.setItem("level", res.data);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (localStorage.getItem("uid") && localStorage.getItem("username")) {
      let tempId = localStorage.getItem("uid");
      setUserId(localStorage.getItem("uid"));
      setUser(localStorage.getItem("username"));
      console.log("User already signed in");
      if (localStorage.getItem("level")) {
        setLevel(localStorage.getItem("level"));
        setLevelLoaded(true);
      }

      getUserLevel(tempId);
    }

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
        setLoading(false);
      });
  }, []);

  const flipParking = async (parkingNumber) => {
    if (loading) return;
    setLoading(true);
    setNumber(parkingNumber);
    if (!user) {
      setSignPop(true);
      setLoading(false);
      return;
    }
    let res = await storage
      .collection("parkings")
      .doc(`${parkingNumber}`)
      .get();
    res = res.data();
    if (!res) {
      setLoading(false);
      return;
    }
    if (res.color === "primary") {
      res.color = "secondary";
      res.user = user;
      res.userId = userId;
      res.level = level;
      setDatePop(true);
    } else if (res.color === "secondary" && res.userId !== userId) {
      setShow(true);
      setLoading(false);
      return;
    } else if (res.color === "secondary") {
      res.color = "primary";
      res.user = "";
      res.userId = "";
      res.time = "";
      res.date = "";
      res.level = 0;
    }
    axios
      .post(
        "https://europe-west1-parkingtlv103.cloudfunctions.net/api/setparking",
        res,
        { params: { parkingNumber, userId } }
      )
      .then((m) => {
        console.log(m);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const handleLogout = () => {
    if (auth) auth.signOut();
    localStorage.clear();
    setUser("");
    setUserId("");
    setLevelLoaded(false);
  };
  const getDate = (time) => {
    const temp = time.split("-");
    return `${temp[2]}/${temp[1]}/${temp[0]}`;
  };
  const getLevelSrc = (level) => {
    if (level === undefined || level < 2) return car0;
    if (level < 16) return car1;
    if (level < 32) return car2;
    if (level < 64) return car3;
    return car4;
  };
  const getNextLevelPoints = (level) => {
    if (level === undefined || level < 2) return 2;
    if (level < 16) return 16;
    if (level < 32) return 32;
    if (level < 64) return 64;
    return 600;
  };
  const addPhone = () => {
    if (level < 64) {
      window.alert("Permission denied. Level 64+");
      return;
    }
    let reqPhone = window.prompt("הכנס מספר טלפון שברצונך להוסיף למערכת:");
    if (reqPhone === null) return;
    axios
      .post(
        "https://europe-west1-parkingtlv103.cloudfunctions.net/api/addPhone",
        {
          phone: reqPhone,
          userId,
        }
      )
      .then((m) => alert(m.data))
      .catch((e) => alert(e.data));
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>מצא חניה</h1>
      </header>
      <div className="parking">
        <img src={img} alt="parking" />
        {levelLoaded && (
          <div className="levelBar">
            <ProgressBar
              getLevelSrc={getLevelSrc}
              getNextLevelPoints={getNextLevelPoints}
              level={level}
            />
          </div>
        )}
      </div>

      <div className="login-buttons">
        {!user ? (
          <button className="login-provider-button" onClick={signInWithGoogle}>
            <img src={google} alt="google icon" />
          </button>
        ) : (
          <h2 className="userDisplay">
            שלום {user}
            <br />
            <p style={{ margin: 0 }}>
              רמה: <span style={{ color: "white" }}>{level}</span>
            </p>
            <a href="https://docs.google.com/spreadsheets/d/1MoiwTiURmRGmSqFSehQn2VOoHwGRl5KQPW8OR3TaMkE/edit?usp=sharing">
              לטבלת רכבים לחץ כאן
            </a>
          </h2>
        )}
      </div>
      {loading && (
        <Button id="load" variant="contained" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          <span> טוען...</span>
        </Button>
      )}
      <div className="parking-buttons">
        {parking.map((btn) => (
          <Button
            id={`n${btn.number}`}
            className="parking-button"
            variant="contained"
            key={btn.number}
            style={{
              maxWidth: "25%",
              height: "150px",
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
                  <img width={30} src={getLevelSrc(btn.level)} alt="car" />
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
          number={number}
        />
      )}
      {userId && (
        <button className="btn btn-info" onClick={addPhone}>
          {" "}
          <img width={30} src={car4} alt="car" />
          הוסף משתמש חדש למערכת <img width={30} src={car4} alt="car" />
        </button>
      )}
      {userId && (
        <p id="logout" onClick={() => handleLogout()}>
          התנתק/י
        </p>
      )}

      <p id="credit">
        Made By{" "}
        <a href="mailto:yonatan.shtalhaim@gmail.com">Yonatan Shtalhaim</a>
      </p>
    </div>
  );
}

export default App;
