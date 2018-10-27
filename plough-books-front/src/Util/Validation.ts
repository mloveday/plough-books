export function validateCash(amount: string, previous: number) {
  const limitedToCurrencyDecimal = limitDecimalsToCurrency(amount);
  const castAmount = Number(limitedToCurrencyDecimal);
  return (castAmount || castAmount === 0) ? castAmount : previous;
}

function limitDecimalsToCurrency(num: string): string {
  const re = new RegExp('^-?(?:\\d*\\.\\d{0,2}|\\d+)');
  const matches = num.match(re);
  return (matches && matches.length) ? matches[0] : "0";
}