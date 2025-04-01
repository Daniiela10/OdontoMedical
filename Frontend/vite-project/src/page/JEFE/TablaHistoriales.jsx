import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/historial';

const TablaHistoriales = () => {
    const [historiales, setHistoriales] = useState([]);
    const [editingHistorial, setEditingHistorial] = useState(null);
    const [formData, setFormData] = useState({
        Descripcion_tratamiento: '',
        Fecha_tratamiento: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const historialesPerPage = 10;

    useEffect(() => {
        fetchHistoriales();
    }, []);

    const fetchHistoriales = async () => {
        try {
            const response = await axios.get(API_URL);
            setHistoriales(response.data);
        } catch (error) {
            console.error('Error fetching historiales:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingHistorial) {
            await updateHistorial(editingHistorial._id, formData);
        } else {
            await createHistorial(formData);
        }
        setFormData({
            Descripcion_tratamiento: '',
            Fecha_tratamiento: '',
        });
        setEditingHistorial(null);
        fetchHistoriales();
    };

    const createHistorial = async (data) => {
        try {
            await axios.post(API_URL, data);
        } catch (error) {
            console.error('Error creating historial:', error);
        }
    };

    const updateHistorial = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating historial:', error);
        }
    };

    const deleteHistorial = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este historial?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchHistoriales();
            } catch (error) {
                console.error('Error deleting historial:', error);
            }
        }
    };

    const handleEdit = (historial) => {
        setEditingHistorial(historial);
        setFormData({
            Descripcion_tratamiento: historial.Descripcion_tratamiento || '',
            Fecha_tratamiento: historial.Fecha_tratamiento || '',
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredHistoriales = historiales.filter((historial) =>
        historial.Descripcion_tratamiento?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastHistorial = currentPage * historialesPerPage;
    const indexOfFirstHistorial = indexOfLastHistorial - historialesPerPage;
    const currentHistoriales = filteredHistoriales.slice(indexOfFirstHistorial, indexOfLastHistorial);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
                    {/* Navbar */}
                    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <div className="container">
                            <Link className="navbar-brand fw-bold" to="/jefe" style={{ color: '#343a40' }}>
                                Panel del Jefe
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
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/usuarios" style={{ transition: 'all 0.3s ease' }}>
                                        Usuarios
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/permisos" style={{ transition: 'all 0.3s ease' }}>
                                        Permisos
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/servicios" style={{ transition: 'all 0.3s ease' }}>
                                        Servicios
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/historiales" style={{ transition: 'all 0.3s ease' }}>
                                        Historiales
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/consultorios" style={{ transition: 'all 0.3s ease' }}>
                                        Consultorios
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="btn btn-outline-primary mx-1" to="/jefe/doctores" style={{ transition: 'all 0.3s ease' }}>
                                        Doctores
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    
            {/* Main Content */}
            <div className="container mt-5">
                <h1 className="text-center mb-4">Gestión de Historiales</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Descripción"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="Descripcion_tratamiento"
                                className="form-control"
                                placeholder="Descripción del Tratamiento"
                                value={formData.Descripcion_tratamiento}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <input
                                type="date"
                                name="Fecha_tratamiento"
                                className="form-control"
                                value={formData.Fecha_tratamiento}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingHistorial ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Descripción del Tratamiento</th>
                            <th>Fecha del Tratamiento</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHistoriales.map((historial) => (
                            <tr key={historial._id}>
                                <td>{historial.Descripcion_tratamiento}</td>
                                <td>{new Date(historial.Fecha_tratamiento).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(historial)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteHistorial(historial._id)}
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
        </>
    );
};

export default TablaHistoriales;