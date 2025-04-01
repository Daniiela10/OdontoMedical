import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/api/users';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        Nombre: '',
        Apellido: '',
        Tipo_Doc: '',
        Doc_identificacion: '',
        Telefono: '',
        Permiso: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            await updateUser(editingUser._id, formData);
        }
        setFormData({
            Nombre: '',
            Apellido: '',
            Tipo_Doc: '',
            Doc_identificacion: '',
            Telefono: '',
            Permiso: ''
        });
        setEditingUser(null);
        fetchUsers();
    };

    const updateUser = async (id, data) => {
        try {
            await axios.patch(`${API_URL}/${id}`, data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            Nombre: user.Nombre || '',
            Apellido: user.Apellido || '',
            Tipo_Doc: user.Tipo_Doc || '',
            Doc_identificacion: user.Doc_identificacion || '',
            Telefono: user.Telefono || '',
            Permiso: user.Permiso?._id || user.Permiso || ''
        });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user) =>
        user.Doc_identificacion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
                <h1 className="text-center mb-4">Admin Page</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Documento de Identificación"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                {editingUser && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="row g-3">
                            {Object.keys(formData).map((key) => (
                                <div key={key} className="col-md-4">
                                    <input
                                        type="text"
                                        name={key}
                                        className="form-control"
                                        placeholder={key}
                                        value={formData[key]}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            Actualizar
                        </button>
                    </form>
                )}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Tipo Documento</th>
                            <th>Documento Identificación</th>
                            <th>Teléfono</th>
                            <th>Permiso</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id}>
                                <td>{user.Nombre || 'N/A'}</td>
                                <td>{user.Apellido || 'N/A'}</td>
                                <td>{user.Tipo_Doc || 'N/A'}</td>
                                <td>{user.Doc_identificacion || 'N/A'}</td>
                                <td>{user.Telefono || 'N/A'}</td>
                                <td>{user.Permiso && typeof user.Permiso === 'object' ? user.Permiso.rol || 'Sin rol' : user.Permiso || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteUser(user._id)}
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
                        {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
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

export default AdminPage;