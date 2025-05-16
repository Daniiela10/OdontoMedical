import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

// roles: array de roles permitidos para la ruta
const PrivateRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);

  // Si no hay usuario autenticado, redirige al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Obtiene el rol del usuario correctamente (soporta objeto o string)
  const userRol =
    typeof user.Permiso === "string"
      ? user.Permiso
      : user.Permiso?.rol || user.Permiso?.Rol || "";

  // Si hay restricción de roles y el usuario no tiene permiso, redirige a "no autorizado"
  if (roles && !roles.includes(userRol)) {
    return <Navigate to="/unauthorized" />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
};

export default PrivateRoute;