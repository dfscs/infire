require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");

// seting middleware
app.use(express.json());
//Initializing Passport
app.use(passport.initialize());
//passport template
require("./Config/Passport");

//CORS Policy
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// importing Routes
const post = require("./Routes/post");
const user = require("./Routes/oauth");
const auth = require("./Routes/auth");
const news = require("./Routes/NewsApi");
app.use("/api/auth", user);
app.use("/api/v1", post); // call hoga aise api/v1/post/upload  is type se andar me
app.use("/api/news", news);
app.use(auth);

// For any unknown API request
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(500).json({ message: error.message || "Something went wrong" });
});

const PORT = process.env.PORT || 8000;
const CONNECTION_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cukln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌹✔✔ MongoDB Connected and Connection started at ${PORT}`);
      console.log(`Local -> http://localhost:8000`);
      console.log(`Client Origin -> ${process.env.CLIENT_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
