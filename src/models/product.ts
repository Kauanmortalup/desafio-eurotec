export class Product {
  public id: string;

  constructor(
    public name: string,
    public price: number,
    public category: string = "Sem Categoria"
  ) {
    this.id = this.generateId();
  }

  private generateId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
}