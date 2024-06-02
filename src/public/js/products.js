document.addEventListener('DOMContentLoaded', function () {
    window.addToCart = async function (button) {
        const cid = button.getAttribute('data-cid')
        const pid = button.getAttribute('data-pid')

        const url = `/api/carts/${cid}/product/${pid}`

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error('Error en la solicitud')
            }

            const result = await response.json()

            Swal.fire({
                position: "top-end",
                icon: "success",
                width: 300,
                title: "Producto añadido al carrito",
                showConfirmButton: false,
                timer: 1500,
                background: '#2f2f2f',
                color: '#ffffff'
            }).then(() => {
                window.location.reload()
            })

        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                width: 300,
                title: "Error al añadir el producto al carrito",
                showConfirmButton: false,
                timer: 1500,
                background: '#2f2f2f',
                color: '#ffffff'
            })
        }
    }
})