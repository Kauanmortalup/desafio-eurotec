import { Request, Response } from 'express';
import { cart } from '../services/cartService';
import { CategoryService } from '../services/categoryService';
import { Product } from '../models/product';

const categoryService = new CategoryService(); 

export class CartController {
  listProducts(req: Request, res: Response) {
    try{
      return res.status(200).json(cart.listProducts());
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  addProduct(req: Request, res: Response) {
    try {
      const { name, price, quantity, categoryName } = req.body;

      const category = categoryService.createCategory(categoryName || "Sem Categoria");

      if (!name || name.trim() === "") {
        return res.status(400).json({ erro: "Invalid Name"});
      } 
      if (!price || price <= 0) {
        return res.status(400).json({ erro: "Invalid Price"});
      }

      cart.addProduct(new Product(name, price, category), quantity);
      return res.status(201).json({ mensagem: "Product Added", cart: cart.listProducts() });
      
    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

    updateQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const productExists = cart.getProductById(id);

      if (!productExists) {
          return res.status(404).json({ erro: "Item not found in the cart" });
      } 
      if (quantity <= 0) {
          return res.status(400).json({ erro: "Invalid quantity" });
      } 

      cart.updateQuantity(id, quantity);
      return res.status(200).json({ mensagem: "Quantity updated", cart: cart.listProducts() });

    } catch (error: any) {
      return res.status(400).json({ erro: error.message });
    }
  }

  removeProductById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const productExists = cart.getProductById(id);

        if (!productExists) {
          return res.status(404).json({ erro: "Product not found in the cart" });
        }

        cart.removeProductById(id);
        return res.status(200).json({ mensagem: "Item removed", cart: cart.listProducts() });
      } catch (error: any) {
        return res.status(400).json({ erro: error.message });
    }
  }
}
