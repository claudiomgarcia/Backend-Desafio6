import { Router } from 'express'
import passport from 'passport'

const sessionsRouter = Router()

sessionsRouter.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Error al registrar el usuario: " + err })
        }
        if (!user) {
            return res.status(400).json({ status: "error", message: info.message })
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ status: "error", message: "Error al iniciar sesión: " + err })
            }
            res.json({ status: "success", message: "Usuario registrado", redirectUrl: "/login" })
        })
    })(req, res, next)
})

sessionsRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(400).json({ error: info.message })
        }
        req.logIn(user, err => {
            if (err) {
                return next(err)
            }
            try {
                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    isAdmin: user.isAdmin
                }
                res.json({ redirectUrl: '/products' })
            } catch (err) {
                res.status(500).send('Error al iniciar sesión')
            }
        })
    })(req, res, next)
})

sessionsRouter.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})


sessionsRouter.get("/githubcallback",passport.authenticate("github",{failureRedirect:"/login"}),async(req,res)=>{
    req.session.user=req.user
    res.redirect("/")
})

sessionsRouter.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) res.status(500).json({ error: 'Error al cerrar sesión' })
        res.redirect('/login')
    })
})

export default sessionsRouter
