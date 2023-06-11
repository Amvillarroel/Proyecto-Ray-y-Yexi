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
            }];

        let carrito = [];
        const divisa = '$';
        const DOMitems = document.querySelector('#items');
        const DOMcarrito = document.querySelector('#carrito');
        const DOMtotal = document.querySelector('#total');
        const DOMbotonVaciar = document.querySelector('#boton-vaciar');
        const miLocalStorage = window.localStorage;

        //Dibuja todos los productos a partir de la base de datos. No confundir con el carrito
        
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

        //Evento para añadir un producto al carrito de la compra
        
        function anyadirProductoAlCarrito(evento) {
            // Anyadimos el Nodo a nuestro carrito
            carrito.push(evento.target.getAttribute('marcador'));
            //mostrar aviso de producto agregado al carrito
            mostrarCartel();
            // Actualizamos el carrito 
            renderizarCarrito();
            // Actualizamos el LocalStorage
            guardarCarritoEnLocalStorage();
            // Cambiar el icono del carrito vacio por el carrito lleno
            let iconoCarrito = document.querySelector('.icono-carrito');
            iconoCarrito.classList.replace('bi-cart', 'bi-cart-check-fill');     
        }

        //funcion para mostrar cartel al agregar un producto
        function mostrarCartel() {
            const cartel = document.getElementById('cartel');
            cartel.style.display = 'flex';
            setTimeout(() => {cartel.style.display = 'none';}, 900)
        }

        //Dibuja todos los productos guardados en el carrito
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
                    // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
                    return itemId === item ? total += 1 : total;
                }, 0);
                // Creamos el nodo del item del carrito
                const miNodo = document.createElement('p');
                miNodo.classList.add('text-center', 'mx-2', 'productosEnCarrito');
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

            // Evento para borrar un elemento del carrito
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
            //Cambiar el carrito full por el carrito vacio si se eliminan todos los articulos
            if (calcularTotal() == 0) {
            let iconoCarrito = document.querySelector('.icono-carrito');
            iconoCarrito.classList.replace('bi-cart-check-fill', 'bi-cart');
            }
        }

        //Calcula el precio total teniendo en cuenta los productos repetidos            
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

        //Vaciar el carrito y vuelve a dibujarlo 
        function vaciarCarrito() {
            // Limpiamos los productos guardados
            carrito = [];
            // Renderizamos los cambios
            renderizarCarrito();
            // Borra LocalStorage
            localStorage.clear();
            //cambiar icono de carrito full por carrito vacio
            let iconoCarrito = document.querySelector('.icono-carrito');
            iconoCarrito.classList.replace('bi-cart-check-fill', 'bi-cart');

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

    //Funcion para el boton enviar pedido
    let arrayCarrito = [];
    let carritoParaEnviar = document.querySelector('#carritoParaEnviar');

        carritoParaEnviar.addEventListener('click', function carritoParaEnviar () {
        //llenar el array del carrito para enviarlo con el boton enviar pedido
        let productosEnCarrito = document.querySelectorAll('.productosEnCarrito');
        productosEnCarrito.forEach((producto)=>{
        arrayCarrito.push(producto.innerText)
        });

        //api de whatsapp para enviar los productos del carrito
        urlApiWahtsapp = 'https://api.whatsapp.com/send?phone=541173621680&text=Me%20interesan%20los%20siguientes%20productos' + ' ' + JSON.stringify(arrayCarrito);
        window.open(urlApiWahtsapp, "_blank");
        vaciarCarrito();
    });

    // función para el boton ver carrito
    function verCarrito() {
        let mostrarCarrito = document.querySelector('.carrito');
        mostrarCarrito.style.display = 'flex';
    }

    /*let btnCarrito = document.querySelector('.btnCarrito');
    btnCarrito.addEventListener('click', verCarrito());*/

    //funcion para ocultar el carrito y seguir comprando
    let btnOcultarCarrito = document.querySelector('#btnSeguirComprando');
    
    btnOcultarCarrito.addEventListener('click', function ocultarCarrito() {
        let ocultarCarrito = document.querySelector('.carrito');
        ocultarCarrito.style.display = 'none';
    })


    //Funciones para manejar los displays de las categorias de los productos    
    let collares = document.querySelectorAll(".collar");
    let llaveros = document.querySelectorAll(".llavero");
    let pulseras = document.querySelectorAll(".pulsera");

    //dejar visible los collares y ocultar el resto de los productos
    llaveros.forEach(elemento => elemento.style.display ='none');
    pulseras.forEach(elemento => elemento.style.display ='none');
    
    function displayProductos(producto) {
        
        if (producto == 'collares') {
            for (let i = 0; i < collares.length; i++) {
            collares[i].style.display = 'flex';
            }

            for (let i = 0; i < llaveros.length; i++) {
            llaveros[i].style.display = 'none';
            }
        
            for (let i = 0; i < pulseras.length; i++) {
            pulseras[i].style.display = 'none';
            }

        } //fin de display collares

         else if (producto == 'llaveros') {
            //let collares = document.querySelectorAll(".collar");
            for (let i = 0; i < collares.length; i++) {
            collares[i].style.display = 'none';
            }

            //let llaveros = document.querySelectorAll(".llavero");
            for (let i = 0; i < llaveros.length; i++) {
            llaveros[i].style.display = 'flex';
            }
            
            //let pulseras = document.querySelectorAll(".pulsera");
            for (let i = 0; i < pulseras.length; i++) {
            pulseras[i].style.display = 'none';
            }

            } //fin display llaveros

            else if (producto == 'pulseras') {
                //let collares = document.querySelectorAll(".collar");
                for (let i = 0; i < collares.length; i++) {
                collares[i].style.display = 'none';
                }
    
                //let llaveros = document.querySelectorAll(".llavero");
                for (let i = 0; i < llaveros.length; i++) {
                llaveros[i].style.display = 'none';
                }
                
                //let pulseras = document.querySelectorAll(".pulsera");
                for (let i = 0; i < pulseras.length; i++) {
                pulseras[i].style.display = 'flex';
                }
    
                } //fin display pulseras


        }//fin de funcion displayProductos

        //funcion para el boton hamburguesa
        let navBarSecundaria = document.querySelector('.navbar-sencundaria');
        
        function flexDirectionSecundaria() {
        navBarSecundaria.classList.toggle('flex-row');
        navBarSecundaria.classList.toggle('mx-auto'); 

        }

