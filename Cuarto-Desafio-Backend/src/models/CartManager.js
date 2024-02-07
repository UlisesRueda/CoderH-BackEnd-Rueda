import { CartsService } from "../services/carts.service.js";
import { ProductsManager } from "./ProductsManager.js";
import { v4 as uuidv4 } from "uuid";

export class CartsManager {
    static #instance;

    constructor() {
        this.carts = [];
    }

    static getInstance() {
        if(!CartsManager.#instance) {
            CartsManager.#instance = new CartsManager();
        }
        return CartsManager.#instance;
    }

    async addCart(){
        try {
            this.carts = await CartsService.getInstance().readCarts();

            const newCart = {
                id: uuidv4(),
                products: []
            };

            this.carts.push(newCart);
            await CartsService.getInstance(this.path).saveCarts(this.carts);

            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            this.carts = await CartsService.getInstance().readCarts();
            const cart = this.carts.find(cart => cart.id === id);

            if(!cart) {
                throw new Error (`No se encuentra el carrito con id ${id}`);
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            this.carts = await CartsService.getInstance().readCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if(!cart) {
                throw new Error (`No se encuentra el carrito con id ${cartId}`);
            }
            await ProductsManager.getInstance().getProductById(productId);
            const product = cart.products.find(product => product.id === productId);

            if(!product) {
                cart.products.push({
                    productId: productId,
                    quantity: 1
                });
            } else {
                product.quantity++;
            }

            await CartsService.getInstance().saveCarts(this.carts);
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async removeProduct(cartId, productId) {
        try {
            this.carts = await CartsService.getInstance().readCarts();
            const cart = this.carts.find(cart => cart.id === cartId);

            if(!cart) {
                throw new Error (`No se encontró el carrito con el id ${cartId}`);
            }

            const product = cart.find(product => product.id === productId);

            if(!product) {
                throw new Error (`No se encontró el producto con id ${productId} en el carrito ${cartId}`);
            }

            if(product.quantity > 1) {
                product.quantity--
            } else {
                const index = cart.products.indexOf(product)
                cart.products.splice(index, 1);
            }

            await CartsService.getInstance().saveCarts(this.carts);
            return cart;
        } catch (error) {
            throw error;
        }
    }
}