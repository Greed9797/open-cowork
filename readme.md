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

> **Qual arquivo baixar?**
>
> - Você está no **Mac com chip M1, M2 ou M3**? → Baixe o `.dmg`
> - Você está no **Windows** (qualquer versão recente)? → Baixe o `.exe`

Acesse a **[página de Releases](https://github.com/Greed9797/open-cowork/releases)**, clique na versão mais recente e baixe o arquivo correspondente ao seu sistema.

---

### 🍎 Instalação no macOS (Apple Silicon — M1/M2/M3)

#### Passo 1 — Baixe o arquivo `.dmg`

Na [página de Releases](https://github.com/Greed9797/open-cowork/releases), clique no arquivo que termina em `-mac-arm64.dmg`.

O arquivo tem cerca de **150–200 MB**. Aguarde o download terminar na pasta Downloads.

#### Passo 2 — Abra o instalador

Dê dois cliques no arquivo `.dmg` que você acabou de baixar. Uma janela vai abrir mostrando o ícone do Open Cowork e uma seta apontando para a pasta **Aplicativos**.

**Arraste o ícone do Open Cowork para a pasta Aplicativos.** Aguarde a cópia terminar (barra de progresso). Depois feche a janela e ejete o DMG (clique com botão direito no ícone do DMG na barra lateral do Finder → Ejetar).

#### Passo 3 — Primeira abertura (liberar no macOS)

Por não vir da Mac App Store, o macOS bloqueia o app na primeira vez. Você verá uma mensagem como _"Open Cowork não pode ser aberto porque é de um desenvolvedor não identificado"_.

**Método 1 — Via Configurações do Sistema (recomendado):**

1. Tente abrir o app normalmente (duplo clique nos Aplicativos)
2. O macOS vai bloquear — clique em **OK** para fechar o aviso
3. Abra **Configurações do Sistema** → **Privacidade e Segurança**
4. Role para baixo até ver a mensagem sobre o Open Cowork
5. Clique em **Abrir Assim Mesmo**
6. Confirme com sua senha de usuário

**Método 2 — Via Terminal (uma linha, permanente):**

Abra o Terminal (use Spotlight: `Cmd + Espaço`, digite "Terminal") e cole o comando abaixo:

```bash
xattr -d com.apple.quarantine /Applications/Open\ Cowork.app
```

Pressione Enter. Depois abra o app normalmente pelos Aplicativos.

#### Passo 4 — Verificar instalação

Abra o app. Você deve ver a tela de boas-vindas do Open Cowork. Se aparecer, a instalação foi concluída com sucesso.

> **Problemas comuns no macOS**
>
> - _"O arquivo está danificado"_ → Execute o Método 2 do Passo 3 acima.
> - _O app abre mas fecha imediatamente_ → Verifique se seu Mac tem chip Apple Silicon (M1+). Este build não roda em Macs Intel.
> - _Tela em branco_ → Aguarde 10–15 segundos. Na primeira abertura o app demora um pouco mais.

---

### 🪟 Instalação no Windows

#### Passo 1 — Baixe o arquivo `.exe`

Na [página de Releases](https://github.com/Greed9797/open-cowork/releases), clique no arquivo que termina em `-win-x64.exe`.

O arquivo tem cerca de **150–200 MB**. Aguarde o download terminar (pasta Downloads).

#### Passo 2 — Execute o instalador

Dê dois cliques no arquivo `.exe` baixado.

**Se o Windows SmartScreen bloquear** (tela azul com "O Windows protegeu seu computador"):

1. Clique em **Mais informações** (link azul pequeno abaixo do texto)
2. Clique no botão **Executar assim mesmo** que aparece

> Isso acontece porque o app não tem assinatura digital cara da Microsoft. É normal para apps open source. O código-fonte é público e auditável.

#### Passo 3 — Conclua a instalação

O instalador vai guiar você pelo processo:

1. Aceite o contrato de licença (MIT — uso livre)
2. Escolha a pasta de instalação (padrão: `C:\Users\<seu-nome>\AppData\Local\Programs\Open Cowork`)
3. Clique em **Instalar**
4. Aguarde a instalação terminar
5. Clique em **Concluir** — o app abre automaticamente

#### Passo 4 — Verificar instalação

O Open Cowork aparece no **Menu Iniciar** e na **Área de Trabalho**. Abra e você verá a tela de boas-vindas.

> **Problemas comuns no Windows**
>
> - _O instalador é bloqueado pelo antivírus_ → Adicione uma exceção para o arquivo `.exe` ou pasta de instalação no seu antivírus. O app é open source e seguro.
> - _"VCRUNTIME140.dll não encontrado"_ → Instale o [Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) da Microsoft.
> - _App não abre após instalação_ → Reinicie o computador e tente novamente.

---

<a id="seguranca"></a>

### 🔒 Configuração de Segurança — Sandbox (Opcional)

O sandbox isola completamente as operações da IA do restante do seu computador. **Recomendado para uso profissional.**

| Nível          | Plataforma | Tecnologia | O que protege                                    |
| -------------- | ---------- | ---------- | ------------------------------------------------ |
| **Básico**     | Todos      | Path Guard | IA acessa somente a pasta de trabalho escolhida  |
| **Aprimorado** | Windows    | WSL2       | Comandos executam dentro de uma VM Linux isolada |
| **Aprimorado** | macOS      | Lima       | Comandos executam dentro de uma VM Linux isolada |

**macOS — instalar Lima (recomendado):**

Abra o Terminal e execute:

```bash
brew install lima
```

> Se não tiver o Homebrew instalado: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`

Depois de instalar o Lima, reinicie o Open Cowork. Ele detecta automaticamente e cria a VM `claude-sandbox`.

**Windows — instalar WSL2 (recomendado):**

Abra o **PowerShell como Administrador** (clique com botão direito no Menu Iniciar → "Terminal do Windows (Admin)") e execute:

```powershell
wsl --install
```

Reinicie o computador quando solicitado. O Open Cowork detecta o WSL2 automaticamente na próxima abertura.

> Sem sandbox instalado, o app ainda funciona normalmente com restrição por pasta.

---

<a id="quick-start"></a>

## 🚀 Primeiros Passos

### Passo 1 — Obtenha uma Chave de API

Você precisa de uma chave de API de um provedor de IA. Recomendamos:

| Provedor       | Onde criar conta                                        | Base URL                     | Modelo recomendado            |
| -------------- | ------------------------------------------------------- | ---------------------------- | ----------------------------- |
| **Anthropic**  | [console.anthropic.com](https://console.anthropic.com/) | _(deixe em branco — padrão)_ | `claude-sonnet-4-6`           |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai/)                 | `https://openrouter.ai/api`  | `anthropic/claude-sonnet-4-6` |

> **Dica:** O OpenRouter aceita cartão de crédito brasileiro, cobra por uso e dá acesso a vários modelos com uma única chave. Boa opção para começar.

### Passo 2 — Configure o App

1. Abra o Open Cowork
2. Clique no ícone **⚙️** no canto inferior esquerdo (Configurações)
3. Cole sua **Chave de API** no campo correspondente
4. Se usar OpenRouter: preencha o campo **Base URL** com `https://openrouter.ai/api`
5. Preencha o campo **Modelo** com o nome do modelo (ex: `claude-sonnet-4-6`)
6. Clique em **Salvar**

### Passo 3 — Escolha uma Pasta de Trabalho

Clique em **Selecionar Pasta de Trabalho** (ou no ícone de pasta). Escolha uma pasta onde a IA terá permissão de ler e escrever arquivos.

> Crie uma pasta dedicada como `Documentos/ai-workspace`. **Não aponte para Área de Trabalho ou pasta pessoal inteira.**

### Passo 4 — Comece a Trabalhar

Digite um comando no campo de texto e pressione Enter. Exemplos para testar:

> "Crie um arquivo chamado teste.txt com um texto de boas-vindas."

> "Liste todos os arquivos desta pasta e me diga quais são os maiores."

> "Leia o arquivo vendas.xlsx e crie um PowerPoint com 5 slides resumindo os dados."

> "Organize os arquivos desta pasta em subpastas separadas por tipo (imagens, documentos, vídeos)."

---

<a id="funcionalidades"></a>

## ✨ Funcionalidades

- **Instalação em um clique** — instaladores prontos para Windows e macOS, sem precisar de terminal
- **Suporte a múltiplos modelos** — Claude, OpenAI, Gemini, DeepSeek, Ollama (local/offline)
- **Sistema de Skills** — fluxos prontos para gerar PPTX, DOCX, XLSX, PDF
- **Integração MCP** — conecte a navegadores, Notion e outros apps
- **Automação de interface** — controle apps desktop via computer use
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

Skills são fluxos de trabalho prontos. Ficam em `.claude/skills/` e são carregadas automaticamente.

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
Não. O app roda inteiramente na sua máquina. O único tráfego externo são seus prompts indo para a API do provedor de IA configurado. Sem analytics, sem telemetria, sem rastreamento.

**Qual a diferença entre Anthropic e OpenRouter?**
Anthropic é o criador do Claude — você paga direto para eles em dólar, sem intermediários. O OpenRouter é um agregador que aceita cartão brasileiro, cobra por uso e dá acesso a vários modelos (Claude, GPT, Gemini) com uma única chave.

**O macOS está bloqueando o app — o que faço?**
Abra o Terminal e execute: `xattr -d com.apple.quarantine /Applications/Open\ Cowork.app`. Depois abra o app normalmente.

**O Windows bloqueou o instalador — é seguro?**
Sim. O bloqueio do SmartScreen acontece porque o app não tem assinatura digital paga da Microsoft. O código-fonte é 100% público e auditável. Clique em "Mais informações" → "Executar assim mesmo".

**O que é a pasta de trabalho?**
É a pasta que a IA tem permissão para ler e escrever. Fora dela, a IA não consegue acessar nada. Escolha uma pasta dedicada.

**Posso usar um modelo local sem internet (Ollama)?**
Sim. Nas configurações, defina a Base URL como `http://localhost:11434` e informe o nome do modelo. Certifique-se de que o Ollama está rodando localmente.

**Como funciona o sandbox?**
Com WSL2 (Windows) ou Lima (macOS) instalado, todos os comandos executam dentro de uma VM Linux isolada. Mesmo que a IA cometa um erro, não consegue afetar arquivos fora da pasta de trabalho.

**Funciona no Linux?**
Os instaladores prontos são apenas para Windows e macOS. Usuários Linux podem compilar do código-fonte.

**Meu antivírus bloqueou o app no Windows — o que faço?**
Adicione uma exceção para a pasta de instalação do Open Cowork no seu antivírus. O app é open source — o código-fonte está disponível publicamente para verificação.

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
