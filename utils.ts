
import { DENOMINATIONS } from './constants';
import { Denomination } from './types';

export const getRandomDenomination = (excludeValues: number[] = []): Denomination => {
  // Lọc bỏ các mệnh giá bị loại trừ (ví dụ: đã trúng giải đặc biệt rồi)
  const availableDenominations = DENOMINATIONS.filter(
    d => !excludeValues.includes(d.value)
  );
  
  // Nếu vì lý do nào đó không còn mệnh giá nào, trả về mệnh giá thấp nhất
  if (availableDenominations.length === 0) return DENOMINATIONS[0];

  const totalWeight = availableDenominations.reduce((acc, d) => acc + d.weight, 0);
  let random = Math.random() * totalWeight;

  for (const denom of availableDenominations) {
    if (random < denom.weight) {
      return denom;
    }
    random -= denom.weight;
  }

  return availableDenominations[0];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
