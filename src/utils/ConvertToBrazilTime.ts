export function convertToBrazilTime(utcDate) {
  const offset = -3 * 60 * 60 * 1000;
  // Ajusta a data/hora para o fuso horário de São Paulo
  const brazilTime = new Date(utcDate.getTime() + offset);
  return brazilTime;
}