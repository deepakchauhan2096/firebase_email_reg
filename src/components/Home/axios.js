import axios from "axios";
const Axios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

Axios.interceptors.request.use(async function (config) {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  config.headers["user-key"] = userId;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default Axios;

const WordpressAxios = axios.create({
  baseURL: "https://maharajafarmersmarketusa.com/wp-json/wc/v2",
  auth: {
    username: "ck_e08ee57c7e2b0e7c10a2c932f2ea24cc4264055f",
    password: "cs_1ae97918f989d6af747fd703d4ce77e821c8b738",
  },
});

export { WordpressAxios };

const POSAxios = axios.create({
  // baseURL: "https://dataservices.sypramsoftware.com/api",
  auth: {
    UserId: "MeCHHkZ9",
    Password: "tdypsA =",
    Pin: "lqBZghxJgaVE",
  },
  headers: {
    Pin: "lqBZghxJgaVE",
    UserId: "MeCHHkZ9",
    Password: "tdypsA =",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
});

export { POSAxios };
