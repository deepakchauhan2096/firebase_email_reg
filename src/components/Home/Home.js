import { async } from "@firebase/util";
import React, { useState } from "react";
import { TesseractService } from "./TesseractService";

function Home(props) {
  const [file, setFile] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [filename, setFilename] = useState(null);
  const [ocrData, setOcrData] = useState();
  const tesseractService = new TesseractService();

  const handleFileChange = async (files) => {
    console.log("files : ", files);
    files = Object.values(files);
    console.log("files2 : ", files);
    if (files.length <= 9) {
      const inputFiles = [];
      const imagePreviewUrls = [];
      files.forEach((selectedFile) => {
        let reader = new FileReader();
        inputFiles.push(selectedFile);
        reader.readAsDataURL(selectedFile);
        setFile(inputFiles);
        reader.onloadend = () => {
          console.log("reader result", reader.result);
          imagePreviewUrls.push(reader.result);
          setFile(inputFiles);
          setImagePreviewUrl(imagePreviewUrls);
        };
      });
    } else {
      alert("Select only upto 9 files");
    }
  };

  const scanInvoice = () => {
    const postImage = async () => {
      console.log("file >>> : ", file);
      const filenames = await Promise.all(
        file.map(async (inputFile) => {
          try {
            console.log("inputFile : ", inputFile);
            const res = await tesseractService.PostImage(inputFile);
            return res.filename;
          } catch (error) {
            console.log("error fetching descripton", error);
            throw new Error("error");
          }
        })
      );
      console.log("scanInvoice_filenames : ", filenames);
      setFilename(filenames);
    };
    postImage()
      .then((data) => {
        console.log("postImage_data : ", data);
      })
      .catch((err) => {
        alert("Please try again.");
        console.log("err", err);
      });
  };

  const getOcrData = async () => {
    alert("wait for 60 sec. ");
    try {
      const res = await tesseractService.GetDataFromOcr();
      setOcrData(res);
    } catch (error) {
      console.log(error);
    }
  };
  const blockTypeMap = {
    KEY_VALUE_SET: "Key-Value Set",
    PAGE: "Page",
    LINE: "Line",
    WORD: "Word",
    TABLE: "Table"
  };

  return (
    <div>
      <h2>{props.name ? `Welcome - ${props.name}` : "Login please"}</h2>
      <br />
      <input
        type="file"
        multiple
        accept="image/*"
        name="image"
        onChange={(e) => {
          handleFileChange(e.target.files);
        }}
      />
      <button onClick={scanInvoice}>Upload</button>
      <br />
      <br />
      <button onClick={() => console.log(ocrData)}>console</button>
      <br />
      <button onClick={getOcrData}> get data from ocr</button>
      {ocrData ? (
        <h1>Data found:</h1>
      ) : (
        <h1> Press, "get data from ocr" and wait till you see data.</h1>
      )}
      <div style={{ padding: "2%" }}>
        {ocrData?.message.body.Blocks.map((e, index) =>
          
            e.BlockType === "LINE" ? (
              <h6 key={index}>{e.Text}</h6>
            ) : null
         
        )}


      </div>
    </div>
  );
}

export default Home;
