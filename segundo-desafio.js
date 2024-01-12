const { log } = require('console');
const fs = require('fs');

class ProductManager{
    constructor(){
        this.products = [];
        this.path = './productos.json';
    };

    getProducts(){
        try {
            const data = fs.readFileSync(this.path)
            
            this.products = JSON.parse(data);
            console.log('Archivo leído');
        } catch (error) {
            console.error('Error al leer el archivo');
            if(error.errno === -4058) console.log('El archivo no existe');
            else console.log(error);
        }
        return this.products
    };

    getProductsByID(id){
        const idCoindence = this.products.findIndex(event => event.id === id)
        if(idCoindence === -1){
            return 'Product not found'
        }else{
            console.log('The chosen product is: ');
            return (this.products[idCoindence])
        }
        
    }

    addProduct(title, descripcion, price, thumbnail, code, stock){
        if(!title || !descripcion || !price || !thumbnail || !code || !stock ){
            // console.log('Todos los campos deben ser obligatorios');
        };

        const newProduct ={
            id: this.products.length + 1,
            title,
            descripcion,
            price,
            thumbnail,
            code,
            stock
        }

        const repeatedCode = this.products.findIndex(prod => prod.code === code)
        if(repeatedCode === -1){
            this.products.push(newProduct);
            let newProductStr = JSON.stringify(this.products, null, 2)
            fs.writeFileSync(this.path, newProductStr)
            return 'Product Added'
        }else{
            return 'Error. The product code already exists'
        }
    }

    async updateProduct(id, updatedFields){
        const idCoindence = this.products.findIndex(event => event.id === id);

        if(idCoindence === -1){
            return 'Not found';
        }else{
            try {
                let selectedProduct = this.products[idCoindence];
                Object.assign(selectedProduct,updatedFields);
                const updateProductStr = JSON.stringify(this.products,null,2);
                await fs.promises.writeFile(this.path,updateProductStr);
                console.log(this.products[idCoindence]);
                return `El producto con ID ${id} fue modificado exitosamente`
            } catch (error) {
                return `Error al actualizar el producto. Error: ${error}`
            }
        }
    }

    async deleteProduct(id){
        const idCoindence = this.products.findIndex(event => event.id === id)

        if(idCoindence === -1){
            return 'Not found'
        }else{
            this.products.splice(idCoindence, 1);
            try {
                await fs.promises.writeFile(this.path,JSON.stringify(this.products,null,2));
                return `Producto con ID ${id} eliminado correctamente`
            } catch (error) {
                return `Error al eliminar el producto. Error ${error}`
            }
        }
    }
}

async function runTests() {
    const productManager = new ProductManager();
    console.log(productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25));
    // console.log(productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25));
    console.log(productManager.addProduct("segundo producto prueba", "Este es el segundo producto de prueba", 400, "Sin imagen", "def456", 50));
    // console.log(productManager.addProduct("segundo producto prueba", "Este es el segundo producto de prueba", 400, "Sin imagen", "def456", 50));
    console.log(productManager.getProducts());
    console.log(productManager.getProductsByID(1));
    console.log(productManager.getProductsByID(3));
    try {
        const updateResult1 = await productManager.updateProduct(1, { title: "Este producto ha sido modificado", stock: 0 });
        console.log(updateResult1);
    } catch (error) {
        console.error(error);
    }
    try {
        const updateResult3 = await productManager.updateProduct(3, { title: "Este id no existe" });
        console.log(updateResult3);
    } catch (error) {
        console.error(error);
    }
  
    try {
        const deleteResult1 = await productManager.deleteProduct(1);
        console.log(deleteResult1);
    } catch (error) {
        console.error(error);
    }
    try {
        const deleteResult3 = await productManager.deleteProduct(3);
        console.log(deleteResult3);
    } catch (error) {
        console.error(error);
    }
}
runTests();