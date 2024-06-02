import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const generateLink = (endpoint, page, sort, limit, query) => {
    let link = `/${endpoint}?page=${page}`
    if (limit) link += `&limit=${limit}`
    if (sort) link += `&sort=${sort}`
    if (query) link += `&query=${query}`
    return link
}

export { __dirname, generateLink }