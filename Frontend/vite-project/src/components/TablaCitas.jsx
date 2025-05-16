import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance'; // Usa la instancia de Axios personalizada
import { Link, useLocation } from 'react-router-dom';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaTimes } from 'react-icons/fa';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos

const API_URL = '/citas'; // Ya no necesitas el host, la instancia lo tiene

const TablaCitas = () => {
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
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar citas

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [citas, setCitas] = useState([]);
    const [editingCita, setEditingCita] = useState(null);
    const [formData, setFormData] = useState({
        documentoCliente: '',
        nombreCliente: '',
        apellidoCliente: '',
        servicios: '',
        doctora: '',
        consultorio: '',
        fecha: '',
        hora: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const citasPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [citaToDelete, setCitaToDelete] = useState(null);

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
        fetchCitas();
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    const fetchCitas = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            setCitas(response.data.data || response.data || []);
            setError(null);
        } catch (error) {
            setError('Error al cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (cita) => {
        setEditingCita(cita);
        setFormData({
            documentoCliente: cita.documentoCliente || '',
            nombreCliente: cita.nombreCliente || '',
            apellidoCliente: cita.apellidoCliente || '',
            servicios: cita.servicios?._id || cita.servicios || '',
            doctora: cita.doctora?._id || cita.doctora || '',
            consultorio: cita.consultorio?._id || cita.consultorio || '',
            fecha: cita.fecha ? cita.fecha.split('T')[0] : '',
            hora: cita.hora || '',
        });
        setShowEditModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCita) {
                await api.patch(`${API_URL}/${editingCita._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchCitas();
        } catch (error) {
            setError('Error al guardar la cita');
        }
    };

    const handleDeleteClick = (cita) => {
        setCitaToDelete(cita);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${citaToDelete._id}`);
            setShowDeleteModal(false);
            fetchCitas();
        } catch (error) {
            setError('Error al eliminar la cita');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCitas = citas.filter((cita) =>
        cita.documentoCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cita.apellidoCliente?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastCita = currentPage * citasPerPage;
    const indexOfFirstCita = indexOfLastCita - citasPerPage;
    const currentCitas = filteredCitas.slice(indexOfFirstCita, indexOfLastCita);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

    if (loading) return <div>Cargando citas...</div>;
    if (error) return <div>{error}</div>;

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
                <h1 className="text-center mb-4">Gestión de Citas</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Documento, Nombre o Apellido"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {puedeCrear && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingCita(null);
                                setFormData({
                                    documentoCliente: '',
                                    nombreCliente: '',
                                    apellidoCliente: '',
                                    servicios: '',
                                    doctora: '',
                                    consultorio: '',
                                    fecha: '',
                                    hora: '',
                                });
                                setShowEditModal(true);
                            }}
                        >
                            Crear Nueva Cita
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Servicio</th>
                                <th>Doctora</th>
                                <th>Consultorio</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCitas.map((cita) => (
                                <tr key={cita._id}>
                                    <td>{cita.documentoCliente}</td>
                                    <td>{cita.nombreCliente}</td>
                                    <td>{cita.apellidoCliente}</td>
                                    <td>{cita.servicios?.nombre || 'Sin asignar'}</td>
                                    <td>{cita.doctora?.nombre || 'Sin asignar'}</td>
                                    <td>{cita.consultorio?.nombre || 'Sin asignar'}</td>
                                    <td>{cita.fecha ? cita.fecha.split('T')[0] : 'N/A'}</td>
                                    <td>{cita.hora || 'N/A'}</td>
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(cita)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(cita)}
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
                        {Array.from({ length: Math.ceil(filteredCitas.length / citasPerPage) }, (_, index) => (
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
                    <Modal.Title>{editingCita ? 'Editar Cita' : 'Crear Cita'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Documento Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                name="documentoCliente"
                                value={formData.documentoCliente}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombreCliente"
                                value={formData.nombreCliente}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellido Cliente</Form.Label>
                            <Form.Control
                                type="text"
                                name="apellidoCliente"
                                value={formData.apellidoCliente}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Servicio</Form.Label>
                            <Form.Control
                                type="text"
                                name="servicios"
                                value={formData.servicios}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Doctora</Form.Label>
                            <Form.Control
                                type="text"
                                name="doctora"
                                value={formData.doctora}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Consultorio</Form.Label>
                            <Form.Control
                                type="text"
                                name="consultorio"
                                value={formData.consultorio}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Hora</Form.Label>
                            <Form.Control
                                type="time"
                                name="hora"
                                value={formData.hora}
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
                    ¿Estás seguro de que deseas eliminar la cita de <strong>{citaToDelete?.nombreCliente}</strong>?
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

export default TablaCitas;