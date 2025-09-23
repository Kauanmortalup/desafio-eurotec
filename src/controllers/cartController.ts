import { Request, Response } from 'express';
import { cart } from '../services/cartService';
import { Product } from '../models/product';

export class CartController {
  async getHistory(req: Request, res: Response) {
    try {
      const history = await cart.getHistory();
      res.status(200).json(history);
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  async clearCartHistory(req: Request, res: Response) {
    try {
      await cart.clearCartHistory();
      res.status(204).json({ mensagem: "Histórico limpo" });
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  addProduct(req: Request, res: Response) {
    try {
      const { name, price, quantity, category } = req.body;

      if (!name || name.trim() === "") {
        res.status(400).json({ erro: "Nome invalido"});
      } else if (!price || price <= 0) {
        res.status(400).json({ erro: "Preço invalido"});
      } else {
        cart.addProduct(new Product(name, price, category), quantity);
        res.status(201).json({ mensagem: "Produto adicionado", cart: cart.listProducts() });
      }

    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  removeProductById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const productExists = cart.getProductById(id);

        if (!productExists) {
          return res.status(404).json({ erro: "Produto não encontrado no carrinho" });
        }

        cart.removeProductById(id);
        return res.status(200).json({ mensagem: "Produto removido", cart: cart.listProducts() });
      } catch (error: any) {
        return res.status(400).json({ erro: error.message });
    }
  }

  listProducts(req: Request, res: Response) {
    try{
      res.status(200).json(cart.listProducts());
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  calculateTotal(req: Request, res: Response) {
    try {
      const { coupon } = req.query;
      let couponDiscount = 0;

      // Check if the coupon exists and is valid
      if (coupon) {
        couponDiscount = cart.calculateDiscountCoupon(coupon as string);
        if (couponDiscount === 0) {
          return res.status(400).json({ mensagem: "Cupom inválido" });
        }
      }

      const productValue = cart.calculateTotalProduct();
      const shipping = cart.calculateShipping();
      const thresholdDiscount = cart.calculateThresholdDiscount();
      const cashback = cart.calculateCashback();
      const total = (productValue + shipping - couponDiscount - thresholdDiscount - cashback);

      res.status(200).json({ productValue, shipping, couponDiscount, thresholdDiscount, cashback, total });
    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }

  updateQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const productExists = cart.getProductById(id);

      if (!productExists) {
          return res.status(404).json({ erro: "Produto não encontrado no carrinho" });
      } else if (quantity <= 0) {
          return res.status(400).json({ erro: "Quantidade inválida" });
      } else {
        cart.updateQuantity(id, quantity);
        res.status(200).json({ mensagem: "Quantidade alterada", cart: cart.listProducts() });
      }

    } catch (error: any) {
      res.status(400).json({ erro: error.message });
    }
  }
}
