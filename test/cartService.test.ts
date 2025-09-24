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
import { Category } from "../src/models/category";

describe("ShoppingCart", () => {
  let cart: ShoppingCart;

  beforeEach(async () => {
    cart = new ShoppingCart();
    jest.clearAllMocks();
  });

    it("Should find a product by ID", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire A", 500, category);


        await cart.addProduct(product, 2);

        const productID = cart.getProductById(product.id);
        expect(productID?.id).toBe(product.id);
    });

    it("Should add a product to the cart", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire A", 500, category);

        await cart.addProduct(product, 2);

        const items = cart.listProducts();
        expect(items[0].name).toBe("Tire A");
        expect(items[0].category).toBe("Vehicle");
        expect(items[0].price).toBe(500);
        expect(items[0].quantity).toBe(2);
    });

    it("Should remove a product from the cart", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire A", 300, category);

        await cart.addProduct(product, 1);
        await cart.removeProductById(product.id);

        const items = cart.listProducts();
        expect(items.some(item => item.id === product.id)).toBe(false);
    });

    it("Should update the quantity of a product", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire C", 400, category);

        await cart.addProduct(product, 1);
        await cart.updateQuantity(product.id, 5);

        const items = cart.listProducts();
        const item = items.find(i => i.id === product.id);
        expect(item?.quantity).toBe(5);
    });

    it("Should calculate total of products", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire D", 300, category);

        await cart.addProduct(product, 2); // total = 600
        const total = cart.calculateTotalProduct();

        expect(total).toBe(600);
    });

    it("Should apply coupon discount", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire E", 100, category);

        await cart.addProduct(product, 1);

        const total = cart.calculateTotalProduct() + cart.calculateShipping();
        const discount = cart.calculateDiscountCoupon("10%OFF");
        expect(Number(discount.toFixed(2))).toBe(Number((total * 0.1).toFixed(2)));

    });

    it("Should calculate free shipping when total > 500", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire G", 700, category);

        await cart.addProduct(product, 1);
        const shipping = cart.calculateShipping();

        expect(shipping).toBe(0);
    });

    it("Should calculate shipping of 29.99 when total <= 500", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire H", 10, category);

        await cart.addProduct(product, 2);
        const shipping = cart.calculateShipping();

        expect(shipping).toBe(29.99);
    });
   
    it("Should apply discount for total over 1000", async () => {
        const category = new Category("Vehicle");
        const product = new Product("Tire F", 600, category);

        await cart.addProduct(product, 2); // total = 1200
        const discount = cart.calculateThresholdDiscount();

        expect(discount).toBe(120); // 10% de 1200
    });
});