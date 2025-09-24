import { CartItem } from "../models/cart";
import { Product } from "../models/product";
import { CartStorageService } from "./cartStorageService";
import { CartHistoryService } from "./cartHistoryService";

export class ShoppingCart {
    private items: CartItem[] = [];
    private history: any[] = [];

    async init() {
        this.items = await CartStorageService.loadCart();
    }

    private coupons: { [code: string]: number } = {
        "05%OFF": 0.05,
        "10%OFF": 0.1,
        "20%OFF": 0.2,
        "30%OFF": 0.3
    };

    async getHistory() {
        return await CartHistoryService.loadCartHistory();
    }

    async clearCartHistory() {
        this.history = [];
        return await CartHistoryService.clearCartHistory();
    }

    async addProduct(product: Product, quantity: number = 1) {
        // Checks if the product already exists in the cart by name
        const item = this.items.find(p => p.product.name === product.name);
        if (item) {
            item.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }

        await CartStorageService.saveCart(this.items); // Salve in cart.json

        await CartHistoryService.saveCartHistory({
            action: "PRODUCT_ADDED",
            product,
            quantity,
            date: new Date().toISOString()
        }); // Salve in cartHistory.json
    }

    async removeProductById(id: string) {
        const item = this.items.find(p => p.product.id === id);
        if (!item) throw new Error(`Product ${id} not found`);

        this.items = this.items.filter(p => p.product.id !== id); // Removes the item from the cart

        await CartStorageService.saveCart(this.items); // Salve in cart.json

        CartHistoryService.saveCartHistory({
            action: "PRODUCT_DELETED",
            product: item.product,
            quantity: item.quantity,
            date: new Date().toISOString()
        }); // Salve in cartHistory.json
    }

    async updateQuantity(id: string, newQuantity: number) {
        const item = this.items.find(p => p.product.id === id);
        if (!item) throw new Error(`Product ${id} not found`);

        item.quantity = newQuantity;

        await CartStorageService.saveCart(this.items); // Salve in cart.json

        CartHistoryService.saveCartHistory({
            action: "PRODUCT_QUANTITY_UPDATED",
            product: item.product,
            quantity: newQuantity,
            date: new Date().toISOString()
        }); // Salve in cartHistory.json
    }

    getProductById(id: string) {
        const item = this.items.find(p => p.product.id === id);
        return item ? item.product : null;
    }

    listProducts() {
        return this.items.map(p => ({
            id: p.product.id,
            name: p.product.name,
            category: p.product.category.name,
            price: p.product.price,
            quantity: p.quantity
        }));
    }

    calculateTotalProduct() {
        return Number(
            this.items.reduce((total, p) => total + p.product.price * p.quantity, 0).toFixed(2)
        );

    }

    calculateDiscountCoupon(coupon?: string) {
        let discountCoupon = 0;
        let total = this.calculateTotalProduct() + this.calculateShipping();

        if (coupon && this.coupons[coupon]) {
            discountCoupon = Number((total * this.coupons[coupon]).toFixed(2));
        }

        return Number(discountCoupon.toFixed(2));
    }

    calculateThresholdDiscount() {
        let discount = 0;
        let total = this.calculateTotalProduct() + this.calculateShipping()

        if (total > 1000) discount = total * 0.1;

        return Number(discount.toFixed(2));
    }

    calculateShipping() {
        const total = this.calculateTotalProduct();

        return total > 500 ? 0 : 29.99;
    }

    calculateCashback() {
        const total = this.calculateTotalProduct() + this.calculateShipping();
        let cashback = 0;   

        if (total >= 200 && total <= 499.99) cashback = total * 0.005;
        else if (total >= 500 && total <= 799.99) cashback = total * 0.01;
        else if (total >= 800) cashback = total * 0.013;
        else cashback = 0;

        return Number(cashback.toFixed(2));
    }
}

export const cart = new ShoppingCart(); // Initialize the cart