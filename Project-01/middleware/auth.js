const jwt = require("jsonwebtoken");
const config = require("../config.js");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(403).json({ message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, config.secret);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = auth;