import "@testing-library/jest-dom"; // para toBeInTheDocument
import { render, screen, fireEvent } from "@testing-library/react";
import type { Rol } from "../types/Invetory";
import ModalAsignarRol from "./ModalAsignarRol";

describe("ModalAsignarRol sin jest/vi", () => {
  const roles: Rol[] = [
    { id: 1, nombre: "Administrador" },
    { id: 2, nombre: "Docente" },
    { id: 3, nombre: "Estudiante" },
  ];

  let closeCalled = false;
  let assignedRoles: number[] | null = null;

  const onClose = () => {
    closeCalled = true;
  };

  const onAssign = (roles: number[]) => {
    assignedRoles = roles;
  };

  beforeEach(() => {
    closeCalled = false;
    assignedRoles = null;
  });

  // Helper para renderizar el modal
  const renderModal = (open = true, selected: number[] = []) => {
    return render(
      <ModalAsignarRol
        open={open}
        personaNombre="Juan"
        roles={roles}
        rolesSeleccionados={selected}
        onClose={onClose}
        onAssign={onAssign}
      />
    );
  };

  test("no renderiza cuando open es false", () => {
    renderModal(false);
    expect(screen.queryByText(/Asignar roles a:/i)).toBeNull();
  });

  test("renderiza correctamente cuando open es true", () => {
    renderModal();

    // Buscamos el heading h2 de manera accesible
    expect(
      screen.getByRole("heading", { name: /Asignar roles a:/i })
    ).toBeInTheDocument();

    // Verificamos que los roles estén en el documento
    roles.forEach((rol) => {
      expect(screen.getByText(rol.nombre)).toBeInTheDocument();
    });
  });

  test("inicializa roles seleccionados correctamente", () => {
    renderModal(true, [1, 3]);

    const checkboxAdmin = screen.getByLabelText("Administrador") as HTMLInputElement;
    const checkboxEstudiante = screen.getByLabelText("Estudiante") as HTMLInputElement;
    const checkboxDocente = screen.getByLabelText("Docente") as HTMLInputElement;

    expect(checkboxAdmin.checked).toBe(true);
    expect(checkboxEstudiante.checked).toBe(true);
    expect(checkboxDocente.checked).toBe(false);
  });

  test("permite seleccionar, deseleccionar roles y asignar", () => {
    renderModal();

    const checkboxAdmin = screen.getByLabelText("Administrador") as HTMLInputElement;
    const checkboxDocente = screen.getByLabelText("Docente") as HTMLInputElement;

    // Seleccionar roles
    fireEvent.click(checkboxAdmin);
    fireEvent.click(checkboxDocente);

    expect(checkboxAdmin.checked).toBe(true);
    expect(checkboxDocente.checked).toBe(true);

    // Asignar roles
    fireEvent.click(screen.getByText("Asignar roles"));
    expect(assignedRoles).toEqual([1, 2]);

    // Cancelar
    fireEvent.click(screen.getByText("Cancelar"));
    expect(closeCalled).toBe(true);
  });
});
