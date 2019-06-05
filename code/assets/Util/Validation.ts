export function validateCash(amount: string, previous: number): number {
  const limitedToCurrencyDecimal = limitDecimalsToCurrency(amount, previous);
  const castAmount = Number(limitedToCurrencyDecimal);
  return (castAmount || castAmount === 0) ? castAmount : previous;
}

function limitDecimalsToCurrency(num: string, previous: number): string {
  const re = new RegExp('^-?(?:\\d*\\.\\d{0,2}|\\d+)');
  const matches = num.match(re);
  return (matches && matches.length) ? matches[0] : `${previous}`;
}

export function validatePercentageToDecimal(amount: string, previous: number): number {
  const castAmount = Number(amount);
  return (castAmount || castAmount === 0) ? castAmount/100 : previous;
}

export function validateDecimal(amount: string, previous: number): number {
  const castAmount = Number(amount);
  return (castAmount || castAmount === 0) ? castAmount : previous;
}

export function validateInt(amount: string, previous: number): number {
  const castAmount = Number(amount);
  return (castAmount || castAmount === 0) ? Number(castAmount.toFixed(0)) : previous;
}

export const currencyPattern = `(-)?\\d*(\\.\\d{1,2})?`;
export const positiveCurrencyPattern = `\\d*(\\.\\d{1,2})?`;
export const percentagePattern = `\\d*(\\.\\d{0,3})?`;
export const decimalPattern = `\\d*(\\.\\d{0,3})?`;