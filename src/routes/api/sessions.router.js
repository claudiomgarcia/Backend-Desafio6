import { Router } from 'express'
import User from '../../dao/models/users.model.js'
import bcrypt from 'bcryptjs'

const sessionsRouter = Router()

sessionsRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body
    try {
        const newUser = new User({ first_name, last_name, email, age, password })
        await newUser.save()
        res.redirect('/login')
    } catch (err) {
        res.status(500).send('Error al registrar usuario')
    }
})

sessionsRouter.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
            req.session.user = {
                first_name: 'CoderAdmin',
                email: email,
                rol: 'admin'
            }
            req.session.admin = true
            res.json({ redirectUrl: '/products' })
        }
        else {
            const user = await User.findOne({ email })
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
                
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' })

            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                rol: 'user'
            }
            res.json({ redirectUrl: '/products' })
        }
    } catch (err) {
        res.status(500).json({ error: 'Error al iniciar sesión' })
    }
})

sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión')
        res.redirect('/login')
    })
})

export default sessionsRouter
