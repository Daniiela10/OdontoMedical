import React, { useState } from 'react';
import api from '../API/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

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
    <div
      style={{
        background: palette.light,
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(85,111,112,0.10)',
        padding: '2.5rem 2rem',
        maxWidth: 420,
        margin: '0 auto',
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{
          color: palette.primary,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        Registro de Paciente
      </h2>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="Nombre"
            value={formData.Nombre}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Nombre}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Nombre}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="Apellido"
            value={formData.Apellido}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Apellido}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Apellido}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Tipo de Documento</Form.Label>
          <Form.Control
            type="text"
            name="Tipo_Doc"
            value={formData.Tipo_Doc}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Tipo_Doc}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Tipo_Doc}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Documento</Form.Label>
          <Form.Control
            type="text"
            name="Doc_identificacion"
            value={formData.Doc_identificacion}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Doc_identificacion}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Doc_identificacion}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="Telefono"
            value={formData.Telefono}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Telefono}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Telefono}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Correo</Form.Label>
          <Form.Control
            type="email"
            name="Correo"
            value={formData.Correo}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Correo}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Correo}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: palette.gray, fontWeight: 500 }}>Clave</Form.Label>
          <Form.Control
            type="password"
            name="Clave"
            value={formData.Clave}
            onChange={handleInputChange}
            isInvalid={!!formErrors.Clave}
            style={{
              borderRadius: 12,
              border: `1.5px solid ${palette.accent}`,
              background: palette.light,
              color: palette.primary,
              fontWeight: 500,
            }}
          />
          <Form.Control.Feedback type="invalid">{formErrors.Clave}</Form.Control.Feedback>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          className="w-100"
          style={{
            background: palette.secondary,
            border: 'none',
            borderRadius: 20,
            fontWeight: 600,
            fontSize: 18,
            padding: "0.5rem 0",
            boxShadow: '0 2px 8px rgba(73,182,178,0.10)',
            transition: "background 0.2s"
          }}
        >
          Registrarse
        </Button>
      </Form>
    </div>
  );
};

export default Register;