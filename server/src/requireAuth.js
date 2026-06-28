const jwt = require("jsonwebtoken");
const { env } = require("./env");

function requireAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.admin = payload; // e.g. { email: 'team@venturizer.com', id: '...' }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

module.exports = { requireAuth };
