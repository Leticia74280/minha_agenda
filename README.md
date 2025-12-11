# Minha Agenda - Aplicação de Contatos

Uma aplicação web moderna para gerenciamento de contatos, desenvolvida com Node.js, Express e SQLite.

## Funcionalidades

- **CRUD Completo**: Criar, Listar, Editar e Excluir contatos
- **Busca em Tempo Real**: Pesquise por nome, telefone ou email
- **Tema Escuro/Claro**: Alterne entre temas com persistência local
- **Estatísticas**: Visualize total de contatos e resultados filtrados
- **Responsivo**: Interface adaptável para mobile e desktop
- **Persistência**: Dados salvos em banco SQLite

## Tecnologias

- **Backend**: Node.js + Express
- **Banco de Dados**: SQLite3
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript
- **Containerização**: Docker + Docker Compose
- **Deploy**: Configurado para Render.com

## API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/contacts` | Lista todos os contatos |
| POST | `/api/contacts` | Cria novo contato |
| PUT | `/api/contacts/:id` | Atualiza contato existente |
| DELETE | `/api/contacts/:id` | Remove contato |

## Recursos da Interface

- **Modo Escuro**: Clique no ícone 🌙/☀️ no canto superior direito
- **Busca**: Digite no campo de pesquisa para filtrar contatos instantaneamente
- **Edição**: Clique em "Editar" para modificar um contato
- **Exclusão**: Clique em "Excluir" com confirmação de segurança
- **Estatísticas**: Visualize total de contatos e resultados da busca
---

⭐ Se este projeto foi útil, considere dar uma estrela no repositório!
