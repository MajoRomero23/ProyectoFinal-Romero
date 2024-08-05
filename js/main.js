if (!localStorage.getItem('alertaBienvenida')){

    Swal.fire({
        title: '¡Bienvenido!',
        color:"black",
        text: '¡Hola! Bienvenido a CineActual, en la compra de 2 o más boletos obtén un coleccionable de regalo. ¡Nos vemos pronto!',
        iconHtml: '<i class="bi bi-gift"></i>',
        confirmButtonText:'Continuar',
        confirmButtonColor:'rgb(39, 81, 199)',
        iconColor: 'rgb(39, 81, 199)',
        }).then(()=> {
        localStorage.setItem('alertaBienvenida','true');
    });
}

let peliculas = [];

fetch("./js/peliculas.json")
.then (response => response.json())
.then (data => {
    peliculas = data;
    cargarPeliculas(peliculas);
})

const contenedorPeliculas = document.querySelector("#contenedorPeliculas");
const botonesCategorias = document.querySelectorAll(".botonTipo");
let botonesComprar = document.querySelectorAll(".peliculaComprar");
const contador = document.querySelector("#contador");


function cargarPeliculas(peliculasElegidas){

    contenedorPeliculas.innerHTML = "";

    peliculasElegidas.forEach(pelicula => {

        const div = document.createElement("div");
        div.classList.add("pelicula");
        div.innerHTML= `
        <img class="peliculaImagen" src="${pelicula.imagen}" alt="${pelicula.titulo}"">
        <div class="peliculaDetalles">
        <h3 class="peliculaTitulo">"${pelicula.titulo}"</h3>
        <p class="peliculaDuracion">${pelicula.duracion} min</p>
        <p class="peliculaPrecio">$${pelicula.precio} </p>
        <button class="peliculaComprar"id=${pelicula.id}>Comprar</button>
        </div>`;

        contenedorPeliculas.append(div);


})
actualizarAgregar();

}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click",(e)=> {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if(e.currentTarget.id != "Todas") {
        const peliculasBoton = peliculas.filter(pelicula => pelicula.categoria.id === e.currentTarget.id);
        cargarPeliculas(peliculasBoton);
        } else{
            cargarPeliculas(peliculas); 
        }
    })
})

function actualizarAgregar() {
    botonesComprar = document.querySelectorAll(".peliculaComprar");

    botonesComprar.forEach(boton => {
        boton.addEventListener("click", agregarAlResumen);
    });
}

let peliculasResumen;

const peliculasResumenLS = JSON.parse(localStorage.getItem("peliculas-en-resumen"));

if(peliculasResumenLS) {
    peliculasResumen = (peliculasResumenLS);
    actualizarContador();
} else {
    peliculasResumen = [];
}


function agregarAlResumen(e){
    const idBoton = e.currentTarget.id;
    const peliculaComprada = peliculas.find(pelicula => pelicula.id === idBoton);

    if(peliculasResumen.some(pelicula => pelicula.id === idBoton)){
    const index = peliculasResumen.findIndex(pelicula => pelicula.id === idBoton);
    peliculasResumen[index].cantidad++;

    } else {
    peliculaComprada.cantidad =1 ;
    peliculasResumen.push(peliculaComprada);
    }

    actualizarContador();

    localStorage.setItem("peliculas-en-resumen", JSON.stringify(peliculasResumen));
}


function actualizarContador(){
        let nuevoContador = peliculasResumen.reduce((acc, pelicula) => acc + pelicula.cantidad, 0);
        contador.innerText = nuevoContador;
}
