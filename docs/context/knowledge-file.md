# Torqx MVP - Knowledge File (PT-BR)

## Visão Geral do Projeto

**Nome do Projeto:** Torqx  
**Tipo:** Plataforma SaaS para Oficinas Automotivas  
**Cronograma:** Desenvolvimento do MVP em 12 semanas  
**Lançamento Alvo:** Terceiro Trimestre de 2025 (Q3 2025)

**Missão:** Revolucionar a gestão de oficinas automotivas através de ferramentas com Inteligência Artificial (IA) que simplificam operações, melhoram a experiência do cliente e impulsionam o crescimento do negócio.

**Proposta de Valor Principal:** "A força que move sua oficina" - A única plataforma de gestão para oficinas automotivas com integração nativa de IA para recomendações inteligentes de serviços, manutenção preditiva e suporte automatizado ao cliente.

**Modelo de Negócio:** SaaS B2B com arquitetura multitenant, precificação baseada em assinatura e compartilhamento de receita do marketplace (funcionalidade futura, não inclusa no MVP).

## Personas de Usuário

### Usuários Primários

**1. Dono da Oficina (Perfil: Proprietário)**
- **Perfil:** Proprietário de oficinas automotivas de pequeno a médio porte (1-20 funcionários).
- **Dores:** Processos manuais, falta de insights de negócio, dificuldade em gerenciar múltiplos aspectos da oficina.
- **Objetivos:** Aumentar receita, melhorar eficiência operacional, maior retenção de clientes.
- **Conhecimento Técnico:** Médio, prefere interfaces simples e intuitivas.
- **Funcionalidades Chave:** Dashboard de análises, relatórios financeiros, insights de IA, gestão de equipe.

**2. Gerente da Oficina (Perfil: Gerente)**
- **Perfil:** Gerente de operações responsável pelas atividades diárias da oficina.
- **Dores:** Conflitos de agendamento, gestão de estoque, comunicação com clientes.
- **Objetivos:** Otimizar alocação de recursos, reduzir tempo ocioso, melhorar satisfação do cliente.
- **Conhecimento Técnico:** Médio a alto, confortável com ferramentas digitais.
- **Funcionalidades Chave:** Otimização de agendamento, alertas de estoque, gestão de clientes, acompanhamento de ordens de serviço.

**3. Técnico Automotivo (Perfil: Técnico)**
- **Perfil:** Mecânico qualificado realizando reparos e manutenções veiculares.
- **Dores:** Instruções de serviço pouco claras, falta de informação técnica, documentação manual.
- **Objetivos:** Completar trabalhos eficientemente, acessar informações técnicas rapidamente, registrar progresso do trabalho.
- **Conhecimento Técnico:** Baixo a médio, necessita de interfaces amigáveis para mobile.
- **Funcionalidades Chave:** Atualização de ordens de serviço, assistência de diagnóstico por IA, interface mobile, documentação fotográfica.

### Usuários Secundários

**4. Proprietário do Veículo (Cliente Final)**
- **Perfil:** Pessoa física ou jurídica proprietária de veículos que necessitam de manutenção.
- **Dores:** Falta de transparência, dificuldade em encontrar oficinas confiáveis, custos inesperados.
- **Objetivos:** Serviço confiável, preços justos, agendamento conveniente, transparência.
- **Conhecimento Técnico:** Variado, espera uma experiência digital moderna.
- **Funcionalidades Chave (Pós-MVP):** Agendamento online, acompanhamento de serviço, precificação transparente, ferramentas de comunicação.

## Especificações de Funcionalidades (MVP)

### Funcionalidades Essenciais (MVP)

#### 1. Autenticação e Autorização (RBAC)
**História de Usuário:** Como dono de oficina, quero acessar os dados da minha oficina de forma segura e controlar quem pode acessar diferentes funcionalidades.

**Critérios de Aceitação:**
- Autenticação baseada em JWT com refresh tokens.
- Controle de Acesso Baseado em Função (RBAC) com 3 níveis iniciais: Proprietário, Gerente, Técnico.
- Suporte a autenticação multifator (MFA) via TOTP (Google Authenticator, Authy).
- Gerenciamento de sessão com logout automático por inatividade (configurável, padrão 30 min).
- Recuperação de senha com verificação por e-mail e token de uso único.
- Bloqueio de conta após 5 tentativas de login malsucedidas.

**Implementação Técnica:**
- Backend: Node.js + Express.js.
- Tokens JWT com validade de 15 minutos para acesso e 7 dias para refresh.
- Middleware RBAC para proteção de rotas e granularidade de permissões.
- Rate limiting para endpoints de autenticação (ex: 10 requisições/minuto por IP).
- Hash de senhas com Argon2.

**Níveis de RBAC Detalhados (MVP):**
- **Proprietário (Owner):** Acesso total. Pode gerenciar usuários, configurações da oficina, finanças, relatórios completos, e todas as funcionalidades operacionais. Único que pode gerenciar assinaturas e dados de faturamento da oficina com a Torqx.
- **Gerente (Manager):** Acesso a todas as funcionalidades operacionais (clientes, veículos, OS, estoque, agendamento). Pode gerenciar técnicos, visualizar relatórios operacionais e financeiros básicos. Não pode gerenciar usuários Proprietário ou alterar configurações críticas da oficina.
- **Técnico (Technician):** Acesso limitado a visualizar seus agendamentos, atualizar ordens de serviço atribuídas, consultar informações de veículos e clientes relacionados às suas OS. Não pode visualizar dados financeiros ou gerenciar outros usuários.

#### 2. Gestão de Clientes (CRM)
**História de Usuário:** Como gerente de oficina, quero manter registros detalhados de clientes para fornecer um serviço personalizado.

**Critérios de Aceitação:**
- CRUD completo para clientes pessoa física (PF) e jurídica (PJ).
- Validação de CPF/CNPJ com algoritmo e consulta a APIs públicas (quando disponível e legalmente permitido).
- Gerenciamento de informações de contato (múltiplos telefones e e-mails).
- Histórico completo de serviços e interações.
- Segmentação de clientes por tags personalizáveis (ex: VIP, Frota, Particular).
- Busca avançada e filtros por múltiplos campos.

