<p align="center">
  <img src="resources/logo.png" alt="Open Cowork Logo" width="280" />
</p>

<h1 align="center">Open Cowork — App Desktop de Agente IA</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Plataforma-Windows%20%7C%20macOS-blue" alt="Plataforma" />
  <img src="https://img.shields.io/badge/Licença-MIT-green" alt="Licença" />
  <img src="https://img.shields.io/badge/Electron-41.x-47848F?logo=electron" alt="Electron" />
  <img src="https://img.shields.io/badge/Node.js-22+-brightgreen" alt="Node.js" />
</p>

<p align="center">
  <a href="#instalacao">⬇️ Download</a> •
  <a href="#quick-start">🚀 Primeiros Passos</a> •
  <a href="#funcionalidades">✨ Funcionalidades</a> •
  <a href="#skills">🧰 Skills</a> •
  <a href="#faq">❓ FAQ</a>
</p>

---

O Open Cowork é um app desktop gratuito e open source para Windows e macOS. Ele integra Claude, OpenAI, Gemini e outros modelos em uma interface gráfica simples — sem necessidade de programação. Principais recursos: isolamento em VM (WSL2 no Windows, Lima no macOS), Skills integradas para gerar PPTX, DOCX, XLSX e PDF, integração via MCP com navegadores e Notion, automação de interface gráfica por computer use e controle remoto via Telegram.

---

## 📋 Requisitos do Sistema

|                 | Windows                         | macOS                           |
| --------------- | ------------------------------- | ------------------------------- |
| **Sistema**     | Windows 10 / 11 (64-bit)        | macOS 12 Monterey ou superior   |
| **Arquitetura** | x64                             | Apple Silicon (M1+)             |
| **RAM**         | 4 GB mínimo, 8 GB recomendado   | 4 GB mínimo, 8 GB recomendado   |
| **Disco**       | ~500 MB livres                  | ~500 MB livres                  |
| **Node.js**     | Não necessário (incluso no app) | Não necessário (incluso no app) |

