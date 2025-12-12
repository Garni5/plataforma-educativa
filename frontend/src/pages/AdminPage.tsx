import React, { useState } from 'react';
import UserTable from '../fetures/admin/components/UserTable';
import { usePersonas } from '../fetures/admin/hooks/usePersona';
import Pagination from '../fetures/admin/components/Pagination';
import ModalAsignarRol from '../fetures/admin/components/ModalAsignarRol';
import type { Persona } from '../fetures/admin/types/Invetory';


const AdminPage: React.FC = () => {
  const { 
    personas, 
    loading, 
    error, 
    setters, 
    rols, 
    filters,
    lastPage, 
    refetch ,
    rolsAsign
  } = usePersonas();


  const [open, setOpen] = useState(false);
  const [personaAsignar, setPersonaAsignar] = useState<Persona | null>(null);
  const handleAsign = (persona: Persona) => {
    console.log("Asignar persona con ID:", persona);
    setPersonaAsignar(persona);
    setOpen(true);   
  };
  const handleAssign = (rolesSeleccionados: number[]) => {
        console.log("Roles asignados:", rolesSeleccionados);
        rolsAsign(personaAsignar?.id_persona || 0,rolesSeleccionados);
        setOpen(false);
        refetch();
    };

   

  return (
    <div className="p-4">
      {error && <div className="text-red-600 mb-4">{error}</div>}

     <div className="items-start justify-between md:flex">
    <div className="max-w-lg">
        <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            Asignación de roles
        </h3>
        <p className="text-gray-600 mt-2">
            Administra y asigna los roles correspondientes a cada persona para garantizar un acceso adecuado y controlar los permisos dentro del sistema.
        </p>
    </div>
</div>

      <div className="mb-4 flex justify-end gap-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={filters.search}
          onChange={(e) => setters.setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <select
          value={filters.rol?.id || ""}
          onChange={(e) => {
            const rol = rols.find(r => r.id === Number(e.target.value)) || null;
            setters.setRol(rol);
          }}
          className="border p-2 rounded-lg"
        >
          <option value="">Todos los roles</option>
          {rols.map(r => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>
      </div>

      <UserTable
        onAsign={handleAsign}     
        items={personas}
        loading={loading}
      />
        
      <Pagination page={filters.page} lastPage={lastPage} onChange={setters.setPage}/>
      <ModalAsignarRol
                open={open}
                personaNombre={personaAsignar?.nombres || ''}
                roles={rols}
                rolesSeleccionados={personaAsignar?.roles?.map(r => r.id) || []} // opcional
                onClose={() => setOpen(false)}
                onAssign={handleAssign}
            />
    </div>
  );
};

export default AdminPage;
