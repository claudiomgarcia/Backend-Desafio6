import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import usersModel from '../dao/models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body

            try {
                let user = await usersModel.findOne({ email: username })
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' })
                }

                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password)
                }

                let result = await usersModel.create(newUser)
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username })
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' })
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' })
            }
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENTID,
        clientSecret: process.env.SECRETID,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await usersModel.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: "",
                    password: " "
                }
                let result = await usersModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await usersModel.findById(id)
        done(null, user)
    })

}

export default initializePassport