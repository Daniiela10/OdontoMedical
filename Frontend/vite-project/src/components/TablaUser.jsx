import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Table, InputGroup, Spinner, Alert, Container, Nav } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaUserCog, FaBars, FaSignOutAlt, FaTimes, FaKey, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd } from 'react-icons/fa';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles';

const API_URL = '/users';

const TablaUser = () => {
  // Contexto de autenticación
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Determina el rol mínimo requerido según la ruta
  let rutaRol = "";
  if (location.pathname.startsWith('/admin')) rutaRol = "ADMIN";
  else if (location.pathname.startsWith('/jefe')) rutaRol = "JEFE";
  else if (location.pathname.startsWith('/recepcionista')) rutaRol = "RECEPCIONISTA";

  // Obtiene el rol real del usuario
  const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";

  // LOG para depuración
  console.log("user:", user);
  console.log("userRol:", userRol);
  console.log("rutaRol:", rutaRol);

  // Permisos por jerarquía
  const puedeVer = tienePermiso(userRol, rutaRol);
  const puedeCrear = tienePermiso(userRol, rutaRol);
  const puedeEditar = tienePermiso(userRol, rutaRol);
  const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar usuarios

  // Si no puede ver, no renderiza nada
  if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

  // Estados principales
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Tipo_Doc: '',
    Doc_identificacion: '',
    Telefono: '',
    Correo: '',
    Permiso: '',
    Clave: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Estado para el modal de confirmación de borrado
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Estado para el modal de crear usuario
  const [showCreateModal, setShowCreateModal] = useState(false);

  const colorScheme = {
    primary: '#2c3e50',
    secondary: '#34495e',
    accent: '#3498db',
    danger: '#e74c3c',
    light: '#ecf0f1',
    dark: '#2c3e50'
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    fetchUsers();
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line
  }, [location.pathname]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_URL);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      setError('Error al cargar los usuarios. Por favor intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.Nombre.trim()) errors.Nombre = 'Nombre es requerido';
    if (!formData.Apellido.trim()) errors.Apellido = 'Apellido es requerido';
    if (!formData.Doc_identificacion.trim()) errors.Doc_identificacion = 'Documento es requerido';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      if (editingUser) {
        await api.patch(`${API_URL}/${editingUser._id}`, formData);
      } else {
        await api.post(API_URL, formData);
      }
      setShowEditModal(false);
      setShowCreateModal(false);
      await fetchUsers();
    } catch (error) {
      setError(editingUser ? 'Error al actualizar el usuario.' : 'Error al crear el usuario.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      Nombre: user.Nombre || '',
      Apellido: user.Apellido || '',
      Tipo_Doc: user.Tipo_Doc || '',
      Doc_identificacion: user.Doc_identificacion || '',
      Telefono: user.Telefono || '',
      Correo: user.Correo || '',
      Permiso: user.Permiso?._id || user.Permiso || '',
      Clave: ''
    });
    setFormErrors({});
    setShowEditModal(true);
    if (isMobile) setSidebarOpen(false);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`${API_URL}/${userToDelete._id}`);
      setShowDeleteModal(false);
      await fetchUsers();
    } catch (error) {
      setError('Error al eliminar el usuario.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.Doc_identificacion?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.Apellido?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lógica para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    sessionStorage.clear();
    if (setUser) setUser(null); // Limpia el contexto si es posible
    navigate('/login');
  };

  // Configuración de vistas permitidas por rol
  const menuConfig = {
    ADMIN: [
      { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
      { key: 'permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
      { key: 'servicios', label: 'Servicios', icon: <FaCogs className="me-2" /> },
      { key: 'citas', label: 'Citas', icon: <FaCalendarAlt className="me-2" /> },
      { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
      { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
      { key: 'doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
    ],
    JEFE: [
      { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
      { key: 'permisos', label: 'Permisos', icon: <FaKey className="me-2" /> },
      { key: 'servicios', label: 'Servicios', icon: <FaCogs className="me-2" /> },
      { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
      { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
      { key: 'doctores', label: 'Doctores', icon: <FaUserMd className="me-2" /> },
    ],
    RECEPCIONISTA: [
      { key: 'usuarios', label: 'Usuarios', icon: <FaUserCog className="me-2" /> },
      { key: 'historiales', label: 'Historiales', icon: <FaFileMedical className="me-2" /> },
      { key: 'consultorios', label: 'Consultorios', icon: <FaClinicMedical className="me-2" /> },
    ],
  };

  // Función para obtener el prefijo de ruta según el rol
  const getBasePath = (rol) => {
    if (rol === "ADMIN") return "/admin";
    if (rol === "JEFE") return "/jefe";
    if (rol === "RECEPCIONISTA") return "/recepcionista";
    return "/";
  };

  const basePath = getBasePath(userRol);

  // Genera el menú filtrado según el rol
  const menuItems = (menuConfig[userRol] || []).map(item => ({
    ...item,
    path: `${basePath}/${item.key}`
  }));

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colorScheme.light }}>
      {/* Sidebar */}
      <div
        className={`d-flex flex-column ${isMobile ? 'position-fixed' : ''}`}
        style={{
          width: isMobile ? '75%' : '250px',
          height: '100vh',
          zIndex: 1000,
          transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
          backgroundColor: colorScheme.primary,
          color: colorScheme.light
        }}
      >
        <div className="p-3 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: colorScheme.secondary }}>
          <div className="d-flex align-items-center">
            <Link
              to="/admin"
              className="text-light text-decoration-none d-flex align-items-center"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <FaUserCog className="me-2" size={24} />
              <h5 className="mb-0">Panel de Control</h5>
            </Link>
          </div>
          {isMobile && (
            <Button
              variant="link"
              className="p-0 text-light"
              onClick={() => setSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </Button>
          )}
        </div>

        <Nav variant="pills" className="flex-column p-3">
          {menuItems.map((item) => (
            <Nav.Item key={item.path} className="mb-2">
              <Nav.Link
                as={Link}
                to={item.path}
                className="text-white d-flex align-items-center"
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  border: 'none',
                }}
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* Overlay para móviles */}
      {isMobile && sidebarOpen && (
        <div
          className="position-fixed"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isMobile ? '0' : '250px',
          transition: 'margin-left 0.3s ease',
          overflowX: 'hidden'
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <div
            className="d-flex justify-content-between align-items-center p-3"
            style={{
              backgroundColor: colorScheme.primary,
              color: colorScheme.light
            }}
          >
            <Button
              variant="link"
              className="p-0 text-light"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={20} />
            </Button>
            <h5 className="mb-0">Gestión de Usuarios</h5>
            <Button
              variant="link"
              className="p-0 text-light"
              onClick={handleLogout}
            >
              <FaSignOutAlt size={20} />
            </Button>
          </div>
        )}

        <Container fluid className="py-4 px-3 px-md-4">
          {!isMobile && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 style={{ color: colorScheme.dark }}>Gestión de Usuarios</h1>
              <Button
                variant="outline-light"
                style={{
                  color: colorScheme.dark,
                  borderColor: colorScheme.dark
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" /> Cerrar Sesión
              </Button>
            </div>
          )}

          {error && (
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              style={{ backgroundColor: colorScheme.danger, color: 'white' }}
            >
              {error}
            </Alert>
          )}

          {/* Search Bar */}
          <InputGroup className="mb-4 shadow-sm">
            <InputGroup.Text style={{
              backgroundColor: colorScheme.accent,
              color: 'white',
              border: 'none'
            }}>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre, apellido o documento"
              value={searchTerm}
              onChange={handleSearch}
              style={{ borderLeft: 'none' }}
            />
          </InputGroup>

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" style={{ color: colorScheme.accent }} />
              <p className="mt-2" style={{ color: colorScheme.dark }}>Cargando usuarios...</p>
            </div>
          ) : (
            <>
              {/* Botón de crear usuario */}
              {puedeCrear && (
                <Button
                  variant="success"
                  className="mb-3"
                  onClick={() => {
                    setFormData({
                      Nombre: '',
                      Apellido: '',
                      Tipo_Doc: '',
                      Doc_identificacion: '',
                      Telefono: '',
                      Correo: '',
                      Permiso: '',
                      Clave: ''
                    });
                    setFormErrors({});
                    setShowCreateModal(true);
                  }}
                >
                  Crear Usuario
                </Button>
              )}

              {/* Users Table */}
              <div className="table-responsive shadow-sm rounded">
                <Table striped hover className="mb-0">
                  <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                    <tr>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Tipo de Documento</th>
                      <th>Identificación</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Permiso</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user._id}>
                        <td>{user.Nombre}</td>
                        <td>{user.Apellido}</td>
                        <td>{user.Tipo_Doc}</td>
                        <td>{user.Doc_identificacion}</td>
                        <td>{user.Telefono}</td>
                        <td>{user.Correo}</td>
                        <td>{user.Permiso?.rol || 'N/A'}</td>
                        <td>
                          {puedeEditar && (
                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                              <FaEdit />
                            </Button>
                          )}
                          {puedeBorrar && (
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(user)}>
                              <FaTrash />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Container>
      </div>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {['Nombre', 'Apellido', 'Tipo_Doc', 'Doc_identificacion', 'Telefono', 'Correo', 'Permiso'].map(field => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.replace('_', ' ')}</Form.Label>
                <Form.Control
                  type={field === 'Correo' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors[field]}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors[field]}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="Clave"
                value={formData.Clave}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Clave}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.Clave}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de creación de usuario */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {['Nombre', 'Apellido', 'Tipo_Doc', 'Doc_identificacion', 'Telefono', 'Correo', 'Permiso'].map(field => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{field.replace('_', ' ')}</Form.Label>
                <Form.Control
                  type={field === 'Correo' ? 'email' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  isInvalid={!!formErrors[field]}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors[field]}
                </Form.Control.Feedback>
              </Form.Group>
            ))}
            <Form.Group className="mb-3">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="Clave"
                value={formData.Clave}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Clave}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.Clave}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
              Crear Usuario
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.Nombre} {userToDelete?.Apellido}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TablaUser;