import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.254.135.189:5000', 
  //baseURL: 'http://0.0.0.0:5000', 
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      let token = localStorage.getItem('token'); 
      
      if (token) {
        const cleanToken = token.replace(/"/g, ''); 
        
        config.headers.Authorization = `Bearer ${cleanToken}`;
        
        console.log("🚀 API : Token nettoyé et envoyé au serveur.");
      } else {
        console.warn("⚠️ API : Aucun token trouvé dans le localStorage.");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;