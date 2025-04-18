# Marketplace - API

## 💻 Projeto

**[Marketplace - API](https://github.com/AdrianoTobias/marketplace-api)**, é uma aplicação com o framework NestJS, voltada ao desenvolvimento de serviços Web para um "Marketplace", o qual engloba API's REST de usuários, produtos, visualizações, categorias e métricas, além de tratativas com anexos (watched list). O projeto segue a modelagem "Domain Driven Design (DDD)" e o conceito de "Clean Architecture".

O projeto possui, ainda, autenticação e controle de acesso a rotas, bem como a implementação de testes (unitários e end-to-end).

É uma aplicação desenvolvida durante o **[MBA Fullstack](https://www.rocketseat.com.br/mba)**, provido pela **[Rocketseat](https://rocketseat.com.br/)**, em parceria com a **[Sirius Education](https://landing.sirius.education/home/)**.


## ✔️ Funcionalidades e Regras

- [x]  Deve ser possível cadastrar novos usuários
    - [x]  Deve ser feito o hash da senha do usuário
    - [x]  Não deve ser possível cadastrar usuário com e-mail duplicado
    - [x]  Não deve ser possível cadastrar usuário com telefone duplicado

- [x]  Deve ser possível atualizar os dados do usuário
    - [x]  Deve ser feito o hash da senha do usuário
    - [x]  Não deve ser possível atualizar para um e-mail duplicado
    - [x]  Não deve ser possível atualizar para um telefone duplicado

- [x]  Deve ser possível obter o token de autenticação
    - [x]  Não deve ser possível se autenticar com credenciais incorretas

- [x]  Deve ser possível realizar o upload de arquivos

- [x]  Deve ser possível criar e editar um Produto
    - [x]  Deve ser possível armazenar o valor do produto em centavos
    - [x]  Não deve ser possível criar/editar um Produto com um usuário inexistente
    - [x]  Não deve ser possível criar/editar um Produto com uma categoria inexistente
    - [x]  Não deve ser possível criar/editar um Produto com imagens inexistentes
    - [x]  Não deve ser possível editar um Produto inexistente
    - [x]  Não deve ser possível alterar um Produto de outro usuário
    - [x]  Não deve ser possível editar um Produto já vendido

- [x]  Deve ser possível obter dados de um Produto
    - [x]  Qualquer usuário deve poder obter dados do Produto
    
- [x]  Deve ser possível listar todas as categorias
    - [x]  Qualquer usuário deve poder obter a lista de categorias

- [x]  Deve ser possível listar todos os produtos por ordem de criação (mais recente)
    - [x]  Qualquer usuário deve poder obter a lista de produtos
    - [x]  Deve ser possível realizar paginação pela lista de produtos
    - [x]  Deve ser possível filtrar pelo Status
    - [x]  Deve ser possível buscar pelo título ou pela descrição do produto

- [x]  Deve ser possível listar todos os produtos de um usuário
    - [x]  Não deve ser possível listar os produtos de um usuário inexistente
    - [x]  Deve ser possível filtrar pelo Status
    - [x]  Deve ser possível buscar pelo título ou pela descrição do produto

- [x]  Deve ser possível alterar o Status do Produto
    - [x]  Não deve ser possível alterar o Status de um Produto com um usuário inexistente
    - [x]  Não deve ser possível alterar o Status de um Produto inexistente
    - [x]  Não deve ser possível alterar o Status de um Produto de outro usuário
    - [x]  Não deve ser possível marcar como Cancelado um Produto já Vendido
    - [x]  Não deve ser possível marcar como Vendido um Produto Cancelado

- [x]  Deve ser possível obter informações do perfil de um usuário
    - [x]  Não deve ser possível obter informações do perfil de um usuário inexistente
    - [x]  Não deve ser possível obter a senha do usuário

- [x]  Deve ser possível registrar uma visualização em um produto
    - [x]  Não deve ser possível registrar uma visualização em um produto inexistente
    - [x]  Não deve ser possível registrar uma visualização de um usuário inexistente
    - [x]  Não deve ser possível registrar uma visualização do próprio dono do produto
    - [x]  Não deve ser possível registrar uma visualização duplicada
    
- [x]  Métricas
    - [x]  Não deve ser possível obter métricas de usuários inexistentes
    - [x]  Deve ser possível obter a métrica de produtos vendidos nos últimos 30 dias
    - [x]  Deve ser possível obter a métrica de produtos disponíveis nos últimos 30 dias
    - [x]  Deve ser possível obter a métrica de visualizações nos últimos 30 dias
    - [x]  Deve ser possível obter a métrica de visualizações por dia dos últimos 30 dias
    - [x]  Deve ser possível obter a métrica de visualizações de um produto nos últimos 7 dias


## 🧪 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [NestJS](https://docs.nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [JWT](https://jwt.io/)
- [Zod](https://github.com/colinhacks/zod)
- [Vitest](https://vitest.dev/)


## 🚀 Como executar

Clonar o projeto e acessar a pasta do mesmo:

```bash
$ git clone https://github.com/AdrianoTobias/marketplace-api.git
$ cd marketplace-api
```

Para iniciá-lo:
```bash
# Instalar as dependências
$ npm install
```

> Esse projeto depende do [Docker](https://docs.docker.com/get-started/get-docker/) para rodar os bancos de dados. Após tê-lo instalado:

```bash
# Criar o container
$ docker compose up -d

# Criar a estrutura dos bancos de dados (aplicação e Redis)
$ npx prisma migrate dev
```

```bash
# Iniciar a aplicação
$ npm run start:dev
```
A aplicação estará disponível no endereço http://localhost:3333.

Para executar os testes:
```bash
# Iniciar os testes unitários
$ npm run test

# Iniciar os testes end-to-end
$ npm run test:e2e
```



[Adriano Tobias](https://github.com/AdrianoTobias)