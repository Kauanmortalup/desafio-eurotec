import fs from 'fs/promises';
import path from 'path';
import { CartItem } from '../models/cart';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'cart.json');

export class CartStorageService {
  private static async ensureDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  // Ensure the file exists and has valid JSON
  private static async ensureFile() {
    try {
      await fs.access(FILE_PATH);
      const content = await fs.readFile(FILE_PATH, 'utf8');
      if (!content) {
        await fs.writeFile(FILE_PATH, '[]', 'utf8');
      }
    } catch {
      await fs.writeFile(FILE_PATH, '[]', 'utf8');
    }
  }

  static async saveCart(items: CartItem[]) {
    try {
      await this.ensureDir();
      await this.ensureFile();

      const tmp = FILE_PATH + '.tmp';

      // First, write to the temporary file
      await fs.writeFile(tmp, JSON.stringify(items, null, 2), 'utf8');

      // Check if the temporary file actually exists before renaming
      try {
        await fs.access(tmp);
        await fs.rename(tmp, FILE_PATH);
      } catch (renameErr) {
        console.error('Error renaming tmp file:', renameErr);
        throw renameErr;
      }

    } catch (err) {
      console.error('Error saving cart:', err);
      throw err;
    }
  }

  static async loadCart(): Promise<CartItem[]> {
    try {
      await this.ensureDir();
      await this.ensureFile();

      const data = await fs.readFile(FILE_PATH, 'utf8');
      return JSON.parse(data) as CartItem[];
    } catch (err) {
      console.error('Error loading cart:', err);
      return [];
    }
  }
}
