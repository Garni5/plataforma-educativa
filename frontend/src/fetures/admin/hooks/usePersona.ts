
import { useState, useEffect, useCallback } from "react";
import type { Persona, Rol, UsePersonasParams} from "../types/Invetory";
import { personaService } from "../api/personaService";

interface ApiError {
  message: string;
}
interface RolAPI {
    id_rol: number;
    nombre_privilegio: string;
}

export const usePersonas = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [rols,setRols] = useState<Rol[]>([]);
  const [rol,setRol] = useState<Rol | null>(null);

  const asignRols = async (id: number, rols: number[]) => {
    try {
      const payload = {rols:rols};
      const data = await personaService.asignRols(payload, id);
      console.log(data);      
    } catch (err) {
       const error = err as ApiError;
      setError(error.message || "Error al asignar roles");
    }
  };

  const fetchRols = useCallback(async () => {
    try {
      const data = await personaService.getRols();
     const adaptedData: Rol[] = data.data
    .filter((rol: RolAPI ) => rol.nombre_privilegio !== "administrador")
    .map((rol: RolAPI) => ({
        id: rol.id_rol,
        nombre: rol.nombre_privilegio
    }));
      setRols(adaptedData || []);
    } catch (err) {
       const error = err as ApiError;
      setError(error.message || "Error al cargar roles");
    }
  },[]);
 const fetchPersonas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: UsePersonasParams = { 
        search:search,
        page:page,
        id_rol:rol?.id  
    };
      const data = await personaService.getAll(params)
     const adaptedData = data.data
    .filter((persona: Persona) => 
        !persona.roles?.some((rol: Rol) => rol.nombre === "administrador")
    )
    .map((persona: Persona) => ({
        ...persona,
        roles: persona.roles?.filter((rol: Rol) => rol.nombre !== "administrador")
    }));
      setPersonas(adaptedData  || []);
      setTotal(data.totalRecords || 0);   
      setLastPage(data.meta.lastPage || 1);   
    } catch (err) {
             const error = err as ApiError;
      setError(error.message || "Error al cargar personas");
    } finally {
      setLoading(false);
    }
  }, [search, rol, page]);
  useEffect(() => {
    fetchRols();
    fetchPersonas();
  }, [fetchRols, fetchPersonas]);
   
  return { 
    personas,
    total,
    loading,
    error,
    setters:{setSearch,setPage,setRol},
    rols,
    lastPage,
    filters:{search,rol,page},
    refetch: fetchPersonas,
    rolsAsign:asignRols
 };
};

