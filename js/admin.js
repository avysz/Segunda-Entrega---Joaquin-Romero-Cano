
let consolasPrimerInicio = [
    {
        id: '5f49fab9-3135-4676-a160-5c3fdbb1ae92',
        descripcion: 'Resident Evil 4 es un remake del Resident Evil 4 original del 2005. Survival Horror de última generación reimaginado para el año 2023.',
        titulo: 'Resident Evil 4',
        precio: 12960,
        imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202210/0706/EVWyZD63pahuh95eKloFaJuC.png',
        categoria: 'Xbox',
        fechaDeCreacion: '2023-03-23',
    },
    {
        id: '2e897bad-d4e4-413d-a515-ed95df9ad917',
        descripcion: 'Street Fighter 6 hace gala de la potencia del RE ENGINE de Capcom, e incluye tres modos de juego: World Tour, Fighting Ground y Battle Hub. Un variado elenco de 18 luchadores',
        titulo: 'Street Fighter 6',
        precio: 9900,
        imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202211/1407/XFU0aPBvtm3W2od1ZvhByAOv.png',
        categoria: 'PlayStation',
        fechaDeCreacion: '2023-06-02'
    },
    {
        id: 'fc3025ec-f314-4b63-9765-1e8df3ee358a',
        descripcion: 'Cyberpunk 2077 es un RPG de aventura y acción de mundo abierto ambientado en el futuro sombrío de Night City, una peligrosa megalópolis obsesionada con el poder, el glamur y las incesantes modificaciones corporales',
        titulo: 'Cyberpunk 2077',
        precio: 8600,
        imagen: 'https://image.api.playstation.com/vulcan/ap/rnd/202111/3013/cKZ4tKNFj9C00giTzYtH8PF1.png',
        categoria: 'Steam',
        fechaDeCreacion: '2020-12-09'
    },
];


let consolas = JSON.parse(localStorage.getItem("productos")) || consolasPrimerInicio


// !Si nunca hemos guardado en el localStorage un item productos lo creamos en este if
if(  JSON.parse(localStorage.getItem("productos")) === null  ) {

    localStorage.setItem("productos", JSON.stringify(consolas))
    
}



let idEditar;
const btn = document.querySelector('button.btn[type="submit"]')
const tableBodyHTML = document.querySelector("#table-body")




pintarProductos(consolas)



const inputFiltrarHTML = document.getElementById("filtrar")

const formularioProductoHTML = document.getElementById("formularioProducto")

// !LISTENER EVENTO FORMULARIO
formularioProductoHTML.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const el = formularioProductoHTML.elements;


    let id;

    
    if(idEditar) {
        id = idEditar
    } else {
        id = crypto.randomUUID()
    }


    const nuevoProducto = {
        id: id,
        titulo: el.tituloName.value,
        descripcion: el.descripcion.value,
        precio: el.precio.valueAsNumber,
        imagen: el.imagen.value,
        categoria: el.categoria.value,
        fechaDeCreacion: obtenerFecha(),
    }


    if(idEditar) {
    
        const index = consolas.findIndex(consola => {
            return consola.id === idEditar
        })
        
        consolas[index] = nuevoProducto;
        
        idEditar = undefined;

        btn.innerText = "Agregar producto"
        btn.classList.remove("btn-success")
    } else {
        consolas.push(nuevoProducto)
    }


    Swal.fire({
        icon: 'success',
        title: 'Producto agregado/modificado correctamente',
        text: 'El producto se actualizo o modifico correctamente!',
    })


    pintarProductos(consolas)

    localStorage.setItem("productos", JSON.stringify(consolas))
    
    formularioProductoHTML.reset()
    el.tituloName.focus()
})




// - PINTAR PRODUCTOS
function pintarProductos(arrayAPintar) {

    tableBodyHTML.innerHTML = "";

    arrayAPintar.forEach(function(conso, index) {
        tableBodyHTML.innerHTML += 
            `<tr>
                <td class="table-image">
                        <img src="${conso.imagen}" alt="${conso.titulo}">
                </td>
                <td class="table-title">${conso.titulo}</td>
                <td class="table-description">${conso.descripcion}</td>
                <td class="table-price">${conso.precio}</td>
                <td class="table-category">${conso.categoria}</td>
                <td >
                    <div class="d-flex gap-1">
                        <button class="btn-delete btn btn-danger btn-sm" onclick="borrarProducto('${conso.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="btn btn-success btn-sm" onclick="editarProducto('${conso.id}')" data-bs-toggle="modal" data-bs-target="#formModal">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                    
                </td>
            </tr>`
    })
}


//Funcion para filtrar productos
inputFiltrarHTML.addEventListener('keyup', (evt) => {

    const busqueda = evt.target.value.toLowerCase();
    
    const resultado = consolas.filter((producto) =>  {
    
        const titulo = producto.titulo.toLowerCase()

        if( titulo.includes(busqueda)  ) {
            return true
        } 
        return false
    } )
    pintarProductos(resultado)

})






const borrarProducto = (idABuscar) => {
    Swal.fire({
        title: 'Desea borrar producto',
        icon: 'error',
        text: 'Realmente desea elminar el producto?',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar' ,
        confirmButtonText: 'Borrar',
    }).then((result) => {

        if(result.isConfirmed) {
            const indiceEncontrado = consolas.findIndex((productoFindIndex) => {
                if(productoFindIndex.id === idABuscar) {
                    return true
                }
                return false
            })
            consolas.splice(indiceEncontrado, 1);

            pintarProductos(consolas)

            localStorage.setItem("productos", JSON.stringify(consolas)   )


            Swal.fire('Borrado!', 'Producto borrado correctamente', 'success')
        }
    })

}

// - Editar producto
const editarProducto = function(idRecibido) {

    console.log(`Editar elemento ${idRecibido}`)

    const productoEditar = consolas.find((prod) => {
        if(prod.id === idRecibido) {
            return true
        }
    })


    if(!productoEditar) return;

    idEditar = productoEditar.id


    const elements = formularioProductoHTML.elements;

    elements.tituloName.value = productoEditar.titulo;
    elements.precio.value = productoEditar.precio;
    elements.descripcion.value = productoEditar.descripcion;
    elements.imagen.value = productoEditar.imagen;
    elements.categoria.value = productoEditar.categoria;


    
    btn.innerText = "Editar Producto"
    btn.classList.add("btn-success")



    
}



function obtenerFecha() {
    const fecha = new Date()
    let mes = fecha.getMonth() + 1;
    if(mes < 10) {
        mes = '0'+ mes
    }
    let dia = fecha.getDate()
    if(dia < 10) {
        dia = '0' + dia
    }
    const year = fecha.getFullYear()

    const fechaFormateada = `${year}-${mes}-${dia}`
    return fechaFormateada
}

