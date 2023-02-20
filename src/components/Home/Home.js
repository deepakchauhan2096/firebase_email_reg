import React, { useState } from "react";
import { TesseractService } from "./TesseractService";

function Home(props) {
  const [file, setFile] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [filename, setFilename] = useState(null);
  const [ocrData, setOcrData] = useState();
  const [ocrDataBody, setOcrDataBody] = useState();

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
    setOcrData();
    setOcrDataBody();
    try {
      const res = await tesseractService.GetDataFromOcr();
      setOcrData(res);
      // if (res) {
      //   const entries = Object.entries(res.message.body);
      //   var objs = entries.map((x) => ({
      //     key: x[0],
      //     value: x[1],
      //   }));
      //   setOcrDataBody(objs);
      // }
    } catch (error) {
      console.log(error);
    }
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
      <button
        onClick={() => {
          console.log(ocrDataBody, ocrData);
        }}
      >
        console
      </button>
      <br />
      <button onClick={getOcrData}> get data from ocr</button>
      {ocrData ? (
        <h1>Data found:</h1>
      ) : (
        <h1> Press, "get data from ocr" and wait till you see data.</h1>
      )}
      <div>
        {ocrDataBody?.map((e, index) => (
          <div style={{ margin: "1%" }}>
            {e.value.map((v) => (
              <div
   
                style={{
                  background: "white",
                  color: "#000",
                  margin: "0.2%",
                  width: "24%",
                  height: "100px",
                  overflow: "scroll",
                  float: "left",
                  border: "0.5px solid black",
                  borderRadius: "7px",
                  padding: "1%",
                }}
              >
      
                {e.key + ":"}<hr style={{ margin:"2%"}} />
                <h4   style={{ color: "#91464d" }}>
                  {v === "" ? "Not Filled" : v}
                </h4>
                <br />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
