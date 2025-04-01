import jwt from 'jsonwebtoken';
export const verifyJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      console.log('Token no proporcionado');
      return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
      if (!process.env.JWT_SECRET) {
        console.log('JWT_SECRET no está definido en las variables de entorno');
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token válido, datos decodificados:', decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log('Error al validar el token:', error.message);
      return res.status(401).json({ message: 'Token no válido' });
    }
  };
export const verifyRole = (rolesPermitidos) => (req, res, next) => {
    const userRol = req.user.Nombre_rol;
    const hasRole = Array.isArray(userRol)
        ? userRol.some(rol => rolesPermitidos.includes(rol)) 
        : rolesPermitidos.includes(userRol);

    if (!hasRole) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};