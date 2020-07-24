import axios from 'axios';

const api = axios.create({
  baseURL: "https://revolution.sbidoso.com.br"
})

export default api;