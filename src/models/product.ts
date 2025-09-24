import { v4 as uuidv4 } from 'uuid';
import { Category } from './category';  

export class Product {
  public id: string;

  constructor(
    public name: string,
    public price: number,
    public category: Category,
  ) {
    this.id = uuidv4();
  }
}