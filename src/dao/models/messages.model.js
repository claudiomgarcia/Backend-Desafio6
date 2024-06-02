import mongoose from 'mongoose'

const messagesSchema = new mongoose.Schema({
    user: String,
    message: String
})

export default mongoose.model('messages', messagesSchema)
