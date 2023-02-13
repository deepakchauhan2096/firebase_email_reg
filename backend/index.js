const express = require("express");
const multer = require("multer");
const request = require("request");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' })
// const fs = require('fs')
const app = express();
const PORT = 3001;
const cors = require("cors");

app.use(cors());

// for parsing application/json
app.use(express.json({ limit: "50mb" }));
// for parsing application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true, parameterLimit: 50000, limit: "50mb" })
);
// for parsing multipart/form-data
app.use(upload.single("file"));

app.post("/ocr_upload", (req, res) => {
  let ext = "jpeg";
  console.log("started");
  let imageId = Date.now().toString();
  let options = {
    method: "POST",
    url: "https://32tjfxiw9i.execute-api.us-west-2.amazonaws.com/default/ocr-upload",
    headers: { "x-api-key": "e3zlQxHOJRzcmLdqu18sg1Ytq2XOSJ6X/fErkhjO" },
    body: { fileExt: ext, imageID: imageId },
    json: true,
  };
  function callback(error, body) {
    if (error === null) {
      // console.log('body from req', body)
      const result = { message: body.body };
      res.send(result);
    } else {
      res.status(400).send({
        message: "Couldn't upload image",
      });
      console.log("error upload", error);
    }
  }
  request(options, callback);
});

app.post("/api/upload-image", (req, res) => {
  console.log("body 2: ", req.file);
  let uid = req.file.originalname;
  let ext = "jpeg";
  let base64 = req.file.buffer.toString("base64");

  console.log("started");
  let imageId = uid + Date.now().toString();
  let options = {
    method: "POST",
    url: "https://no0voy2hwj.execute-api.us-east-1.amazonaws.com/default/aiupload",
    headers: { "x-api-key": "e3zlQxHOJRzcmLdqu18sg1Ytq2XOSJ6X/fErkhjO" },
    body: { img: base64, fileExt: ext, imageID: imageId },
    json: true,
  };
  function callback(error, body) {
    if (error === null) {
      // console.log('body from req', body)
      const result = { message: body.body, filename: imageId + "." + ext };
      res.send(result);
    } else {
      res.status(400).send({
        message: "Couldn't upload image",
      });
      console.log("error upload", error);
    }
  }
  request(options, callback);
});

app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});
