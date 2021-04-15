# EducaTools

> Ferramentas e jogos para docentes

Aplicação web para a criação de recursos digitais para docentes.

## Notas de Desenvolvimento

### Configuração da Credencial no Google

1. Entrar em https://console.developers.google.com/?hl=pt-br
2. Criar um novo projeto
3. Entrar em "Biblioteca" e procurar por "Google+ API". Ative-a.
4. Entrar em APIs e Serviços e criar nova credencial do tipo "Id do Cliente OAuth"
5. Seguir até o final e pegar o ID e SECRET

### Configuração do MongoDB

1. Entrar em https://www.mongodb.com/
2. Logar com a conta
3. Criar novo projeto
4. Criar no cluster
5. Configurar novo usuário
6. Configurar conexão
7. Dentro do cluster, clicar em connect
8. Usar a URL indicada

### Configurações
As configurações de desenvolvimento devem ficar no `config.env`.
As de produção ficam como variáveis de ambiente no servidor.


## Rodar o projeto (desenvolvimento)

``` bash
# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev

# Rodar em produção
npm start
```

## Deploy

1. Garanta que os dados de PORT, MONGO_URI, GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configurados como variáveis de ambiente na plataforma.

2. Comando de deploy no máquina.

``` bash
git remote add umbler https://geonosis.deploy.umbler.com/j9oyo51j/educatools-com-br.git
git push umbler master
```

3. Se não der certo, fazer direto no painel via GitHub.