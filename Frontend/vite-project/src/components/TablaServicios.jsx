import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaPlus, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaTimes } from 'react-icons/fa';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos

const API_URL = '/servicio';

const TablaServicios = () => {
    // Contexto de autenticación y ubicación
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Determina el rol mínimo requerido según la ruta
    let rutaRol = "";
    if (location.pathname.startsWith('/admin')) rutaRol = "ADMIN";
    else if (location.pathname.startsWith('/jefe')) rutaRol = "JEFE";
    else if (location.pathname.startsWith('/recepcionista')) rutaRol = "RECEPCIONISTA";

    // Obtiene el rol real del usuario
    const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";

    // Permisos por jerarquía
    const puedeVer = tienePermiso(userRol, rutaRol);
    const puedeCrear = tienePermiso(userRol, rutaRol);
    const puedeEditar = tienePermiso(userRol, rutaRol);
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar servicios

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [servicios, setServicios] = useState([]);
    const [formData, setFormData] = useState({
        Nombre: '',
        Descripcion: '',
        Disponible: 'Activo',
        Precio: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const serviciosPerPage = 10;
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [servicioToDelete, setServicioToDelete] = useState(null);
    const [editingServicio, setEditingServicio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const colorScheme = {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        light: '#ecf0f1',
        dark: '#2c3e50',
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        fetchServicios();
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line
    }, [location.pathname]);

    const fetchServicios = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(API_URL);
            setServicios(response.data);
        } catch (error) {
            setError('Error al cargar los servicios');
            console.error('Error fetching servicios:', error);
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
        if (!formData.Nombre.trim()) errors.Nombre = 'El nombre es requerido';
        if (!formData.Descripcion.trim()) errors.Descripcion = 'La descripción es requerida';
        if (!formData.Precio || isNaN(formData.Precio)) errors.Precio = 'El precio debe ser un número válido';
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
            if (editingServicio) {
                await api.patch(`${API_URL}/${editingServicio._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchServicios();
        } catch (error) {
            setError('Error al guardar el servicio');
            console.error('Error al guardar el servicio:', error);
        }
    };

    const handleEdit = (servicio) => {
        setEditingServicio(servicio);
        setFormData({
            Nombre: servicio.Nombre || '',
            Descripcion: servicio.Descripcion || '',
            Disponible: servicio.Disponible || 'Activo',
            Precio: servicio.Precio || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (servicio) => {
        setServicioToDelete(servicio);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${servicioToDelete._id}`);
            setShowDeleteModal(false);
            fetchServicios();
        } catch (error) {
            setError('Error al eliminar el servicio');
            console.error('Error al eliminar el servicio:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredServicios = servicios.filter((servicio) =>
        servicio.Nombre?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastServicio = currentPage * serviciosPerPage;
    const indexOfFirstServicio = indexOfLastServicio - serviciosPerPage;
    const currentServicios = filteredServicios.slice(indexOfFirstServicio, indexOfLastServicio);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Cargando servicios...</div>;
    if (error) return <div>{error}</div>;

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
                    color: colorScheme.light,
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

            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                <h1 className="text-center mb-4">Gestión de Servicios</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Nombre"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {puedeCrear && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingServicio(null);
                                setFormData({
                                    Nombre: '',
                                    Descripcion: '',
                                    Disponible: 'Activo',
                                    Precio: '',
                                });
                                setShowEditModal(true);
                            }}
                        >
                            <FaPlus className="me-2" />
                            Crear Nuevo Servicio
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Disponible</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentServicios.map((servicio) => (
                                <tr key={servicio._id}>
                                    <td>{servicio.Nombre}</td>
                                    <td>{servicio.Descripcion}</td>
                                    <td>{servicio.Disponible}</td>
                                    <td>{servicio.Precio}</td>
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(servicio)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(servicio)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <nav>
                    <ul className="pagination">
                        {Array.from({ length: Math.ceil(filteredServicios.length / serviciosPerPage) }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Modal de edición */}
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editingServicio ? 'Editar Servicio' : 'Crear Servicio'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Nombre"
                                    value={formData.Nombre}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.Nombre}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.Nombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Descripcion"
                                    value={formData.Descripcion}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.Descripcion}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.Descripcion}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Disponible</Form.Label>
                                <Form.Select
                                    name="Disponible"
                                    value={formData.Disponible}
                                    onChange={handleInputChange}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="Precio"
                                    value={formData.Precio}
                                    onChange={handleInputChange}
                                    isInvalid={!!formErrors.Precio}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {formErrors.Precio}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Guardar Cambios
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
                        ¿Estás seguro de que deseas eliminar el servicio <strong>{servicioToDelete?.Nombre}</strong>?
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
        </div>
    );
};

export default TablaServicios;