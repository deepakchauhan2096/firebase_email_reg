import React, { useState } from "react";
import { TesseractService } from "./TesseractService";

function Home(props) {
  const [file, setFile] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [filename, setFilename] = useState(null);
  const [invoiceImgUrls, setInvoiceImgUrls] = useState([]);

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
        // reader.onloadend = () => {
        //   console.log("reader result", reader.result);
        //   imagePreviewUrls.push(reader.result);
        //   setFile(inputFiles);
        //   setImagePreviewUrl(imagePreviewUrls);
        // };
      });
      // setTimeout(() => {
      //   setFile(inputFiles);
      //   setImagePreviewUrl(imagePreviewUrls);
      // }, 1000);
    } else {
      alert("Select only upto 9 files");
    }
  };

  const scanInvoice = () => {
    const postImage = async () => {
      const filenames = await Promise.all(
        file?.map(async (inputFile) => {
          try {
            const res = await tesseractService.PostImage(inputFile);
            setInvoiceImgUrls((prev) => [
              ...prev,
              res.message.imageURL.Location,
            ]);
            return res.filename;
          } catch (error) {
            console.log("error fetching descripton", error);
            // return null;
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

  return (
    <div>
      <h2>{props.name ? `Welcome - ${props.name}` : "Login please"}</h2>
      <br />
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange(e.target.files)}
      />
      <button onClick={scanInvoice}>Upload</button>
      <button onClick={() => console.log(file)}>console</button>
    </div>
  );
}

export default Home;
