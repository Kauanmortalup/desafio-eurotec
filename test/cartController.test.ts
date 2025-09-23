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
    loadCart: jest.fn()
  }
}));

import request from "supertest";
import express from "express";
import { CartController } from "../src/controllers/cartController";
import { cart } from "../src/services/cartService";

const app = express();
app.use(express.json());

const controller = new CartController();

// Routes to test
app.post('/items', controller.addProduct);
app.delete('/items/:id', controller.removeProductById);
app.put('/items/:id', controller.updateQuantity);
app.get('/items', controller.listProducts);
app.get('/total', controller.calculateTotal);
app.get('/history', controller.getHistory);
app.delete('/history', controller.clearCartHistory);

describe("CartController", () => {
    beforeEach(async () => {
        // clear data before each test
        await request(app).delete("/history");
        cart['items'] = [];
        cart['history'] = [];
        jest.clearAllMocks();
    });

    it("Deve adicionar produto", async () => {
        const res = await request(app).post("/items").send({
        name: "Pneu A",
        price: 500,
        quantity: 2,
        category: "Veiculo",
        });

        expect(res.status).toBe(201);
        expect(res.body.cart[0].name).toBe("Pneu A");
    });

    it("Deve listar produtos", async () => {
        await request(app).post("/items").send({
        name: "Pneu B",
        price: 300,
        quantity: 1,
        category: "Veiculo",
        });

        const res = await request(app).get("/items");
        expect(res.status).toBe(200);
    });

    it("Deve remover produto existente", async () => {
        const add = await request(app).post("/items").send({
        name: "Pneu C",
        price: 200,
        quantity: 1,
        category: "Veiculo",
        });

        const id = add.body.cart[0].id;
        const res = await request(app).delete(`/items/${id}`);
        expect(res.status).toBe(200);
    });

    it("Deve retornar 404 ao remover produto inexistente", async () => {
        const res = await request(app).delete("/items/12345");
        expect(res.status).toBe(404);
    });

    it("Deve calcular total com frete grátis e descontos", async () => {
        await request(app).post("/items").send({
        name: "Pneu D",
        price: 1000,
        quantity: 2,
        category: "Veiculo",
        });

        const res = await request(app).get("/total?coupon=10%OFF");
        expect(res.status).toBe(200);
        expect(res.body.productValue).toBe(2000);
        expect(res.body.shipping).toBe(0);
        expect(res.body.couponDiscount).toBe(200);
        expect(res.body.thresholdDiscount).toBe(200);
        expect(res.body.cashback).toBe(26);
        expect(res.body.total).toBe(2000 + 0 - 200 - 200 - 26);
    });

    it("Deve atualizar quantidade", async () => {
        const add = await request(app).post("/items").send({
        name: "Pneu A",
        price: 500,
        quantity: 2,
        category: "Veiculo",
        });

        const id = add.body.cart[0].id;
        const res = await request(app).put(`/items/${id}`).send({ quantity: 5 });
        expect(res.status).toBe(200);
        expect(res.body.cart[0].quantity).toBe(5);
    });
});
