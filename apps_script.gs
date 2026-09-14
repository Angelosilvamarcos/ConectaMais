const ABA = 'Pedidos';

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);

  if (!sh) sh = ss.insertSheet(ABA);

  if (sh.getLastRow() === 0) {
    sh.appendRow([
      'ID','Data/Hora de Entrada','Canal','Nome','Produto','Tipo','Problema',
      'Setor','Prioridade','Status','Resolução','Prazo (h)','Vencimento',
      'Duplicidade','Mensagem','Data/Hora da Resolução',
      'Tempo de Atendimento (h)','Observação da Gestão'
    ]);
  }
}

function doGet() {
  setup();
  return resposta({
    ok: true,
    sistema: 'Conecta Mais 4.0',
    mensagem: 'Endpoint ativo'
  });
}

function doPost(e) {
  try {
    setup();

    if (!e || !e.postData || !e.postData.contents) {
      return resposta({ok:false, erro:'Corpo da requisição vazio.'});
    }

    const dados = JSON.parse(e.postData.contents);
    const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);

    if (dados.action === 'update') {
      return atualizarPedido(dados, sh);
    }

    sh.appendRow([
      dados.id || '',
      dados.dataHora || '',
      dados.canal || 'Web',
      dados.nome || '',
      dados.produto || '',
      dados.tipo || '',
      dados.problema || '',
      dados.setor || '',
      dados.prioridade || '',
      dados.status || 'Não atendido',
      dados.resolucao || '',
      dados.prazo || '',
      dados.vencimento || '',
      dados.duplicidade ? 'SIM' : 'NÃO',
      dados.mensagem || '',
      dados.dataResolucao || '',
      dados.tempoAtendimento || '',
      dados.observacao || ''
    ]);

    return resposta({ok:true, action:'insert', id:dados.id || ''});
  } catch (erro) {
    return resposta({ok:false, erro:String(erro)});
  }
}

function atualizarPedido(dados, sh) {
  const id = String(dados.id || '').trim();
  if (!id) return resposta({ok:false, erro:'ID não informado.'});

  const lastRow = sh.getLastRow();
  if (lastRow < 2) return resposta({ok:false, erro:'Nenhum pedido cadastrado.'});

  const ids = sh.getRange(2, 1, lastRow - 1, 1).getValues();

  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) {
      const row = i + 2;

      const values = {
        4: dados.nome,
        5: dados.produto,
        6: dados.tipo,
        7: dados.problema,
        8: dados.setor,
        9: dados.prioridade,
        10: dados.status,
        11: dados.resolucao,
        12: dados.prazo,
        13: dados.vencimento,
        14: dados.duplicidade ? 'SIM' : 'NÃO',
        15: dados.mensagem,
        16: dados.dataResolucao,
        17: dados.tempoAtendimento,
        18: dados.observacao
      };

      Object.keys(values).forEach(col => {
        if (values[col] !== undefined) {
          sh.getRange(row, Number(col)).setValue(values[col]);
        }
      });

      return resposta({ok:true, action:'update', id});
    }
  }

  return resposta({ok:false, erro:'Pedido não encontrado: ' + id});
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