**Implementação Técnica:**
- Tabela `customers` no PostgreSQL com campo JSONB para dados flexíveis (ex: `preferences`, `custom_fields`).
- Integração (opcional, dependendo da viabilidade e custo) com APIs brasileiras para validação de documentos.
- Busca full-text com `to_tsvector` do PostgreSQL para campos de texto.
- Trilha de auditoria para todas as alterações em dados de clientes.

#### 3. Gestão de Veículos
**História de Usuário:** Como técnico, quero acesso a informações completas do veículo para fornecer recomendações de serviço precisas.

**Critérios de Aceitação:**
- Cadastro de veículos com especificações técnicas (marca, modelo, ano, motor, chassi/VIN, placa).
- Validação de placa e preenchimento automático de dados básicos via API (ex: FIPE, SINESP Cidadão - verificar legalidade e disponibilidade).
- Histórico completo de manutenções e peças substituídas.
- Registro de quilometragem por visita.
- Integração (futura) com dados de recall de fabricantes.
- Alertas de manutenção preventiva baseados em tempo e quilometragem (configuráveis).

**Implementação Técnica:**
- Integração com APIs públicas (se viável) para dados veiculares.
- Campo JSONB para `technical_specs` e `maintenance_history_details`.
- Sistema de alertas automatizado com base em regras configuráveis e dados do veículo.
- Armazenamento de fotos do veículo (ex: avarias pré-existentes, após serviço).

#### 4. Ordens de Serviço (OS) com Assistente de IA
**História de Usuário:** Como gerente de oficina, quero assistência da IA para criar ordens de serviço precisas com base nas descrições de problemas dos clientes.

**Critérios de Aceitação:**
- Processamento de descrição de problemas em linguagem natural (Português-BR).
- Recomendações de serviços pela IA com base na descrição, histórico do veículo e base de conhecimento.
- Estimativa automática de tempo e custo (baseada em serviços e peças sugeridas).
- Anexo de fotos e documentos à OS (ex: fotos do problema, orçamentos externos).
- Gerenciamento de fluxo de status da OS (ex: Aberta, Em Análise, Aguardando Aprovação, Em Andamento, Concluída, Cancelada).
- Sistema de aprovação do cliente para serviços adicionais ou alterações de orçamento (notificação por e-mail/SMS).

**Implementação Técnica:**
- Integração com OpenAI GPT-4 (ou similar) para processamento de NLP.
- Base de conhecimento automotiva customizada (10.000+ sintomas e serviços relacionados).
- Modelos de Machine Learning (ML) para estimativa de custo/tempo, treinados com dados históricos (simulados inicialmente).
- Atualizações de status em tempo real com WebSockets.
- Armazenamento de arquivos em cloud (ex: AWS S3, Google Cloud Storage).

#### 5. Agendamento Inteligente
**História de Usuário:** Como gerente de oficina, quero um sistema de agendamento otimizado por IA que maximize a eficiência e a utilização de recursos.

**Critérios de Aceitação:**
- Visualização de calendário (dia, semana, mês) com drag-and-drop.
- Consideração da especialização e disponibilidade dos técnicos.
- Otimização da alocação de boxes/elevadores.
- Detecção automática de conflitos de horário.
- Registro de preferências do cliente (ex: técnico preferido, melhor horário).
- Sistema de lembretes multicanal (e-mail, SMS) configurável (ex: 24h antes, 1h antes).

**Implementação Técnica:**
- Algoritmo de otimização para alocação de recursos (pode iniciar com heurísticas simples e evoluir).
- Integração com sistema de Ordens de Serviço.
- Sistema de notificações automatizado (e-mail via SendGrid/Mailgun, SMS via Twilio/TotalVoice).
- Sincronização de calendário (futura) com Google Calendar/Outlook.

#### 6. Chatbot com IA
**História de Usuário:** Como cliente, quero interagir com um chatbot inteligente que possa me ajudar a diagnosticar problemas e agendar serviços.

**Critérios de Aceitação:**
- Compreensão de linguagem natural em Português-BR.
- Conversas de diagnóstico interativas (perguntas e respostas).
- Capacidade de agendar serviços básicos.
- Integração com a disponibilidade da oficina em tempo real.
- Transbordo para atendimento humano quando necessário (com histórico da conversa).
- Manutenção do histórico de conversas por cliente.

**Implementação Técnica:**
- OpenAI GPT-4 (ou similar) com treinamento customizado para o contexto automotivo.
- WebSockets para comunicação em tempo real.
- Integração com o sistema de Agendamento.
- Gerenciamento de estado da conversa.
- Análise de sentimento para monitorar qualidade e satisfação.

#### 7. Gestão de Estoque (Básico)
**História de Usuário:** Como gerente de oficina, quero rastrear os níveis de estoque e receber alertas para reposição.

**Critérios de Aceitação:**
- Catálogo de produtos (peças e materiais) com suporte a código de barras.
- Rastreamento de níveis de estoque (quantidade atual, mínima, máxima).
- Alertas automáticos para reposição (quando atingir nível mínimo).
- Integração (futura, pós-MVP) com fornecedores para cotação/pedidos.
- Rastreamento de uso de peças por Ordem de Serviço.
- Relatório básico de giro de estoque (ABC simplificado).

**Implementação Técnica:**
- Suporte a leitor de código de barras (via input de texto ou integração com câmera mobile no PWA).
- Movimentações de estoque automatizadas vinculadas às OS.
- Alertas por e-mail/notificação no sistema.
- Análise preditiva básica para demanda de peças (pós-MVP).

#### 8. Relatórios e Análises (Básico)
**História de Usuário:** Como dono de oficina, quero relatórios abrangentes e insights gerados por IA para tomar decisões de negócio informadas.

**Critérios de Aceitação:**
- Dashboard operacional em tempo real (OS do dia, status, receita parcial).
- Relatórios financeiros básicos (faturamento, despesas com peças, ticket médio).
- Métricas de satisfação do cliente (baseadas em avaliações pós-serviço, se implementado no MVP).
- Análise de produtividade de técnicos (OS concluídas, tempo médio).
- Insights de negócio gerados por IA (ex: serviços mais rentáveis, horários de pico).
- Capacidade de exportar relatórios (PDF, CSV/Excel).

**Implementação Técnica:**
- Agregação de dados em tempo real (ou near real-time).
- Visualização de dados com Chart.js ou similar.
- Geração de relatórios automatizada (agendada ou sob demanda).
- Modelos de ML para reconhecimento de padrões e geração de insights.
- Funcionalidade de exportação de dados.

