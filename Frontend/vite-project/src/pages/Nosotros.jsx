import React, { useState } from "react";
import { Carousel, Container, Row, Col, Collapse, Button } from "react-bootstrap";
import PublicNavBar from "../components/NavBarPublico";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Register from "../components/Register";

import Img1 from "../assets/img/nosotros_1.jpg";
import Img2 from "../assets/img/nosotros_2.jpg";
import Img3 from "../assets/img/nosotros_3.jpg";
import Img4 from "../assets/img/nosotros_4.jpg";
import Img5 from "../assets/img/nosotros_5.jpg";
import Img6 from "../assets/img/nosotros_6.jpg";
import Img7 from "../assets/img/nosotros_7.jpg";

const images = [
  { src: Img1, text: "Contamos con un equipo humano altamente calificado y tecnología de punta." },
  { src: Img2, text: "Nuestra prioridad es la salud y bienestar de nuestros pacientes." },
  { src: Img3, text: "Ofrecemos tratamientos personalizados en un ambiente cálido y seguro." },
  { src: Img4, text: "Especialistas en Periodoncia e Implantología con años de experiencia." },
  { src: Img5, text: "Atención integral y acompañamiento en todo tu proceso odontológico." },
  { src: Img6, text: "Innovación constante para brindarte los mejores resultados." },
  { src: Img7, text: "OdontoMedical: tu sonrisa, nuestro compromiso." },
];

const palette = {
  primary: '#556f70',
  secondary: '#49b6b2',
  light: '#eef6f6',
  accent: '#95bfbd',
  gray: '#7d7e7d',
  grayLight: '#8c9694',
};

