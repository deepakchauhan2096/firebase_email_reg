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

  var Key_Value_Block = [];
  var Key_only_objects = [];
  let key_value_ids_only = [];
  let temp_id_holder = [];
  let temp_value_id_holder = [];
  let all_Key_value_ids = [];
  let word_from_key;
  let temp_value_id_store;
  let temp_selected_only;
  let final_array = [];

  const find_words_for_key_value = () => {
    final_array = [];
    all_Key_value_ids.map((values) => {
      word_from_key = "";
      values.key.map((id) => {
        ocrData?.message.body.Blocks.map((e) => {
          if (e.Id === id.id) {
            word_from_key = word_from_key + e.Text;
          }
        });
      });
      values.value.map((id) => {
        ocrData?.message.body.Blocks.map((e) => {
          if (id.id == e.Id) {
            e.Relationships?.map((ref_id) => {
              temp_value_id_store = ref_id.Ids;
            });
          }
          if (temp_value_id_store == e.Id) {
            temp_selected_only = e.SelectionStatus || e.Text;
          }
        });
      });
      final_array.push({ key: word_from_key, value: temp_selected_only });
    });
    if (final_array) {
      console.table(final_array);
    }
  };

  const find_Child = () => {
    all_Key_value_ids = [];
    Key_only_objects.map((keys) => {
      keys.Relationships.map((child) => {
        if (child.Type === "CHILD") {
          temp_id_holder = [];
          child.Ids.map((id) => {
            temp_id_holder.push({ id });
          });
        }
        if (child.Type === "VALUE") {
          temp_value_id_holder = [];
          child.Ids.map((id) => {
            temp_value_id_holder.push({ id });
          });
        }
        key_value_ids_only = {
          key: temp_id_holder,
          value: temp_value_id_holder,
        };
      });
      all_Key_value_ids.push(key_value_ids_only);
    });
    console.log(all_Key_value_ids);
    find_words_for_key_value();
  };
  const Filter_KEY_EntityTypes = () => {
    Key_only_objects = [];
    Key_Value_Block.map((e) => {
      if (e.EntityTypes[0] === "KEY") {
        Key_only_objects.push(e);
      }
    });
    find_Child();
  };
  const key_value_pair = () => {
    Key_Value_Block = [];
    ocrData?.message.body.Blocks.map((e) => {
      if (e.BlockType === "KEY_VALUE_SET") {
        Key_Value_Block.push(e);
      }
    });
    Filter_KEY_EntityTypes();
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
          console.log(ocrData);
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
      <div style={{ padding: "2%" }}>
        {/* {ocrData?.message.body.Blocks.map((e, index) =>
          
            e.BlockType === "KEY_VALUE_SET" ? (
              <h6 key={index}>{e.EntityTypes[0]}</h6>
            ) : null
         
        )} */}

        <button onClick={key_value_pair}>click to filter key value pair</button>
      </div>
    </div>
  );
}

export default Home;
