import React, { useState, useEffect } from "react";
import type { Rol } from "../types/Invetory";



interface Props {
    open: boolean;
    personaNombre: string;
    roles: Rol[];
    rolesSeleccionados?: number[]; 
    onClose: () => void;
    onAssign: (roles: number[]) => void;
}

const ModalAsignarRol: React.FC<Props> = ({
    open,
    personaNombre,
    roles,
    rolesSeleccionados = [],
    onClose,
    onAssign
}) => {

    const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

    useEffect(() => {
        setSelectedRoles(rolesSeleccionados);
    }, [rolesSeleccionados]);

    if (!open) return null;

    const toggleRole = (id: number) => {
        if (selectedRoles.includes(id)) {
            setSelectedRoles(selectedRoles.filter(r => r !== id));
        } else {
            setSelectedRoles([...selectedRoles, id]);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-800">
                    Asignar roles a: <span className="text-indigo-600">{personaNombre}</span>
                </h2>

                <p className="mt-2 text-gray-600">
                    Selecciona los roles que deseas asignar a esta persona.
                </p>


                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    {roles.map((rol) => (
                        <label key={rol.id} className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={selectedRoles.includes(rol.id)}
                                onChange={() => toggleRole(rol.id)}
                                className="w-4 h-4 text-indigo-600"
                            />
                            <span className="text-gray-700">{rol.nombre}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end mt-6 gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => onAssign(selectedRoles)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Asignar roles
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAsignarRol;
