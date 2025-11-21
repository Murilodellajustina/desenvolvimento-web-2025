import { Router } from "express";
import { pool } from "../db.js";

const router = Router(); 
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM agendamento ORDER BY id DESC");
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/agendamento - erro:", err);
    return res.status(500).json({ erro: "erro interno" });
  }
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id); 

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  try {
    const { rows } = await pool.query("SELECT * FROM agendamento WHERE id = $1", [id]);

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.post("/", async (req, res) => {
  const { usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado} = req.body ?? {}; 

  const uid = Number(usuarios_id);
  const temUidValido = Number.isInteger(uid) && uid > 0;
  const ExameOuConsultaEhValido = typeof ExameOuConsulta === "string" && ExameOuConsulta.trim() !== "";
  const MedicoValido = typeof Medico === "string" && Medico.trim() !== "";
  const cid = Number(Clinica_id);
  const pid = Number(Paciente_id);
  const temCidValido = Number.isInteger(cid) && cid > 0;
  const temPidValido = Number.isInteger(pid) && pid > 0;
  const est = estado ?? "d"; 

  if (!temUidValido || !ExameOuConsultaEhValido || !MedicoValido || !temCidValido || !temPidValido || !est ) {
    return res.status(400).json({ erro: "usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id e estado obrigatórios." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO agendamento (usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado]
    );
    res.status(201).json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado} = req.body ?? {}; 


  const uid = Number(usuarios_id);
  const temUidValido = Number.isInteger(uid) && uid > 0;
  const ExameOuConsultaEhValido = typeof ExameOuConsulta === "string" && ExameOuConsulta.trim() !== "";
  const MedicoValido = typeof Medico === "string" && Medico.trim() !== "";
  const cid = Number(Clinica_id);
  const pid = Number(Paciente_id);
  const temCidValido = Number.isInteger(cid) && cid > 0;
  const temPidValido = Number.isInteger(pid) && pid > 0;
  const est = estado ?? "d"; 

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (!temUidValido || !ExameOuConsultaEhValido || !MedicoValido || !temCidValido || !temPidValido || !est ) {
    return res.status(400).json({ erro: "usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id e estado obrigatórios." });
  }


  try {
    const { rows } = await pool.query(
      "UPDATE agendamento SET usuarios_id = $1, ExameOuConsulta = $2, Medico = $3, Clinica_id = $4, Paciente_id = $5, estado = $6 WHERE id = $7 RETURNING *",
      [usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado, id]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { usuarios_id, ExameOuConsulta, Medico, Clinica_id, Paciente_id, estado } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (usuarios_id === undefined && ExameOuConsulta === undefined && Medico === undefined && Clinica_id === undefined && Paciente_id === undefined && estado === undefined) {
    return res.status(400).json({ erro: "envie todos os dados" });
  }

  let uid = null;
    if (Usuarios_id !== undefined) {
        uid = Number(Usuarios_id);
        if (!Number.isInteger(uid) || uid <= 0) {
            return res.status(400).json({ erro: "Usuarios_id deve ser inteiro > 0" });
        }
    }
  let ExOcV = null;
    if (ExameOuConsulta !== undefined) {
        EXcOv = String(ExameOuConsulta);
        if (EXcOv !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "ExameOuConsulta deve ser valido" });
        }
    }
    let MedVal = null;
    if (Medico !== undefined) {
        MedVal = String(Medico);
        if (MedVal !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "Medico deve ser valido" });
        }
    } 
    let cid = null;
    if (Clinica_id !== undefined) {
        cid = Number(Clinica_id);
        if (!Number.isInteger(cid) || cid <= 0) {
            return res.status(400).json({ erro: "Clinica_id deve ser inteiro > 0" });
        }
    }
    let pid = null;
    if (Paciente_id !== undefined) {
        pid = Number(Paciente_id);
        if (!Number.isInteger(pid) || pid <= 0) {
            return res.status(400).json({ erro: "Paciente_id deve ser inteiro > 0" });
        }
    }

  try {
    const { rows } = await pool.query(
      "UPDATE agendamentos SET usuarios_id = $1, ExameOuConsulta = $2, Medico = $3, Clinica_id = %4, Paciente_id = $5, estado = $6 WHERE id = $7 RETURNING *",
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

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  try {
    const r = await pool.query("DELETE FROM agendamento WHERE id = $1 RETURNING id", [id]);

    if (!r.rowCount) return res.status(404).json({ erro: "não encontrado" });

    res.status(204).end(); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;