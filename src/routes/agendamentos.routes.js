import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        a.id,
        a.usuarios_id,
        a.exameouconsulta,
        a.medico,
        a.paciente_id,
        p.nome AS paciente_nome,
        a.estado,
        a.data_criacao,
        a.data_atualizacao
      FROM agendamento a
      JOIN paciente p ON p.id = a.paciente_id
      ORDER BY a.id DESC
    `);

    return res.json(rows);
  } catch (err) {
    console.error("GET /api/agendamento - erro:", err);
    return res.status(500).json({ erro: "erro interno" });
  }
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ erro: "id inválido" });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM agendamento WHERE id = $1",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.post("/", async (req, res) => {
  const { usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado } = req.body;

  try {
    const { rows } = await pool.query(
      `INSERT INTO agendamento 
      (usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado) 
      VALUES ($1,$2,$3,$4,$5,$6) 
      RETURNING *`,
      [usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST erro:", err);
    res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const { usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE agendamento SET 
      usuarios_id = $1,
      ExameOuConsulta = $2,
      Medico = $3,
      Clinica_id = $4,
      Paciente_id = $5,
      estado = $6
      WHERE id = $7
      RETURNING *`,
      [usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado, id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const r = await pool.query("DELETE FROM agendamento WHERE id = $1", [id]);
    if (r.rowCount === 0) return res.status(404).json({ erro: "não encontrado" });

    res.sendStatus(204);
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;
