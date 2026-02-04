
import { DENOMINATIONS } from './constants';
import { Denomination } from './types';

// Hàm xáo trộn mảng
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Tạo bộ 9 bao lì xì
export const generateLixiDeck = (): Denomination[] => {
  const deck: Denomination[] = [];
  
  // 1. Thêm chắc chắn hoặc xác suất cao các mệnh giá lớn (chỉ 1 lần)
  const bigPrizes = DENOMINATIONS.filter(d => d.value >= 500000);
  const mediumPrizes = DENOMINATIONS.filter(d => d.value >= 100000 && d.value < 500000);
  const smallPrizes = DENOMINATIONS.filter(d => d.value < 100000);

  // Thêm giải đặc biệt (xác suất xuất hiện trong deck 9 bao là 100% để người dùng thấy "có cơ hội")
  // Nhưng người dùng chỉ được chọn 1 trong 9, nên tỷ lệ trúng thực tế vẫn là 1/9
  deck.push(...bigPrizes); // Thêm 500k và 1tr vào deck (mỗi thứ 1 cái)

  // 2. Thêm các mệnh giá trung bình (100k, 200k)
  deck.push(mediumPrizes[0], mediumPrizes[1]);

  // 3. Lấp đầy phần còn lại bằng mệnh giá nhỏ (có thể lặp lại)
  while (deck.length < 9) {
    const randomSmall = smallPrizes[Math.floor(Math.random() * smallPrizes.length)];
    deck.push(randomSmall);
  }

  // 4. Xáo trộn bộ bài
  return shuffleArray(deck);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
