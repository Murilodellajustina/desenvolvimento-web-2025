CREATE TABLE Usuarios (
    id                SERIAL       NOT NULL PRIMARY KEY,
    nome              VARCHAR(255) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    senha_hash        VARCHAR(255) NOT NULL,
    papel             SMALLINT     NOT NULL CHECK (papel IN (0,1,2)),  -- 0=admin, 1=funcionário da saúde, 2=Clinica
    data_criacao      TIMESTAMP    DEFAULT now(),
    data_atualizacao  TIMESTAMP    DEFAULT now()
);

CREATE TABLE Paciente(
    id                SERIAL       NOT NULL PRIMARY KEY,
    Nome              VARCHAR(255) NOT NULL,	
    CPF               VARCHAR(11)  NOT NULL UNIQUE,
    Telefone          VARCHAR(15)  NOT NULL
);

CREATE TABLE Agendamento(
    id                SERIAL       NOT NULL PRIMARY KEY,
    Usuarios_id       BIGINT       NOT NULL REFERENCES Usuarios(id),
    ExameOuConsulta   VARCHAR(255) NOT NULL,
    Medico            VARCHAR(255) NOT NULL,
    Paciente_id       BIGINT       NOT NULL REFERENCES Paciente(Nome),	
    estado            VARCHAR(255) NOT NULL CHECK (estado IN ('d','u')), -- d-Disponivel, u-Utilizado
    data_criacao      TIMESTAMP    DEFAULT now(),
    data_atualizacao  TIMESTAMP    DEFAULT now()
);


INSERT INTO Usuarios (nome, email, senha_hash, papel) VALUES('Marcelo', 'Marcelo@gmail.com.br', '123', 1);
INSERT INTO Usuarios (nome, email, senha_hash, papel) VALUES('Admin', 'admin@admin.com.br', '1234', 0);

INSERT INTO Paciente (Nome, CPF, Telefone) VALUES ('João Silva', '12345678901', '11999999999');
INSERT INTO Paciente (Nome, CPF, Telefone) VALUES ('Maria Oliveira', '10987654321', '11888888888');
INSERT INTO Paciente (Nome, CPF, Telefone) VALUES ('Ana Souza', '11122233344', '11777777777');
INSERT INTO Paciente (Nome, CPF, Telefone) VALUES ('Carlos Pereira', '55566677788', '11666666666');

INSERT INTO Agendamento (Usuarios_id, ExameOuConsulta, Medico, Paciente_id, estado) VALUES (1, 'Ecodoppler', 'Fernando Arruda', 1, 'd');