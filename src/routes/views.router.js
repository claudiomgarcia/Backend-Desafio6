import { Router } from "express"
import ProductManager from '../dao/managers/mongomanagers/mongoProductManager.js'
import CartManager from "../dao/managers/mongomanagers/mongoCartManager.js"
import { generateLink } from '../utils.js'
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js"

const viewsRouter = Router()

const productManager = new ProductManager()
const cartManager = new CartManager()

// viewsRouter.get('/', (req, res) => {
//     res.render('home', { title: "Ingreso" })
// })

viewsRouter.get('/products', isAuthenticated, async (req, res) => {
    try {
        const { limit, sort, query, page } = req.query

        //Asigna un carrito por defecto o lo crea
        const defaultCart = await cartManager.getOrCreateCart()

        const readProducts = await productManager.getProducts(limit, page, sort, query)

        const { products, totalProducts, totalPages, currentPage } = readProducts

        if (page !== undefined && (isNaN(page) || page <= 0 || page > totalPages)) {
            res.status(404).json({ error: 'Página inexistente.' })
        }

        const hasPrevPage = currentPage > 1
        const hasNextPage = currentPage < totalPages

        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                pageNumber: i,
                isCurrent: i === currentPage,
                pageLink: generateLink('products', i, sort, limit, query)
            })
        }

        res.render('products', {
            readProducts: products,
            totalProducts,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? generateLink('products', currentPage - 1, sort, limit, query) : null,
            nextLink: hasNextPage ? generateLink('products', currentPage + 1, sort, limit, query) : null,
            ascLink: generateLink('products', 1, 'asc', limit, query),
            descLink: generateLink('products', 1, 'desc', limit, query),
            pages,
            defaultCart,
            user: req.session.user,
            title: "Todos los productos"
        })

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos.', message: error.message })
    }

})

viewsRouter.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts', { title: "Productos en tiempo real" })
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos.', message: error.message })
    }

})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat', { title: "Chat" })
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const cart = await cartManager.getCartById(cid)

        res.render('cart', { cart, title: "Detalle del Carrito" })
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el carrito.', message: error.message })
    }
})

viewsRouter.get(['/', '/login'], isNotAuthenticated, (req, res) => {
    res.render(
        'login',
        { title: "Ingresar" })
})

viewsRouter.get('/register', isNotAuthenticated, (req, res) => {
    res.render(
        'register',
        { title: "Registrarse" })
})

viewsRouter.get('/profile', isAuthenticated, (req, res) => {
    res.render(
        'profile',
        {
            user: req.session.user,
            title: "Mi Cuenta"
        })
})

export default viewsRouter