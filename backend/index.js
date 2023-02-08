const express = require("express");
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
// const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const app = express();
const PORT =  3001;
const cors = require("cors")
app.use(cors())

// for parsing application/json
app.use(express.json({ limit: "50mb" }));
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, parameterLimit: 50000, limit: "50mb" }));
// for parsing multipart/form-data
app.use(upload.single("file"));

app.post("/test", (req, res) => {
    console.log("yes");
});

app.post("/uploadToS3", (req, res) => {
    // let uid = req.headers["user-key"]
    console.log('body : ', req.file);
    // fs.writeFileSync("res.txt",req)
    
});

app.post("/api/upload-image", (req, res) => {
    console.log('body : ', req.file)
    let uid = req.headers["user-key"];
    let ext = "jpeg";
    let base64 = req.file.buffer.toString("base64");

    console.log("started")
    let imageId = uid + Date.now().toString();
    let options = {
      method: "POST",
      // url: "https://kl6p16gjh4.execute-api.us-west-2.amazonaws.com/default/testuploadicms",
      url: process.env.url + "/testuploadicms",
      // url: "https://rn93zjgpv6.execute-api.us-east-1.amazonaws.com/default/icms_mobile_scanner",
      headers: { "x-api-key": process.env.API_SECRET },
      body: { img: base64, fileExt: ext, imageID: imageId },
      json: true,
    };
    function callback(error, response, body) {
      if (error === null) {
        console.log('body from req', body.body)
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