const functions = require("firebase-functions");
const express = require("express");
const firebase = require("firebase-admin");
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

//Signup new user to DB
app.post("/signup", (req, res) => {
  db.collection("users")
    .doc(req.body.id)
    .set(req.body)
    .then((sucsess) => res.status(200).send(sucsess))
    .catch((e) => res.send(e));
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

app.post("/setparking", async (req, res) => {
  let parked;
  if (req.body.color == "primary") parked = false;
  else parked = true;
  console.log(req.query, req.body);
  console.log(parked);
  db.collection("users")
    .doc(req.query.userId)
    .update({ parked: parked })
    .catch((e) => console.log(e));
  const parking = await db
    .collection("parkings")
    .doc(req.query.parkingNumber)
    .set(req.body)
    .catch((e) => res.send(e));
  res.send("parking updated success");
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

exports.api = functions.region("europe-west1").https.onRequest(app);
