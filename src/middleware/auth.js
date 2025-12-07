import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.jwt;
    const csrfHeader = req.headers["x-csrf-token"];
    const csrfCookie = req.cookies?.csrf_token;

    if (!token) return res.status(401).json({ erro: "Não autenticado" });
    if (!csrfHeader || csrfHeader !== csrfCookie) return res.status(403).json({ erro: "Falha CSRF" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    console.error("authMiddleware erro:", err);
    return res.status(401).json({ erro: "Token inválido" });
  }
}