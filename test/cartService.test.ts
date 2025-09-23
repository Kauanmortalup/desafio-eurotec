// Ignore the functions
jest.mock("../src/services/cartHistoryService", () => ({
    CartHistoryService: {
        saveCartHistory: jest.fn(),
        loadCartHistory: jest.fn(),
        clearCartHistory: jest.fn()
    }
}));
jest.mock("../src/services/cartStorageService", () => ({
    CartStorageService: {
        saveCart: jest.fn(),
        loadCart: jest.fn().mockResolvedValue([])
    }
}));

import { ShoppingCart } from "../src/services/cartService";
import { Product } from "../src/models/product";

describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(async () => {
    cart = new ShoppingCart();
    jest.clearAllMocks();
  });

    it("Deve localiza produto por ID", async () => {
        const product = new Product("Pneu A", 500, "Veiculo");

        await cart.addProduct(product, 2);

        const productID = cart.getProductById(product.id);
        expect(productID?.id).toBe(product.id);
    });

    it("Deve adicionar um produto no carrinho", async () => {
        const product = new Product("Pneu A", 500, "Veiculo");

        await cart.addProduct(product, 2);

        const items = cart.listProducts();
        expect(items[0].name).toBe("Pneu A");
        expect(items[0].category).toBe("Veiculo");
        expect(items[0].price).toBe(500);
        expect(items[0].quantity).toBe(2);
    });

    it("Deve remover um produto do carrinho", async () => {
        const product = new Product("Pneu B", 300, "Veiculo");

        await cart.addProduct(product, 1);
        await cart.removeProductById(product.id);

        const items = cart.listProducts();
        expect(items.some(item => item.id === product.id)).toBe(false);
    });

    it("Deve atualizar a quantidade de um produto", async () => {
        const product = new Product("Pneu C", 400, "Veiculo");

        await cart.addProduct(product, 1);
        await cart.updateQuantity(product.id, 5);

        const items = cart.listProducts();
        const item = items.find(i => i.id === product.id);
        expect(item?.quantity).toBe(5);
    });

    it("Deve calcular o total dos produtos", async () => {
        const product = new Product("Pneu D", 300, "Veiculo");

        await cart.addProduct(product, 2); // total = 600
        const total = cart.calculateTotalProduct();

        expect(total).toBe(600);
    });

    it("Deve aplicar desconto de cupom", async () => {
        const product = new Product("Pneu E", 100, "Veiculo");

        await cart.addProduct(product, 1);

        const total = cart.calculateTotalProduct() + cart.calculateShipping();
        const discount = cart.calculateDiscountCoupon("10%OFF");
        expect(Number(discount.toFixed(2))).toBe(Number((total * 0.1).toFixed(2)));

    });

    it("Deve calcular frete grátis quando total > 500", async () => {
        const product = new Product("Pneu G", 700, "Veiculo");

        await cart.addProduct(product, 1);
        const shipping = cart.calculateShipping();

        expect(shipping).toBe(0);
    });

    it("Deve calcular frete de 29.99 quando total <= 500", async () => {
        const product = new Product("Pneu H", 10, "Veiculo");

        await cart.addProduct(product, 2);
        const shipping = cart.calculateShipping();

        expect(shipping).toBe(29.99);
    });
   
    it("Deve aplicar desconto por valor acima de 1000", async () => {
        const product = new Product("Pneu F", 600, "Veiculo");

        await cart.addProduct(product, 2); // total = 1200
        const discount = cart.calculateThresholdDiscount();

        expect(discount).toBe(120); // 10% de 1200
    });
});