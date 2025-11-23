import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) return res.status(401).json({ erro: "Token não enviado" });

  const [, token] = auth.split(" ");

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ erro: "Token inválido" });
  }
}
