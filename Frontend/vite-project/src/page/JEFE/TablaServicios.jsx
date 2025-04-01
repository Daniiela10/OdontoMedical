import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/servicio';

const TablaServicios = () => {
    const [servicios, setServicios] = useState([]);
    const [editingServicio, setEditingServicio] = useState(null);
    const [formData, setFormData] = useState({
        Nombre: '',
        Descripcion: '',
        Disponible: 'Activo',
        Precio: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const serviciosPerPage = 10;

    useEffect(() => {
        fetchServicios();
    }, []);

    const fetchServicios = async () => {
        try {
            const response = await axios.get(API_URL);
            setServicios(response.data);
        } catch (error) {
            console.error('Error fetching servicios:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingServicio) {
            await updateServicio(editingServicio._id, formData);
        } else {
            await createServicio(formData);
        }
        setFormData({
            Nombre: '',
            Descripcion: '',
            Disponible: 'Activo',
            Precio: '',
        });
        setEditingServicio(null);
        fetchServicios();
    };

    const createServicio = async (data) => {
        try {
            await axios.post(API_URL, data);
        } catch (error) {
            console.error('Error creating servicio:', error);
        }
    };

    const updateServicio = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating servicio:', error);
        }
    };

    const deleteServicio = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchServicios();
            } catch (error) {
                console.error('Error deleting servicio:', error);
            }
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
                <h1 className="text-center mb-4">Gestión de Servicios</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Nombre"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="Nombre"
                                className="form-control"
                                placeholder="Nombre"
                                value={formData.Nombre}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="Descripcion"
                                className="form-control"
                                placeholder="Descripción"
                                value={formData.Descripcion}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                name="Disponible"
                                className="form-control"
                                value={formData.Disponible}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="number"
                                name="Precio"
                                className="form-control"
                                placeholder="Precio"
                                value={formData.Precio}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingServicio ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
                <table className="table table-striped">
                    <thead>
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
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(servicio)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteServicio(servicio._id)}
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
                        {Array.from({ length: Math.ceil(filteredServicios.length / serviciosPerPage) }, (_, index) => (
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

export default TablaServicios;