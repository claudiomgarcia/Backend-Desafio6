import mongoose from 'mongoose'

const cartsSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
        quantity: { type: Number, default: 1 }
    }],
})


export default mongoose.model('carts', cartsSchema)
