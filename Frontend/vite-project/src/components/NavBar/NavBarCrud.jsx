import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FaUserCog, FaTimes, FaUser, FaConciergeBell, FaKey, FaHistory, FaUserMd, FaClinicMedical, FaCalendarAlt, FaSignOutAlt, FaFileMedical } from "react-icons/fa";
import { Button } from "react-bootstrap";
import { AuthContext } from "../../contexts/AuthContext";
import { Modal, Form, Table } from 'react-bootstrap';

// Valores por defecto para el esquema de colores
const defaultColorScheme = {
  primary: '#556f70',
  secondary: '#95bfbd',
  accent: '#49b6b2',
  light: '#eef6f6',
  dark: '#7d7e7d',
};

const getMenuItems = (rol) => {
  if (rol === "ADMIN") {
    return [
      { path: '/admin/usuarios', label: 'Usuarios', icon: <FaUser className="me-2" /> },
      { path: '/admin/permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
      { path: '/admin/servicios', label: 'Servicios', icon: <FaConciergeBell className="me-2" /> },
      { path: '/admin/citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
      { path: '/admin/consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
      { path: '/admin/doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
      { path: '/admin/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
    ];
  }
  if (rol === "DOCTORA") {
    return [
      { path: '/doctora/usuarios', label: 'Usuarios', icon: <FaUser className="me-2" /> },
      { path: '/doctora/permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
      { path: '/doctora/servicios', label: 'Servicios', icon: <FaConciergeBell className="me-2" /> },
      { path: '/doctora/citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
      { path: '/doctora/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
      { path: '/doctora/consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
      { path: '/doctora/doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
    ];
  }
  // RECEPCIONISTA
  return [
    { path: '/recepcionista/usuarios', label: 'Usuarios', icon: <FaUser className="me-2" /> },
    { path: '/recepcionista/historiales', label: 'Historiales', icon: <FaHistory className="me-2" /> },
    { path: '/recepcionista/consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
  ];
};

const NavBarCrud = ({
  isMobile = false,
  sidebarOpen = true,
  setSidebarOpen = () => {},
  colorScheme = defaultColorScheme,
  userRol = ""
}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const menuItems = getMenuItems(userRol);
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menú hamburguesa para móviles
  if (mobile) {
    return (
      <>
        <div style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 2000
        }}>
          <Button
            variant="primary"
            style={{ borderRadius: '50%', width: 56, height: 56, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
            onClick={() => setShowMenu(true)}
            aria-label="Abrir menú"
          >
            <FaUserCog size={28} />
          </Button>
        </div>
        {showMenu && (
          <div className="menu-overlay" onClick={() => setShowMenu(false)}>
            <div
              className="mobile-menu sidebar"
              onClick={e => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowMenu(false)}>
                <FaTimes />
              </button>
              <div>
                <div className="navbar-brand">
                  <FaUserCog className="me-2" size={24} />
                  Panel de Control
                </div>
                <Nav variant="pills" className="flex-column nav">
                  {menuItems.map((item) => (
                    <Nav.Item key={item.path}>
                      <Nav.Link
                        as={Link}
                        to={item.path}
                        className="nav-link"
                        onClick={() => setShowMenu(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
              <Button className="btn" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="sidebar">
      <div>
        <div className="navbar-brand">
          <FaUserCog className="me-2" size={24} />
          Panel de Control
        </div>
        <Nav variant="pills" className="flex-column nav">
          {menuItems.map((item) => (
            <Nav.Item key={item.path}>
              <Nav.Link
                as={Link}
                to={item.path}
                className="nav-link"
                active={location.pathname === item.path}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
      <Button className="btn" onClick={handleLogout}>
        <FaSignOutAlt className="me-2" />
        Cerrar sesión
      </Button>
    </div>
  );
};

export default NavBarCrud;