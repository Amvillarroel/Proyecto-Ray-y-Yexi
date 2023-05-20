
//    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" crossorigin="anonymous">
   
        document.addEventListener('DOMContentLoaded', () => {

            // Variables
            const baseDeDatos = [
                {
                    id: 1,
                    nombre: 'Collar Fairy Moon',
                    precio: 300,
                    imagen: 'images/Collar-fairy-moon.jpeg',
                    categoria: 'collar'
                },
                {
                    id: 2,
                    nombre: 'Collar love-lila',
                    precio: 560,
                    imagen: 'images/Collar-love-lila.jpeg',
                    categoria: 'collar'
                },
                {
                    id: 3,
                    nombre: 'Collar pearl',
                    precio: 600,
                    imagen: 'images/Collar-pearl.jpeg',
                    categoria: 'collar'
                },
                {
                    id: 4,
                    nombre: 'Collar teddy',
                    precio: 500,
                    imagen: 'images/Collar-teddy.jpeg',
                    categoria: 'collar'
                },
                {
                    id: 5,
                    nombre: 'Llavero amor',
                    precio: 300,
                    imagen: 'images/Llavero-amor.jpeg',
                    categoria: 'llavero'
                },
                {
                    id: 6,
                    nombre: 'Llavero happy',
                    precio: 700,
                    imagen: 'images/Llavero-happy.jpeg',
                    categoria: 'llavero'
                },
                {
                    id: 7,
                    nombre: 'Llavero love',
                    precio: 700,
                    imagen: 'images/Llavero-love.jpeg',
                    categoria: 'llavero'
                },
                {
                    id: 8,
                    nombre: 'Llavero peace',
                    precio: 700,
                    imagen: 'images/Llavero-peace.jpeg',
                    categoria: 'llavero'
                },
                {
                    id: 9,
                    nombre: 'Pulsera amor',
                    precio: 700,
                    imagen: 'images/Pulsera-amor.jpeg',
                    categoria: 'pulsera'
                },
                {
                    id: 10,
                    nombre: 'Pulsera love black-golden',
                    precio: 700,
                    imagen: 'images/Pulsera-love-black-golden.jpeg',
                    categoria: 'pulsera'
                }

            ];

            let carrito = [];
            const divisa = '$';
            const DOMitems = document.querySelector('#items');
            const DOMcarrito = document.querySelector('#carrito');
            const DOMtotal = document.querySelector('#total');
            const DOMbotonVaciar = document.querySelector('#boton-vaciar');
            const miLocalStorage = window.localStorage;

            // Funciones

            /**
            * Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
            */
            function renderizarProductos() {
                baseDeDatos.forEach((info) => {
                    // Estructura
                    const miNodo = document.createElement('div');
                    miNodo.classList.add('card', 'col-sm-4', `${info.categoria}`);
                    
                    // Body
                    const miNodoCardBody = document.createElement('div');
                    miNodoCardBody.classList.add('card-body');
                    // Titulo
                    const miNodoTitle = document.createElement('h5');
                    miNodoTitle.classList.add('card-title');
                    miNodoTitle.textContent = info.nombre;
                    // Imagen
                    const miNodoImagen = document.createElement('img');
                    miNodoImagen.classList.add('img-fluid');
                    miNodoImagen.setAttribute('src', info.imagen);
                    // Precio
                    const miNodoPrecio = document.createElement('p');
                    miNodoPrecio.classList.add('card-text');
                    miNodoPrecio.textContent = `${info.precio}${divisa}`;
                    // Boton 
                    const miNodoBoton = document.createElement('button');
                    miNodoBoton.classList.add('btn-productos');
                    miNodoBoton.textContent = '+';
                    miNodoBoton.setAttribute('marcador', info.id);
                    miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
                    // Insertamos
                    miNodoCardBody.appendChild(miNodoImagen);
                    miNodoCardBody.appendChild(miNodoTitle);
                    miNodoCardBody.appendChild(miNodoPrecio);
                    miNodoCardBody.appendChild(miNodoBoton);
                    miNodo.appendChild(miNodoCardBody);
                    DOMitems.appendChild(miNodo);
                });
            }

            /**
            * Evento para añadir un producto al carrito de la compra
            */
            function anyadirProductoAlCarrito(evento) {
                // Anyadimos el Nodo a nuestro carrito
                carrito.push(evento.target.getAttribute('marcador'))
                // Actualizamos el carrito 
                renderizarCarrito();
                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();
            }

            /**
            * Dibuja todos los productos guardados en el carrito
            */
            function renderizarCarrito() {
                // Vaciamos todo el html
                DOMcarrito.textContent = '';
                // Quitamos los duplicados
                const carritoSinDuplicados = [...new Set(carrito)];
                // Generamos los Nodos a partir de carrito
                carritoSinDuplicados.forEach((item) => {
                    // Obtenemos el item que necesitamos de la variable base de datos
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        // ¿Coincide las id? Solo puede existir un caso
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Cuenta el número de veces que se repite el producto
                    const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                        // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                        return itemId === item ? total += 1 : total;
                    }, 0);
                    // Creamos el nodo del item del carrito
                    const miNodo = document.createElement('li');
                    miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                    miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
                    // Boton de borrar
                    const miBoton = document.createElement('button');
                    miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                    miBoton.textContent = 'X';
                    miBoton.style.marginLeft = '1rem';
                    miBoton.dataset.item = item;
                    miBoton.addEventListener('click', borrarItemCarrito);
                    // Mezclamos nodos
                    miNodo.appendChild(miBoton);
                    DOMcarrito.appendChild(miNodo);
                });
                // Renderizamos el precio total en el HTML
                DOMtotal.textContent = calcularTotal();
            }

            /**
            * Evento para borrar un elemento del carrito
            */
            function borrarItemCarrito(evento) {
                // Obtenemos el producto ID que hay en el boton pulsado
                const id = evento.target.dataset.item;
                // Borramos todos los productos
                carrito = carrito.filter((carritoId) => {
                    return carritoId !== id;
                });
                // volvemos a renderizar
                renderizarCarrito();
                // Actualizamos el LocalStorage
                guardarCarritoEnLocalStorage();

            }

            /**
             * Calcula el precio total teniendo en cuenta los productos repetidos
             */
            function calcularTotal() {
                // Recorremos el array del carrito 
                return carrito.reduce((total, item) => {
                    // De cada elemento obtenemos su precio
                    const miItem = baseDeDatos.filter((itemBaseDatos) => {
                        return itemBaseDatos.id === parseInt(item);
                    });
                    // Los sumamos al total
                    return (total + miItem[0].precio);
                }, 0).toFixed(2);
            }

            /**
            * Varia el carrito y vuelve a dibujarlo
            */
            function vaciarCarrito() {
                // Limpiamos los productos guardados
                carrito = [];
                // Renderizamos los cambios
                renderizarCarrito();
                // Borra LocalStorage
                localStorage.clear();

            }

            function guardarCarritoEnLocalStorage () {
                miLocalStorage.setItem('carrito', JSON.stringify(carrito));
            }

            function cargarCarritoDeLocalStorage () {
                // ¿Existe un carrito previo guardado en LocalStorage?
                if (miLocalStorage.getItem('carrito') !== null) {
                    // Carga la información
                    carrito = JSON.parse(miLocalStorage.getItem('carrito'));
                }
            }

            // Eventos
            DOMbotonVaciar.addEventListener('click', vaciarCarrito);

            // Inicio
            cargarCarritoDeLocalStorage();
            renderizarProductos();
            renderizarCarrito();
        });

        //Funciones para manejar los displays de las categorias de los productos
        function displayProductos(producto) {
            if (producto == 'collares') {
            
            let collares = document.querySelectorAll(".collar");
            for (let i = 0; i < collares.length; i++) {
            collares[i].style.display = 'flex';
            }

            let llaveros = document.querySelectorAll(".llavero");
            for (let i = 0; i < llaveros.length; i++) {
            llaveros[i].style.display = 'none';
            }
            
            let pulseras = document.querySelectorAll(".pulsera");
            for (let i = 0; i < pulseras.length; i++) {
            pulseras[i].style.display = 'none';
            }

            } //fin de display collares

             else if (producto == 'llaveros') {
                let collares = document.querySelectorAll(".collar");
                for (let i = 0; i < collares.length; i++) {
                collares[i].style.display = 'none';
                }
    
                let llaveros = document.querySelectorAll(".llavero");
                for (let i = 0; i < llaveros.length; i++) {
                llaveros[i].style.display = 'flex';
                }
                
                let pulseras = document.querySelectorAll(".pulsera");
                for (let i = 0; i < pulseras.length; i++) {
                pulseras[i].style.display = 'none';
                }
    
                } //fin display llaveros

                else if (producto == 'pulseras') {
                    let collares = document.querySelectorAll(".collar");
                    for (let i = 0; i < collares.length; i++) {
                    collares[i].style.display = 'none';
                    }
        
                    let llaveros = document.querySelectorAll(".llavero");
                    for (let i = 0; i < llaveros.length; i++) {
                    llaveros[i].style.display = 'none';
                    }
                    
                    let pulseras = document.querySelectorAll(".pulsera");
                    for (let i = 0; i < pulseras.length; i++) {
                    pulseras[i].style.display = 'flex';
                    }
        
                    } //fin display llaveros


            }//fin de funcion displayProductos