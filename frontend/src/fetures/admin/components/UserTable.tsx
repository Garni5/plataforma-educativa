
import type { Persona } from '../types/Invetory';

interface Props{
    onAsign: (persona: Persona) => void;  
    items:Persona[];
    loading:boolean;
}

function UserTable({onAsign,items,loading}:Props) {
  return (           
             <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">Nombres</th>
                            <th className="py-3 px-6">Correo</th>
                            <th className="py-3 px-6">Telefono</th>
                            <th className="py-3 px-6">Roles</th>
                            <th className="py-3 px-6">Acciones</th>

                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="py-3 px-6 text-center">
                                    Cargando...
                                </td>
                            </tr>
                        ):
                        items?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-3 px-6 text-center">
                                    No se encontraron resultados
                                </td>
                            </tr>
                        ):(
                             
                            items?.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.nombres} {item.apellidos}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.correo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.telefono}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.roles?.map(role => role.nombre).join(', ')}</td>
                                    <td className=" px-6 py-4 whitespace-nowrap">
                                      
                                        <button
                                        onClick={()=>onAsign(item)}
                                        className="py-2 leading-none px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Asignar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        
                        )
                        }
                       
                    </tbody>
                </table>
            </div>
       
  )
}

export default UserTable



