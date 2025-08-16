import axios from 'axios';
const backend_url = import.meta.env.VITE_API_URL;
export default axios.create({
    baseURL : backend_url
});

export const axiosPrivate = axios.create({
    baseURL : backend_url,
    headers : { 'Content-Type' : 'application/json' },
    withCredentials : true
});