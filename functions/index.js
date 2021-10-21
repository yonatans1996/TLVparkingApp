const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
const axios = require("axios");
const cors = require("cors");
const firebaseConfig = {
  apiKey: "AIzaSyAM5kUWITztlOqJ7t8_zupos5-Adh6PypE",
  authDomain: "parkingtlv103.firebaseapp.com",
  projectId: "parkingtlv103",
  storageBucket: "parkingtlv103.appspot.com",
  messagingSenderId: "450372316952",
  appId: "1:450372316952:web:8169ea8d94dd7fae98f86d",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const app = express();
app.use(cors());
// const firebase = require("firebase");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//Return array of all parking buttons
app.get("/buttons", (req, res) => {
  db.collection("parkings")
    .orderBy("number")
    .onSnapshot((docs) => {
      let tempParking = [];
      docs.forEach((doc) => {
        const data = doc.data();
        tempParking.push(data);
      });
      return res.send(tempParking);
    });
});

app.post("/addPhone", async (req, res) => {
  if (
    !req.body.phone ||
    req.body.phone.match(/^[0-9]+$/) == null ||
    req.body.phone.length !== 10
  ) {
    res.send("מספר  טלפון לא חוקי (10 ספרות)");
    return;
  }
  let levelResult = await db
    .collection("users")
    .doc(req.body.userId)
    .get()
    .then((res) => res.data())
    .catch((e) => res.send(e));
  let result = levelResult.level ? levelResult.level : 0;

  let phoneRes = await db
    .collection("phones")
    .doc(req.body.phone)
    .get()
    .then((res) => res.data())
    .catch((e) => console.log(e));

  if (result < 64 || phoneRes !== undefined) {
    if (result < 64) res.send("Permission denied. Level 64+");
    else res.send("Phone is alreay in the system");
    return;
  }
  db.collection("phones").doc(req.body.phone).set({ valid: true });
  res.send("מספר טלפון נוסף בהצלה");
});

//Signup new user to DB
app.post("/signup", async (req, res) => {
  let phoneRes = await db
    .collection("phones")
    .doc(req.body.phone)
    .get()
    .then((res) => res.data())
    .catch((e) => console.log(e));
  console.log(phoneRes);
  if (phoneRes !== undefined && phoneRes.valid) {
    db.collection("phones").doc(req.body.phone).set({ valid: false });
    db.collection("users")
      .doc(req.body.id)
      .set(req.body)
      .then((sucsess) => res.status(200).send(sucsess))
      .catch((e) => res.send(e));
  } else {
    res.status(400).send("מספר הפלאפון לא נמצא במערכת");
  }
});
app.get("/parkinguser", async (req, res) => {
  const personId = await db
    .collection("parkings")
    .doc(req.query.parkingNumber)
    .get()
    .then((res) => res.data().userId);
  let parkingData = await db
    .collection("users")
    .doc(personId)
    .get()
    .then((res) => res.data());
  res.send(parkingData);
});

app.get("/updateuserpark", async (req, res) => {
  const parking = req.query.parked === "true";
  let parkingData = await db
    .collection("users")
    .doc(req.query.userId)
    .update({ parked: parking })
    .catch((e) => res.send(e));
  res.send("update user success");
});

app.get("/kickUser", (req, res) => {
  const emptyParking = {
    color: "primary",
    date: "",
    time: "",
    user: "",
    userId: "",
  };
  db.collection("parkings").doc(req.query.parkingNumber).update(emptyParking);
  res.send("success kick");
});

app.post("/setparking", async (req, res) => {
  const parking = await db
    .collection("parkings")
    .doc(req.query.parkingNumber)
    .set(req.body)
    .catch((e) => res.send(e));
  res.send("parking updated successfuly");
});

app.post("/updateparktime", async (req, res) => {
  const parking = await db
    .collection("parkings")
    .doc(req.query.parkingNumber)
    .update(req.body)
    .catch((e) => res.send(e));
  res.send("parking time and date updated success");
});

app.get("/userparkstatus", async (req, res) => {
  if (!req.query.userId) {
    res.send("User not found");
    return;
  }
  const user = await db
    .collection("users")
    .doc(req.query.userId)
    .get()
    .then((res) => res.data());
  if (!user) {
    res.send("User not found");
    return;
  }
  console.log(user);
  res.send(user.parked === true);
});
app.get("/level", async (req, res) => {
  let levelResult = await db
    .collection("users")
    .doc(req.query.userId)
    .get()
    .then((res) => res.data())
    .catch((e) => res.send(e));
  let result = levelResult.level ? levelResult.level : 0;
  res.send(`${result}`);
});
app.get("/expired", async (req, res) => {
  const table = {
    "01": 0,
    "02": 1,
    "03": 2,
    "04": 3,
    "05": 4,
    "06": 5,
    "07": 6,
    "08": 7,
    "09": 8,
    10: 9,
    11: 10,
    12: 11,
  };
  const hours = {
    "00": 0,
    "01": 1,
    "02": 2,
    "03": 3,
    "04": 4,
    "05": 5,
    "06": 6,
    "07": 7,
    "08": 8,
    "09": 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
  };
  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    return this;
  };
  const currentDate = new Date();
  currentDate.addHours(3);
  db.collection("parkings")
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const park = doc.data();
        if (park.date) {
          const parkString = park.date.split("-");
          const timeString = park.time.split(":");
          const parkDate = new Date(
            parkString[0],
            table[parkString[1]],
            parkString[2],
            hours[timeString[0]],
            timeString[1]
          );
          if (parkDate < currentDate) {
            db.collection("users")
              .doc(`${park.userId}`)
              .update({ level: firebase.firestore.FieldValue.increment(1) })
              .catch((e) => res.send(e));

            db.collection("parkings").doc(`${park.number}`).update({
              time: "",
              date: "",
              color: "primary",
              user: "",
              userId: "",
            });
          }
        }
      });
    });
  res.send("ok");
});

exports.api = functions.region("europe-west1").https.onRequest(app);
