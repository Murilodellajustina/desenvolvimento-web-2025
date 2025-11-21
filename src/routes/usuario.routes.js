import { Router } from "express";
import { pool } from "../db.js";

const router = Router(); 
router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios ORDER BY id DESC");
    return res.json(rows);
  } catch (err) {
    console.error("GET /api/usuarios - erro:", err);
    return res.status(500).json({ erro: "erro interno" });
  }
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id); 

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]);

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.post("/", async (req, res) => {
  const { nome, email, papel, senha} = req.body ?? {}; 

  const nomeValido = typeof nome === "string" && nome.trim() !== "";
  const emailValido = typeof email === "string" && email.trim() !== "";
  const papelValido = Number(papel);
  const temPapelValido = Number.isInteger(papel) && papel > 0;
  const senhaValida = typeof senha === "string" && senha.trim() !== "";

  if (!nomeValido || !emailValido || !temPapelValido || !senhaValida ) {
    return res.status(400).json({ erro: "nome, email, papel e senha  obrigatórios." });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO usuarios (nome, email, papel, senha) VALUES ($1, $2, $3, 4$) RETURNING *",
      [nome, email, papel, senha]
    );
    res.status(201).json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});


router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, papel, senha} = req.body ?? {}; 


  const nomeValido = typeof nome === "string" && nome.trim() !== "";
  const emailValido = typeof email === "string" && email.trim() !== "";
  const temPapelValido = Number.isInteger(papel) && papel == 0 || papel == 1 || papel == 2 ;
  const senhaValida = typeof senha === "string" && senha.trim() !== "";

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (!nomeValido || !emailValido || !temPapelValido || senhaValida ) {
    return res.status(400).json({ erro: "nome, email, Papel e senha  obrigatórios." });
  }


  try {
    const { rows } = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, papel = $3, senha = $4 RETURNING *",
      [nome, email, papel, senha]
    );

    if (!rows[0]) return res.status(404).json({ erro: "não encontrado" });

    res.json(rows[0]); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, papel, senha } = req.body ?? {};

  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: "id inválido" });

  if (nome === undefined && email === undefined && papel === undefined && senha === undefined) {
    return res.status(400).json({ erro: "envie todos os dados" });
  }

  let nm= null; ;//nome
    if (nome !== undefined) {
        nm = String(nome);
        if (nm !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "Nome deve ser valido" });
        }
    }
  let Em = null; // email
    if (email !== undefined) {
        Em = String(email);
        if (Em !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "email deve ser valido." });
        }
    } 
    let pap = null; //papel
    if (papel !== undefined) {
        pap = Number(papel);
        if (!Number.isInteger(pap) || pap !=  0 && pap != 1 && pap != 2) {
            return res.status(400).json({ erro: "Papel deve ser 0, 1 ou 2" });
        }
    }

    let Senh = null; // senha
    if (senha !== undefined) {
        Senh = String(senha);
        if (Senh !== "string" && texto.trim() == "") {
            return res.status(400).json({ erro: "senha deve ser valido." });
        }
    } 

  try {
    const { rows } = await pool.query(
      "UPDATE usuario SET nome = $1, email = $2, papel = $3, senha = $4 WHERE id = $5 RETURNING *",
      [nome, email, papel, senha, id]
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
    const r = await pool.query("DELETE FROM usuarios WHERE id = $1 RETURNING id", [id]);

    if (!r.rowCount) return res.status(404).json({ erro: "não encontrado" });

    res.status(204).end(); 
  } catch {
    res.status(500).json({ erro: "erro interno" });
  }
});

export default router;