### Funcionalidades de IA (Diferenciais)

#### 1. Manutenção Preditiva (Conceitual no MVP)
**Funcionalidade:** Analisar histórico do veículo e padrões de uso para prever necessidades de manutenção.
**Implementação no MVP:** Alertas baseados em regras (tempo/km) com sugestões de IA para próximos serviços baseados no histórico e tipo de veículo. Modelos de ML mais robustos são pós-MVP.
**Valor de Negócio:** Engajamento proativo do cliente, aumento de receita recorrente.

#### 2. Otimização Dinâmica de Preços (Pós-MVP)
**Funcionalidade:** IA sugere preços com base em condições de mercado, demanda e concorrência.
**Implementação:** Análise de mercado em tempo real e algoritmos de precificação.
**Valor de Negócio:** Margens de lucro otimizadas, posicionamento competitivo.

#### 3. Previsão de Churn de Clientes (Pós-MVP)
**Funcionalidade:** Identificar clientes em risco de evasão e sugerir estratégias de retenção.
**Implementação:** Análise comportamental e modelagem preditiva.
**Valor de Negócio:** Melhoria na retenção de clientes, aumento do LTV (Lifetime Value).

#### 4. Previsão de Demanda (Conceitual no MVP)
**Funcionalidade:** Prever padrões de demanda de serviços para melhor planejamento de recursos.
**Implementação no MVP:** Análise de histórico de serviços para identificar horários de pico e serviços mais comuns. Modelos de time series são pós-MVP.
**Valor de Negócio:** Otimização de equipe, redução de tempos de espera.

## Assets de Design

### Identidade Visual da Marca (Atualizada 2025)
**Paleta de Cores Moderna:**

**Cores Primárias (Slate):**
- Torqx Primary: `#0F172A` (RGB: 15, 23, 42) - Profissional, Sofisticado, Confiável.
- Torqx Primary Light: `#1E293B` (RGB: 30, 41, 59) - Variação mais clara para fundos.

**Cores Secundárias (Sky):**
- Torqx Secondary: `#0EA5E9` (RGB: 14, 165, 233) - Tecnológico, Moderno, Inovação.
- Torqx Secondary Light: `#38BDF8` (RGB: 56, 189, 248) - Hover states, elementos interativos.
- Torqx Secondary Dark: `#0284C7` (RGB: 2, 132, 199) - Estados ativos, CTAs importantes.

**Cores Accent (Emerald):**
- Torqx Accent: `#10B981` (RGB: 16, 185, 129) - Sucesso, Crescimento, Confirmações.
- Torqx Accent Light: `#34D399` (RGB: 52, 211, 153) - Estados de sucesso suaves.
- Torqx Accent Dark: `#059669` (RGB: 5, 150, 105) - Ações positivas importantes.

**Cores Neutras Modernas:**
- Gray 50: `#F8FAFC` - Backgrounds claros
- Gray 100: `#F1F5F9` - Borders sutis
- Gray 200: `#E2E8F0` - Dividers
- Gray 400: `#94A3B8` - Texto secundário
- Gray 600: `#475569` - Texto principal
- Gray 900: `#0F172A` - Texto escuro
- Branco: `#FFFFFF` - Branco puro

**CSS Variables:**
```css
:root {
  --torqx-primary: #0F172A;
  --torqx-primary-light: #1E293B;
  --torqx-secondary: #0EA5E9;
  --torqx-secondary-light: #38BDF8;
  --torqx-secondary-dark: #0284C7;
  --torqx-accent: #10B981;
  --torqx-accent-light: #34D399;
  --torqx-accent-dark: #059669;
}
```

**Tipografia Moderna:**
- **Primária (Headings):** **Satoshi** - Geométrica, moderna, impactante.
  - Pesos: Medium (500), Semibold (600), Bold (700), Black (800).
- **Secundária (Body):** **Inter** - Legível, profissional, versátil.
  - Pesos: Regular (400), Medium (500), Semibold (600), Bold (700).
- **Mono (Código/Dados):** **JetBrains Mono** - Para elementos técnicos.
  - Pesos: Regular (400), Medium (500), Bold (700).

**Assets de Logo:**
- Formato SVG para escalabilidade.
- Variantes PNG para diferentes fundos (com e sem slogan).
- Versões monocromáticas (positiva e negativa).
- Favicon.

### Componentes de UI (Design System Completo)
**Sistema de Design:** Configuração customizada do Tailwind CSS (v3.x) com tokens Torqx.

**Biblioteca de Componentes Padronizados:**

**Botões:**
- **Primário:** `bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all`
- **Accent:** `bg-gradient-to-r from-torqx-accent to-torqx-accent-dark text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all`
- **Secundário:** `bg-white text-torqx-primary px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-torqx-secondary transition-all`
- **Ghost:** `bg-transparent text-torqx-primary px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all`

**Cards:**
- **Básico:** `bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all`
- **Com Ícone:** Inclui ícone colorido (12x12) no topo
- **Destacado:** `bg-gradient-to-br from-torqx-primary to-torqx-primary-light text-white p-6 rounded-2xl shadow-lg`
- **Estatística:** Foco em números grandes e métricas

**Formulários:**
- **Input Padrão:** `w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-torqx-secondary focus:border-transparent transition-all`
- **Input Erro:** `border-2 border-red-300 focus:ring-red-500`
- **Input Sucesso:** `border-2 border-torqx-accent focus:ring-torqx-accent`
- **Textarea:** `resize-none` + classes do input padrão
- **Select:** Classes do input padrão

**Tabelas:**
- **Header:** `bg-gray-50 px-6 py-4 text-left text-sm font-semibold text-gray-700`
- **Row:** `px-6 py-4 hover:bg-gray-50 border-b border-gray-100`
- **Status Badges:** `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium`

**Navegação:**
- **Navbar:** `bg-white shadow-sm border-b border-gray-100`
- **Breadcrumb:** Links com `text-torqx-secondary` separados por `/`
- **Tabs:** `border-b-2 border-torqx-secondary text-torqx-secondary` para ativo
- **Paginação:** Números com `bg-torqx-secondary text-white rounded-lg` para ativo

**Estados:**
- **Loading Spinner:** `animate-spin h-8 w-8 text-torqx-secondary`
- **Skeleton:** `animate-pulse h-4 bg-gray-200 rounded`
- **Progress Bar:** `bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark`

