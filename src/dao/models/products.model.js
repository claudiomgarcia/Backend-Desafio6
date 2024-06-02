import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true},
    price: { type: Number, required: true },
    thumbnail: { type: Array, default: [], required: false },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, required: true },
    stock: { type: Number, required: true }
})

productsSchema.plugin(mongoosePaginate)

export default mongoose.model('products', productsSchema)