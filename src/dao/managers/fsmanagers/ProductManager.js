import { promises as fs } from 'fs'

export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    async addProduct(product) {
        try {
            const { code } = product
            const products = await this.getProducts()

            const existingProduct = products.find(item => item.code === code)
            if (existingProduct) {
                return false
            }

            const newProduct = {
                id: this.getNextId(products),
                ...product
            }
            products.push(newProduct)
            await this.saveProductsToFile(products)
            return true
        } catch (error) {
            throw error
        }

    }

    async getProductById(id) {
        try {
            const products = await this.getProducts()
            const product = products.find(product => product.id === id)
            if (!product) {
                return null
            }
            return product
        } catch (error) {
            throw error
        }

    }

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts()
            const index = products.findIndex(product => product.id === id)
            if (index !== -1) {
                const updatedProduct = {
                    ...products[index],
                    ...updatedFields
                }

                if (updatedFields.hasOwnProperty('id')) {
                    updatedProduct.id = products[index].id
                    return false
                }

                products[index] = updatedProduct
                await this.saveProductsToFile(products)

                return true
            }
            else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async deleteProduct(id) {
        try {
            const products = await this.getProducts()
            const index = products.findIndex(product => product.id === id)
            if (index === -1) {
                return null
            }
            else {
                products.splice(index, 1)
                await this.saveProductsToFile(products)
                return true
            }
        } catch (error) {
            throw error
        }

    }

    async getProducts(limit) {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            const products = data ? JSON.parse(data) : []
            return limit ? products.slice(0, limit) : products
        } catch (error) {
            if (error.code === 'ENOENT') {
                return []
            } else {
                throw error
            }
        }
    }

    async saveProductsToFile(products) {
        try {
            const data = JSON.stringify(products, null, 2)
            await fs.writeFile(this.path, data)
        } catch (error) {
            throw error
        }
    }

    getNextId(products) {
        if (products.length === 0) {
            return 1
        }
        const maxId = Math.max(...products.map(product => product.id))
        return maxId + 1
    }
}