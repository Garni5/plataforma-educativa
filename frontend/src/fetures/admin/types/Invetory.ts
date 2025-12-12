export  interface Persona {
  id_persona:number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  password: string;
  roles?:Rol[];
}
export  interface Rol{
    id:number,
    nombre:string
}
export interface UsePersonasParams {
  search?: string;
  id_rol?: number;
  page?: number;
  limit?: number | null;  
}