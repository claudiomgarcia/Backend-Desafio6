import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    age: Number,
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }
})

usersSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next()
        }

        const salt = await bcrypt.genSalt(10)

        const hashedPassword = await bcrypt.hash(this.password, salt)

        this.password = hashedPassword;

        next()
    } catch (error) {
        next(error)
    }
})

export default mongoose.model('users', usersSchema)
