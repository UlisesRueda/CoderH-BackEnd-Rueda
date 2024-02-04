import fs from 'fs';
import __dirname from '../utils.js';

export class ProductsService {
    static #instance;

    constructor() {
        this.path =`${__dirname}/data/productos.json`;
    }

    static getInstance() {
        if(!ProductsService.#instance) {
            ProductsService.#instance = new ProductsService();
        }
        return ProductsService.#instance;
    }

    async readProducts() {
        try {
            const response = fs.readFileSync(this.path, 'utf-8');
            const products = JSON.parse(response); 

            return products;
        } catch (error) {
            throw error;
        }
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            throw error;
        }
    }
}