**Modais:**
- **Container:** `fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50`
- **Content:** `bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl`

**Toast Notifications:**
- **Sucesso:** `bg-torqx-accent text-white p-4 rounded-xl shadow-lg`
- **Erro:** `bg-red-500 text-white p-4 rounded-xl shadow-lg`
- **Info:** `bg-torqx-secondary text-white p-4 rounded-xl shadow-lg`

**Ícones:** Heroicons (Outline e Solid) + conjunto customizado de ícones automotivos (SVG).
**Layout:** Sistema de grid responsivo (12 colunas) com abordagem mobile-first.

**Referência Completa:** Consultar `/torqx_design_system.html` para visualização e código de todos os componentes.

### Modos de Interface (Light/Dark Mode)
- **Light Mode (Padrão):** Fundos claros (`#FFFFFF`, `#F8FAFC`), texto escuro (`#0F172A`, `#475569`). Cores Torqx em destaque.
- **Dark Mode:** Fundos escuros (`#0F172A`, `#1E293B`), texto claro (`#F8FAFC`, `#E2E8F0`). Cores Torqx adaptadas para contraste adequado.
- **Seleção de Modo:** Toggle no perfil do usuário, persistido via `localStorage` e detecção automática de preferência do sistema (`prefers-color-scheme`).

**Implementação Dark Mode:**
```css
/* Light Mode (padrão) */
.light {
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8FAFC;
  --text-primary: #0F172A;
  --text-secondary: #475569;
}

/* Dark Mode */
.dark {
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --text-primary: #F8FAFC;
  --text-secondary: #E2E8F0;
}
```

### Responsividade
- **Mobile-First:** Design e desenvolvimento iniciam pela menor tela.
- **Breakpoints Padrão (Tailwind):**
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px
- **Elementos Adaptáveis:** Imagens, tabelas, formulários e navegação devem se ajustar fluidamente.
- **Testes:** Emuladores de dispositivos e testes em aparelhos reais.

### Arquivos Figma
- Sistema de Design Principal: [Link para o workspace Figma da Torqx]
- Mockups de Interface (Desktop e Mobile): [Link para os designs de UI]
- Diagramas de Fluxo de Usuário: [Link para os fluxogramas]

## Documentação de API (Exemplos)

### Endpoints de Autenticação

#### POST /api/auth/login
**Descrição:** Autentica o usuário e retorna tokens JWT.
**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "SenhaSegura123"
}
```
**Resposta (Sucesso 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-do-usuario",
    "email": "usuario@exemplo.com",
    "role": "gerente",
    "tenantId": "uuid-da-oficina"
  }
}
```

