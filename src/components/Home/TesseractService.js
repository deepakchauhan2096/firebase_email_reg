import Axios from "./axios";

export class TesseractService {

    async PostImage(image) {
        console.log("image in tesseract is: ",image)
        const data = new FormData();
        console.log("data : ",data)
        data.append("file", image);

        console.log("data2 : ",data)
        // let temp = data
        // var res = await Axios.post(appendURL+`/api/upload-image`, {params:{data:data,vendorName}});
        // var res = await Axios.post(`http://localhost:3001/api/upload-image`, data);
        // var res = await Axios.post(`http://localhost:3001/test`);
        // var res = await Axios.post(`http://localhost:5001/api/upload-image`, data);
        var res = await Axios.post(`http://localhost:3001/uploadToS3`, data);
        return res.data
    }
}