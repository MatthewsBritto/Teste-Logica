import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { diferencaTempo, formatarTempo } from './tempo.js';
import { calcularResultados, processarLinha } from './pilotos.js';

// Leitura do arquivo de log
const rl = createInterface({
    input: createReadStream('corrida.txt'),
    crlfDelay: Infinity
});

let pilotos = {};

rl.on('line', (line) => {
    processarLinha(line,pilotos);
});

rl.on('close', () => {
    const resultados =  calcularResultados(pilotos, diferencaTempo, formatarTempo); 
    
    // Verifica se o array foi gerado corretamente
    if (!resultados || resultados.length === 0) {
        console.error("Nenhum resultado foi calculado. Verifique se os dados de pilotos estão corretos.");
        console.error(pilotos); // Exibe os dados dos pilotos para depuração
        return;
    }    
    
    // // Ordena pelo tempo numero de voltas && pelo total de prova (comparação feita em microsegundos)
    resultados.sort((a, b) =>  a.voltas >= b.voltas && a.tempoTotal - b.tempoTotal );
  

  //Exibe o resultado da corrida
  console.log('Posição Chegada \t|\t\t Código Piloto \t Nome Piloto \t\t|\t Voltas  Completadas \t|\t Tempo Total de Prova');
  resultados.forEach((piloto, index) => {
      console.log(`\t ${index + 1} \t\t|\t\t ${piloto.codigo} - \t\t ${piloto.nome} \t\t|\t\t ${piloto.voltas} \t\t|\t\t ${formatarTempo(piloto.tempoTotal)}`);
  });
})