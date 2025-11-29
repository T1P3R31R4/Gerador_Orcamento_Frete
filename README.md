# 🚚 Gerador de Orçamento de Frete

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

> Uma ferramenta ágil para transportadores autônomos gerarem orçamentos profissionais e enviarem via WhatsApp em segundos.

![Preview do Projeto](./preview.png)

## 💡 Sobre o Projeto

No mercado de transporte autônomo, a informalidade muitas vezes atrapalha o fechamento de negócios. Muitos motoristas enviam preços apenas por texto, passando pouca credibilidade.

Este projeto resolve esse problema entregando uma **Single Page Application (SPA)** onde o usuário preenche os dados do serviço e a aplicação gera instantaneamente uma imagem (JPG) formatada, profissional e pronta para envio.

### 🚀 Funcionalidades Principais

- **Geração de Imagem via DOM:** Conversão de componentes HTML/React em imagem para download usando `html-to-image`.
- **Integração com API do IBGE:** Busca automática de Estados (UFs) e Cidades para evitar erros de digitação e padronizar endereços.
- **Formatação Automática (Máscaras):** - Moeda (BRL) em tempo real.
  - Telefone/WhatsApp.
- **Preview em Tempo Real:** O usuário vê exatamente como o documento ficará enquanto digita.
- **Design Responsivo:** Interface otimizada para uso em Desktop e Mobile (foco no uso em campo).

## 🛠 Tech Stack

- **Core:** React (Vite) + TypeScript
- **Estilização:** Tailwind CSS
- **APIs:** IBGE (Localidades)
- **Libs:** - `html-to-image` (Renderização de imagem)
  - `react-icons` (UI Icons)

## 📦 Como Rodar Localmente

Pré-requisitos: Node.js instalado.

```bash
# 1. Clone o repositório
git clone [https://github.com/SEU-USUARIO/gerador-orcamento-frete.git](https://github.com/SEU-USUARIO/gerador-orcamento-frete.git)

# 2. Entre na pasta do projeto
cd gerador-orcamento-frete

# 3. Instale as dependências
npm install

# 4. Rode o servidor de desenvolvimento
npm run dev
