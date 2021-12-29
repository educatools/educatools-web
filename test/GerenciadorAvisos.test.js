const dbHandler = require('./BancoDeDadosTest');
const GerenciadorAvisos = require('../servicos/GerenciadorAvisos');

/** Configuração do Banco de dados em memória */
beforeAll(async() => await dbHandler.connect());
afterEach(async() => await dbHandler.clearDatabase());
afterAll(async() => await dbHandler.closeDatabase());

test('Cria aviso', async () => {
  const aviso = await GerenciadorAvisos.criaAviso(new Date("2021-03-17T03:24:00"), new Date("2021-03-18T03:24:00"), "Aviso");

  expect(aviso).not.toBeNull();
  expect(aviso._id).not.toBeNull();
  expect(aviso.dataInicial.getFullYear()).toBe(2021);
  expect(aviso.dataInicial.getMonth()).toBe(2); // inicia do index 0
  expect(aviso.dataInicial.getDate()).toBe(17);
  expect(aviso.dataFinal.getFullYear()).toBe(2021);
  expect(aviso.dataFinal.getMonth()).toBe(2); // inicia do index 0
  expect(aviso.dataFinal.getDate()).toBe(18);
  expect(aviso.mensagem).toBe("Aviso");
});

test('Altera aviso', async () => {
  const {_id:avisoId} = await GerenciadorAvisos.criaAviso(new Date("2021-03-17T03:24:00"), new Date("2021-03-18T03:24:00"), "Aviso");

  const avisoAlterado = await GerenciadorAvisos.alteraAviso(avisoId, new Date("2021-05-15T03:24:00"), new Date("2021-06-16T03:24:00"), "Aviso alterado");

  expect(avisoAlterado).not.toBeNull();
  expect(avisoAlterado._id.toString()).toBe(avisoId.toString())
  expect(avisoAlterado.dataInicial.getFullYear()).toBe(2021);
  expect(avisoAlterado.dataInicial.getMonth()).toBe(4); // inicia do index 0
  expect(avisoAlterado.dataInicial.getDate()).toBe(15);
  expect(avisoAlterado.dataFinal.getFullYear()).toBe(2021);
  expect(avisoAlterado.dataFinal.getMonth()).toBe(5); // inicia do index 0
  expect(avisoAlterado.dataFinal.getDate()).toBe(16);
  expect(avisoAlterado.mensagem).toBe("Aviso alterado");
});

test('Recupera aviso por id', async () => {
  const {_id:avisoId} = await GerenciadorAvisos.criaAviso(new Date("2021-03-17T03:24:00"), new Date("2021-03-18T03:24:00"), "Aviso");
  
  const aviso = await GerenciadorAvisos.recuperaAvisoPorId(avisoId);
  expect(aviso._id.toString()).toBe(avisoId.toString());
  expect(aviso.mensagem).toBe("Aviso");
  expect(aviso.dataInicial.getFullYear()).toBe(2021);
  expect(aviso.dataInicial.getMonth()).toBe(2); // inicia do index 0
  expect(aviso.dataInicial.getDate()).toBe(17);
  expect(aviso.dataFinal.getFullYear()).toBe(2021);
  expect(aviso.dataFinal.getMonth()).toBe(2); // inicia do index 0
  expect(aviso.dataFinal.getDate()).toBe(18);
});

test('Deleta aviso', async () => {
  const {_id:avisoId} = await GerenciadorAvisos.criaAviso(new Date("2021-03-17T03:24:00"), new Date("2021-03-18T03:24:00"), "Aviso");

  await GerenciadorAvisos.deletaAviso(avisoId);

  const aviso = await GerenciadorAvisos.recuperaAvisoPorId(avisoId);
  expect(aviso).toBeNull();
});

test('Recupera todos os avisos', async () => {
  await GerenciadorAvisos.criaAviso(new Date("2021-03-17T03:24:00"), new Date("2021-03-18T03:24:00"), "Aviso 1");
  await GerenciadorAvisos.criaAviso(new Date("2021-04-17T03:24:00"), new Date("2021-05-18T03:24:00"), "Aviso 2");

  const avisos = await GerenciadorAvisos.recuperaTodosAvisos();
  expect(avisos.length).toBe(2);
});

test('Recupera avisos válidos', async () => {
  await GerenciadorAvisos.criaAviso(new Date("2020-03-17T03:24:00"), new Date("2020-03-18T03:24:00"), "Aviso inválido");
  await GerenciadorAvisos.criaAviso(new Date("2021-01-01T03:24:00"), new Date("2021-12-31T03:24:00"), "Aviso válido");


  const avisos = await GerenciadorAvisos.recuperaAvisosValidos(new Date("2021-03-01T05:25:00"));

  expect(avisos.length).toBe(1);
  expect(avisos[0].mensagem).toBe("Aviso válido");
});