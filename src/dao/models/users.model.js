import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    age: Number,
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
})

export default mongoose.model('users', usersSchema)
