import React, { useState } from 'react';
import api from '../API/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Tipo_Doc: '',
    Doc_identificacion: '',
    Telefono: '',
    Correo: '',
    Clave: '',
    Permiso: '6820f7c214cd039b43a1f66c', // ID fijo para PACIENTE
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.Nombre.trim()) errors.Nombre = 'Nombre es requerido';
    if (!formData.Apellido.trim()) errors.Apellido = 'Apellido es requerido';
    if (!formData.Tipo_Doc.trim()) errors.Tipo_Doc = 'Tipo de documento es requerido';
    if (!formData.Doc_identificacion.trim()) errors.Doc_identificacion = 'Documento es requerido';
    if (!formData.Telefono.trim() || isNaN(formData.Telefono)) errors.Telefono = 'Teléfono es requerido y debe ser numérico';
    if (!formData.Correo.trim()) errors.Correo = 'Correo es requerido';
    if (!formData.Clave.trim()) errors.Clave = 'Clave es requerida';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const dataToSend = {
        ...formData,
        Telefono: Number(formData.Telefono),
      };
      await api.post('/users', dataToSend);
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. Intenta con otro correo o revisa los datos.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Card.Body>
          <h2 className="mb-4 text-center">Registro de Paciente</h2>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Nombre}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Nombre}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="Apellido"
                value={formData.Apellido}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Apellido}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Apellido}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Control
                type="text"
                name="Tipo_Doc"
                value={formData.Tipo_Doc}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Tipo_Doc}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Tipo_Doc}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Documento</Form.Label>
              <Form.Control
                type="text"
                name="Doc_identificacion"
                value={formData.Doc_identificacion}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Doc_identificacion}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Doc_identificacion}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Telefono}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Telefono}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="Correo"
                value={formData.Correo}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Correo}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Correo}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="Clave"
                value={formData.Clave}
                onChange={handleInputChange}
                isInvalid={!!formErrors.Clave}
              />
              <Form.Control.Feedback type="invalid">{formErrors.Clave}</Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Registrarse
            </Button>
          </Form>
          <div className="mt-3 text-center">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;