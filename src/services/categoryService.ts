import { Category } from '../models/category';

export class CategoryService {
  private categories: Category[] = [];

  createCategory(name: string): Category {
    const existing = this.categories.find(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing; 
    }

    const newCategory = new Category(name);
    this.categories.push(newCategory);
    return newCategory;
  }

  listCategories(): Category[] {
    return this.categories;
  }
}