import { Router } from "express";
import { pool } from "../db.js";

const router = Router();
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM clinica ORDER BY id DESC");
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/clinica - erro:", err);
    return res.status(500).json({ erro: "erro interno" });
  }
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  try {
    const { rows } = await pool.query("SELECT * FROM clinica WHERE id = $1", [id]);

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.post("/", async (req, res) => {
  const { nome, cep, telefone, endereco, ativo } = req.body ?? {};

  const nomeValido = typeof nome === "string" && nome.trim() !== "";
  const cepValido = typeof cep === "string" && cep.trim() !== "" && cep.length === 8;
  const telefoneValido = typeof telefone === "string" && telefone.trim() !== "";
  const enderecoValido = typeof endereco === "string" && endereco.trim() !== "";

  if (!nomeValido || !cepValido || !telefoneValido || !enderecoValido) {
    return res.status(400).json({ erro: "nome, cep, telefone e endereço obrigatórios." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO clinica (nome, cep, telefone, endereco, ativo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, cep, telefone, endereco, ativo]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cep, telefone, endereco, ativo } = req.body ?? {};


  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });


  try {
    const { rows } = await pool.query(
      "UPDATE clinica SET nome = $1, cep = $2, telefone = $3, endereco = $4, ativo = $5 WHERE id = $6 RETURNING *",
      [nome, cep, telefone, endereco, ativo, id]
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
      "UPDATE clinica SET ativo = $1 WHERE id = $2 RETURNING *",
      [ativo, id]
    );

    if (!rows[0])
      return res.status(404).json({ erro: "clínica não encontrada" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "erro interno" });
  }
});


router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  try {
    const r = await pool.query("DELETE FROM clinica WHERE id = $1 RETURNING id", [id]);

    if (!r.rowCount) return res.status(404).json({ erro: "não encontrado" });

    res.status(204).end();
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;