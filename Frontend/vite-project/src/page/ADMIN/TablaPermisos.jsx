import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/permisos';

const TablaPermisos = () => {
    const [permisos, setPermisos] = useState([]);
    const [editingPermiso, setEditingPermiso] = useState(null);
    const [formData, setFormData] = useState({
        rol: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const permisosPerPage = 10;

    useEffect(() => {
        fetchPermisos();
    }, []);

    const fetchPermisos = async () => {
        try {
            const response = await axios.get(API_URL);
            setPermisos(response.data);
        } catch (error) {
            console.error('Error fetching permisos:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingPermiso) {
            await updatePermiso(editingPermiso._id, formData);
        } else {
            await createPermiso(formData);
        }
        setFormData({
            rol: '',
        });
        setEditingPermiso(null);
        fetchPermisos();
    };

    const createPermiso = async (data) => {
        try {
            await axios.post(API_URL, data);
        } catch (error) {
            console.error('Error creating permiso:', error);
        }
    };

    const updatePermiso = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating permiso:', error);
        }
    };

    const deletePermiso = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este permiso?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchPermisos();
            } catch (error) {
                console.error('Error deleting permiso:', error);
            }
        }
    };

    const handleEdit = (permiso) => {
        setEditingPermiso(permiso);
        setFormData({
            rol: permiso.rol || '',
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPermisos = permisos.filter((permiso) =>
        permiso.rol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPermiso = currentPage * permisosPerPage;
    const indexOfFirstPermiso = indexOfLastPermiso - permisosPerPage;
    const currentPermisos = filteredPermisos.slice(indexOfFirstPermiso, indexOfLastPermiso);

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
                <h1 className="text-center mb-4">Gestión de Permisos</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Rol"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input
                                type="text"
                                name="rol"
                                className="form-control"
                                placeholder="Rol"
                                value={formData.rol}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        {editingPermiso ? 'Actualizar' : 'Crear'}
                    </button>
                </form>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPermisos.map((permiso) => (
                            <tr key={permiso._id}>
                                <td>{permiso.rol || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(permiso)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deletePermiso(permiso._id)}
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
                        {Array.from({ length: Math.ceil(filteredPermisos.length / permisosPerPage) }, (_, index) => (
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

export default TablaPermisos;