
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
  
  // 1. Thêm 1 bao 1 triệu (Duy nhất)
  const oneMillion = DENOMINATIONS.find(d => d.value === 1000000);
  if (oneMillion) deck.push(oneMillion);

  // 2. Thêm 1 bao 500k (Duy nhất)
  const fiveHundredK = DENOMINATIONS.find(d => d.value === 500000);
  if (fiveHundredK) deck.push(fiveHundredK);

  // 3. Thêm các mệnh giá 100k - 200k
  const mediumPrizes = DENOMINATIONS.filter(d => d.value >= 100000 && d.value < 500000);
  deck.push(mediumPrizes[0], mediumPrizes[1]); // 100k và 200k

  // 4. Lấp đầy 9 bao bằng mệnh giá nhỏ (10k, 20k, 50k)
  const smallPrizes = DENOMINATIONS.filter(d => d.value < 100000);
  while (deck.length < 9) {
    const randomSmall = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
    deck.push(randomSmall);
  }

  // 5. Xáo trộn cực mạnh
  return shuffleArray(deck);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};
