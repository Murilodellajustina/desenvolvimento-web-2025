import { Router } from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

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
        a.clinica_id,
        c.nome AS clinica_nome,
        a.estado,
        a.data_agenda
      FROM agendamento a
      LEFT JOIN paciente p ON p.id = a.paciente_id
      LEFT JOIN clinica c ON c.id = a.clinica_id
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


router.post("/", authMiddleware,async (req, res) => {
  try {
    const {
      usuarios_id,
      exameouconsulta,
      medico,
      paciente_id,
      Clinica_id,
      estado,
      data_agenda
    } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO agendamento 
      (usuarios_id, exameouconsulta, medico, paciente_id, Clinica_id, estado, data_agenda) 
      VALUES ($1,$2,$3,$4,$5, $6, $7) 
      RETURNING *`,
      [usuarios_id, exameouconsulta, medico, paciente_id, Clinica_id, estado, data_agenda]
    );

    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /agendamento erro:", err);
    return res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const { paciente_id, estado, usuarios_id } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE agendamento SET  
        paciente_id = $1,
        estado = $2,
        usuarios_id = $3
        WHERE id = $4
        RETURNING *`,
      [paciente_id, estado, usuarios_id, id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]);
  } catch (err) {
    console.error("PUT erro:", err);
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
