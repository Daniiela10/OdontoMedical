import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/login", { Correo: correo, Clave: clave });
      const { token } = res.data;

      // Validar token recibido
      if (!token) {
        setError("Token no recibido.");
        return;
      }

      // Decodificar token para obtener el rol
      const decoded = jwtDecode(token);
      const rol = decoded.Permiso;

      // Guardar token en contexto y localStorage
      login(token);

      // Redirigir según el rol
      if (rol === "ADMIN") navigate("/admin/usuarios");
      else if (rol === "JEFE") navigate("/jefe/usuarios");
      else if (rol === "RECEPCIONISTA") navigate("/recepcionista/usuarios");
      else navigate("/unauthorized");
    } catch (err) {
      setError("Credenciales incorrectas o error de servidor.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Correo</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>Clave</label>
          <input
            type="password"
            className="form-control"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;