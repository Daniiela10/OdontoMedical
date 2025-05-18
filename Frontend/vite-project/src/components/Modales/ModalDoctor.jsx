import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export function ModalEditarDoctor({
  show,
  onHide,
  onSubmit,
  formData,
  handleInputChange,
  editingDoctor,
  consultorios
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{editingDoctor ? 'Editar Doctor' : 'Crear Doctor'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              name="Nombres"
              value={formData.Nombres}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="Apellidos"
              value={formData.Apellidos}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Cargo</Form.Label>
            <Form.Control
              type="text"
              name="Cargo"
              value={formData.Cargo}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consultorio</Form.Label>
            <Form.Select
              name="Id_consultorio"
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
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export function ModalEliminarDoctor({
  show,
  onHide,
  onConfirm,
  doctorToDelete
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar al doctor <strong>{doctorToDelete?.Nombres}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
} 