import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path'
import __dirname from './utils.js';
import ProductsManager from './models/ProductManager.js';
import realTimeRouter from './routes/realTimeProducts.router.js';

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

//CONEXCION CON WEBSOCKET
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const io = new Server(httpServer);

app.use("/", realTimeRouter(io)); 

app.get('/', async (req, res) => {
    try {
        const products = await ProductsManager.getInstance().getProducts();

        res.render('home', { title: 'Home', products: products });

    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});


io.on("connection", async (socket) => {
    console.log('Nueva conexion')

    try {
        const products = await ProductsManager.getInstance().getProducts();
        io.emit("products", products);
    } catch (error) {
        io.emit('response', { status: 'error', message: error.message });
    }

    socket.on("new-product", async (newProduct) => {
        try {
            const newProductObj = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            };

            const pushedProd = await ProductsManager.getInstance().addProduct(newProductObj);
            const pushedId = pushedProd.id;
            const updatedList = await ProductsManager.getInstance().getProducts();
            io.emit("products", updatedList);
            io.emit("response", { status: 'success', message: `Product ${pushedId} added successfully` });
        } catch (error) {
            io.emit('response', { status: 'error', message: error.message });
        }
    });

    socket.on("delete-product", async (id) => {
        try {
            const pId = parseInt(id);
            await ProductsManager.getInstance().deleteProduct(pId);
            const updatedList = await ProductsManager.getInstance().getProducts();
            io.emit("products", updatedList);
            io.emit('response', { status: 'success', message: "deleted successfully" });
        } catch (error) {
            io.emit('response', { status: 'error', message: error.message });
        }
    });
});
