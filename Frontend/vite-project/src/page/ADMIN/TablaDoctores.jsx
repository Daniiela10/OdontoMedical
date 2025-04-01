import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/doctora';
const API_CONSULTORIOS_URL = 'http://localhost:5000/api/consultorios';

const TablaDoctores = () => {
    const [doctores, setDoctores] = useState([]);
    const [consultorios, setConsultorios] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formData, setFormData] = useState({
        Nombres: '',
        Apellidos: '',
        Cargo: '',
        Id_consultorio: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const doctoresPerPage = 10;

    useEffect(() => {
        fetchDoctores();
        fetchConsultorios();
    }, []);

    const fetchDoctores = async () => {
        try {
            const response = await axios.get(API_URL);
            setDoctores(response.data);
        } catch (error) {
            console.error('Error fetching doctores:', error);
        }
    };

    const fetchConsultorios = async () => {
        try {
            const response = await axios.get(API_CONSULTORIOS_URL);
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
        if (editingDoctor) {
            await updateDoctor(editingDoctor._id, formData);
        } else {
            await createDoctor(formData);
        }
        setFormData({
            Nombres: '',
            Apellidos: '',
            Cargo: '',
            Id_consultorio: '',
        });
        setEditingDoctor(null);
        fetchDoctores();
    };

    const createDoctor = async (data) => {
        try {
            await axios.post(API_URL, data);
        } catch (error) {
            console.error('Error creating doctor:', error);
        }
    };

    const updateDoctor = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    };

    const deleteDoctor = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este doctor?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchDoctores();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            Nombres: doctor.Nombres || '',
            Apellidos: doctor.Apellidos || '',
            Cargo: doctor.Cargo || '',
            Id_consultorio: doctor.Id_consultorio || '',
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredDoctores = doctores.filter((doctor) =>
        doctor.Nombres?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastDoctor = currentPage * doctoresPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - doctoresPerPage;
    const currentDoctores = filteredDoctores.slice(indexOfFirstDoctor, indexOfLastDoctor);

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
                <h1 className="text-center mb-4">Gestión de Doctores</h1>
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
                                name="Nombres"
                                className="form-control"
                                placeholder="Nombres"
                                value={formData.Nombres}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="Apellidos"
                                className="form-control"
                                placeholder="Apellidos"
                                value={formData.Apellidos}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="Cargo"
                                className="form-control"
                                placeholder="Cargo"
                                value={formData.Cargo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                name="Id_consultorio"
                                className="form-control"
                                value={formData.Id_consultorio}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar Consultorio</option>
                                {consultorios.map((consultorio) => (
                                    <option key={consultorio._id} value={consultorio._id}>
                                        {consultorio.Nombre_consultorio}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingDoctor ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Cargo</th>
                            <th>Consultorio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentDoctores.map((doctor) => (
                            <tr key={doctor._id}>
                                <td>{doctor.Nombres}</td>
                                <td>{doctor.Apellidos}</td>
                                <td>{doctor.Cargo}</td>
                                <td>{doctor.Id_consultorio?.Nombre_consultorio || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(doctor)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteDoctor(doctor._id)}
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
                        {Array.from({ length: Math.ceil(filteredDoctores.length / doctoresPerPage) }, (_, index) => (
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

export default TablaDoctores;