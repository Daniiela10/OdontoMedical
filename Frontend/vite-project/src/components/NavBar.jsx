import { Link, useNavigate } from "react-router-dom";
import { FaUserMd } from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión (elimina token, limpia storage, etc.)
    localStorage.removeItem("token");
    // Puedes limpiar más datos aquí si es necesario
    navigate("/");
  };

  return (
    <nav
      style={{
        width: "100%",
        background: "#556f70",
        padding: "12px 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 100,
      }}
    >
      {/* Logo o ícono a la izquierda */}
      <div style={{ marginLeft: 32 }}>
        <FaUserMd size={32} color="#fff" />
      </div>
      {/* Links a la derecha */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginRight: 32 }}>
        <Link
          to="/perfil"
          style={{
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            marginRight: 28,
            fontSize: 17,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Perfil
        </Link>
        <Link
          to="/agendar-citas"
          style={{
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            marginRight: 28,
            fontSize: 17,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Agendar Cita
        </Link>
        <Link
          to="/ver-mi-historia"
          style={{
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
            marginRight: 28,
            fontSize: 17,
            letterSpacing: 0.5,
            transition: "color 0.2s",
          }}
        >
          Mi Historia
        </Link>
        <button
          onClick={handleLogout}
          style={{
            border: "none",
            outline: "none",
            background: "#eef6f6",
            color: "#556f70",
            fontWeight: 600,
            fontSize: 16,
            borderRadius: 20,
            padding: "7px 22px",
            marginLeft: 8,
            cursor: "pointer",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseOver={e => {
            e.target.style.background = "#49b6b2";
            e.target.style.color = "#fff";
          }}
          onMouseOut={e => {
            e.target.style.background = "#eef6f6";
            e.target.style.color = "#556f70";
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
};

export default NavBar;