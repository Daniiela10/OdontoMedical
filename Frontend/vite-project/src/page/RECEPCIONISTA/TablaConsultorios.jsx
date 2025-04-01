import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/consultorios';

const TablaConsultorios = () => {
    const [consultorios, setConsultorios] = useState([]);
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
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre del Consultorio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentConsultorios.map((consultorio) => (
                            <tr key={consultorio._id}>
                                <td>{consultorio.Nombre_consultorio}</td>
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