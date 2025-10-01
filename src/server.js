import express from "express";
import dotenv from "dotenv";
import agendamentoRouter from "./routes/agendamentos.routes.js";

dotenv.config(); 

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    LISTAR:     "GET /api/agendamento",
    MOSTRAR:    "GET /api/agendamento/:id",
    CRIAR:      "POST /api/agendamento  BODY: { usuarios_id: Number, ExameOuConsulta: 'string', Medico: 'string', Paciente_id: Number, estado: 'Varchar', data_criacao: Date, data_atualizacao: Date }",
    SUBSTITUIR: "PUT /api/agendamento/:id  BODY: { usuarios_id: Number, ExameOuConsulta: 'string', Medico: 'string', Paciente_id: Number, estado: 'Varchar', data_criacao: Date, data_atualizacao: Date }",
    ATUALIZAR:  "PATCH /api/agendamento/:id  BODY: { usuarios_id?: Number, ExameOuConsulta?: 'string', Medico?: 'string', Paciente_id?: Number, estado?: 'Varchar', data_criacao?: Date, data_atualizacao?: Date }",
    DELETAR:    "DELETE /api/agendamento/:id",
  });
});

app.use("/api/agendamento", agendamentoRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));