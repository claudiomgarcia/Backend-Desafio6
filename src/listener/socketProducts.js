//import ProductManager from "../dao/managers/fsmanagers/ProductManager.js"
import ProductManager from '../dao/managers/mongomanagers/mongoProductManager.js'
import { __dirname } from "../utils.js"

//const productManager = new ProductManager(__dirname + '/dao/managers/fsmanagers/data/products.json')
const productManager = new ProductManager()

const socketProducts = (socketServer) => {
    socketServer.on('connection', async (socket) => {

        const sendUpdatedProductList = async (limit, page, sort, query) => {
            const productList = await productManager.getProducts(limit, page, sort, query)
            socketServer.emit('sendProducts', productList.products)
        }
        sendUpdatedProductList()

        socket.on('addProduct', async (obj) => {
            try {
                await productManager.addProduct(obj)
                sendUpdatedProductList()
            } catch (error) {
                console.error('Error al agregar el producto:', error)
            }
        })

        socket.on('deleteProduct', async (id) => {
            try {
                await productManager.deleteProduct(id)
                sendUpdatedProductList()
            } catch (error) {
                console.error('Error al eliminar el producto:', error)
            }
        })
    })
}

export default socketProducts