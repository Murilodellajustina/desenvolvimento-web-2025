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
  const { nome, cep, telefone, endereco} = req.body ?? {}; 

  const nomeValido = typeof nome === "string" && nome.trim() !== "";
  const cepValido = typeof cep === "string" && cep.trim() !== "" && cep.length === 8;
  const telefoneValido = typeof telefone === "string" && telefone.trim() !== "";
  const enderecoValido = typeof endereco === "string" && endereco.trim() !== "";

  if (!nomeValido || !cepValido || !telefoneValido || !enderecoValido) {
    return res.status(400).json({ erro: "nome, cep, telefone e endereço obrigatórios." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO clinica (nome, cep, telefone, endereco) VALUES ($1, $2, $3, $4) RETURNING *",
      [nome, cep, telefone, endereco]
    );
    res.status(201).json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cep, telefone, endereco} = req.body ?? {}; 

  const nomeValido = typeof nome === "string" && nome.trim() !== "";
  const cepValido = typeof cep === "string" && cep.trim() !== "" && cep.length === 8;
  const telefoneValido = typeof telefone === "string" && telefone.trim() !== "";
  const enderecoValido = typeof endereco === "string" && endereco.trim() !== "";

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (!nomeValido || !cepValido || !telefoneValido || !enderecoValido) {
    return res.status(400).json({ erro: "nome, cep, telefone e endereco obrigatórios." });
  }


  try {
    const { rows } = await pool.query(
      "UPDATE clinica SET nome = $1, cpf = $2, telefone = $3 RETURNING *",
      [nome, cpf, telefone]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, cep, telefone, endereco } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (nome === undefined && cep === undefined && telefone === undefined && endereco === undefined) {
    return res.status(400).json({ erro: "envie todos os dados" });
  }

  let nm= null; ;//nome
    if (nome !== undefined) {
        nm = String(nome);
        if (nm !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "Nome deve ser valido" });
        }
    }
  let cepV = null; // cep
    if (cep !== undefined) {
        cepV = String(cep);
        if (cepV !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "cep deve ser valido." });
        }
    } 
    let tel = null; //telefone
    if (telefone !== undefined) {
        tel = String(telefone);
        if (tel !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "telefone deve ser valido." });
        }
    }

    let ende = null; //endereco
    if (endereco !== undefined) {
        ende = String(endereco);
        if (ende !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "endereco deve ser valido." });
        }
    }

  try {
    const { rows } = await pool.query(
      "UPDATE clinica SET nome = $1, cep = $2, telefone = $3, endereco = $4 WHERE id = $5 RETURNING *",
      [nome, cep, telefone, endereco, id]
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
    const r = await pool.query("DELETE FROM clinica WHERE id = $1 RETURNING id", [id]);

    if (!r.rowCount) return res.status(404).json({ erro: "não encontrado" });

    res.status(204).end(); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;