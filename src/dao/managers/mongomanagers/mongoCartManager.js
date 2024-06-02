import cartsModel from '../../models/carts.model.js'

export default class CartManager {

    async createCart() {
        try {
            const cartData = {}
            return await cartsModel.create(cartData)
        } catch (error) {
            throw error
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const updatedCart = await cartsModel.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $inc: { "products.$.quantity": 1 } },
                { new: true }
            )

            if (!updatedCart) {
                const cart = await cartsModel.findById(cid)
                cart.products.push({ product: pid })
                await cart.save()
            }
        } catch (error) {
            throw error
        }
    }

    async getCarts() {
        try {
            return await cartsModel.find()
        } catch (error) {
            throw error
        }
    }


    async getCartById(cid) {
        try {
            return await cartsModel.findById(cid).populate('products.product').lean()
        } catch (error) {
            throw error
        }
    }

    async deleteProductInCart(cid, pid) {
        try {
            const productExist = await cartsModel.findOne({ _id: cid, "products.product": pid })

            if (!productExist) {
                throw new Error('Producto no encontrado en el carrito')
            }

            const updatedCart = await cartsModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            )

            if (!updatedCart) {
                throw new Error('Carrito no encontrado')
            }

            return updatedCart

        } catch (error) {
            throw error
        }
    }

    async deleteAllProducts(cid) {
        try {
            const cart = await cartsModel.findOne({ _id: cid, products: { $exists: true, $ne: [] } })

            if (!cart) {
                throw new Error('El carrito ya está vacío')
            }

            const updatedCart = await cartsModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: {} } },
                { new: true }
            )

            if (!updatedCart) {
                throw new Error('Carrito no encontrado')
            }

        } catch (error) {
            throw error
        }
    }

    async updateCart(cid, products) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }
            cart.products = products
            const updatedCart = await cart.save()
            return updatedCart

        } catch (error) {
            throw error
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            const productExist = await cartsModel.findOne({ _id: cid, "products.product": pid })
            if (!productExist) {
                throw new Error('Producto no encontrado')
            }

            return cartsModel.updateOne(
                { "_id": cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } }
            )
        } catch (error) {
            throw error
        }
    }

    //Metodo creado para esta entrega asignar un carrito a la vista /products. 
    //Asigna el primer carrito que encuentra y si no existe ninguno, crea uno y lo asigna como por defecto
    async getOrCreateCart() {
        try {
            let cart = await cartsModel.findOne().lean()
            if (!cart) {
                cart = await this.createCart()
            }
            return cart
        } catch (error) {
            throw error
        }
    }
}