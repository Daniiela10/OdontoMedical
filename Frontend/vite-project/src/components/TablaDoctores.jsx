import React, { useState, useEffect, useContext } from 'react';
import api from '../API/axiosInstance'; // Usa la instancia personalizada
import { Link, useLocation } from 'react-router-dom';
import { Button, Table, Modal, Form, Nav } from 'react-bootstrap';
import { FaUserCog, FaKey, FaEdit, FaTrash, FaCogs, FaCalendarAlt, FaFileMedical, FaClinicMedical, FaUserMd, FaTimes } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../contexts/AuthContext'; // Asegúrate de que la ruta sea correcta
import { tienePermiso } from '../utils/roles'; // <-- Importa la función de permisos
import NavBarCrud from './NavBar/NavBarCrud';
import { ModalEditarDoctor, ModalEliminarDoctor } from './Modales/ModalDoctor';
import '../styles/globalTableStyles.css';

const API_URL = '/doctora'; // Solo la ruta, la instancia ya tiene el baseURL
const API_CONSULTORIOS_URL = '/consultorios';

const TablaDoctores = () => {
    // Agrega el contexto de autenticación y ubicación
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Determina el rol mínimo requerido según la ruta
    let rutaRol = "";
    if (location.pathname.startsWith('/admin')) rutaRol = "ADMIN";
    else if (location.pathname.startsWith('/doctora')) rutaRol = "DOCTORA";
    else if (location.pathname.startsWith('/recepcionista')) rutaRol = "RECEPCIONISTA";

    // Obtiene el rol real del usuario
    const userRol = typeof user.Permiso === "string" ? user.Permiso : user.Permiso?.rol || "";

    // Permisos por jerarquía
    const puedeVer = tienePermiso(userRol, rutaRol);
    const puedeCrear = tienePermiso(userRol, rutaRol);
    const puedeEditar = tienePermiso(userRol, rutaRol);
    const puedeBorrar = userRol === "ADMIN"; // Solo ADMIN puede borrar doctores

    // Si no puede ver, no renderiza nada
    if (!puedeVer) return <div>No tienes permisos para ver esta tabla.</div>;

    // Estados principales
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [doctores, setDoctores] = useState([]);
    const [consultorios, setConsultorios] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formData, setFormData] = useState({
        Nombres: '',
        Apellidos: '',
        Cargo: '',
        Id_consultorio: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [doctorToDelete, setDoctorToDelete] = useState(null);

    const colorScheme = {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db',
        light: '#ecf0f1',
        dark: '#2c3e50',
    };

    useEffect(() => {
        fetchDoctores();
        fetchConsultorios();
    }, [location.pathname]);

    const fetchDoctores = async () => {
        setLoading(true);
        try {
            const response = await api.get(API_URL);
            setDoctores(response.data);
            setError(null);
        } catch (error) {
            setError('Error al cargar los doctores');
        } finally {
            setLoading(false);
        }
    };

    const fetchConsultorios = async () => {
        try {
            const response = await api.get(API_CONSULTORIOS_URL);
            setConsultorios(response.data);
        } catch (error) {
            // No es crítico para la vista
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingDoctor) {
                await api.patch(`${API_URL}/${editingDoctor._id}`, formData);
            } else {
                await api.post(API_URL, formData);
            }
            setShowEditModal(false);
            fetchDoctores();
        } catch (error) {
            setError('Error al guardar el doctor');
        }
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            Nombres: doctor.Nombres || '',
            Apellidos: doctor.Apellidos || '',
            Cargo: doctor.Cargo || '',
            Id_consultorio: doctor.Id_consultorio?._id || doctor.Id_consultorio || '',
        });
        setShowEditModal(true);
    };

    const handleDeleteClick = (doctor) => {
        setDoctorToDelete(doctor);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`${API_URL}/${doctorToDelete._id}`);
            setShowDeleteModal(false);
            fetchDoctores();
        } catch (error) {
            setError('Error al eliminar el doctor');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDoctores = doctores.filter((doctor) =>
        doctor.Nombres?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredDoctores.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredDoctores.length / itemsPerPage);
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
        DOCTORA: [
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
        if (rol === "DOCTORA") return "/doctora";
        if (rol === "RECEPCIONISTA") return "/recepcionista";
        return "/";
    };

    const basePath = getBasePath(userRol);

    // Genera el menú filtrado según el rol
    const menuItems = (menuConfig[userRol] || []).map(item => ({
        ...item,
        path: `${basePath}/${item.key}`
    }));

    if (loading) return <div>Cargando doctores...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: colorScheme.light }}>
            {/* Sidebar NavBarCrud */}
            <NavBarCrud colorScheme={colorScheme} userRol={userRol} />
            {/* Main Content */}
            <div className="flex-grow-1 p-4">
                <h1 className="text-center mb-4">Gestión de Doctores</h1>
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
                                setEditingDoctor(null);
                                setFormData({
                                    Nombres: '',
                                    Apellidos: '',
                                    Cargo: '',
                                    Id_consultorio: '',
                                });
                                setShowEditModal(true);
                            }}
                        >
                            Crear Nuevo Doctor
                        </Button>
                    )}
                </div>
                <div className="table-responsive shadow-sm rounded">
                    <Table responsive striped hover className="mb-0">
                        <thead style={{ backgroundColor: colorScheme.primary, color: colorScheme.light }}>
                            <tr>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Cargo</th>
                                <th>Consultorio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((doctor) => (
                                <tr key={doctor._id}>
                                    <td>{doctor.Nombres}</td>
                                    <td>{doctor.Apellidos}</td>
                                    <td>{doctor.Cargo}</td>
                                    <td>{doctor.Id_consultorio?.Nombre_consultorio || 'Sin asignar'}</td>
                                    <td>
                                        {puedeEditar && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEdit(doctor)}
                                            >
                                                <FaEdit />
                                            </Button>
                                        )}
                                        {puedeBorrar && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDeleteClick(doctor)}
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
                        {Array.from({ length: totalPages }, (_, i) => (
                            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => paginate(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Modal de edición/creación */}
                <ModalEditarDoctor
                  show={showEditModal}
                  onHide={() => setShowEditModal(false)}
                  onSubmit={handleSubmit}
                  formData={formData}
                  handleInputChange={handleInputChange}
                  editingDoctor={editingDoctor}
                  consultorios={consultorios}
                />

                {/* Modal de eliminación */}
                <ModalEliminarDoctor
                  show={showDeleteModal}
                  onHide={() => setShowDeleteModal(false)}
                  onConfirm={confirmDelete}
                  doctorToDelete={doctorToDelete}
                />
            </div>
        </div>
    );
};

export default TablaDoctores;