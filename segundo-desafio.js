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
            console.log('El producto elegido es: ');
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
            return 'Producto agregado'
        }else{
            return 'Error. Este producto ya existe'
        }
    }

    async updateProduct(id, updatedFields){
        const idCoindence = this.products.findIndex(event => event.id === id);

        if(idCoindence === -1){
            return 'Not found';
        }else{
            try {
                let selectedProduct = this.products[idCoindence]

                Object.assign(selectedProduct, updatedFields)

                const updateProductStr = JSON.stringify(this.products, null, 2)

                fs.writeFile(this.path, updateProductStr);
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
                const fileContent = await fs.promises.readFile(this.path, 'utf-8');
                const data = JSON.parse(fileContent)

                const updatedData = data.filter(prod => prod.id !== id);
                await fs.watchFile(this.path, JSON.stringify(updatedData, null, 2))
                return `Producto con ID ${is} eliminado correctamente`
            } catch (error) {
                return `Error al eliminar el producto. Error ${error}`
            }
        }
    }
}

const productManager = new ProductManager();

console.log(productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25));
console.log(productManager.addProduct("producto prueba", "Este es un producto de prueba", 200, "Sin imagen", "abc123", 25));
console.log(productManager.addProduct("segundo producto prueba", "Este es el segundo producto de prueba", 400, "Sin imagen", "def456", 50));
console.log(productManager.addProduct("segundo producto prueba", "Este es el segundo producto de prueba", 400, "Sin imagen", "def456", 50));
console.log("----------------------------------- \n Test getProducts\n-----------------------------------");
console.log(productManager.getProducts());
console.log("----------------------------------- \n Test getProductById\n-----------------------------------");
console.log(productManager.getProductsByID(1));
console.log(productManager.getProductsByID(3));
console.log("----------------------------------- \n Test updateProduct\n-----------------------------------");
console.log(productManager.updateProduct(1, {title: "Este producto ha si modificado", stock: 0 }));
console.log(productManager.updateProduct(3, {title:"Este id no existe"}));
console.log("----------------------------------- \n Test deleteProduct\n-----------------------------------");
productManager.deleteProduct(1)
    .then(result => console.log(result))
    .catch(error => console.error(error));

productManager.deleteProduct(3)
    .then(result => console.log(result))
    .catch(error => console.error(error))
