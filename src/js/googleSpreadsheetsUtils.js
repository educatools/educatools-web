// FIXME: Tirar o processamento da planilha do front-end

/**
 * Lê o arquivo JSON e estrutura dentro de um array de linhas
 * 
 * @param {JSON} data 
 */
function readDataToTable(data) {
  var table = [];
  var rowData = [];

  for (var r = 0; r < data.length; r++) {
    var cell = data[r]["gs$cell"];
    var val = cell["$t"];
    if (cell.col == 1) { // indica que alcançou uma nova linha
      table.push(rowData)
      rowData = [];
    }
    rowData.push(val);
  }

  return table;
}

/**
 * Estrutura um mapa onde o número da linha é chave e
 * o valor é um array com os valores nas colunas correspondentes.
 * 
 * @param {JSON} data 
 */
function readDataToTableRowMap(data, ignoreFirstColAndRow = true) {
  const tableRowMap = new Map();
  data.forEach(element => {
    const cell = element["gs$cell"];
    const {row, col, $t:content} = cell;
    const rowContent = tableRowMap.get(row);

    if(ignoreFirstColAndRow && (col == 1 || row == 1)) {
      return;
    }

    if(!rowContent) {
      tableRowMap.set(row, [content]); // cria a linha
    } else {
      tableRowMap.set(row, [...rowContent, content]); // finaliza a linha
    }
  });

  console.log("tableRowMap", tableRowMap);

  return tableRowMap;
}



/**
 * Função de callback da planilha.
 * Este nome é passado como parâmetro na URL da planilha.
 * 
 * @param {JSON} json 
 */
function doData(json) {
  var data = json.feed.entry;
  var table = readDataToTableRowMap(data);


  console.log("doData", data);
  const startTool = window.educatools.toolStart;
  startTool ? startTool(table) : alert("erro ao iniciar o jogo");
}


/**
 * Insere a tag que carrega os dados da planilha dentro do corpo da página
 * 
 * @param {String} id 
 * @param {Number} page 
 */
function includeSpreadSheetOnPage(id = null, page = 1) {
  if(!id) {
    alert("Ops! Aconteceu um erro!");
  }
  
  const scriptTag = document.createElement("script");
  var srcAttr = document.createAttribute("src");
  srcAttr.value = `https://spreadsheets.google.com/feeds/cells/${id}/${page}/public/values?alt=json-in-script&callback=doData`;
  scriptTag.setAttributeNode(srcAttr);

  // inserts into the page
  document.getElementsByTagName("body")[0].append(scriptTag);
}