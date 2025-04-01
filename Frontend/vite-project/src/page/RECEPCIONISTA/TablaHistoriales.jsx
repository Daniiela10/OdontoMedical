import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/historial';

const TablaHistoriales = () => {
    const [historiales, setHistoriales] = useState([]);
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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/recepcionista">
                        Panel de Recepcionista
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
                                <Link className="nav-link" to="/recepcionista/usuarios">
                                    Gestión de Usuarios
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/recepcionista/historiales">
                                    Gestión de Historiales
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/recepcionista/consultorios">
                                    Gestión de Consultorios
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
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Descripción del Tratamiento</th>
                            <th>Fecha del Tratamiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentHistoriales.map((historial) => (
                            <tr key={historial._id}>
                                <td>{historial.Descripcion_tratamiento}</td>
                                <td>{new Date(historial.Fecha_tratamiento).toLocaleDateString()}</td>
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