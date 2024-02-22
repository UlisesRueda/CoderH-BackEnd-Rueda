import express from 'express';
import { CartsManager } from '../models/CartManager.js';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async(req, res) => {
    try {
        const newCart = await CartsManager.getInstance().addCart();

        res.json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async(req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const cart = await CartsManager.getInstance().getCartById(id);

        res.json({ status: 'success', payload: cart});        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async(req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart = await CartsManager.getInstance().addProductToCart(cartId, productId);
        res.json({ status:'success', payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:cid/product/:pid', async(req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart = await CartsManager.getInstance().removeProduct(cartId, productId);
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router