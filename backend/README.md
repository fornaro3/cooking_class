# 📚 Cooking Class


## 🧾 Descrição

O Cooking Class é uma plataforma E-learning robusta, desenvolvida para o nicho de culinária, que conecta Chefs de cozinha (instrutores) a alunos. O propósito principal da aplicação é fornecer um ecossistema completo para a criação, gerenciamento, comercialização e consumo de cursos online.

A aplicação é composta por um backend, que expõe uma API RESTful, e um frontend que a consome. O sistema gerencia dois tipos principais de usuários: Chefs e Alunos, cada um com níveis de permissão distintos. A API é responsável por toda a lógica de negócio, incluindo: autenticação e autorização de usuários, gestão de conteúdo (cursos e aulas), processamento de matrículas e transações financeiras. O frontend, por sua vez, provê a interface para que os Chefs publiquem e administrem seus cursos e para que os Alunos possam adquirir e consumir o conteúdo.

## 👥 Integrantes

- Carolina Cochlar Graser  
- Erik Santiago Piana
- Maria Clara da Silva dos Santos 
- Nathan Fornaro da Silva
- Odair José Pereira de Oliveira Junior

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Node.JS
- **CMS:** Strapi
- **Banco de Dados:** SQLite
- **Front-end:** JavaScript
- **Framework/Biblioteca Frontend:** React
- **Gerenciador de Pacotes Frontend:** Node.js (npm)
- **Versionamento:** Git + GitHub

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- [Node.JS v22.16.0](https://nodejs.org/en)
- Git instalado

### Passos

```bash
# PASSOS PARA EXECUTAR A APLICAÇÃO
# 1. Clone o repositório
git clone https://github.com/usuario/repositorio

#Passos para ajustar o banco de dados
# 1. Configure a sua senha no arquivo appsettings.json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=kanbanban;user=root;password=**SuaSenha**"
  }

#Passos para executar o backend
# 1. Acesse a pasta do projeto
cd kanbanban

# 2. Restaure os pacotes
dotnet restore

# 3. Aplique as migrações do Entity Framework Core
dotnet ef database update

# 4. Execute a aplicação
dotnet run

#Agora vamos executar o frontend
# 1. Acesse a pasta correta
cd frontend

# 2. Restaure os pacostes
npm install 

# 3. Execute a aplicação
npm start