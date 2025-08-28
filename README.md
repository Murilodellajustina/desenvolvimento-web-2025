# AgendaFácil - Sistema de agendamento
## 1) Problema  
- Todos os dias, pessoas sofrem pelo atraso no agendamento de exames e consultas pelo SUS, onde algumas demoram dias, meses e até anos para serem agendadas. 
- Os sistemas são falhos e de dificil entendimento
- Com um sistema interativo, e com profissionais treinados, estas filas poderiam ser diminuidas ou até mesmo zeradas! 
- Objetivo Inicial: Reduzir as filas do SUS, e facilitar o entendimento de profissionais da Saúde.
## 2) Atores e Decisores (quem usa / quem decide)
- Atores: Funcionários da saúde e clinicas
- Decisores/Apoiadores: Admins
## 3) Casos de uso (de forma simples) 
- Todos: [ações comuns, ex.: Logar/des  logar; Manter dados cadastrais]
- Funcionario da saúde: Manter (inserir, mostrar, editar, remover) todos os agendamentos.
- Clinica: Manter (inserir, editar, remover) todas as vagas.
- Admin: Manter (inserir, editar, mostrar, remover) todas as vagas, agendamentos e usuários.
## 4) Limites e suposições
- Limites: entrega final até o fim da disciplina (ex.: 2025-11-30); rodar no
navegador; sem serviços pagos.
- Suposições: internet no laboratório; navegador atualizado; acesso ao GitHub; 10
min para teste rápido.
- Plano B: sem internet → rodar local e salvar em arquivo/LocalStorage; sem tempo do
professor → testar com 3 colegas. -->
## 5) Hipóteses + validação

H-Valor: Se o funcionário tem mais facilidade de manusear o sistema, então a fila do SUS anda mais rápido.
Validação: Envia para 5 uniades de saude e testa se os funcionários conseguem manusear apenas utilizando o manual de uso.
H-Viabilidade: Com HTML/CSS/JS + armazenamento local. Cadastrar exames/consultas, e agendar pacientes, leva até 5s.
Validação (viabilidade): medir 40 ações; meta: pelo menos 36 das 40 ações em 2s ou menos
## 6) Fluxo principal e primeira fatia

**Fluxo principal (curto):**
1) Funcionario da saúde faz login → 
2) Procura o exame/consulta que deseja → 
3) Agenda o paciente →
4) Mostra a confirmação
**Primeira fatia vertical (escopo mínimo):**
Inclui: 2 telas (por tipo de usuário), 3 ações por usuário, Cadastrar, editar e excluir (CRUD);
Critérios de aceite:
- Cadastro realizado com sucesso;
- Edição realizada com sucesso;
- Exclusão realizada com sucesso
## 7) Esboços de algumas telas (wireframes)
<!-- Vale desenho no papel (foto), Figma, Excalidraw, etc. Não precisa ser bonito,
precisa ser claro.
 EXEMPLO de telas:
 • Login
 • Lista de chamados (ordem + tempo desde criação)
 • Novo chamado (formulário simples)
 • Painel do professor (atender/encerrar)
 EXEMPLO de imagem:
 ![Wireframe - Lista de chamados](img/wf-lista-chamados.png) -->
[Links ou imagens dos seus rascunhos de telas aqui]...
## 8) Tecnologias
### 8.1 Navegador
**Navegador:** [HTML/CSS/JS | JS, BOOTSTRAP]
**Armazenamento local:** [LocalStorage]
**Hospedagem:** [GitHub Pages]
### 8.2 Front-end (servidor de aplicação, se existir)
**Front-end (servidor):** [Next.js]
**Hospedagem:** [GitHub Pages]
### 8.3 Back-end (API/servidor, se existir)
**Back-end (API):** [Javascript]
**Banco de dados:** [MySQL ou Postgree]
## 9) Plano de Dados (Dia 0) — somente itens 1–3

### 9.1 Entidades
- [Admin] — [Autoriza criação de usuários, pode excluir registros]
- [Funcionario da saúde] — [Agenda pacientes, exclui ou edita agendamentos]
- [Clinicas] — [Cadastra, exclui ou editas exames/consultas]
### 9.2 Campos por entidade
### Usuario
| Campo | Tipo | Obrigatório | Exemplo |
|-----------------|-------------------------------|-------------|--------------------|
| id | número | sim | 1 |
| nome | texto | sim | "Ana Souza" |
| senha_hash | texto | sim | "$2a$10$..." |
| papel | número (0=admin, 1=funcionário da saúde, 2=Clinica) | sim | 0 |
| dataCriacao | data/hora | sim | 2025-08-20 14:30 |
| dataAtualizacao | data/hora | sim | 2025-08-20 15:10 |
### Agenda
| Campo | Tipo | Obrigatório | Exemplo |
|-----------------|--------------------|-------------|-------------------------|
| id | número | sim | 2 |
| Usuario_id | número (fk) | sim | 8f3a-... |
| texto | texto | sim | "Erro ao compilar" |
| estado | char | sim | 'a' \| 'f' |
| dataCriacao | data/hora | sim | 2025-08-20 14:35 |
| dataAtualizacao | data/hora | sim | 2025-08-20 14:50 |
### 9.3 Relações entre entidades
- Uma Clinica tem muitos exames/consultas. (1→N)
- Um exame/consulta pertence a muitas clinicas. (1→N)
- Um funcionario da saúde possui muitos agendamentos. (N→1)