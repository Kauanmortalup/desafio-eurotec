import { Request, Response } from 'express';
import { cart } from '../services/cartService';


export class CartOperationsController {
    calculateTotal(req: Request, res: Response) {
        try {
            const { coupon } = req.query;
            let couponDiscount = 0;

            // Check if the coupon exists and is valid
            if (coupon) {
            couponDiscount = cart.calculateDiscountCoupon(coupon as string);
            if (couponDiscount === 0) {
                return res.status(400).json({ mensagem: "Invalid coupon" });
            }
            }

            const productValue = cart.calculateTotalProduct();
            const shipping = cart.calculateShipping();
            const thresholdDiscount = cart.calculateThresholdDiscount();
            const cashback = cart.calculateCashback();
            const total = Number((productValue + shipping - couponDiscount - thresholdDiscount - cashback).toFixed(2));

            return res.status(200).json({ productValue, shipping, couponDiscount, thresholdDiscount, cashback, total });
        } catch (error: any) {
            return res.status(400).json({ erro: error.message });
        }
    }
}