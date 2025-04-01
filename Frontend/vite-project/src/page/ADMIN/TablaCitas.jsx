import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/citas';

const TablaCitas = () => {
    const [citas, setCitas] = useState([]); // Inicializamos como un array vacío
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
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const citasPerPage = 10;

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const response = await axios.get(API_URL);
                if (Array.isArray(response.data.data)) {
                    setCitas(response.data.data); // Aseguramos que sea un array
                } else {
                    console.error('La respuesta del backend no es un array:', response.data);
                    setCitas([]); // Si no es un array, lo inicializamos como vacío
                }
            } catch (error) {
                console.error('Error fetching citas:', error);
                setCitas([]); // En caso de error, inicializamos como vacío
            }
        };

        fetchAllData();
    }, []);

    const handleEdit = (cita) => {
        setEditingCita(cita);
        setFormData({
            documentoCliente: cita.documentoCliente || '',
            nombreCliente: cita.nombreCliente || '',
            apellidoCliente: cita.apellidoCliente || '',
            servicios: cita.servicios?._id || '',
            doctora: cita.doctora?._id || '',
            consultorio: cita.consultorio?._id || '',
            fecha: cita.fecha ? cita.fecha.split('T')[0] : '',
            hora: cita.hora || '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${API_URL}/${editingCita._id}`, formData);
            setCitas((prevCitas) =>
                prevCitas.map((cita) =>
                    cita._id === editingCita._id ? { ...cita, ...formData } : cita
                )
            );
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
        } catch (error) {
            console.error('Error al actualizar la cita:', error);
        }
    };

    const deleteCita = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                setCitas((prevCitas) => prevCitas.filter((cita) => cita._id !== id));
            } catch (error) {
                console.error('Error al eliminar la cita:', error);
            }
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredCitas = Array.isArray(citas)
        ? citas.filter((cita) =>
              cita.documentoCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cita.nombreCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cita.apellidoCliente?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : []; // Si `citas` no es un array, devolvemos un array vacío

    const indexOfLastCita = currentPage * citasPerPage;
    const indexOfFirstCita = indexOfLastCita - citasPerPage;
    const currentCitas = filteredCitas.slice(indexOfFirstCita, indexOfLastCita);

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
                                <Link className="btn btn-outline-primary mx-1" to="/admin/usuarios">
                                    Usuarios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/permisos">
                                    Permisos
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/servicios">
                                    Servicios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/citas">
                                    Citas
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/historiales">
                                    Historiales
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/consultorios">
                                    Consultorios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="btn btn-outline-primary mx-1" to="/admin/doctores">
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
                            localStorage.removeItem('authToken');
                            sessionStorage.clear();
                            window.location.href = '/login';
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mt-5">
                <h1 className="text-center mb-4">Gestión de Citas</h1>

                {/* Formulario de edición */}
                {editingCita && (
                    <form onSubmit={handleUpdate} className="mb-4">
                        <h3 className="text-center">Editar Cita</h3>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="documentoCliente"
                                    className="form-control"
                                    placeholder="Documento Cliente"
                                    value={formData.documentoCliente}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="nombreCliente"
                                    className="form-control"
                                    placeholder="Nombre Cliente"
                                    value={formData.nombreCliente}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="apellidoCliente"
                                    className="form-control"
                                    placeholder="Apellido Cliente"
                                    value={formData.apellidoCliente}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="servicios"
                                    className="form-control"
                                    placeholder="Servicio"
                                    value={formData.servicios}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="doctora"
                                    className="form-control"
                                    placeholder="Doctora"
                                    value={formData.doctora}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    name="consultorio"
                                    className="form-control"
                                    placeholder="Consultorio"
                                    value={formData.consultorio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    name="fecha"
                                    className="form-control"
                                    value={formData.fecha}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="time"
                                    name="hora"
                                    className="form-control"
                                    value={formData.hora}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <button type="submit" className="btn btn-success me-2">
                                Guardar Cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setEditingCita(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
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
                                    <td>{cita.doctora ? `${cita.doctora.nombre} ${cita.doctora.apellido}` : 'Sin asignar'}</td>
                                    <td>{cita.consultorio ? `${cita.consultorio.nombre} (${cita.consultorio.ubicacion})` : 'Sin asignar'}</td>
                                    <td>{cita.fecha ? new Date(cita.fecha).toLocaleDateString() : 'N/A'}</td>
                                    <td>{cita.hora || 'N/A'}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEdit(cita)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => deleteCita(cita._id)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default TablaCitas;