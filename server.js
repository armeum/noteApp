const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// const port = 5000;
const mongoose = require("mongoose");
const req = require("express/lib/request");
const res = require("express/lib/response");
const dotenv =  require('dotenv').config()
const PORT =  process.env.PORT || 5000
//middleware
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let MONGODB_URI = `mongodb+srv://munisa:tel5850789@cluster0.eh7df.mongodb.net/AnyNoteDB`;

mongoose.connect(MONGODB_URI || "mongodb://localhost:27017/AnyNoteDB");

const anynoteSchema = {
  date: String,
  title: String,
  body: String,
};

const AnyNote = mongoose.model("AnyNote", anynoteSchema);

app.get("/", (req, res) => {
  AnyNote.find({}, (err, anyNote) => {
    res.render("index", { anyNote: anyNote });
  });
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.get("/header", (req, res) => {
  res.render("header");
});

// app.get("/create", (req, res) => {
//   res.render("create", { title: req.body.title, body: req.body.body });
// });
app.get("/create", (req, res) => {
  res.render("create");
});

// app.post("/createNote", (req, res) => {
//   console.log(req.body.title);
//   console.log(req.body.noteBody);
//   res.render("index", { title: req.body.title, body: req.body.noteBody });
// });

app.post("/createNote", (req, res) => {
  console.log(req.body);
  const anyNote = new AnyNote(req.body);
  anyNote.save();
  res.redirect("/");

  AnyNote.find({}, (err, anyNote) => {
    if (!err) {
      console.log(req.body);

      console.log("success");
    } else {
      res.redirect("/create");
      console.log("failed, the error is ", err);
    }
  });
});

app.get("/delete/:id", (req, res) => {
  AnyNote.findByIdAndDelete(req.params.id, (err) => {
    err ? console.error(err) : console.log("deleted");

    res.redirect("/");
  });
});

app.get("/edit/:id", (req, res) => {
  AnyNote.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    (err, result) => {
      if (!err) {
        res.render("update", { anyNote: result });
      } else {
        console.log(err);
      }
    }
  );
});

app.get("/delete/:id", (req, res) => {
  AnyNote.findByIdAndDelete(req.params.id, (err) => {
    err ? console.error(err) : console.log("deleted");

    res.redirect("/");
  });
});

app.post("/edit/:id", (req, res) => {
  AnyNote.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    (err, result) => {
      if (!err) {
        console.log(req.body);

        res.redirect("/");
        console.log("success");
      } else {
        console.log(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Hello world", port);
});
