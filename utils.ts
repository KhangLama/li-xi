
import { DENOMINATIONS } from './constants';
import { Denomination } from './types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateLixiDeck = (): Denomination[] => {
  const deck: Denomination[] = [];
  
  // 1 bao × 200.000đ
  const d200 = DENOMINATIONS.find(d => d.value === 200000);
  if (d200) deck.push(d200);

  // 1 bao × 100.000đ
  const d100 = DENOMINATIONS.find(d => d.value === 100000);
  if (d100) deck.push(d100);

  // 4 bao × 50.000đ
  const d50 = DENOMINATIONS.find(d => d.value === 50000);
  if (d50) {
    for (let i = 0; i < 4; i++) deck.push(d50);
  }

  // 20 bao × 20.000đ
  const d20 = DENOMINATIONS.find(d => d.value === 20000);
  if (d20) {
    for (let i = 0; i < 20; i++) deck.push(d20);
  }

  // 10 bao x 10.000đ
  const d10 = DENOMINATIONS.find(d => d.value === 10000);
  if (d10) {
    for (let i = 0; i < 10; i++) deck.push(d10);
  }

  return shuffleArray(deck);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
