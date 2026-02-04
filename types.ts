
export interface Denomination {
  value: number;
  label: string;
  color: string;
  weight: number; // Probability weight
  imageUrl: string;
}

export interface LuckHistory {
  id: string;
  amount: number;
  timestamp: number;
}