> **Sandbox (opcional, recomendado):** WSL2 no Windows, Lima no macOS — veja [Configuração de Segurança](#seguranca).

---

<a id="instalacao"></a>

## ⬇️ Download e Instalação

### macOS

**Passo 1 — Baixe o DMG**

Acesse a [página de Releases](https://github.com/Greed9797/open-cowork/releases) e baixe o arquivo `Open Cowork-<versão>-mac-arm64.dmg`.

**Passo 2 — Abra o DMG**

Dê dois cliques no arquivo `.dmg`. Arraste o **Open Cowork** para a pasta **Aplicativos**.

**Passo 3 — Libere o app no macOS (somente na primeira vez)**

Por não estar na Mac App Store, o macOS pode bloquear o app na primeira abertura. Para resolver:

1. Acesse **Configurações do Sistema → Privacidade e Segurança**
2. Role até o aviso sobre o app bloqueado
3. Clique em **Abrir Assim Mesmo**

Ou execute no Terminal para liberar permanentemente:

```bash
xattr -d com.apple.quarantine /Applications/Open\ Cowork.app
```

---

### Windows

**Passo 1 — Baixe o instalador**

Acesse a [página de Releases](https://github.com/Greed9797/open-cowork/releases) e baixe o arquivo `Open Cowork-<versão>-win-x64.exe`.

**Passo 2 — Execute o instalador**

Dê dois cliques no `.exe`. Se o Windows SmartScreen bloquear, clique em **Mais informações → Executar assim mesmo**.

**Passo 3 — Abra o app**

O Open Cowork aparece no Menu Iniciar e na Área de Trabalho. Abra e siga para os [Primeiros Passos](#quick-start).

---

### Compilar do Código-Fonte

Para desenvolvedores que querem contribuir ou criar uma build personalizada:

```bash
# Requisitos: Node.js 22+, npm 10+
git clone https://github.com/Greed9797/open-cowork.git
cd open-cowork
npm install
npm run rebuild     # recompila módulos nativos para o Electron
npm run dev         # modo dev com hot-reload
npm run build       # gera o instalador em /release
```

---

<a id="seguranca"></a>

### 🔒 Configuração de Segurança (Sandbox)

O Open Cowork oferece isolamento em múltiplos níveis para proteger seu sistema:

| Nível          | Plataforma | Tecnologia | O que faz                                         |
| -------------- | ---------- | ---------- | ------------------------------------------------- |
| **Básico**     | Todos      | Path Guard | Acesso a arquivos restrito à pasta de trabalho    |
| **Aprimorado** | Windows    | WSL2       | Todos os comandos executam dentro de uma VM Linux |
| **Aprimorado** | macOS      | Lima       | Todos os comandos executam dentro de uma VM Linux |

**macOS — ativar sandbox Lima (recomendado):**

```bash
brew install lima
# O Open Cowork detecta o Lima automaticamente e cria a VM 'claude-sandbox'
```

**Windows — ativar sandbox WSL2 (recomendado):**

Instale o WSL2 pela Microsoft: [https://docs.microsoft.com/pt-br/windows/wsl/install](https://docs.microsoft.com/pt-br/windows/wsl/install)

O Open Cowork detecta o WSL2 automaticamente — nenhuma configuração adicional é necessária.

> Se nenhuma VM estiver disponível, o app usa apenas restrição por caminho de pasta.

---

<a id="quick-start"></a>

## 🚀 Primeiros Passos

### Passo 1 — Obtenha uma Chave de API

Você precisa de uma chave de API de um provedor de IA. Opções recomendadas:

| Provedor       | Onde obter                                              | Base URL                     | Modelo recomendado            |
| -------------- | ------------------------------------------------------- | ---------------------------- | ----------------------------- |
| **Anthropic**  | [console.anthropic.com](https://console.anthropic.com/) | _(deixe em branco — padrão)_ | `claude-sonnet-4-6`           |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai/)                 | `https://openrouter.ai/api`  | `anthropic/claude-sonnet-4-6` |

> O OpenRouter permite usar vários provedores com uma única chave e cobrança por uso.

### Passo 2 — Configure o App

1. Abra o app → clique no ícone **⚙️ Configurações** (canto inferior esquerdo)
2. Cole sua **Chave de API**
3. Defina a **Base URL** se estiver usando OpenRouter (veja tabela acima)
4. Informe o nome do **Modelo**
5. Clique em **Salvar**

### Passo 3 — Escolha uma Pasta de Trabalho

Clique em **Selecionar Pasta de Trabalho** e escolha uma pasta. A IA só pode ler e escrever arquivos dentro dessa pasta.

> Crie uma pasta dedicada como `~/ai-workspace` — não aponte para toda a sua pasta pessoal.

### Passo 4 — Comece a Trabalhar

Digite um comando e pressione Enter. Exemplos:

> "Resuma todos os PDFs desta pasta em um único documento Word."

> "Leia o arquivo vendas.xlsx e crie uma apresentação PowerPoint com 5 slides mostrando as principais tendências."

> "Organize os arquivos desta pasta em subpastas por tipo e data."

---

<a id="funcionalidades"></a>

## ✨ Funcionalidades

- **Instalação em um clique** — instaladores prontos para Windows e macOS, sem precisar de terminal
- **Suporte a múltiplos modelos** — Claude, APIs compatíveis com OpenAI, Gemini, DeepSeek, Ollama (local)
- **Sistema de Skills** — fluxos prontos para gerar PPTX, DOCX, XLSX, PDF
- **Integração MCP** — conecte a navegadores, Notion e outros apps
- **Automação de interface** — controle apps desktop via computer use (recomendado: Gemini Pro)
- **Controle remoto** — envie comandos via bot do Telegram
- **Sandbox em VM** — WSL2 (Windows) e Lima (macOS) isolam todas as operações da IA
- **Entrada multimodal** — arraste imagens e arquivos direto no chat
- **Memória persistente** — a IA lembra o contexto entre sessões
- **Tarefas agendadas** — execute tarefas de IA recorrentes automaticamente

---

## 🎬 Demonstrações

### Organização de Arquivos 📂

https://github.com/user-attachments/assets/dbeb0337-2d19-4b5d-a438-5220f2a87ca7

### Gerar PPT a partir de Arquivos 📊

https://github.com/user-attachments/assets/30299ded-0260-468f-b11d-d282bb9c97f2

### Gerar Planilhas XLSX 📉

https://github.com/user-attachments/assets/f57b9106-4b2c-4747-aecd-a07f78af5dfc

### Automação de Interface Gráfica 🖥

https://github.com/user-attachments/assets/75542c76-210f-414d-8182-1da988c148f2

---

<a id="skills"></a>

## 🧰 Skills

Skills são fluxos de trabalho prontos para a IA. Ficam em `.claude/skills/` e são carregadas automaticamente conforme a necessidade.

| Skill           | O que faz                                                |
| --------------- | -------------------------------------------------------- |
| `pptx`          | Gera apresentações PowerPoint a partir de dados ou texto |
| `docx`          | Cria e edita documentos Word                             |
| `pdf`           | Lê, preenche e extrai conteúdo de PDFs                   |
| `xlsx`          | Cria e processa planilhas Excel                          |
| `skill-creator` | Cria suas próprias skills personalizadas                 |

Para adicionar uma skill personalizada, crie uma pasta em `.claude/skills/<nome>/` com um arquivo `SKILL.md` descrevendo o fluxo.

---

## 🏗️ Arquitetura

```
open-cowork/
├── src/
│   ├── main/                    # Processo principal Electron (Node.js)
│   │   ├── claude/              # Runner do agente e integração com SDK de IA
│   │   ├── config/              # Configurações e modelos
│   │   ├── db/                  # Persistência SQLite
│   │   ├── memory/              # Memória entre sessões
│   │   ├── remote/              # Controle remoto (Telegram)
│   │   ├── sandbox/             # Path guard e bridge para VM
│   │   ├── session/             # Gerenciamento de sessões
│   │   ├── skills/              # Carregador de skills
│   │   └── tools/               # Execução de ferramentas (arquivo, web, shell)
│   ├── preload/                 # Context bridge do Electron
│   └── renderer/                # Interface React + Tailwind
│       └── components/
│           ├── ChatView.tsx     # Interface principal de chat
│           ├── ConfigModal.tsx  # Painel de configurações
│           ├── Sidebar.tsx      # Navegação lateral
│           └── TracePanel.tsx   # Trace de raciocínio da IA
├── .claude/skills/              # Definições das skills padrão
├── resources/                   # Ícones e binários
├── electron-builder.yml         # Configuração de build
└── package.json
```

---

<a id="faq"></a>

## ❓ Perguntas Frequentes

**O Open Cowork é gratuito?**
Sim — licença MIT, totalmente open source. Você paga apenas pela API do modelo de IA que escolher (Anthropic, OpenRouter, etc.).

**O app envia meus dados para algum servidor?**
Não. O app roda inteiramente na sua máquina. O único tráfego externo são seus prompts indo para a API do provedor de IA que você configurou. Sem analytics, sem telemetria, sem rastreamento.

**O macOS está bloqueando o app — o que faço?**
Execute no Terminal: `xattr -d com.apple.quarantine /Applications/Open\ Cowork.app`

**O que é a pasta de trabalho?**
É a pasta que a IA tem permissão para ler e escrever. Escolha uma pasta dedicada — a IA não consegue acessar arquivos fora dela.

**Posso usar um modelo local (Ollama)?**
Sim. Nas configurações, defina a Base URL como `http://localhost:11434` e informe o nome do modelo Ollama. Certifique-se de que o Ollama está rodando localmente.

**Como funciona o sandbox?**
Com WSL2 (Windows) ou Lima (macOS) instalado, todos os comandos que a IA executa rodam dentro de uma VM Linux isolada. Mesmo que a IA cometa um erro, ela não consegue tocar nos arquivos do seu sistema fora da pasta de trabalho.

**O que são Skills?**
Skills são fluxos de trabalho prontos (PPTX, DOCX, XLSX, PDF). A IA as carrega automaticamente quando você descreve uma tarefa relacionada. Você também pode criar suas próprias skills.

**Funciona no Linux?**
Os instaladores prontos são apenas para Windows e macOS. Usuários Linux podem compilar do código-fonte.

---

## 🛠️ Contribuindo

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Faça o commit e o push
4. Abra um Pull Request

---

## 📄 Licença

MIT © Open Cowork Team — Todos os direitos reservados.

---

> Esta distribuição é mantida pelo **W3 LABS**, com base no trabalho original do time do [Open Cowork](https://github.com/OpenCoworkAI/open-cowork). Todos os direitos de propriedade intelectual pertencem ao Open Cowork Team.
