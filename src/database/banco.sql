
DROP TABLE  IF EXISTS Usuarios CASCADE;
CREATE TABLE IF NOT EXISTS Usuarios (
    id                SERIAL       NOT NULL PRIMARY KEY,
    nome              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    senha_hash        VARCHAR(255) NOT NULL,
    papel             SMALLINT     NOT NULL CHECK (papel IN (0,1,2,3)),  -- 0=admin, 1=funcionário da saúde, 2=Clinica, 3 master
    data_criacao      TIMESTAMP    DEFAULT now(),
    data_atualizacao  TIMESTAMP    DEFAULT now(),
    Ativo             BOOLEAN      DEFAULT TRUE
);
DROP TABLE IF EXISTS Paciente CASCADE;
CREATE TABLE IF NOT EXISTS Paciente(
    id                SERIAL       NOT NULL PRIMARY KEY,
    Nome              VARCHAR(255) NOT NULL,	
    CPF               VARCHAR(11)  NOT NULL UNIQUE,
    Telefone          VARCHAR(15)  NOT NULL,
 	Ativo             BOOLEAN      DEFAULT TRUE
);
DROP TABLE IF EXISTS Clinica CASCADE;
CREATE TABLE IF NOT EXISTS Clinica(
    id                SERIAL       NOT NULL PRIMARY KEY,
    Nome              VARCHAR(255) NOT NULL,	
    CEP               VARCHAR(11)  NOT NULL,
    Telefone          VARCHAR(15)  NOT NULL,
    Endereco          VARCHAR(255) NOT NULL,
    Ativo             BOOLEAN      DEFAULT TRUE
);
DROP TABLE IF EXISTS Agendamento CASCADE;

CREATE TABLE IF NOT EXISTS Agendamento(
    id                SERIAL       NOT NULL PRIMARY KEY,
    Usuarios_id       INTEGER      NOT NULL REFERENCES Usuarios(id),
    ExameOuConsulta   VARCHAR(255) NOT NULL,
    Medico            VARCHAR(255) NOT NULL,
    Clinica_id        INTEGER      NOT NULL REFERENCES Clinica(id),
    Paciente_id       INTEGER      REFERENCES Paciente(id),	
    estado            VARCHAR(255) NOT NULL CHECK (estado IN ('d','u')), -- d-Disponivel, u-Utilizado
    data_agenda       TIMESTAMP    NOT NULL    ,
    data_criacao      TIMESTAMP    DEFAULT now(),
    data_atualizacao  TIMESTAMP    DEFAULT now()
);