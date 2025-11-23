import { Router } from "express";
import { pool } from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();

/* -------------------- LOGIN -------------------- */
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    // compara a senha enviada com o hash salvo no banco
    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // gera token JWT
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, papel: usuario.papel },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Erro login:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

/* -------------------- LISTAR TODOS -------------------- */
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("GET /usuarios erro:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

/* -------------------- MOSTRAR POR ID -------------------- */
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

/* -------------------- CRIAR USUÁRIO -------------------- */
router.post("/", async (req, res) => {
  const { nome, email, papel, senha } = req.body;

  if (!nome || !email || !senha || !Number.isInteger(papel)) {
    return res
      .status(400)
      .json({ erro: "nome, email, papel e senha obrigatórios" });
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nome, email, papel, senha_hash) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, email, papel, senhaHash]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /usuarios erro:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});

/* -------------------- ATUALIZAR (PUT) -------------------- */
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, papel, senha } = req.body;

  if (!id) return res.status(400).json({ erro: "id inválido" });
  if (!nome || !email || !senha || !Number.isInteger(papel))
    return res.status(400).json({ erro: "dados inválidos" });

  const senhaHash = await bcrypt.hash(senha, 10);

  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET nome=$1, email=$2, papel=$3, senha_hash=$4 WHERE id=$5 RETURNING *",
      [nome, email, papel, senhaHash, id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

/* -------------------- DELETAR -------------------- */
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
