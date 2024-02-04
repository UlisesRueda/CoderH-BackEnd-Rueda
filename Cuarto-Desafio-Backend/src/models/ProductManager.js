import { ProductsService } from "../services/products.service.js";

export default class ProductsManager {
    static #instance;

    constructor() {
        this.products = [];
    }

    static getInstance() {
        if(!ProductsManager.#instance) {
            ProductsManager.#instance = new ProductsManager();
        }
        return ProductsManager.#instance;
    }

    async getProducts(limit) {
        try {
            this.products = await ProductsService.getInstance().readProducts();

            if(limit){
                return this.products.slice(0, limit);
            } else {
                return this.products;
            }
        } catch (error) {
            console.log('Error al retornar los productos: ', error);
            throw error;
        }
    }

    async getProductsById(id) {
        try {
            this.products = await ProductsService.getInstance().readProducts();
            const product = this.products.find(product => product.id === id);

            if(!product){
                throw new Error(`No se encontró el producto con id ${id}`);
            }
            return product;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(newProduct) {
        try {
            this.products = await ProductsService.getInstance().readProducts();

            if (this.products.find(product => product.code === newProduct.code)) {
                throw new Error(`Ya existe un producto con el código ${newProduct.code}`);
            }

            const lastId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);

            const product = {
                id: parseInt(lastId) + 1, 
                ...newProduct
            };
            this.products.push(product);

            await ProductsService.getInstance().saveProducts(this.products);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            this.products = await ProductsService.getInstance().readProducts();
            const productIndex = this.products.findIndex(product => product.id === id);

            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${id}`);
            }
            if (this.products.find(product => product.code === updatedProduct.code)) {
                throw new Error(`Ya existe un producto con el código ${updatedProduct.code}`);
            }
            const product = {
                id,
                ...updatedProduct
            };
            this.products[productIndex] = product;

            await ProductsService.getInstance().saveProducts(this.products);
            return product;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            this.products = await ProductsService.getInstance().readProducts();
            
            const productIndex = this.products.findIndex(product => String(product.id) === String(id));
    
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${id}`);
            }
    
            const product = this.products[productIndex];
            this.products.splice(productIndex, 1);
    
            await ProductsService.getInstance().saveProducts(this.products);
            return product;
        } catch (error) {
            throw error;
        }
    }
    
};