import axios from "axios";

const serverUrl = "http://localhost:5000";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});

export {serverUrl};
export default instance;
