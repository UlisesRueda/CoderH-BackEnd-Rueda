import fs from 'fs';
import __dirname from '../utils.js';

export class CartsService {
    static #instance;

    constructor() {
        this.path = `${__dirname}/data/carts.json`;
    }

    static getInstance() {        
        if(!CartsService.#instance) {
            CartsService.#instance = new CartsService();
        }
        return CartsService.#instance;        
    }

    async readCarts() {
        try {
            const response = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(response);
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async saveCarts(carts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            throw error;
        }
    }
}