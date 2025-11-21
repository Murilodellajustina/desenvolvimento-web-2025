import express from "express";
import dotenv from "dotenv";
import agendamentoRouter from "./routes/agendamentos.routes.js";
import usuariosRouter from "./routes/usuario.routes.js";
import pacienteRouter from "./routes/paciente.routes.js";
import clinicaRouter from "./routes/clinica.routes.js";

dotenv.config(); 

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    LISTAR:     "GET /api/agendamento",
    MOSTRAR:    "GET /api/agendamento/:id",
    CRIAR:      "POST /api/agendamento  BODY: { usuarios_id: Number, ExameOuConsulta: 'string', Medico: 'string', Clinica_id: Number, Paciente_id: Number, estado: 'string'}",
    SUBSTITUIR: "PUT /api/agendamento/:id  BODY: { usuarios_id: Number, ExameOuConsulta: 'string', Medico: 'string', Clinica_id: Number, Paciente_id: Number, estado: 'Varchar' }",
    ATUALIZAR:  "PATCH /api/agendamento/:id  BODY: { usuarios_id?: Number, ExameOuConsulta?: 'string', Medico?: 'string', Clinica_id?: Number, Paciente_id?: Number, estado?: 'Varchar' }",
    DELETAR:    "DELETE /api/agendamento/:id",
  });
});

app.get("/", (_req, res) => {
  res.json({
    LISTAR:     "GET /api/usuarios",
    MOSTRAR:    "GET /api/usuarios/:id",
    CRIAR:      "POST /api/usuarios  BODY: { nome: 'string', email: 'string', papel: Number, senha: 'string'}",
    SUBSTITUIR: "PUT /api/usuarios/:id  BODY: { nome: 'string', email: 'string', papel: Number, senha: 'string'}",
    ATUALIZAR:  "PATCH /api/usuarios/:id  BODY: {nome?: 'string', email?: 'string', papel?: Number, senha?: 'string' }",
    DELETAR:    "DELETE /api/usuarios/:id",
  });
});

app.get("/", (_req, res) => {
  res.json({
    LISTAR:     "GET /api/paciente",
    MOSTRAR:    "GET /api/paciente/:id",
    CRIAR:      "POST /api/paciente  BODY: { nome: 'string', cpf: 'string', telefone: 'string'}",
    SUBSTITUIR: "PUT /api/paciente/:id  BODY: { nome: 'string', cpf: 'string', telefone: 'string'}",
    ATUALIZAR:  "PATCH /api/paciente/:id  BODY: {nome?: 'string', cpf?: 'string', telefone?: 'string' }",
    DELETAR:    "DELETE /api/paciente/:id",
  });
});

app.get("/", (_req, res) => {
  res.json({
    LISTAR:     "GET /api/clinica",
    MOSTRAR:    "GET /api/clinica/:id",
    CRIAR:      "POST /api/clinica  BODY: { nome: 'string', cep: 'string', telefone: 'string', endereco: 'string'}",
    SUBSTITUIR: "PUT /api/clinica/:id  BODY: { nome: 'string', cep: 'string', telefone: 'string', endereco: 'string'}",
    ATUALIZAR:  "PATCH /api/clinica/:id  BODY: {nome?: 'string', cep?: 'string', telefone?: 'string', endereco: 'string' }",
    DELETAR:    "DELETE /api/clinica/:id",
  });
});

app.use("/api/agendamento", agendamentoRouter);
app.use("/api/usuarios", usuariosRouter);
app.use("/api/paciente", pacienteRouter);
app.use("/api/clinica", clinicaRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));