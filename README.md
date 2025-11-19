<h1 align="center">🧩 Sistema de Gestão de Tarefas Colaborativo</h1>

<p align="center">
  <strong>Um sistema full-stack de gestão de tarefas colaborativo, focado em escalabilidade e reatividade.</strong><br/>
  Construído com <b>NestJS</b>, <b>RabbitMQ</b>, <b>React</b>, <b>Zustand</b> e <b>TanStack Router</b>.
</p>

## 📘 Sumário

1. [🏗️ Arquitetura](#-arquitetura)
2. [🧠 Decisões Técnicas e Trade-offs](#-decisões-técnicas-e-trade-offs)
3. [⏱️ Cronograma de Desenvolvimento](#️-cronograma-de-desenvolvimento)
4. [⚠️ Problemas e Melhorias Futuras](#️-problemas-e-melhorias-futuras)
5. [⚙️ Arquivos .env](#️-arquivos-env)
6. [🚀 Instruções de Execução](#-instruções-de-execução)

---

## 🏗️ Arquitetura

O sistema é dividido entre:

- **Interface cliente** (React)
- **API Gateway** (NestJS)
- **Microsserviços especializados** (Auth, Tasks, Comments)

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/RabbitMQ-ready-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white"/>
  <img src="https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Zustand-Store-181717?style=for-the-badge&logo=zustand&logoColor=white"/>
</p>

---

## 📘 Sumário

1. [🏗️ Arquitetura](#-arquitetura)
2. [🧠 Decisões Técnicas e Trade-offs](#-decisões-técnicas-e-trade-offs)
3. [⏱️ Cronograma de Desenvolvimento](#️-cronograma-de-desenvolvimento)
4. [⚠️ Problemas e Melhorias Futuras](#️-problemas-e-melhorias-futuras)
5. [⚙️ Arquivos .env](#️-arquivos-env)
6. [🚀 Instruções de Execução](#-instruções-de-execução)

---

## 🏗️ Arquitetura

O sistema é dividido entre:

- **Interface cliente:** React
- **API Gateway:** NestJS
- **Microsserviços especializados:** Auth, Tasks, Comments
- **Assíncrona (RabbitMQ)** — comandos e eventos em segundo plano (Criar usuário, Criar Tarefa, Adicionar Comentário)

### 🔹 Diagrama Simplificado

````text
[ Cliente (React, Zustand, TanStack Router) ]
   |
   |--- (1) HTTP API (Login, Register, CreateTask)
   |
   |--- (2) WebSocket (Receber atualizações 'task_created', etc)
   |
   v
+-------------------------------------------+
|      API Gateway / Main App (NestJS)      |
|    (Recebe HTTP, Autentica JWT,           |
|     Gerencia Conexões Socket.io)          |
+-------------------------------------------+
   |      |                        |
   |      | (A) HTTP Sync          | (B) Mensageria Async
   |      | (p/ Auth)              | (p/ Tasks, Comments)
   |      |                        |
   v      v                        v
+-----------+                +---------------------+
| Serviço   |                |     RabbitMQ        |
| de Auth   |                +---------------------+
| (NestJS)  |                     |           |
+-----------+                     |           |
                                  v           v
                        +-----------+   +-------------+
                        | Serviço   |   | Serviço de  |
                        | de Tasks  |   | Comentários |
                        | (NestJS)  |   | (NestJS)    |
                        +-----------+   +-------------+
                             |               |
                             `----(evento)---'
                                    |
                                    `---> (Evento consumido pelo Gateway
                                           para notificar o cliente via Socket.io)
🧠 Decisões Técnicas e Trade-offs
🔸 Monorepo vs. Multi-repo
Decisão: Monorepo

Prós:

Gerenciamento centralizado de dependências

Compartilhamento de código (DTOs, interfaces)

Consistência entre serviços

Contras:

Maior complexidade na configuração de paths TypeScript (resolvido no Dia 4)

🔸 Comunicação entre Microsserviços
Decisão: Abordagem híbrida — HTTP para Auth e RabbitMQ para Tasks/Comments

Auth (HTTP): Ideal para operações síncronas (login e registro).

Tasks/Comments (RabbitMQ): Usado para operações CUD em background, garantindo resiliência.

🔸 Reatividade (Socket.io)
Decisão: O Gateway gerencia as conexões WebSocket com o cliente.

Prós:

Experiência colaborativa em tempo real

Contras:

Complexidade no gerenciamento de múltiplas conexões e escalabilidade

## ⏱️ Cronograma de Desenvolvimento

| 🧩 **Fase** | 📝 **Descrição** | ⏳ **Dias** |
|:--|:--|:--:|
| **Backend — Fundamentos** | Estrutura inicial do Monorepo, CRUD básico (Register), microsserviços iniciais | **1–3** |
| **Backend — Débito Técnico** | Correção de paths, modules e configurações TypeScript | **4** |
| **Backend — Real-Time** | Implementação do Socket.io e lógica de negócio | **5–6** |
| **Frontend — Integração e UI** | Login/Register, Dashboard, CRUD de Tasks, Audit Logs e reatividade | **6–14** |

> 💡 **Resumo:** o foco inicial foi a base do monorepo e da comunicação assíncrona.
> Em seguida, o sistema evoluiu para incluir reatividade e integração visual com o front-end.

---

## ⚠️ Problemas e Melhorias Futuras

> A seguir estão pontos técnicos e estruturais planejados para futuras iterações do projeto.

### ⚙️ **Configuração de Paths**
- O arquivo `tsconfig.json` ainda requer ajustes manuais de paths compartilhados entre serviços.

### 🧾 **Audit Logs**
- Criar um microsserviço dedicado (`audit-service`) para registrar eventos do **RabbitMQ**.
  Isso garantirá **rastreabilidade** e **observabilidade** das ações em todo o sistema.

### 🧪 **Testes**
- Implementar **testes unitários** e **E2E** (integração completa) para microsserviços e comunicação entre eles.

---

## ⚙️ Arquivos `.env`

Cada serviço possui suas próprias variáveis de ambiente.

### 📦 `apps/api-gateway/.env`
```env
JWT_SECRET=seu_token_aqui
🔐 apps/auth-service/.env
env
Copy code
JWT_SECRET=seu_token_aqui
JWT_REFRESH=seu_refresh_token_aqui
⚠️ Os demais serviços não requerem variáveis específicas no momento.

🚀 Instruções de Execução
Este projeto é um monorepo full-stack com múltiplos microsserviços e um cliente React.
Siga as etapas abaixo para configurar e executar corretamente o sistema:

🐋 1️⃣ Dependências Externas
Certifique-se de que Docker e Docker Compose estão instalados.
O projeto depende de PostgreSQL e RabbitMQ, inicializados via Docker:

bash
Copy code
docker compose up -d --build
⚙️ 2️⃣ Instalação e Execução (Raiz do Projeto)
Na pasta raiz, instale as dependências e inicie todos os serviços do monorepo:

bash
Copy code
npm install
npm run dev
🧱 3️⃣ Tipos Compartilhados (packages/types)
Este pacote contém DTOs e interfaces compartilhadas entre microsserviços:

bash
Copy code
cd packages/types
npm run dev
💻 4️⃣ Front-end (Aplicação React)
Por fim, inicie o cliente web (interface do usuário):

bash
Copy code
cd apps/web
npm run dev
✅ Resumo do Ambiente em Execução
Componente	Comando	Status Esperado
🧠 Microsserviços + Gateway	npm run dev (na raiz)	Em execução
🐇 RabbitMQ + PostgreSQL	docker compose up -d --build	Contêineres ativos
📦 Tipos compartilhados	npm run dev (em packages/types)	Servindo DTOs
🌐 Front-end	npm run dev (em apps/web)	Acessível em http://localhost:5173

Feito com ❤️ por mim, Victor Gabriel ```
````
