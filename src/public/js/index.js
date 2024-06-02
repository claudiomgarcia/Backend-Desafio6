const truncate = (str, len) => {
    if (str.length > len) {
        return str.slice(0, len) + '...'
    }
    return str
}

const socketClient = io()

socketClient.on("sendProducts", (obj) => {
    updateProductList(obj)
})

function updateProductList(productList) {
    const productsDiv = document.getElementById('list-products')
    let productsHTML = ""
    productList.forEach((product) => {
        const truncatedDescription = truncate(product.description, 100)
        productsHTML += `<div class="column is-one-fifth">
        <div class="card" style="height: 100%">
            <div class="level px-1 pt-2">
                <div class="level-left">
                    <p class="level-item has-text-left">
                        <a href="?query=${product.category}" class="button is-small is-link is-rounded">${product.category}</a>
                    </p>
                </div>
                <div class="level-right">
                    <p class="level-item has-text-right">
                        <button class="button is-small is-dark is-hovered is-rounded">Stock: ${product.stock}</button>
                    </p>
                </div>
            </div>
            <div class="card-content mb-6" style="flex-grow: 1">
                <p class="title is-5">${product.title}</p>
                <p class="subtitle is-6">$${product.price}</p>
                <p class="is-size-6">${truncatedDescription}</p>
            </div>
            <div style="position: absolute; bottom: 0; right: 0;">
                <p class="buttons p-2">
                    <button class="button is-link is-rounded">Añadir al carrito</button>
                </p>
            </div>
        </div>
    </div>`
    })

    productsDiv.innerHTML = productsHTML
}

const form = document.getElementById("formProduct")
form.addEventListener("submit", (evt) => {
    evt.preventDefault()

    const title = form.elements.title.value
    const description = form.elements.description.value
    const category = form.elements.category.value
    const price = form.elements.price.value
    const code = form.elements.code.value
    const stock = form.elements.stock.value
    const thumbnail = form.elements.thumbnail.value
    const status = form.elements.status.checked

    socketClient.emit("addProduct", {
        title,
        description,
        category,
        price,
        code,
        stock,
        thumbnail,
        status,
    })
    form.reset()
})

document.getElementById("delete-btn").addEventListener("click", () => {
    const idInput = document.getElementById("id-prod")
    const deleteId = idInput.value

    socketClient.emit("deleteProduct", deleteId)
    idInput.value = ""
})

socket.emit('message', "Comunicandome desde websocket")