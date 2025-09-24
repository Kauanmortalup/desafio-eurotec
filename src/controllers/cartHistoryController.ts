import { Request, Response } from 'express';
import { cart } from '../services/cartService';


export class CartHistoryController {
    async getHistory(req: Request, res: Response) {
        try {
        const history = await cart.getHistory();
        return res.status(200).json(history);
        } catch (error: any) {
        return res.status(400).json({ erro: error.message });
        }
    }
    
    async clearCartHistory(req: Request, res: Response) {
        try {
        await cart.clearCartHistory();
        return res.status(204).json({ mensagem: "Clean history" });
        } catch (error: any) {
        return res.status(400).json({ erro: error.message });
        }
    }  
}