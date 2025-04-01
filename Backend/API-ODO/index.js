import corsConfig from "./src/config/corsOdoConfig.js";
import events from "events";
import express from "express";
import dotenv from "dotenv";
import port from "./src/config/bdD.js";  
import swaggerDocs from "./swagger.js";  
import modelOdoPermisos from "./src/routes/rutasOdoPermisos.js";
import modelOdoHistoriales from "./src/routes/rutasOdoHistoriales.js";
import modelOdoServicios from "./src/routes/rutasOdoServicios.js";
import modelOdoUsers from "./src/routes/rutasOdoUser.js";
import modelOdoConsultorio from "./src/routes/rutasOdoConsultorios.js";
import modelOdoDoctora from "./src/routes/rutasOdoDoctora.js";
import rutasOdoCitas from "./src/routes/rutasOdoCitas.js"; // Importación de la ruta de citas
import rutasOdoLogin from "./src/routes/rutasOdoLogin.js";

events.setMaxListeners(20);

dotenv.config();

const app = express();

app.use(corsConfig);

app.use(express.json());

// Registro de rutas
app.use('/api/', modelOdoPermisos);
app.use('/api/', modelOdoHistoriales);
app.use('/api/', modelOdoServicios);
app.use('/api/', modelOdoUsers);
app.use('/api/', modelOdoConsultorio);
app.use('/api/', modelOdoDoctora);
app.use('/api/', rutasOdoCitas); // Llamada a la ruta de citas
app.use('/api/', rutasOdoLogin);

swaggerDocs(app, port); 

app.get("/", (req, res) => {
  res.send("<h1>ESTA ES LA API</h1>");
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});