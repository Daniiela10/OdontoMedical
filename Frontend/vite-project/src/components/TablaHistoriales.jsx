import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance'; // Usa la instancia de Axios personalizada
import { Link, useLocation } from 'react-router-dom';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaEye, FaPlus } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext';
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos

const API_URL = '/historiales'; // Solo la ruta, la instancia ya tiene el baseURL

const TablaHistoriales = () => {
    // Agrega el contexto de autenticación
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
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar historiales

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [historiales, setHistoriales] = useState([]);
    const [editingHistorial, setEditingHistorial] = useState(null);
    const [formData, setFormData] = useState({
        paciente: '',
        cita: '',
        servicio: '',
        doctora: '',
        consultorio: '',
        descripcionTratamiento: '',
        fechaAtencion: '',
        observaciones: '',
        archivoAdjunto: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const historialesPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewHistorial, setViewHistorial] = useState(null);

    const colorScheme = {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        light: '#ecf0f1',
        dark: '#2c3e50',
    };

    useEffect(() => {
        fetchHistoriales();
    }, [location.pathname]);

    const fetchHistoriales = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            setHistoriales(response.data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los historiales');
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
            if (editingHistorial) {
                await api.patch(`${API_URL}/${editingHistorial._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchHistoriales();
        } catch (error) {
            setError('Error al guardar el historial');
        }
    };

    const handleEdit = (historial) => {
        setEditingHistorial(historial);
        setFormData({
            paciente: historial.paciente?._id || '',
            cita: historial.cita?._id || '',
            servicio: historial.servicio?._id || '',
            doctora: historial.doctora?._id || '',
            consultorio: historial.consultorio?._id || '',
            descripcionTratamiento: historial.descripcionTratamiento || '',
            fechaAtencion: historial.fechaAtencion ? historial.fechaAtencion.split('T')[0] : '',
            observaciones: historial.observaciones || '',
            archivoAdjunto: historial.archivoAdjunto || '',
        });
        setShowEditModal(true);
    };

    const handleView = (historial) => {
        setViewHistorial(historial);
        setShowViewModal(true);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredHistoriales = historiales.filter((historial) =>
        historial.paciente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        historial.paciente?.doc_identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastHistorial = currentPage * historialesPerPage;
    const indexOfFirstHistorial = indexOfLastHistorial - historialesPerPage;
    const currentHistoriales = filteredHistoriales.slice(indexOfFirstHistorial, indexOfLastHistorial);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div>Cargando historiales...</div>;
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
                className="d-flex flex-column"
                style={{
                    width: '250px',
                    height: '100vh',
                    backgroundColor: colorScheme.primary,
                    color: colorScheme.light,
                }}
            >
                <div className="p-3 border-bottom" style={{ borderColor: colorScheme.secondary }}>
                    <Link
                        to="/admin"
                        className="text-light text-decoration-none d-flex align-items-center"
                    >
                        <FaUserCog className="me-2" size={24} />
                        <h5 className="mb-0">Panel de Control</h5>
                    </Link>
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
                                onClick={() => isMobile && setSidebarOpen && setSidebarOpen(false)}
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
                <h1 className="text-center mb-4">Gestión de Historiales Clínicos</h1>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Buscar por Nombre o Documento"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {puedeCrear && (
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingHistorial(null);
                                setFormData({
                                    paciente: '',
                                    cita: '',
                                    servicio: '',
                                    doctora: '',
                                    consultorio: '',
                                    descripcionTratamiento: '',
                                    fechaAtencion: '',
                                    observaciones: '',
                                    archivoAdjunto: '',
                                });
                                setShowEditModal(true);
                            }}
                        >
                            Crear Nuevo Historial
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Paciente</th>
                                <th>Documento</th>
                                <th>Fecha de Atención</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentHistoriales.map((historial) => (
                                <tr key={historial._id}>
                                    <td>{historial.paciente?.nombre || 'Sin asignar'}</td>
                                    <td>{historial.paciente?.doc_identificacion || 'Sin asignar'}</td>
                                    <td>{historial.fechaAtencion || 'N/A'}</td>
                                    <td>
                                        {puedeVer && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleView(historial)}
                                            >
                                                <FaEye /> Ver
                                            </Button>
                                        )}
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(historial)}
                                            >
                                                <FaEdit /> Editar
                                            </Button>
                                        )}
                                        {puedeCrear && (
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                onClick={() => alert('Añadir más páginas al historial')}
                                            >
                                                <FaPlus /> Añadir
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
                        {Array.from({ length: Math.ceil(filteredHistoriales.length / historialesPerPage) }, (_, index) => (
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
                    <Modal.Title>{editingHistorial ? 'Editar Historial' : 'Crear Historial'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Paciente</Form.Label>
                            <Form.Control
                                type="text"
                                name="paciente"
                                value={formData.paciente}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción del Tratamiento</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="descripcionTratamiento"
                                value={formData.descripcionTratamiento}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Fecha de Atención</Form.Label>
                            <Form.Control
                                type="date"
                                name="fechaAtencion"
                                value={formData.fechaAtencion}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="observaciones"
                                value={formData.observaciones}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de visualización */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ver Historial</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Paciente:</strong> {viewHistorial?.paciente?.nombre || 'Sin asignar'}</p>
                    <p><strong>Documento:</strong> {viewHistorial?.paciente?.doc_identificacion || 'Sin asignar'}</p>
                    <p><strong>Descripción del Tratamiento:</strong> {viewHistorial?.descripcionTratamiento || 'N/A'}</p>
                    <p><strong>Fecha de Atención:</strong> {viewHistorial?.fechaAtencion || 'N/A'}</p>
                    <p><strong>Observaciones:</strong> {viewHistorial?.observaciones || 'N/A'}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default TablaHistoriales;