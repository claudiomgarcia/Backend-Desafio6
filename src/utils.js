import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const generateLink = (endpoint, page, sort, limit, query) => {
    let link = `/${endpoint}?page=${page}`
    if (limit) link += `&limit=${limit}`
    if (sort) link += `&sort=${sort}`
    if (query) link += `&query=${query}`
    return link
}

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export { __dirname, generateLink, createHash, isValidPassword }