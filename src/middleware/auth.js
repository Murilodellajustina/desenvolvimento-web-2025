import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies?.jwt;

  if (!token) return res.status(401).json({ erro: "Não autenticado" });

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.user = dados;

    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      const csrfCookie = req.cookies?.csrf_token;
      const csrfHeader = req.get("x-csrf-token");

      if (!csrfCookie) {
        console.error("CSRF falhou: cookie ausente", req.cookies);
        return res.status(401).json({ erro: "Erro CSRF: cookie não encontrado" });
      }

      if (!csrfHeader) {
        console.error("CSRF falhou: header ausente");
        return res.status(401).json({ erro: "Erro CSRF: token não enviado" });
      }

      if (csrfCookie !== csrfHeader) {
        console.error("CSRF falhou: tokens diferentes", {
          cookie: csrfCookie,
          header: csrfHeader,
        });
        return res.status(401).json({ erro: "Erro CSRF: token inválido" });
      }
    }
    return next();
  } catch (err) {
    console.error("authMiddleware erro:", err);
    return res.status(401).json({ erro: "Token inválido" });
  }
}