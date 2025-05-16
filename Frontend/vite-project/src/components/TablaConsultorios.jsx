import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance'; // Usa la instancia personalizada
import { Link, useLocation } from 'react-router-dom';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos

const API_URL = '/consultorios'; // Solo la ruta, la instancia ya tiene el baseURL

const TablaConsultorios = () => {
    // Agrega el contexto de autenticación y ubicación
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
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar consultorios

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [consultorios, setConsultorios] = useState([]);
    const [editingConsultorio, setEditingConsultorio] = useState(null);
    const [formData, setFormData] = useState({
        Nombre_consultorio: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const consultoriosPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [consultorioToDelete, setConsultorioToDelete] = useState(null);

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
        fetchConsultorios();
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const fetchConsultorios = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            setConsultorios(response.data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los consultorios');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingConsultorio) {
                await api.patch(`${API_URL}/${editingConsultorio._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchConsultorios();
        } catch (error) {
            setError('Error al guardar el consultorio');
        }
    };

    const handleEdit = (consultorio) => {
        setEditingConsultorio(consultorio);
        setFormData({
            Nombre_consultorio: consultorio.Nombre_consultorio || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (consultorio) => {
        setConsultorioToDelete(consultorio);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${consultorioToDelete._id}`);
            setShowDeleteModal(false);
            fetchConsultorios();
        } catch (error) {
            setError('Error al eliminar el consultorio');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredConsultorios = consultorios.filter((consultorio) =>
        consultorio.Nombre_consultorio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastConsultorio = currentPage * consultoriosPerPage;
    const indexOfFirstConsultorio = indexOfLastConsultorio - consultoriosPerPage;
    const currentConsultorios = filteredConsultorios.slice(indexOfFirstConsultorio, indexOfLastConsultorio);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Cargando consultorios...</div>;
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
                <h1 className="text-center mb-4">Gestión de Consultorios</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Nombre del Consultorio"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {puedeCrear && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingConsultorio(null);
                                setFormData({
                                    Nombre_consultorio: '',
                                });
                                setShowEditModal(true);
                            }}
                        >
                            Crear Nuevo Consultorio
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Nombre del Consultorio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentConsultorios.map((consultorio) => (
                                <tr key={consultorio._id}>
                                    <td>{consultorio.Nombre_consultorio}</td>
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(consultorio)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(consultorio)}
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
                        {Array.from({ length: Math.ceil(filteredConsultorios.length / consultoriosPerPage) }, (_, index) => (
                            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Modal de edición/creación */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingConsultorio ? 'Editar Consultorio' : 'Crear Consultorio'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del Consultorio</Form.Label>
                            <Form.Control
                                type="text"
                                name="Nombre_consultorio"
                                value={formData.Nombre_consultorio}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar
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
                    ¿Estás seguro de que deseas eliminar el consultorio <strong>{consultorioToDelete?.Nombre_consultorio}</strong>?
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

export default TablaConsultorios;