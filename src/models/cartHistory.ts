import { CartItem } from './cart';

export interface CartHistory {
  readonly action: string;
  readonly product: CartItem['product'];
  readonly quantity: number;
  readonly date: string;
}