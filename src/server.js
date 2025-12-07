import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./middleware/auth.js";
import agendamentoRouter from "./routes/agendamentos.routes.js";
import usuariosRouter from "./routes/usuario.routes.js";
import pacienteRouter from "./routes/paciente.routes.js";
import clinicaRouter from "./routes/clinica.routes.js";

dotenv.config(); 

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
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
      DELETAR:    "DELETE /api/agendamento/:id",
    },
    USUARIOS: {
      LISTAR:     "GET /api/usuarios",
      MOSTRAR:    "GET /api/usuarios/:id",
      CRIAR:      "POST /api/usuarios",
      SUBSTITUIR: "PUT /api/usuarios/:id",
      ATUALIZAR:  "PATCH /api/usuarios/:id",
      DELETAR:    "DELETE /api/usuarios/:id",
    },
    PACIENTE: {
      LISTAR:     "GET /api/paciente",
      MOSTRAR:    "GET /api/paciente/:id",
      CRIAR:      "POST /api/paciente",
      SUBSTITUIR: "PUT /api/paciente/:id",
      ATUALIZAR:  "PATCH /api/paciente/:id",
      DELETAR:    "DELETE /api/paciente/:id",
    },
    CLINICA: {
      LISTAR:     "GET /api/clinica",
      MOSTRAR:    "GET /api/clinica/:id",
      CRIAR:      "POST /api/clinica",
      SUBSTITUIR: "PUT /api/clinica/:id",
      ATUALIZAR:  "PATCH /api/clinica/:id",
      DELETAR:    "DELETE /api/clinica/:id",
      INATIVAR:   "PATCH /api/clinica/:id/ativo",
    },
  });
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));