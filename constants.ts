
import { Denomination } from './types';

// Sử dụng proxy images.weserv.nl để đảm bảo hình ảnh có CORS tốt cho việc chụp ảnh màn hình
const proxyImg = (url: string) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=${encodeURIComponent(url)}`;

export const DENOMINATIONS: Denomination[] = [
  {
    value: 10000,
    label: '10.000 VNĐ',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    weight: 35,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-10k-768x341.jpg?v=1758621839')
  },
  {
    value: 20000,
    label: '20.000 VNĐ',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    weight: 25,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-20k-768x361.jpg?v=1758621792')
  },
  {
    value: 50000,
    label: '50.000 VNĐ',
    color: 'bg-pink-50 border-pink-200 text-pink-800',
    weight: 15,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-50k-768x359.jpg?v=1758621738')
  },
  {
    value: 100000,
    label: '100.000 VNĐ',
    color: 'bg-green-50 border-green-200 text-green-800',
    weight: 12,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-100-nghin-768x341.jpg?v=1758622260')
  },
  {
    value: 200000,
    label: '200.000 VNĐ',
    color: 'bg-red-50 border-red-200 text-red-800',
    weight: 8,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-200-nghin.jpg')
  },
  {
    value: 500000,
    label: '500.000 VNĐ',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
    weight: 4,
    imageUrl: proxyImg('https://www.anhnghethuatdulich.com/wp-content/uploads/2025/09/anh-tien-500-nghin.jpg')
  },
  {
    value: 1000000,
    label: '1.000.000 VNĐ',
    color: 'bg-amber-50 border-amber-400 text-amber-900 ring-4 ring-yellow-400',
    weight: 1,
    imageUrl: 'https://images.weserv.nl/?url=https://img.freepik.com/premium-photo/stack-gold-ingots-money-background-generative-ai_1031313-1466.jpg'
  }
];

export const TETS_WISHES = [
  "Chúc mừng năm mới Bính Ngọ 2026!",
  "Mã đáo thành công, vạn sự như ý!",
  "Năm mới sung túc, ngựa phi nước đại!",
  "Sức khỏe bền bỉ, dẻo dai như ngựa chiến!",
  "Tiền vào như nước, lộc đến đầy nhà!",
  "An khang thịnh vượng, phát tài phát lộc!"
];
