import express from 'express';
import { ProductsManager } from '../models/ProductManager.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
    if(req === 'POST' || req === 'PUT') {
        const { title, description, code, price, stock, category, thumbnail } = req.body;

        if(!title || !description || !code || !price || !stock || !category || !thumbnail) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }
    }
    next();
})

router.get('/', async(req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await ProductsManager.getInstance().getProducts(limit);

        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.post('/', async (req, res) =>{
    try {
        const { title, description, code, price, stock, category, thumbnail } = req.body;
        let newProduct = { title, description, code, price, status: true, stock, category, thumbnail };

        newProduct = await ProductsManager.getInstance().addProduct(newProduct);
        res.json({ status: 'success', payload: `Se agregó el producto con id ${newProduct.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.put('/:pid', async(req, res) =>{
    try {
        const id = parseInt(req.params.pid);
        let updatedProduct = req.body;

        updatedProduct = await ProductsManager.getInstance().updatedProduct(id, updatedProduct);
        res.json({ status: 'success', payload: `Se actualizó con éxito el producto con id ${updatedProduct.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.delete('/:pid', async(req, res) =>{
    try {
        const id = parse(req.params.pid);
        const deletedProduct = await ProductsManager.getInstance().deleteProduct(id);

        res.json({ status: 'success', payload: `Se eliminó el producto con id ${deletedProduct.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router