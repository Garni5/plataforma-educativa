
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; 
    if (!user || !user.roles) {
      return res.status(403).json({ message: "No autorizado" });
    }

 
    const userRoles = user.roles.map(r => r.privilegio?.nombre_privilegio).filter(Boolean);

    const hasRole = userRoles.some(r => allowedRoles.includes(r));
    if (!hasRole) {
      return res.status(403).json({ message: "No tienes permisos" });
    }

    next();
  };
}

module.exports = { authorizeRoles };
