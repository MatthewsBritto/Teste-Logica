import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// Função para converter o tempo de volta em milissegundos
function tempoParaMs(tempo) {
    if (!tempo.includes(":")) return 0; // Verifica se o formato do tempo é válido
    const [minutos, segundos] = tempo.split(':');
    const [segundosInteiros, milissegundos] = segundos.split('.');
    return (parseInt(minutos) * 60 * 1000) + (parseInt(segundosInteiros) * 1000) + parseInt(milissegundos);
}

// Função para calcular a diferença de tempo entre horas
function diferencaTempo(horaInicio, horaFim) {
    const [horaI, minutoI, segundoI] = horaInicio.split(':');
    const [horaF, minutoF, segundoF] = horaFim.split(':');
    const msInicio = (parseInt(horaI) * 3600 + parseInt(minutoI) * 60 + parseFloat(segundoI)) * 1000;
    const msFim = (parseInt(horaF) * 3600 + parseInt(minutoF) * 60 + parseFloat(segundoF)) * 1000;
    return msFim - msInicio;
}

// Função para formatar o tempo total de prova em hh:mm:ss.ms
function formatarTempo(ms) {
    const horas = Math.floor(ms / 3600000);
    const minutos = Math.floor((ms % 3600000) / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const milissegundos = ms % 1000;

    // return `${horas}:${minutos}:${segundos}.${milissegundos}`;

    if (milissegundos.toLocaleString().length ==  2) {
        return `${horas}:${minutos}:${segundos}.${milissegundos}0`;
    } else {
        return `${horas}:${minutos}:${segundos}.${milissegundos}`;
    }
}

// Leitura do arquivo de log
const rl = createInterface({
    input: createReadStream('corrida.txt'),
    crlfDelay: Infinity
});

let pilotos = {};

// Processamento linha por linha
rl.on('line', (line) => {

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
});

rl.on('close', () => {

    // Calcula o tempo total de prova
    const resultados = Object.keys(pilotos).map(codigo => {
        const piloto = pilotos[codigo];
        const diferenca = diferencaTempo(piloto.horaInicio, piloto.horaFim);
        return {
            codigo,
            nome: piloto.nome,
            voltas: piloto.voltas,
            tempoTotal: diferenca
        };
    });
    
    // Ordena pelo tempo numero de voltas && pelo total de prova (comparação feita em microsegundos)
    resultados.sort((a, b) =>  a.voltas >= b.voltas && a.tempoTotal - b.tempoTotal );
    

    //Exibe o resultado da corrida
    console.log('Posição Chegada \t|\t\t Código Piloto \t Nome Piloto \t\t|\t Voltas Completadas \t|\t Tempo Total de Prova');
    resultados.forEach((piloto, index) => {
        console.log(`\t ${index + 1} \t\t|\t\t ${piloto.codigo} - \t\t ${piloto.nome} \t\t|\t\t ${piloto.voltas} \t\t|\t\t ${formatarTempo(piloto.tempoTotal)}`);
    });
});
