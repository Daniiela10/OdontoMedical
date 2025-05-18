import { Modal, Button, Form, Alert } from 'react-bootstrap';
import api from '../../API/axiosInstance';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalAgendarCitaPaciente = ({
  show,
  onHide,
  servicio,
  user,
  doctoras = [],
  consultorios = [],
  onCitaAgendada
}) => {
  const [form, setForm] = useState({
    doctora: '',
    consultorio: '',
    fecha: '',
    hora: '',
    documentoCliente: '',
    nombreCliente: '',
    apellidoCliente: ''
  });
  const [error, setError] = useState(null);
  const [usarDatosUsuario, setUsarDatosUsuario] = useState(false);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [horasDisponibles, setHorasDisponibles] = useState([]);

  // Autocompletar datos del usuario si el checkbox está marcado
  useEffect(() => {
    const completarDatos = async () => {
      if (usarDatosUsuario && user) {
        let nombre = user.Nombre || user.nombre || user.nombreCliente || '';
        let apellido = user.Apellido || user.apellido || user.apellidoCliente || '';
        let documento = user.Doc_identificacion || user.doc_identificacion || user.documento || user.documentoCliente || '';
        // Si falta alguno, intenta obtener el usuario completo desde la API
        if ((!apellido || !documento) && (user.id || user._id)) {
          setLoadingDatos(true);
          try {
            const { data } = await api.get(`/users/${user.id || user._id}`);
            nombre = data.Nombre || nombre;
            apellido = data.Apellido || apellido;
            documento = data.Doc_identificacion || documento;
          } catch {
            // Opcional: podrías mostrar un error si lo deseas
          }
          setLoadingDatos(false);
        }
        setForm(f => ({
          ...f,
          documentoCliente: documento,
          nombreCliente: nombre,
          apellidoCliente: apellido
        }));
      }
    };
    completarDatos();
    // eslint-disable-next-line
  }, [usarDatosUsuario, user]);

  // Filtrar doctoras según el servicio seleccionado (si hay relación)
  const doctorasFiltradas = doctoras;

  // Filtrar consultorios según la doctora seleccionada
  const consultoriosFiltrados = doctoras.length && form.doctora
    ? consultorios.filter(c => c._id === (doctoras.find(d => d._id === form.doctora)?.Id_consultorio?._id || doctoras.find(d => d._id === form.doctora)?.Id_consultorio))
    : [];

  useEffect(() => {
    // Si cambia la doctora, autoselecciona el consultorio correspondiente
    if (form.doctora) {
      const doc = doctoras.find(d => d._id === form.doctora);
      if (doc && doc.Id_consultorio) {
        setForm(f => ({ ...f, consultorio: doc.Id_consultorio?._id || doc.Id_consultorio }));
      }
    }
  }, [form.doctora, doctoras]);

  // Calcular horas disponibles para ortodoncia
  useEffect(() => {
    const esOrtodoncia = servicio && (servicio.Nombre === 'Ortodoncia' || servicio.nombre === 'Ortodoncia');
    if (esOrtodoncia && form.fecha) {
      const fetchHorasOcupadas = async () => {
        try {
          const fechaISO = new Date(form.fecha).toISOString().split('T')[0];
          const res = await api.get('/citas');
          const ocupadas = (res.data.data || res.data || []).filter(cita => {
            return (
              (cita.servicios?._id === servicio._id || cita.servicios === servicio._id) &&
              cita.fecha && cita.fecha.split('T')[0] === fechaISO
            );
          }).map(cita => cita.hora);
          // Generar intervalos de 20 minutos entre 13:00 y 19:00
          const horas = [];
          for (let h = 13; h <= 19; h++) {
            for (let m of [0, 20, 40]) {
              if (h === 19 && m > 0) continue;
              const horaStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
              if (!ocupadas.includes(horaStr)) horas.push(horaStr);
            }
          }
          setHorasDisponibles(horas);
        } catch {
          setHorasDisponibles([]);
        }
      };
      fetchHorasOcupadas();
    } else {
      setHorasDisponibles([]);
    }
  }, [servicio, form.fecha]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (!form.doctora || !form.consultorio || !form.fecha || !form.hora || !form.documentoCliente || !form.nombreCliente || !form.apellidoCliente) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    onCitaAgendada({
      servicios: servicio._id,
      doctora: form.doctora,
      consultorio: form.consultorio,
      fecha: form.fecha,
      hora: form.hora,
      documentoCliente: form.documentoCliente,
      nombreCliente: form.nombreCliente,
      apellidoCliente: form.apellidoCliente
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agendar Cita - {servicio?.Nombre}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Recoger mis datos"
              checked={usarDatosUsuario}
              onChange={e => setUsarDatosUsuario(e.target.checked)}
              disabled={loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              name="documentoCliente"
              value={form.documentoCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombreCliente"
              value={form.nombreCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellidoCliente"
              value={form.apellidoCliente}
              onChange={handleChange}
              required
              disabled={usarDatosUsuario || loadingDatos}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Doctora</Form.Label>
            <Form.Select name="doctora" value={form.doctora} onChange={handleChange} required>
              <option value="">Seleccione una doctora</option>
              {doctorasFiltradas.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.Nombres} {doc.Apellidos}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Consultorio</Form.Label>
            <Form.Select name="consultorio" value={form.consultorio} required disabled>
              <option value="">Seleccione un consultorio</option>
              {consultoriosFiltrados.map(c => (
                <option key={c._id} value={c._id}>{c.Nombre_consultorio}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              required
              min={(() => {
                const today = new Date();
                return today.toISOString().split('T')[0];
              })()}
              pattern={servicio && (servicio.Nombre === 'Ortodoncia' || servicio.nombre === 'Ortodoncia') ? "[0-9]{4}-[0-9]{2}-[0-9]{2}" : undefined}
              onInput={e => {
                if (servicio && (servicio.Nombre === 'Ortodoncia' || servicio.nombre === 'Ortodoncia')) {
                  const d = new Date(e.target.value + 'T00:00:00-05:00');
                  // Usar Intl.DateTimeFormat para Colombia
                  const diaSemana = new Intl.DateTimeFormat('es-CO', { weekday: 'short', timeZone: 'America/Bogota' }).format(d);
                  // Jueves en español puede ser 'jue.' o 'jueves' según navegador, así que aceptamos ambos
                  if (!(diaSemana.toLowerCase().startsWith('jue'))) {
                    e.target.setCustomValidity('Solo puedes seleccionar jueves para ortodoncia');
                  } else {
                    e.target.setCustomValidity('');
                  }
                }
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora</Form.Label>
            {servicio && (servicio.Nombre === 'Ortodoncia' || servicio.nombre === 'Ortodoncia') ? (
              <Form.Select name="hora" value={form.hora} onChange={handleChange} required>
                <option value="">Seleccione una hora</option>
                {horasDisponibles.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </Form.Select>
            ) : (
              <Form.Control type="time" name="hora" value={form.hora} onChange={handleChange} required />
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary" disabled={loadingDatos}>Agendar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

ModalAgendarCitaPaciente.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  servicio: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  doctoras: PropTypes.array,
  consultorios: PropTypes.array,
  onCitaAgendada: PropTypes.func.isRequired
};

export default ModalAgendarCitaPaciente; 