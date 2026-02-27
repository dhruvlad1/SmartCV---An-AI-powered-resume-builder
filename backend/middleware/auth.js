const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Prefer cookie, but also allow Bearer token for flexibility
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const [scheme, value] = req.headers.authorization.split(" ");
    if (scheme === "Bearer" && value) {
      token = value;
    }
  }

  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
