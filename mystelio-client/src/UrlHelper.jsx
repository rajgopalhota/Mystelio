import axios from "axios";

// const serverUrl = "http://localhost:5000";
const serverUrl = "http://10.46.119.254:5000";

const instance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "http://10.46.119.254:5000",
});

export {serverUrl};
export default instance;
