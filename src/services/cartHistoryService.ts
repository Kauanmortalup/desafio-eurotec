import fs from 'fs/promises';
import path from 'path';
import { CartHistory } from '../models/cartHistory';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'cartHistory.json');

export class CartHistoryService {
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

  static async saveCartHistory(history: CartHistory) {
    try {
      await this.ensureDir();
       await this.ensureFile();

      const existingHistory = await this.loadCartHistory();
      existingHistory.push(history);

      const tmp = FILE_PATH + '.tmp';

      // First, write to the temporary file
      await fs.writeFile(tmp, JSON.stringify(existingHistory, null, 2), 'utf8');

      // Check if the temporary file actually exists before renaming
      try {
        await fs.access(tmp);
        await fs.rename(tmp, FILE_PATH);
      } catch (renameErr) {
        console.error('Error renaming tmp file:', renameErr);
        throw renameErr;
      }

    } catch (err) {
      console.error('Error saving cart history:', err);
      throw err;
    }
  }

  static async loadCartHistory(): Promise<CartHistory[]> {
    try {
      await this.ensureDir();
      await this.ensureFile();
      const data = await fs.readFile(FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (err: any) {
      if (err.code === 'ENOENT') return [];
      console.error('Error loading cart history:', err);
      return [];
    }
  }

  static async clearCartHistory() {
    try {
      await this.ensureDir();
      await this.ensureFile();
      await fs.writeFile(FILE_PATH, JSON.stringify([], null, 2), 'utf8');
    } catch (err) {
      console.error('Error clearing cart history:', err);
      throw err;
    }
  }
}