const Nosotros = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [bounce, setBounce] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
  };
  const handleCloseForm = () => setShowForm(false);

  return (
    <div style={{ minHeight: "100vh", background: palette.light }}>
      <PublicNavBar onShowForm={handleShowForm} bounce={bounce} />
      {/* FORMULARIO DESPLEGABLE */}
      <Collapse in={showForm}>
        <div
          style={{
            position: 'absolute',
            right: 30,
            top: 70,
            zIndex: 100,
            minWidth: 340,
            maxWidth: 400,
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(85,111,112,0.18)',
            padding: '2rem 1.5rem',
            animation: bounce ? 'bounceIn 0.4s' : 'none',
          }}
        >
          <div className="mb-3 d-flex justify-content-between">
            <Button
              variant={isLogin ? "primary" : "outline-primary"}
              style={{
                background: isLogin ? palette.secondary : '#fff',
                color: isLogin ? '#fff' : palette.primary,
                border: 'none',
                borderRadius: 20,
                fontWeight: 600,
                marginRight: 8,
              }}
              onClick={() => setIsLogin(true)}
            >
              Iniciar sesión
            </Button>
            <Button
              variant={!isLogin ? "primary" : "outline-primary"}
              style={{
                background: !isLogin ? palette.secondary : '#fff',
                color: !isLogin ? '#fff' : palette.primary,
                border: 'none',
                borderRadius: 20,
                fontWeight: 600,
              }}
              onClick={() => setIsLogin(false)}
            >
              Registrarse
            </Button>
            <Button
              variant="link"
              style={{ color: palette.gray, marginLeft: 'auto', fontSize: 22, textDecoration: 'none' }}
              onClick={handleCloseForm}
              aria-label="Cerrar"
            >
              ×
            </Button>
          </div>
          <div>
            {isLogin ? <Login /> : <Register />}
          </div>
        </div>
      </Collapse>
      <Container className="py-5">
        <div className="d-flex justify-content-center mb-5">
          <div
            style={{
              width: "100%",
              maxWidth: 1300,
              borderRadius: 40,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(85,111,112,0.15)",
              background: "#fff",
            }}
          >
            <Carousel fade indicators={true} interval={3500}>
              {images.map((img, idx) => (
                <Carousel.Item key={idx}>
                  <img
                    className="d-block w-100"
                    src={img.src}
                    alt={`slide-${idx + 1}`}
                    style={{
                      height: "700px",
                      objectFit: "cover",
                      borderRadius: 0,
                    }}
                  />
                  <Carousel.Caption>
                    <div
                      style={{
                        background: "rgba(73,182,178,0.85)",
                        borderRadius: 12,
                        padding: "0.7rem 1.5rem",
                        display: "inline-block",
                        boxShadow: "0 2px 8px rgba(85,111,112,0.10)",
                      }}
                    >
                      <p
                        style={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "1.35rem",
                          margin: 0,
                          letterSpacing: 0.5,
                        }}
                      >
                        {img.text}
                      </p>
                    </div>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
        <h1
          className="text-center mb-3"
          style={{
            color: palette.secondary,
            fontWeight: 900,
            letterSpacing: 1,
            fontSize: "2.7rem",
          }}
        >
          SOMOS ODONTOMEDICAL
        </h1>
        <p
          className="text-center mb-2"
          style={{
            color: palette.primary,
            fontSize: "1.2rem",
            fontWeight: 500,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          La Clínica Odontológica OdontoMedical emerge en el año 2012 por la Doctora 👩‍⚕️ Yamile Guzmán Betancourt. Su visión pionera se centra en ofrecer servicios especializados en Periodoncia e Implantología 😁, destacando por su compromiso con la calidad y la atención personalizada en el cuidado bucodental.
        </p>
        <p
          className="text-center mb-4"
          style={{
            color: palette.gray,
            fontSize: "1.1rem",
            fontWeight: 500,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          Somos una clínica dedicada a transformar sonrisas y mejorar la calidad de vida de nuestros pacientes, brindando atención integral y humana en cada etapa de tu tratamiento.
        </p>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
        {/* MISIÓN Y VISIÓN */}
        <h2
          className="text-center mb-4"
          style={{
            color: palette.primary,
            fontWeight: 800,
            letterSpacing: 1,
            fontSize: "2rem",
          }}
        >
          Misión y Visión
        </h2>
        <Row className="justify-content-center mb-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          <Col md={6} className="mb-3">
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 12px rgba(73,182,178,0.08)",
                padding: "2rem 1.5rem",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: palette.secondary, fontWeight: 700, fontSize: "1.15rem" }}>
                En Odontomedical, nos dedicamos a ofrecer una atención odontológica 🦷 integral, basada en las necesidades únicas de cada paciente 👤 y en los más recientes avances científicos 📚.
              </span>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 12px rgba(73,182,178,0.08)",
                padding: "2rem 1.5rem",
                minHeight: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: palette.secondary, fontWeight: 700, fontSize: "1.15rem" }}>
                Odontomedical es ser líder en odontología, ofreciendo servicios de alta calidad y atención personalizada respaldada por tecnología innovadora 🖥️, buscando destacar como un centro de excelencia 🏥🦷 reconocido mundialmente por nuestro compromiso con la salud bucal 🪥 y el bienestar de los pacientes 👥.
              </span>
            </div>
          </Col>
        </Row>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
        {/* SISTEMA DE EXPEDIENTE Y OBJETIVOS */}
        <h2
          className="text-center mb-4"
          style={{
            color: palette.secondary,
            fontWeight: 800,
            letterSpacing: 1,
            fontSize: "2rem",
          }}
        >
          Sistema de Expediente clínico electrónico y agendamiento de citas
        </h2>
        <div
          className="mb-3"
          style={{
            color: palette.primary,
            fontSize: "1.15rem",
            fontWeight: 600,
            maxWidth: 900,
            margin: "0 auto 1.5rem auto",
            textAlign: "center",
          }}
        >
          Objetivo general:
        </div>
        <div
          className="mb-4"
          style={{
            color: palette.gray,
            fontSize: "1.08rem",
            fontWeight: 500,
            maxWidth: 900,
            margin: "0 auto 1.5rem auto",
            textAlign: "center",
          }}
        >
          Diseñar e implementar un sistema de informacion 💻 utilizado para optimizar la gestión clínica 🏥🦷 y mejorar el agendamiento de citas 📓 ademas de ofrecer los servicios en los que especializa la clinica 🏥🦷.
        </div>
        <div
          className="mb-2"
          style={{
            color: palette.primary,
            fontSize: "1.15rem",
            fontWeight: 600,
            maxWidth: 900,
            margin: "0 auto 1rem auto",
            textAlign: "center",
          }}
        >
          Objetivos específicos
        </div>
        <ul
          style={{
            color: palette.gray,
            fontSize: "1.08rem",
            fontWeight: 500,
            maxWidth: 900,
            margin: "0 auto 2.5rem auto",
            textAlign: "left",
            listStyle: "disc inside",
          }}
        >
          <li>
            Desarrollar un sistema con gestión de datos: Permitirá a la clínica almacenar 💾, organizar 📁 y acceder 🔑 eficientemente a los historiales clínicos 💻 de los pacientes 👥, garantizando la confidencialidad y seguridad 🔐 de la información 🗒️.
          </li>
          <li>
            Implementación de funciones para la creación, actualización y consulta de historiales 🗒️: Se optimizan los procesos de registro para la información 🗒️ por parte del personal medico 👩‍⚕️ y administrativo 👩‍💼.
          </li>
          <li>
            Diseño de una interfaz intuitiva 🕹️ y amigable: Permitirá que los usuarios del software 💻 incluyendo a los médicos, asistentes y el personal administrativo 👩‍💼. Pueda acceder fácilmente a los datos relevantes, realizar búsquedas avanzadas y generar informes personalizados según la necesidad de la clínica.
          </li>
        </ul>
        <hr
          style={{
            border: "none",
            height: 4,
            background: "linear-gradient(90deg, #49b6b2 0%, #95bfbd 100%)",
            boxShadow: "0 2px 8px #49b6b255",
            borderRadius: 8,
            margin: "2rem auto 2.5rem auto",
            width: "60%",
          }}
        />
      </Container>
      <Footer />
    </div>
  );
};

export default Nosotros;