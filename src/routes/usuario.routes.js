import { Router } from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const router = Router();
const ACCESS_TOKEN_TTL = "2h";
const REFRESH_TOKEN_TTL = "7d";

router.get("/me", (req, res) => {
  const token = req.cookies?.jwt;

  if (!token) return res.status(401).json({ erro: "Não autenticado" });

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    return res.json(dados);
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido" });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const usuario = rows[0];
    if (!usuario) return res.status(401).json({ erro: "Usuário não encontrado" });
    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) return res.status(401).json({ erro: "Senha incorreta" });
    if (senha.length < 6) return res.status(401).json({ erro: "Senha deve ter 6 digitos" });

    const payload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL,
    });

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_TTL }
    );
    const csrfToken = uuid();
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };

    res.cookie("jwt", accessToken, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", csrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 8 * 60 * 60 * 1000,
    });
    return res.json({
      ok: true,
      csrfToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    });
  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

router.post("/logout", (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  };

  res.clearCookie("jwt", options);
  res.clearCookie("refresh_token", options);
  res.clearCookie("csrf_token", { ...options, httpOnly: false });

  return res.json({ ok: true });
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ erro: "Refresh token ausente" });
    }

    let payload;
    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );
    } catch (err) {
      console.error("Erro ao verificar refresh token:", err);
      return res.status(401).json({ erro: "Refresh token inválido" });
    }
    const { rows } = await pool.query(
      "SELECT id, nome, email, papel FROM usuarios WHERE id = $1 AND ativo = true",
      [payload.id]
    );

    const usuario = rows[0];
    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const novoPayload = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
    };

    const novoAccessToken = jwt.sign(
      novoPayload,
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const novoCsrfToken = uuid();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    };

    res.cookie("jwt", novoAccessToken, {
      ...cookieOptions,
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.cookie("csrf_token", novoCsrfToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 2 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      csrfToken: novoCsrfToken,
      usuario: novoPayload,
    });
  } catch (err) {
    console.error("POST /refresh erro:", err);
    return res.status(500).json({ erro: "Erro interno no refresh" });
  }
});


router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /usuarios erro:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ erro: "id inválido" });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.post("/", async (req, res) => {
  const { nome, email, papel, senha, ativo } = req.body;

  if (!nome || !email || !senha || !Number.isInteger(papel)) {
    return res
      .status(400)
      .json({ erro: "nome, email, papel e senha obrigatórios" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nome, email, papel, senha_hash, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, email, papel, senhaHash, ativo]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /usuarios erro:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, papel, senha, ativo } = req.body;

  if (!id) return res.status(400).json({ erro: "id inválido" });
  if (!nome || !email || !senha || !Number.isInteger(papel))
    return res.status(400).json({ erro: "dados inválidos" });

  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET nome=$1, email=$2, papel=$3, senha_hash=$4, ativo=$5 WHERE id=$6 RETURNING *",
      [nome, email, papel, senhaHash, ativo, id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.patch("/:id/ativo", async (req, res) => {
  const id = Number(req.params.id);
  const { ativo } = req.body;

  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ erro: "id inválido" });

  if (typeof ativo !== "boolean")
    return res.status(400).json({ erro: "valor inválido para ativo" });

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET ativo = $1 WHERE id = $2 RETURNING *",
      [ativo, id]
    );

    if (!rows[0])
      return res.status(404).json({ erro: "usuario não encontrada" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "erro interno" });
  }
});


router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ erro: "id inválido" });

  try {
    const r = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id",
      [id]
    );

    if (!r.rowCount)
      return res.status(404).json({ erro: "não encontrado" });

    res.status(204).end();
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;
