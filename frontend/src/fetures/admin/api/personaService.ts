import { http } from "../../../shared/api/httpClient";
interface payload{
    rols:number[]
}
export const personaService = {
    getAll: async (params={}) => {
        const { data } = await http.get("/api/personas", { params });
        return data;
    },
    getRols:async () => {
        const { data } = await http.get(`/api/rols`);
        return data;
    },
    asignRols:async (payload:payload,id:number) => {
         const { data } = await http.post(`/api/user/${id}/roles/bulk`,payload);
         return data;
    }        
};