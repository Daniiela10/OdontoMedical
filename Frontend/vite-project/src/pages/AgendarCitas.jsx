{/* Renderizar el modal solo si hay un servicio seleccionado */}
{servicioSeleccionado && (
  <ModalAgendarCitaPaciente
    show={showModal}
    onHide={() => setShowModal(false)}
    servicio={servicioSeleccionado}
    user={user}
    doctoras={doctoras}
    consultorios={consultorios}
    onCitaAgendada={handleCitaAgendada}
  />
)} 