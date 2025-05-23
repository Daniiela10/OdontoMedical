import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

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

      if (!token) {
        setError("Token no recibido.");
        return;
      }

      const decoded = jwtDecode(token);
      const rol = decoded.Permiso;

      login(token);

      if (rol === "ADMIN") navigate("/admin/usuarios");
      else if (rol === "DOCTORA") navigate("/doctora/usuarios");
      else if (rol === "RECEPCIONISTA") navigate("/recepcionista/usuarios");
      else if (rol === "PACIENTE") navigate("/perfil");
      else navigate("/unauthorized");
    } catch (err) {
      setError("Credenciales incorrectas o error de servidor.");
    }
  };

  return (
    <div
      style={{
        background: palette.light,
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(85,111,112,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: 380,
        margin: '0 auto',
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{
          color: palette.primary,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={{ color: palette.gray, fontWeight: 500 }}>Correo</label>
          <input
            type="email"
            className="form-control"
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-3">
          <label style={{ color: palette.gray, fontWeight: 500 }}>Clave</label>
          <input
            type="password"
            className="form-control"
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <div
            className="alert"
            style={{
              background: palette.grayLight,
              color: "#fff",
              borderRadius: 10,
              padding: "0.5rem 1rem",
              fontWeight: 500,
              marginBottom: 12,
              border: "none"
            }}
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          className="btn w-100"
          style={{
            background: palette.secondary,
            color: "#fff",
            border: "none",
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 18,
            padding: "0.5rem 0",
            boxShadow: '0 2px 8px rgba(73,182,178,0.10)',
            transition: "background 0.2s"
          }}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default Login;