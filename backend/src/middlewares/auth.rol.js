export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // asegúrate de que req.user exista (usuario autenticado)
      if (!req.user) {
        return res.status(401).json({ message: "No authenticated" });
      }
      console.log(req.user);
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "No tienes permiso para esa acción" });
      }
      next();
    } catch (e) {
      return res.status(500).json({ message: `Error verifying role: ${e}` });
    }
  };
};
