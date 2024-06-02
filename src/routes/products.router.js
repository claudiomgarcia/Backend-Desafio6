import { Router } from 'express'
//import ProductManager from '../dao/managers/fsmanagers/ProductManager.js'
import ProductManager from '../dao/managers/mongomanagers/mongoProductManager.js'
import { generateLink } from '../utils.js'

const productsRouter = Router()
//const productManager = new ProductManager(__dirname + '/dao/managers/fsmanagers/data/products.json')

const productManager = new ProductManager()

productsRouter.get('/', async (req, res) => {
    try {
        const { limit, sort, query, page } = req.query
        const readProducts = await productManager.getProducts(limit, page, sort, query)

        const { products, totalProducts, totalPages, currentPage } = readProducts

        const hasPrevPage = currentPage > 1
        const hasNextPage = currentPage < totalPages

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            nextPage: hasNextPage ? currentPage + 1 : null,
            page: currentPage,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? generateLink('products', currentPage - 1, sort, limit, query) : null,
            nextLink: hasNextPage ? generateLink('products', currentPage + 1, sort, limit, query) : null
        })

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener los productos.', message: error.message })
    }
})

productsRouter.get('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productManager.getProductById(pid)

        // if (isNaN(pid)) {
        //     return res.status(400).json({ error: 'El id no es un número' })
        // }

        if (!product) {
            return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}.` })
        }
        res.json(product)
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al obtener el producto.', message: error.message })
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const product = req.body
        product.status = true

        // if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
        //     res.status(400).json({ error: 'Faltan campos obligatorios en el producto.' })
        // }

        const createProduct = await productManager.addProduct(product)

        if (createProduct === false) {
            return res.status(400).json({ error: `Ya existe un producto con el código "${product.code}".` })
        }

        res.status(201).json({ message: `Se agregó correctamente el producto con el código "${product.code}".` })

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al agregar el producto.', message: error.message })
    }
})

productsRouter.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const fields = req.body

        // if (isNaN(pid)) {
        //     return res.status(400).json({ error: 'El id no es un número' })
        // }

        const product = await productManager.updateProduct(pid, fields)

        if (product === false) {
            return res.status(400).json({ error: `No se puede modificar el ID del producto` })
        }

        if (!product) {
            return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}` })
        }

        res.json({ message: `Se actualizó el producto ${pid}` })

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al actualizar el producto.', message: error.message })
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        const product = await productManager.deleteProduct(pid)

        // if (isNaN(pid)) {
        //     return res.status(400).json({ error: 'El id no es un número' })
        // }

        if (!product) {
            return res.status(404).json({ error: `No se encontró ningún producto con el id ${pid}` })
        }

        res.json({ message: `Se eliminó correctamente el producto con el id ${pid}` })

    } catch (error) {
        res.status(500).json({ error: 'Hubo un error al intentar eliminar el producto.', message: error.message })
    }
})

export default productsRouter