import api from "./client";

export interface HolaResponse {
  mensaje: string;
}

export async function getHola(): Promise<HolaResponse> {
  const response = await api.get<HolaResponse>("/hola");
  return response.data;
}

