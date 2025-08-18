import axios from "axios";

const ApiCustomer = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

export default ApiCustomer;