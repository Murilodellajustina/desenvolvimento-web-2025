import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.js";
import agendamentoRouter from "./routes/agendamentos.routes.js";
import usuariosRouter from "./routes/usuario.routes.js";
import pacienteRouter from "./routes/paciente.routes.js";
import clinicaRouter from "./routes/clinica.routes.js";
import { ensureUsuariosTable } from "./utils/ensureSchema.js";

dotenv.config(); 

const app = express();
const origensPermitidaS = [
  "http://localhost:5173",
  "https://murilodellajustina.github.io",             
];

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (origensPermitidaS.includes(origin)) {
      return callback(null, true);
    }

    console.log("Bloqueado pelo CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));



app.use(express.json());
app.use(cookieParser());

app.use("/api/usuarios", usuariosRouter);  
app.use("/api/paciente", pacienteRouter);
app.use("/api/clinica", clinicaRouter);
app.use("/api/agendamento", authMiddleware, agendamentoRouter);


app.get("/", (_req, res) => {
  res.json({
    AGENDAMENTO: {
      LISTAR:     "GET /api/agendamento",
      MOSTRAR:    "GET /api/agendamento/:id",
      CRIAR:      "POST /api/agendamento",
      SUBSTITUIR: "PUT /api/agendamento/:id",
      ATUALIZAR:  "PATCH /api/agendamento/:id",
    },
    USUARIOS: {
      LISTAR:     "GET /api/usuarios",
      MOSTRAR:    "GET /api/usuarios/:id",
      CRIAR:      "POST /api/usuarios",
      SUBSTITUIR: "PUT /api/usuarios/:id",
      ATUALIZAR:  "PATCH /api/usuarios/:id",
      INATIVAR:   "PATCH /api/usuarios/:id/ativo",
    },
    PACIENTE: {
      LISTAR:     "GET /api/paciente",
      MOSTRAR:    "GET /api/paciente/:id",
      CRIAR:      "POST /api/paciente",
      SUBSTITUIR: "PUT /api/paciente/:id",
      ATUALIZAR:  "PATCH /api/paciente/:id",
      INATIVAR:   "PATCH /api/paciente/:id/ativo",
    },
    CLINICA: {
      LISTAR:     "GET /api/clinica",
      MOSTRAR:    "GET /api/clinica/:id",
      CRIAR:      "POST /api/clinica",
      SUBSTITUIR: "PUT /api/clinica/:id",
      ATUALIZAR:  "PATCH /api/clinica/:id",
      INATIVAR:   "PATCH /api/clinica/:id/ativo",
    },
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);

  try {
    await ensureUsuariosTable();   
  } catch (err) {
    console.error("Erro ao garantir tabelas:", err);
  }
});