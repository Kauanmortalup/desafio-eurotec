# Desafio Eurotec – Sistema de Carrinho de Compras

API RESTful desenvolvida com **Node.js**, **Express** e **TypeScript**, que permite gerenciar de forma eficiente um carrinho de compras, com persistência de dados em arquivos JSON. A aplicação é containerizada com Docker e possui testes automatizados com Jest.

## Funcionalidades

- Adicionar, atualizar e remover itens do carrinho
- Calcular total do carrinho, incluindo descontos e frete grátis
- Armazenamento seguro do carrinho e do histórico em arquivos JSON
- Criação automática de arquivos e diretórios se não existirem
- Estrutura modularizada para fácil manutenção
- Testes automatizados com Jest

## Tecnologias

- Node.js
- Express
- TypeScript
- Jest (testes automatizados)
- Docker

## Como rodar localmente com Docker

1. Clone o repositório:
git clone https://github.com/Kauanmortalup/Desafio-Eurotec.git


2. Build e execute o container Docker:

- docker build -t desafio-eurotec .
- docker run --rm desafio-eurotec npm test           (RODAS OS TESTES)
- docker run -p 3000:3000 desafio-eurotec


3.  A aplicação estará disponível em:
http://localhost:3000


4.  Use o Postman ou qualquer cliente HTTP para testar os endpoints:

PRODUTO NO CARRINHO
- POST /items → Adiciona produto no carrinho
- GET /items → Listar produtos do carrinho
- PUT /items/:id → Atualizar quantidade de produto do carrinho
- DELETE /items/:id → Deletar produto do carrinho

OPERAÇÕES DO CARRINHO
- GET /total → Calcular valor do carrinho (considerando frete e descontos)

HISTORICO DO CARRINHO
- GET /history → Listar historico do carrinho
- DELETE /history → Deletar historico do carrinho

Exemplo rota completa http://localhost:3000/cart/items
