Sistema de Gestão de Tarefas Colaborativo

Este é um projeto full-stack de um sistema de gestão de tarefas colaborativo, construído com foco em escalabilidade e reatividade.

O back-end utiliza uma arquitetura de microsserviços com NestJS e RabbitMQ para comunicação assíncrona. O front-end é construído em React (com Zustand e TanStack Router) e se comunica com o back-end via HTTP e WebSockets (Socket.io) para atualizações em tempo real.

O projeto é organizado como um Monorepo.

🏗️ Arquitetura

A arquitetura é dividida entre uma interface de cliente, um ponto de entrada de API (Gateway) e múltiplos microsserviços especializados. A comunicação acontece de duas formas:

    Síncrona (HTTP): Usada para operações que exigem uma resposta imediata (ex: Login, Registro).

    Assíncrona (RabbitMQ): Usada para comandos e eventos que podem ser processados em segundo plano (ex: Criar Tarefa, Adicionar Comentário), permitindo que a UI responda instantaneamente.

Snippet de código

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

Durante o desenvolvimento, várias decisões de arquitetura foram tomadas:

    Monorepo vs. Multi-repo:

        Decisão: Utilizar um Monorepo.

        Trade-off (Pró): Gerenciamento centralizado de dependências, compartilhamento de código (ex: DTOs, interfaces) entre o front-end e os microsserviços, consistência de tooling.

        Trade-off (Contra): Alta complexidade inicial de configuração, especialmente com paths do TypeScript e resolução de módulos entre os pacotes (um desafio enfrentado no Dia 4).

    Comunicação de Microsserviços (HTTP vs. RabbitMQ para Auth):

        Decisão: Usar uma abordagem híbrida.

        Trade-off (Contexto - Dia 2): Foi analisado o uso de RabbitMQ para autenticação (Login/Register). Usar RabbitMQ (padrão Request/Reply) eliminaria a dependência direta do Gateway com o serviço de Auth.

        Trade-off (Conclusão): No entanto, operações de autenticação são inerentemente síncronas (o usuário precisa esperar a resposta). Usar um message broker para isso adiciona complexidade desnecessária. A decisão final foi usar HTTP síncrono (Gateway -> Serviço de Auth). Isso cria uma dependência de serviço, mas simplifica drasticamente o fluxo de autenticação, que é o comportamento esperado para essa operação.

    Comunicação para Ações (Tasks/Comments):

        Decisão: Usar RabbitMQ para operações de escrita (CUD - Create, Update, Delete).

        Trade-off (Pró): Alta resiliência e performance percebida. O cliente envia a requisição (HTTP) ao Gateway, que a publica no RabbitMQ e retorna 201 Created ou 202 Accepted imediatamente. O processamento real (salvar no banco) acontece em background.

        Trade-off (Contra): O cliente precisa de um segundo canal (Socket.io) para receber a confirmação ou os dados atualizados quando o processamento for concluído.

    Reatividade (Socket.io):

        Decisão: Integrar o Socket.io (provavelmente no Gateway) para reatividade em tempo real.

        Trade-off (Pró): Permite uma experiência colaborativa. Quando o "Serviço de Tasks" termina de processar uma nova tarefa, ele emite um evento (via RabbitMQ) que o Gateway consome e retransmite ao cliente via WebSocket.

        Trade-off (Contra): Gerenciamento de estado de conexão e escalabilidade dos sockets (se houver múltiplas instâncias do Gateway).

⏱️ Cronograma e Tempo Gasto

O projeto foi dividido em duas fases principais (Backend e Frontend):

Dias 1-3: Backend (Fundação e Configuração)

    Scaffolding e configuração inicial do Monorepo.

    Desenvolvimento do primeiro CRUD (Register) e adaptação à arquitetura do NestJS e OOP.

    Estudo inicial da separação de responsabilidades em microsserviços.

Dia 4: Backend (Débito Técnico/Configuração)

    Foco intenso em depuração de problemas do Monorepo.

    Resolução de paths do TypeScript, módulos não encontrados e leitura de documentação para estabilizar o ambiente de desenvolvimento.

Dias 5-6: Backend (Lógica e Real-Time)

    Criação de rotas e lógicas de negócio.

    Início da análise de responsabilidade e implementação do Socket.io para comunicação em tempo real.

Dias 6-14: Frontend (Construção da UI e Integração)

    Início da interface com a implementação do fluxo de autenticação (Login/Register).

    Construção da Dashboard principal.

    Integração com o back-end para buscar dados (fetch).

    Implementação da criação da primeira Task diretamente pelo front-end.

    Implementação da rota de Update.

    Criação de um sistema simplificado de Audit Logs.

    Implementação final do cliente Socket.io para receber dados e atualizações em tempo real do back-end.

⚠️ Problemas Conhecidos e Melhorias

    Problema (Monorepo): A configuração de paths do TypeScript (tsconfig.json) no monorepo ainda pode ser frágil e exigir manutenção cuidadosa.

    Melhoria (Audit Logs): O sistema de Audit Logs atual é simplificado. Uma melhoria seria criar um microsserviço dedicado (audit-service) que apenas escuta eventos do RabbitMQ (ex: task.created, comment.added) e os registra de forma assíncrona.

    Melhoria (Testes): O projeto precisa de uma suíte de testes (unitários e E2E) para garantir a estabilidade dos microsserviços e a comunicação entre eles.

🚀 Instruções de Execução (Específicas)

Como este é um projeto em monorepo com múltiplos microsserviços, vários componentes precisam ser executados simultaneamente.

    Dependências Externas:

        Certifique-se de que o PostgreSQL e o RabbitMQ estejam em execução (ex: via Docker). docker-compose up -d

    Variáveis de Ambiente:

        Cada microsserviço (em apps/) e o Gateway precisarão de seus próprios arquivos .env(api-gateway & auth-service). 

        Certifique-se de que as credenciais do RabbitMQ e do Banco de Dados estão corretas em cada serviço.

    Instalação (Raiz):

        Instale todas as dependências do monorepo a partir da pasta raiz. npm install (ou yarn / pnpm)

    Executar o Back-end (Microsserviços):

        Você precisará de um terminal para cada serviço que deseja executar.

        (Exemplo de comando, ajuste conforme seu package.json):
    Bash

# Terminal 1: Serviço de Autenticação
npm run start:dev

# Terminal 2: Serviço de Tarefas
npm run start:dev 

# Terminal 3: Serviço de Comentários
npm run start:dev 

# Terminal 4: O Gateway
npm run start:dev
Executar o Front-end:

    Em um novo terminal, inicie a aplicação React.

Bash

# Terminal 5: Aplicação Cliente
npm run start:dev 


