import api from "./api";

const userService = {
    login: async (email, password) => {
        try {
            const response = await api.post("/users/signin", { email, password });
            return response.data; 
        } catch (error) {
            throw error;
        }
    },

    signup: async (userData) => {
        try {
            const response = await api.post("/users/signup", userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    }
};

export default userService;