import { http } from "../../../shared/api/httpClient";
import qs from "qs";

export const authService = {
  login: async (username: string, password: string , url: string) => {    
    const data = qs.stringify({ username, password });

    const response = await http.post(url, data, {
   headers: { "Content-Type": "application/json" },
    });

    console.log(response.data);
    return response.data; // Ejemplo: { token, user }
  },

  logout: () => {
     localStorage.removeItem("token");
  },

 /*  getProfile: async () => {
    const { data } = await http.get('/user/me');
    return data;
  }, */
};
