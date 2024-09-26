import { formatarTempo, tempoParaMs } from "./tempo.js";

// Processamento linha por linha
export function processarLinha( line, pilotos ) {

  // Verifica se a linha tem conteúdo válido
  if (line.trim() === '') return;  

  const dados = line.match(/(\d{2}:\d{2}:\d{2}\.\d{3})\s+(\d{3})\s+–\s+([A-Z]\.[A-Z]+)\s+(\d+)\s+(\d{1}:\d{2}\.\d{3})\s+([\d,]+)/);
  
  // Ignora a linha se o formato não for o esperado
  if (!dados) return; 

  // Extrai os dados necessários
  const [_, hora, codigo, nome, volta, tempoVolta] = dados; 

  // Ignora se faltar alguma informação essencial
  if (!codigo || !nome || !tempoVolta) return;  

  // Cria um registro para o piloto se ainda não existir
  if (!pilotos[codigo]) {
      pilotos[codigo] = { 
          nome,
          voltas: 0,
          tempoTotal: 0,
          horaInicio: hora,
          horaFim: hora
      };
  }

  pilotos[codigo].voltas += 1;
  pilotos[codigo].tempoTotal += tempoParaMs(tempoVolta);
  pilotos[codigo].horaFim = hora;
};

export function calcularResultados(pilotos,diferencaTempo, formatarTempo) {

  // Calcula o tempo total de prova
  return Object.keys(pilotos).map(codigo => {
      const piloto = pilotos[codigo];
      const diferenca = diferencaTempo(piloto.horaInicio, piloto.horaFim);
      return {
          codigo,
          nome: piloto.nome,
          voltas: piloto.voltas,
          tempoTotal: diferenca
      };
  }); 
  
};