import express from 'express';
import ProductsManager from '../models/ProductManager.js';

const router = express.Router();

const realTimeRouter = (io) => {
    router.get('/realtimeproducts', async (req, res) => {
        try {
            const products = await ProductsManager.getInstance().getProducts();
            res.render('realTimeProducts', { title: 'Real time products', products: products });
        } catch (error) {
            console.error('Error al obtener los productos en tiempo real:', error);
            res.status(500).send('Error interno del servidor');
        }
    });

    router.post('/realtimeproducts', async (req, res) => {
        try {
            const newProduct = req.body;

            await ProductsManager.getInstance().addProduct(newProduct);

            const updatedProducts = await ProductsManager.getInstance().getProducts();

            io.emit('new-product', updatedProducts) 

            res.status(200).json({ status: 'success', message: 'Product added successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    });

    router.delete('/realtimeproducts', async (req, res) => {
        try {
            const deleteId = req.body;
            await ProductsManager.getInstance().deleteProduct(deleteId);
            const deleteProducts = await ProductsManager.getInstance().getProducts()
            io.emit('delete-product', deleteProducts)

            res.status().json({ status: 'success', message: 'Delete successfully' })
        } catch (error) {
            res.status.json({ status: 'error', message: error.message })
        }
    })

    return router;
};

export default realTimeRouter;
