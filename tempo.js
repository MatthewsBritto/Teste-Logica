export function tempoParaMs(tempo) {
  if (!tempo.includes(":")) return 0; // Verifica se o formato do tempo é válido
  const [minutos, segundos] = tempo.split(':');
  const [segundosInteiros, milissegundos] = segundos.split('.');
  return (parseInt(minutos) * 60 * 1000) + (parseInt(segundosInteiros) * 1000) + parseInt(milissegundos);
}

// Função para calcular a diferença de tempo entre horas
export function diferencaTempo(horaInicio, horaFim) {
  const [horaI, minutoI, segundoI] = horaInicio.split(':');
  const [horaF, minutoF, segundoF] = horaFim.split(':');
  const msInicio = (parseInt(horaI) * 3600 + parseInt(minutoI) * 60 + parseFloat(segundoI)) * 1000;
  const msFim = (parseInt(horaF) * 3600 + parseInt(minutoF) * 60 + parseFloat(segundoF)) * 1000;
  return msFim - msInicio;
}

// Função para formatar o tempo total de prova em hh:mm:ss.ms
export function formatarTempo(ms) {
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