#### POST /api/auth/refresh
**Descrição:** Atualiza o token de acesso usando o token de refresh.
**Cabeçalhos:** `Authorization: Bearer {refreshToken}`
**Resposta (Sucesso 200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (novo token)"
}
```

### Endpoints de Gestão de Clientes

#### GET /api/customers
**Descrição:** Retorna uma lista paginada de clientes.
**Parâmetros de Query:**
- `page`: Número da página (padrão: 1).
- `limit`: Itens por página (padrão: 20).
- `search`: Termo de busca para nome/documento.
- `type`: Filtro por tipo de cliente (individual/empresa).

**Resposta (Sucesso 200):**
```json
{
  "data": [
    {
      "id": "uuid-do-cliente",
      "name": "João Silva",
      "document": "123.456.789-00",
      "email": "joao@email.com",
      "phone": "(11) 99999-9999",
      "type": "individual",
      "createdAt": "2025-06-14T10:00:00Z"
    }
    // ... mais clientes
  ],
  "pagination": {
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

#### POST /api/customers
**Descrição:** Cria um novo cliente.
**Corpo da Requisição:**
```json
{
  "name": "Maria Oliveira",
  "document": "987.654.321-00",
  "email": "maria@email.com",
  "phone": "(21) 88888-8888",
  "type": "individual",
  "address": {
    "street": "Avenida Principal, 456",
    "city": "Rio de Janeiro",
    "state": "RJ",
    "zipCode": "20000-000"
  }
}
```

### Endpoints de Integração com IA

#### POST /api/ai/diagnose
**Descrição:** Processa a descrição do problema do cliente e retorna recomendações de serviço.
**Corpo da Requisição:**
```json
{
  "description": "Meu carro está com um barulho estranho no motor quando acelero.",
  "vehicleId": "uuid-do-veiculo",
  "customerId": "uuid-do-cliente"
}
```
**Resposta (Sucesso 200):**
```json
{
  "recommendations": [
    {
      "serviceId": "uuid-servico-1",
      "serviceName": "Verificação de Correias e Tensionadores",
      "confidence": 0.85,
      "estimatedTimeMinutes": 90,
      "estimatedCost": 250.00,
      "description": "Inspeção visual e auditiva das correias do motor e seus tensionadores."
    },
    {
      "serviceId": "uuid-servico-2",
      "serviceName": "Diagnóstico Eletrônico do Motor",
      "confidence": 0.70,
      "estimatedTimeMinutes": 60,
      "estimatedCost": 180.00,
      "description": "Leitura de códigos de falha e análise de sensores do motor."
    }
  ],
  "additionalQuestions": [
    "O barulho é metálico ou um assobio?",
    "A luz de injeção está acesa no painel?"
  ]
}
```

#### POST /api/ai/chat
**Descrição:** Endpoint para conversas com o chatbot.
**Corpo da Requisição:**
```json
{
  "message": "Gostaria de agendar uma troca de óleo.",
  "conversationId": "uuid-da-conversa (opcional)",
  "context": {
    "customerId": "uuid-do-cliente (opcional)",
    "vehicleId": "uuid-do-veiculo (opcional)"
  }
}
```

## Esquema do Banco de Dados (PostgreSQL)

### Tabelas Principais

#### tenants (Global)
- Armazena informações sobre cada oficina (tenant) na plataforma.
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subdomain VARCHAR(63) UNIQUE NOT NULL, -- Usado para roteamento, ex: minhaoficina.torqx.com.br
    company_name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE, -- Formatado: XX.XXX.XXX/XXXX-XX
    email VARCHAR(255) NOT NULL, -- E-mail principal da oficina
    phone VARCHAR(20),
    address JSONB, -- { street, number, complement, neighborhood, city, state, zipCode }
    subscription_plan VARCHAR(50) DEFAULT 'mvp_basic', -- Plano de assinatura
    subscription_status VARCHAR(20) DEFAULT 'active', -- ex: active, trialing, past_due, canceled
    settings JSONB DEFAULT '{}', -- Configurações específicas do tenant (ex: logo_url, timezone, currency)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- Para soft delete
);
```

#### users (Por Tenant, em schema separado: `tenant_<tenant_id_prefix>`.users)
- Usuários de cada oficina, com suas funções e permissões.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'technician', -- 'owner', 'manager', 'technician'
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    mfa_secret VARCHAR(255), -- Segredo para autenticação multifator (TOTP)
    mfa_enabled BOOLEAN DEFAULT false,
    settings JSONB DEFAULT '{}', -- Configurações pessoais do usuário (ex: theme, notifications)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### customers (Por Tenant)
- Clientes da oficina.
```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL DEFAULT 'individual', -- 'individual' ou 'company'
    name VARCHAR(255) NOT NULL,
    document VARCHAR(18), -- CPF (XXX.XXX.XXX-XX) ou CNPJ (XX.XXX.XXX/XXXX-XX)
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    address JSONB, -- { street, number, complement, neighborhood, city, state, zipCode }
    birth_date DATE,
    notes TEXT, -- Observações gerais sobre o cliente
    tags VARCHAR(255)[], -- Array de tags para segmentação
    preferences JSONB DEFAULT '{}', -- Preferências do cliente (ex: contact_method, best_time_to_call)
    created_by UUID REFERENCES users(id), -- Usuário que criou o cliente
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### vehicles (Por Tenant)
- Veículos dos clientes.
```sql
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    license_plate VARCHAR(10) UNIQUE NOT NULL, -- Formato Mercosul ou antigo
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50),
    fuel_type VARCHAR(50), -- ex: Gasolina, Etanol, Diesel, Flex, Elétrico, Híbrido
    engine_details VARCHAR(255), -- ex: 1.6 16V Turbo
    transmission_type VARCHAR(50), -- ex: Manual, Automático, CVT
    current_mileage INTEGER DEFAULT 0,
    vin VARCHAR(17) UNIQUE, -- Número do Chassi
    technical_specs JSONB DEFAULT '{}', -- Especificações técnicas adicionais
    maintenance_schedule JSONB DEFAULT '{}', -- Cronograma de manutenção customizado/fabricante
    notes TEXT, -- Observações sobre o veículo
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

#### service_orders (Por Tenant)
- Ordens de Serviço.
```sql
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(20) UNIQUE NOT NULL, -- Gerado automaticamente, ex: OS-2025-00001
    customer_id UUID NOT NULL REFERENCES customers(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    assigned_technician_id UUID REFERENCES users(id), -- Técnico principal responsável
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- ex: scheduled, in_progress, awaiting_approval, completed, canceled
    priority VARCHAR(20) DEFAULT 'normal', -- ex: low, normal, high, urgent
    customer_complaint TEXT NOT NULL, -- Descrição do problema pelo cliente
    diagnosis_notes TEXT, -- Diagnóstico realizado pelo técnico
    estimated_completion_at TIMESTAMP WITH TIME ZONE,
    actual_completion_at TIMESTAMP WITH TIME ZONE,
    total_amount DECIMAL(12,2) DEFAULT 0.00, -- Valor total da OS (serviços + peças)
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'pending', -- ex: pending, partial, paid, overdue
    payment_method VARCHAR(50), -- ex: pix, credit_card, cash
    ai_suggestions JSONB DEFAULT '{}', -- Sugestões da IA (serviços, peças, alertas)
    photos_urls VARCHAR(500)[], -- URLs de fotos anexadas à OS
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Relacionamentos Principais
- Um `tenant` possui muitos `users`, `customers`, `vehicles`, `service_orders`.
- Um `customer` possui muitos `vehicles` e `service_orders`.
- Um `vehicle` possui muitas `service_orders`.
- Um `user` (técnico) pode ser atribuído a muitas `service_orders`.
- `service_orders` possuem muitos `service_order_items` (serviços realizados) e `inventory_usage_items` (peças utilizadas).

### Índices Importantes
```sql
-- Para performance em buscas e filtros comuns
CREATE INDEX idx_customers_document ON customers(document TEXT_PATTERN_OPS);
CREATE INDEX idx_customers_name ON customers USING gin(to_tsvector('portuguese', name));
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate TEXT_PATTERN_OPS);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_service_orders_customer_vehicle ON service_orders(customer_id, vehicle_id);
CREATE INDEX idx_users_email ON users(email TEXT_PATTERN_OPS);
```

## Configuração do Ambiente de Desenvolvimento

### Pré-requisitos
- Node.js v20.x ou superior (LTS recomendado).
- PostgreSQL v15.x ou superior.
- Redis v7.x ou superior.
- Docker e Docker Compose (recomendado para gerenciar serviços).
- Git.

### Passos de Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/suaempresa/torqx-mvp.git
   cd torqx-mvp
   ```

2. Instale as dependências (backend e frontend, se monorepo):
   ```bash
   npm install
   # ou yarn install / pnpm install
   ```

3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações locais (banco, chaves de API, etc.)
   ```

4. Inicie os serviços de desenvolvimento (PostgreSQL, Redis) via Docker Compose:
   ```bash
   docker-compose up -d postgres redis
   ```

5. Execute as migrações do banco de dados e popule com dados iniciais (seeds):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Variáveis de Ambiente Essenciais (`.env`)
```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/torqx_dev?schema=public"
REDIS_URL="redis://localhost:6379"

# Autenticação
JWT_SECRET="seu-segredo-super-secreto-para-jwt"
JWT_REFRESH_SECRET="seu-segredo-para-refresh-token"

# Serviços de IA
OPENAI_API_KEY="sua-chave-de-api-da-openai"
OPENAI_MODEL="gpt-4-turbo-preview" # ou modelo mais recente

# Armazenamento de Arquivos (ex: AWS S3)
S3_BUCKET_NAME="torqx-mvp-files"
S3_REGION="us-east-1"
AWS_ACCESS_KEY_ID="sua-chave-de-acesso-aws"
AWS_SECRET_ACCESS_KEY="seu-segredo-aws"

# E-mail Transacional (ex: SendGrid)
EMAIL_PROVIDER_API_KEY="sua-chave-de-api-do-provedor-de-email"
EMAIL_FROM_ADDRESS="nao-responda@torqx.com.br"

# Aplicação
NODE_ENV="development"
PORT=3000
FRONTEND_URL="http://localhost:3001"
API_BASE_URL="http://localhost:3000/api"
```

### Configuração do Docker Compose (`docker-compose.yml`)
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: torqx_postgres_dev
    environment:
      POSTGRES_DB: torqx_dev
      POSTGRES_USER: torqx_user
      POSTGRES_PASSWORD: torqx_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: torqx_redis_dev
    ports:
      - "6379:6379"
    volumes:
      - redis_data_dev:/data
    restart: unless-stopped

volumes:
  postgres_data_dev:
  redis_data_dev:
```

## Diretrizes de Testes

### Estratégia de Testes
- **Testes Unitários:** Cobertura de 80%+ para lógica de negócio crítica (controllers, services, utils).
- **Testes de Integração:** Endpoints da API, interações com banco de dados e serviços externos.
- **Testes End-to-End (E2E):** Fluxos de usuário críticos (ex: criação de OS, agendamento).
- **Testes de Modelos de IA:** Validação de precisão e performance (offline e online).

### Frameworks de Teste
- **Backend:** Jest + Supertest (para testes de API).
- **Frontend:** Jest + React Testing Library + Cypress (para E2E).
- **Testes de IA:** Scripts de validação customizados, `pytest` se modelos Python.

### Estrutura de Pastas de Teste (Exemplo)
```
tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   ├── auth.spec.ts
│   ├── customers.spec.ts
│   └── service-orders.spec.ts
└── ai/
    ├── nlp_validator.py
    └── recommendation_evaluator.py
```

### Executando Testes
```bash
# Testes Unitários
npm run test:unit

# Testes de Integração
npm run test:integration

# Testes E2E (requer ambiente de teste rodando)
npm run test:e2e

# Todos os testes
npm run test

# Relatório de Cobertura
npm run test:coverage
```

## Instruções de Deploy

### Ambiente de Staging (Homologação)
- **Plataforma:** AWS ECS com Fargate (ou similar: Google Cloud Run, Azure Container Apps).
- **Banco de Dados:** AWS RDS PostgreSQL (instância de desenvolvimento/teste).
- **Cache:** AWS ElastiCache Redis.
- **Armazenamento:** AWS S3.
- **CDN:** AWS CloudFront.

### Ambiente de Produção
- **Plataforma:** AWS ECS com auto-scaling e load balancing.
- **Banco de Dados:** AWS RDS PostgreSQL com Multi-AZ para alta disponibilidade.
- **Cache:** AWS ElastiCache Redis com clusterização.
- **Load Balancer:** AWS Application Load Balancer.
- **Monitoramento:** AWS CloudWatch + DataDog (ou similar: New Relic, Sentry).

### Pipeline de Deploy (CI/CD)
1. **Push de Código:** Desenvolvedor envia código para branch de feature.
2. **Pull Request (PR):** Criação de PR para `develop` ou `main` (dependendo da estratégia).
3. **Pipeline de CI:** Testes automatizados, análise de qualidade de código (SonarQube/Codacy), build da aplicação.
4. **Deploy em Staging:** Deploy automático para ambiente de staging após merge em `develop`.
5. **Testes Manuais/QA:** Validação em staging pela equipe de QA e Product Owner.
6. **Deploy em Produção:** Deploy manual (com aprovação) ou automático (com canary/blue-green) após merge em `main` ou criação de tag de release.
7. **Monitoramento Pós-Deploy:** Acompanhamento de logs e métricas para garantir estabilidade.

### Infraestrutura como Código (IaC)
- **Ferramenta:** Terraform (ou AWS CDK, Pulumi).
- **Objetivo:** Gerenciar e versionar toda a infraestrutura da nuvem.
- **Exemplo (`docker-compose.prod.yml` - simplificado, para referência de build da imagem Docker de produção):
```yaml
version: '3.8'
services:
  app:
    image: suaempresa/torqx-app:latest # Imagem Docker construída pelo pipeline de CI
    container_name: torqx_app_prod
    environment:
      NODE_ENV: production
      DATABASE_URL: ${PROD_DATABASE_URL} # Variáveis injetadas pelo orchestrator
      REDIS_URL: ${PROD_REDIS_URL}
      # ... outras variáveis de produção
    ports:
      - "3000:3000"
    # depends_on: # Em produção, o orchestrator gerencia dependências
    restart: unless-stopped
```

## Práticas de Controle de Versão (Git)

### Estratégia de Branching (Ex: GitFlow simplificado)
- **`main`:** Código estável e pronto para produção. Somente merges de `release` ou `hotfix`.
- **`develop`:** Branch de integração para features. Código deve estar sempre funcional.
- **`feature/<nome-da-feature>`:** Desenvolvimento de novas funcionalidades. Criada a partir de `develop`.
- **`hotfix/<nome-do-hotfix>`:** Correções críticas em produção. Criada a partir de `main` e mergeada em `main` e `develop`.
- **`release/<versao>`:** Preparação de releases. Criada a partir de `develop` para estabilização antes de ir para `main`.

### Convenção de Mensagens de Commit (Ex: Conventional Commits)
Formato: `tipo(escopo): descrição curta`

- **`feat`:** Nova funcionalidade (ex: `feat(auth): implementar login com MFA`).
- **`fix`:** Correção de bug (ex: `fix(api): corrigir paginação na busca de clientes`).
- **`docs`:** Alterações na documentação (ex: `docs(readme): atualizar instruções de setup`).
- **`style`:** Mudanças de formatação, sem alteração de lógica (ex: `style(users): aplicar prettier no controller`).
- **`refactor`:** Refatoração de código sem mudança de comportamento (ex: `refactor(db): otimizar query de OS`).
- **`test`:** Adição ou correção de testes (ex: `test(orders): adicionar testes unitários para criação de OS`).
- **`chore`:** Tarefas de build, dependências, etc. (ex: `chore(deps): atualizar versão do Express`).

### Diretrizes de Revisão de Código (Code Review)
- Todo código deve ser revisado por pelo menos um outro membro da equipe antes do merge.
- Testes automatizados devem passar no pipeline de CI.
- Cobertura de testes não deve diminuir.
- Análise estática de código (linting, SonarQube) deve passar.
- Considerar impacto na performance e segurança.
- Comentários construtivos e foco na qualidade do código.

### Template de Pull Request (PR)
```markdown
## Descrição
Breve descrição das alterações realizadas e o problema que resolvem.

## Tipo de Alteração
- [ ] Correção de Bug (non-breaking change que corrige um problema)
- [ ] Nova Funcionalidade (non-breaking change que adiciona funcionalidade)
- [ ] Breaking Change (correção ou funcionalidade que pode causar incompatibilidade com versões anteriores)
- [ ] Documentação
- [ ] Refatoração

## Testes Realizados
- [ ] Testes unitários adicionados/atualizados
- [ ] Testes de integração adicionados/atualizados
- [ ] Testes E2E adicionados/atualizados
- [ ] Testes manuais realizados (descrever cenários)

## Checklist
- [ ] Meu código segue as diretrizes de estilo do projeto.
- [ ] Realizei uma auto-revisão do meu próprio código.
- [ ] Comentei meu código, particularmente em áreas de difícil compreensão.
- [ ] Minhas alterações não geram novos warnings ou erros de lint.
- [ ] A documentação relevante foi atualizada.

## Screenshots (se aplicável)
(Adicionar screenshots/GIFs para alterações visuais)
```

## Práticas de Segurança

### Autenticação e Autorização
- Tokens JWT com expiração curta (15 minutos) e rotação de refresh tokens.
- Suporte obrigatório a MFA para usuários com privilégios elevados (Proprietário, Gerente).
- RBAC granular e auditável.
- Gerenciamento de sessão seguro com logout automático e invalidação de sessão no servidor.

### Proteção de Dados
- Criptografia em repouso (AES-256) para dados sensíveis no banco de dados.
- Criptografia em trânsito (TLS 1.3) para toda comunicação API e web.
- Mascaramento de dados PII (Informações Pessoais Identificáveis) em logs e ambientes de não produção.
- Gerenciamento seguro de chaves de criptografia (ex: AWS KMS, HashiCorp Vault).
- Auditorias de segurança regulares (internas e externas, se possível).

### Segurança de API
- Rate limiting em todos os endpoints para prevenir abuso.
- Validação e sanitização de todas as entradas de dados (input validation).
- Prevenção de SQL Injection (uso de ORM com queries parametrizadas).
- Proteção contra XSS (Cross-Site Scripting) e CSRF (Cross-Site Request Forgery).
- Configuração adequada de CORS (Cross-Origin Resource Sharing).
- Cabeçalhos de segurança HTTP (HSTS, CSP, X-Frame-Options, etc.).

### Segurança de Infraestrutura
- Uso de VPC (Virtual Private Cloud) com subnets privadas para serviços de backend.
- Security Groups e Network ACLs com princípio de menor privilégio.
- Atualizações de segurança regulares para SO e dependências.
- Varredura de vulnerabilidades automatizada (ex: OWASP ZAP, Trivy).
- Sistema de detecção de intrusão (IDS/IPS).
- Criptografia de backups.

## Requisitos de Conformidade

### LGPD (Lei Geral de Proteção de Dados - Brasil)
- **Minimização de Dados:** Coletar apenas os dados pessoais estritamente necessários para a finalidade informada.
- **Gerenciamento de Consentimento:** Obter consentimento explícito e granular para o processamento de dados pessoais. Manter registro dos consentimentos.
- **Direito de Acesso:** Permitir que os titulares visualizem seus dados pessoais armazenados.
- **Direito de Retificação:** Permitir que os titulares corrijam dados incorretos ou desatualizados.
- **Direito de Exclusão (Direito ao Esquecimento):** Permitir que os titulares solicitem a exclusão de seus dados, respeitando as exceções legais.
- **Portabilidade de Dados:** Fornecer os dados do titular em formato estruturado e interoperável, caso solicitado.
- **Privacidade desde a Concepção (Privacy by Design) e por Padrão (Privacy by Default):** Incorporar proteção de dados em todas as fases do desenvolvimento e configurar padrões de privacidade restritivos.

### Implementação da LGPD
- Sistema de rastreamento de consentimento.
- Políticas de retenção de dados e anonimização/pseudoanonimização.
- Trilha de auditoria para todos os acessos e modificações de dados pessoais.
- Relatórios de Impacto à Proteção de Dados Pessoais (RIPD) para processos de alto risco.
- Designação de um Encarregado de Proteção de Dados (DPO), mesmo que terceirizado.
- Procedimentos de resposta a incidentes de segurança que envolvam dados pessoais.

### Padrões da Indústria Automotiva (Considerações Futuras)
- **ISO 27001:** Sistema de gestão de segurança da informação (SGSI).
- **SOC 2 Tipo II:** Controles de segurança, disponibilidade, integridade de processamento, confidencialidade e privacidade.
- **PCI DSS:** Padrão de segurança de dados para a indústria de cartões de pagamento (se a Torqx processar pagamentos diretamente).

## Documentação dos Modelos de IA

### Processamento de Linguagem Natural (NLP)
- **Modelo Base:** OpenAI GPT-4 (ou versão mais recente otimizada para custo/performance).
- **Dados de Treinamento/Fine-tuning (se aplicável):** Base de conhecimento com sintomas automotivos, termos técnicos, e diálogos de atendimento (mais de 10.000 entradas iniciais, em constante expansão).
- **Idiomas Suportados:** Português do Brasil.
- **Meta de Precisão:** 90%+ para recomendações de serviço baseadas em descrição de problemas.
- **Tempo de Resposta:** Média < 2 segundos para interações típicas.

### Motor de Recomendações
- **Algoritmos:** Filtragem colaborativa (baseada no comportamento de usuários/oficinas similares) e filtragem baseada em conteúdo (características do veículo, histórico de serviços).
- **Dados de Treinamento:** Ordens de serviço históricas, comportamento do cliente, avaliações de serviços.
- **Frequência de Atualização:** Retreinamento semanal dos modelos com novos dados.
- **Testes A/B:** Otimização contínua dos algoritmos de recomendação.
- **Fallback:** Recomendações baseadas em regras para cenários com poucos dados.

### Análises Preditivas (Manutenção, Demanda)
- **Modelos:** Séries temporais (ARIMA, Prophet) para previsão de demanda; Classificação/Regressão (Random Forest, Gradient Boosting) para manutenção preditiva.
- **Features Utilizadas:** Idade do veículo, quilometragem, histórico de serviços, padrões de uso, dados sazonais.
- **Predições:** Necessidades de manutenção, falhas prováveis de componentes, picos de demanda de serviços.
- **Validação:** Validação cruzada com dados históricos, backtesting.

### Monitoramento de Performance dos Modelos de IA
- **Métricas:** Acurácia, precisão, recall, F1-score, AUC-ROC (para classificação); MAE, RMSE (para regressão).
- **Monitoramento:** Dashboards em tempo real para performance dos modelos.
- **Alertas:** Notificações automáticas para degradação de performance ou desvios significativos (data drift, concept drift).
- **Loop de Feedback:** Integração de feedback dos usuários (ex: se a recomendação foi útil) para melhoria contínua.

## Regras de Negócio (Exemplos)

### Fluxo de Ordem de Serviço
1. **Criação:** Queixa do cliente → Análise IA → Recomendações de serviços e peças.
2. **Orçamento:** Geração de orçamento detalhado → Envio para aprovação do cliente.
3. **Aprovação:** Cliente aprova (ou solicita revisão) via portal/e-mail/chat. Aprovação do gerente da oficina para descontos > X%.
4. **Atribuição:** Atribuição automática (ou manual) do técnico com base na especialização e disponibilidade.
5. **Execução:** Técnico atualiza progresso, adiciona fotos, solicita peças ao estoque.
6. **Controle de Qualidade:** Verificação interna (opcional, configurável) antes da finalização.
7. **Finalização:** Notificação ao cliente → Processamento do pagamento → Entrega do veículo.

### Regras de Precificação
- **Preços Base:** Tabela de preços padrão para serviços e mão de obra (configurável pela oficina).
- **Precificação Dinâmica (Pós-MVP):** IA sugere ajustes com base na demanda, dia/horário, complexidade.
- **Descontos:** Programa de fidelidade, pacotes de serviços, campanhas promocionais. Hierarquia de aprovação para descontos.

### Gestão de Estoque
- **Pontos de Reposição:** Alertas automáticos quando o estoque atinge o nível mínimo configurado.
- **Seleção de Fornecedores (Pós-MVP):** Lista de fornecedores preferenciais com integração para cotação/pedidos.
- **Controle de Qualidade:** Inspeção de recebimento para peças críticas.
- **Obsolescência:** Revisão trimestral de itens de baixo giro ou obsoletos.

### Comunicação com o Cliente
- **Notificações:** Atualizações automáticas via e-mail, SMS e notificações push (PWA) sobre status da OS, agendamentos, promoções.
- **Preferências:** Cliente define canais de comunicação preferidos.
- **Escalonamento:** Alertas para a equipe da oficina se respostas a clientes estiverem demorando.
- **Feedback:** Pesquisas de satisfação automatizadas após a conclusão do serviço.

Este arquivo de conhecimento serve como guia central para o desenvolvimento do MVP da Torqx, assegurando que todos os membros da equipe possuam acesso às mesmas informações e contexto para práticas de desenvolvimento consistentes e alinhadas com os objetivos do projeto.



## Diretrizes de Desenvolvimento com Design System

### Para IAs e Desenvolvedores

**Sempre Consultar:**
- `/torqx_design_system.html` - Página completa com todos os componentes visuais
- `/torqx_design_system_guide.md` - Guia de implementação e boas práticas

**Padrões Obrigatórios:**
1. **Cores:** Usar apenas as cores da paleta Torqx definida
2. **Tipografia:** Satoshi para headings, Inter para body text
3. **Componentes:** Reutilizar componentes do design system
4. **Responsividade:** Mobile-first sempre
5. **Estados:** Incluir hover, focus, disabled em todos os elementos interativos

**Classes Tailwind Customizadas:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'torqx-primary': '#0F172A',
        'torqx-primary-light': '#1E293B',
        'torqx-secondary': '#0EA5E9',
        'torqx-secondary-light': '#38BDF8',
        'torqx-secondary-dark': '#0284C7',
        'torqx-accent': '#10B981',
        'torqx-accent-light': '#34D399',
        'torqx-accent-dark': '#059669'
      },
      fontFamily: {
        'satoshi': ['Satoshi', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      }
    }
  }
}
```

**Componentes Reutilizáveis (React/Next.js):**
```jsx
// Button.jsx
const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseClasses = 'font-semibold rounded-xl transition-all';
  const variants = {
    primary: 'bg-gradient-to-r from-torqx-secondary to-torqx-secondary-dark text-white hover:shadow-lg',
    accent: 'bg-gradient-to-r from-torqx-accent to-torqx-accent-dark text-white hover:shadow-lg',
    secondary: 'bg-white text-torqx-primary border-2 border-gray-200 hover:border-torqx-secondary',
    ghost: 'bg-transparent text-torqx-primary hover:bg-gray-100'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Card.jsx
const Card = ({ variant = 'basic', children, className = '' }) => {
  const variants = {
    basic: 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all',
    highlighted: 'bg-gradient-to-br from-torqx-primary to-torqx-primary-light text-white p-6 rounded-2xl shadow-lg',
    stat: 'bg-white p-6 rounded-2xl shadow-sm border border-gray-100'
  };
  
  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
```

**Checklist de Qualidade Visual:**
- [ ] Usa cores da paleta Torqx
- [ ] Tipografia Satoshi/Inter aplicada
- [ ] Border radius consistente (8px, 12px, 16px, 24px)
- [ ] Sombras padronizadas (shadow-sm, shadow-lg, shadow-xl)
- [ ] Espaçamento consistente (4px, 8px, 12px, 16px, 24px, 32px)
- [ ] Estados hover/focus/disabled implementados
- [ ] Responsividade mobile-first
- [ ] Transições suaves (transition-all)
- [ ] Contraste adequado para acessibilidade
- [ ] Componentes reutilizáveis do design system

**Exemplo de Página Completa:**
```jsx
// Dashboard.jsx
import { Button, Card } from '@/components/ui';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-torqx-secondary to-torqx-secondary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="ml-3 text-xl font-bold text-torqx-primary font-satoshi">Torqx</span>
            </div>
            <Button variant="primary">Nova OS</Button>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card variant="stat">
            <div className="text-3xl font-bold text-torqx-primary font-satoshi">R$ 45.2k</div>
            <div className="text-gray-600 font-inter">Receita mensal</div>
          </Card>
          {/* Mais cards... */}
        </div>
      </main>
    </div>
  );
};
