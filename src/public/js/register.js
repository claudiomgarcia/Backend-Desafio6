document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault()

    const form = event.target
    const formData = new FormData(form)
    const data = {
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        age: formData.get('age'),
        password: formData.get('password')
    }

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                showConfirmButton: false,
                background: '#2f2f2f',
                color: '#ffffff',
                timer: 1000
            }).then(() => {
                window.location.href = result.redirectUrl
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                showConfirmButton: false,
                text: result.error,
                background: '#2f2f2f',
                color: '#ffffff',
                showCancelButton: true,
                cancelButtonText: "Cerrar",
            })
        }
    } catch (error) {
        console.log(error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            showConfirmButton: false,
            background: '#2f2f2f',
            color: '#ffffff',
            showCancelButton: true,
            cancelButtonText: "Cerrar",
            text: 'Hubo un problema con el servidor. Inténtalo de nuevo más tarde.'
        })
    }
})