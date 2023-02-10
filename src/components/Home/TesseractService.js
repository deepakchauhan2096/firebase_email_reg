import Axios from "./axios";

export class TesseractService {

    async PostImage(image) {
        console.log("image in tesseract is: ",image)
        const data = new FormData();
        console.log("data : ",data)
        data.append("file", image);
        console.log("data2 : ",data)
        var res = await Axios.post(`http://localhost:3001/api/upload-image`, data);
        return res.data
    }

    async GetDataFromOcr(image) {
        console.log("image in tesseract is: ",image)
        // const data = new FormData();
        // console.log("data : ",data)
        // data.append("file", image);
        // console.log("data2 : ",data)
        var res = await Axios.post(`http://localhost:3001/ocr_upload`);
        return res.data
    }
}