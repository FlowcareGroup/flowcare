const requireRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // asegúrate de que req.user exista (usuario autenticado)
      if (!req.user) {
        return res.status(401).json({ message: "No authenticated" });
      }
      const rol = req.user.rol;
      if (rol !== requiredRole) {
        return res.status(403).json({ message: "No tienes permiso para esa acción" });
      }
      next();
    } catch (e) {
      return res.status(500).json({ message: `Error verifying role: ${e}` });
    }
  };
};

module.exports = { requireRole };