import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/consultorios';

const TablaConsultorios = () => {
    const [consultorios, setConsultorios] = useState([]);
    const [editingConsultorio, setEditingConsultorio] = useState(null);
    const [formData, setFormData] = useState({
        Nombre_consultorio: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const consultoriosPerPage = 10;

    useEffect(() => {
        fetchConsultorios();
    }, []);

    const fetchConsultorios = async () => {
        try {
            const response = await axios.get(API_URL);
            setConsultorios(response.data);
        } catch (error) {
            console.error('Error fetching consultorios:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingConsultorio) {
            await updateConsultorio(editingConsultorio._id, formData);
        } else {
            await createConsultorio(formData);
        }
        setFormData({
            Nombre_consultorio: '',
        });
        setEditingConsultorio(null);
        fetchConsultorios();
    };

    const createConsultorio = async (data) => {
        try {
            await axios.post(API_URL, data);
        } catch (error) {
            console.error('Error creating consultorio:', error);
        }
    };

    const updateConsultorio = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating consultorio:', error);
        }
    };

    const deleteConsultorio = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este consultorio?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchConsultorios();
            } catch (error) {
                console.error('Error deleting consultorio:', error);
            }
        }
    };

    const handleEdit = (consultorio) => {
        setEditingConsultorio(consultorio);
        setFormData({
            Nombre_consultorio: consultorio.Nombre_consultorio || '',
        });
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

    return (
        <>
            {/* Navbar */}
                        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div className="container">
                                <Link className="navbar-brand fw-bold" to="/admin" style={{ color: '#343a40' }}>
                                    Panel de Administración
                                </Link>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#navbarNav"
                                    aria-controls="navbarNav"
                                    aria-expanded="false"
                                    aria-label="Toggle navigation"
                                >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav ms-auto">
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/usuarios" style={{ transition: 'all 0.3s ease' }}>
                                                Usuarios
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/permisos" style={{ transition: 'all 0.3s ease' }}>
                                                Permisos
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/servicios" style={{ transition: 'all 0.3s ease' }}>
                                                Servicios
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/citas" style={{ transition: 'all 0.3s ease' }}>
                                                Citas
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/historiales" style={{ transition: 'all 0.3s ease' }}>
                                                Historiales
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/consultorios" style={{ transition: 'all 0.3s ease' }}>
                                                Consultorios
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="btn btn-outline-primary mx-1" to="/admin/doctores" style={{ transition: 'all 0.3s ease' }}>
                                                Doctores
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    className="btn btn-danger ms-3"
                                    style={{
                                        transition: 'all 0.3s ease',
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#c82333')}
                                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#dc3545')}
                                    onClick={() => {
                                        // Lógica para cerrar sesión
                                        localStorage.removeItem('authToken'); // Va a eliminar el token de autenticación
                                        sessionStorage.clear(); // Limpia cualquier dato de sesión
                                        window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
                                    }}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </nav>

            {/* Main Content */}
            <div className="container mt-5">
                <h1 className="text-center mb-4">Gestión de Consultorios</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Nombre del Consultorio"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3">
                        <div className="col-md-12">
                            <input
                                type="text"
                                name="Nombre_consultorio"
                                className="form-control"
                                placeholder="Nombre del Consultorio"
                                value={formData.Nombre_consultorio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingConsultorio ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
                <table className="table table-striped">
                    <thead>
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
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(consultorio)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteConsultorio(consultorio._id)}
                                    >
                                        Borrar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </>
    );
};

export default TablaConsultorios;