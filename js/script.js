//Creacion del constructor
class Ingresos {

	constructor(nombre, precio, option){
		this.nombre = nombre;
		this.precio = precio;
		this.option = option;
	}

}


//Funcion para mostrar la fecha local del sistema
document.addEventListener("DOMContentLoaded", function() {

    function FechaActual() {
        const fechaActual = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const fechaFormateada = fechaActual.toLocaleDateString(undefined, options);
        document.getElementById("fecha-actual").textContent = fechaFormateada;
    }
    FechaActual(); //Llama a la funcion para mostrar la fecha al cargar la pagina
  }
);


/*Definicion de la clase que manejara la interaccion 
con los datos ingresados por el usuario*/
class UI {
	addProduct(ingreso){
		let contenido1 = document.getElementById('content1');
		let contenido2 = document.getElementById('content2');
		let element = document.createElement('div');

		if(ingreso.option == "ingresos"){ //Valida si la opcion es "ingresos"
			let valor1 = parseFloat(ingreso.precio); //Convertir el precio a numero

			element.innerHTML = `<div class="card mb-3">
				<div class="card-body carta">
					<p>${ingreso.nombre}</p>
					<p class="carta1">+${valor1}</p> 
				</div>
			</div>`;

		contenido1.appendChild(element);
		} 
		else if (ingreso.option == "egresos"){ //Verifica si la opcion es egresos
			let valor1 = parseFloat(ingreso.precio);
			let n = valor1;
			let i = 0;

			 let porcentaje = (n * 100)/ingreso1;
			 i = Math.round(porcentaje);

			element.innerHTML = `
			<div class="card mb-3">
				<div class="card-body carta">
					<p>${ingreso.nombre}</p>
					<p>-${n} <b>${porcentaje.toFixed(2)} ~ ${i}%</b></p>  
				</div>
			</div>`;

		contenido2.appendChild(element);

		}
	}

	resetForm(){
		document.getElementById('product-form').reset();
	}
}

//Lista para almacenar los ingresos y egresos
ListIng = [];
ListEgr = [];
label1 = document.getElementById('lab_ing');
label2 = document.getElementById('lab_egr');
label3 = document.getElementById('id_total');
porcentaje = document.getElementById('porcentaje');

document.getElementById('product-form').addEventListener('submit', function(e) {
    let nombre = document.getElementById('name').value;
    let precio = parseFloat(document.getElementById('price').value);
    let option = document.getElementById('Opt').value;

	//Verificar que el ingreso sea un numero mayor que cero
	if(option=="ingresos" && precio <=0){
		Swal.fire({
			icon: 'error',
			title: 'Error en el ingreso',
			text: 'El monto del ingreso debe ser positivo',
			confirmButtonText: 'Salir'
		});
		e.preventDefault(); //Evitar la recarga de la pagina
 		return; //Sale de la funcion para no seguir con el flujo
	}  

    ingreso = new Ingresos(nombre, precio, option); //Crear un nuevo objeto de Ingresos
    let ui = new UI(); //Crear un nuevo objeto UI

    // Verificación de campos
    if (nombre != "" && precio != "") {
        if (option === "egresos") {

			//Validar que los egresos no superen los ingresos
			let totalIngresos = ListIng.reduce((acc, curr) => acc + curr, 0);
			let totalEgresos = ListEgr.reduce((acc, curr) => acc + curr, 0);

			if(totalEgresos + precio>totalIngresos){
				Swal.fire({
					icon: 'error',
					title: 'Egreso no permitido',
					text: 'El monto de egresos no puede ser mayor que los ingresos disponibles',
					confirmButtonText: 'Salir'
				});
				e.preventDefault(); //Evita la recarga de la pagina
				return; //Sale de la funcion para no seguir con el flujo
			}

			//Logica que maneja el ingreso de los gastos mensuales
            Swal.fire({
                title: '¿Estás seguro?',
                text: `Estás agregando un egreso por un monto de ${precio}. ¿Deseas continuar?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    ui.addProduct(ingreso); //Agregar el egreso a la interfaz
                    ListEgr.push(precio); //Agregar el monto a la lista de egresos

                    Swal.fire(
                        'Agregado',
                        'Tu egreso ha sido añadido correctamente.',
                        'success'
                    );

                    ui.resetForm(); //Restablecer el formulario
                    agregar(); // Actualizar los valores de ingreso y egreso
                }
            });
        } 
		else {
            //Los ingresos se agregan directamente a la transacción siempre que sean mayores que cero
            ui.addProduct(ingreso);
            ListIng.push(precio); //Agregar el monto a la lista de ingresos

            Swal.fire({
                icon: 'success',
                title: 'Transacción agregada',
                text: `Se ha agregado correctamente ${nombre} con un monto de ${precio}`,
                showConfirmButton: false,
                timer: 2000
            });

            ui.resetForm(); //Restablecer el formulario
            agregar(); // Actualizar los valores
        }
    } 
	else {
        Swal.fire({ //Mostrar error si faltan campos
            icon: 'error',
            title: 'Error',
            text: 'Por favor, rellena todos los campos',
            confirmButtonText: 'Salir'
        });
    }

    e.preventDefault(); // Evita la recarga de la página
});

//Funcion para calcular y actualizar los ingresos, egresos y porcentaje
function agregar(){

		let numero1 = ListIng;
		let numero2 = ListEgr;
		ingreso1 = 0;
		ingreso2 = 0;
		ingreso3 = 0;
		porcentual = 0;
		x = 0;

		//Calcular el total de ingresos
		for(let i = 0; i < numero1.length; i++){
			ingreso1+=numero1[i];
		}

		//Calcular el total de egresos
		for(let i = 0; i < numero2.length; i++){
			ingreso2+=numero2[i];
		}

		//Calculo del saldo total
		ingreso3 = ingreso1 - ingreso2;

		//Ecuacion que calculara el porcentaje de egresos respecto a ingresos
		porcentual = (ingreso2 * 100)/ingreso1;
		x = Math.round(porcentual);

		label1.innerHTML = `<p>INGRESOS: +${ingreso1.toFixed(2)}</p>`;
		label2.innerHTML = `<p>EGRESOS: -${ingreso2.toFixed(2)}</p>`;
		label3.innerHTML = `<h1>${ingreso3.toFixed(2)}</h1>`;
		porcentaje.innerHTML = `${porcentual.toFixed(2)} ~ ${x}%`;		
}

//Variables para cambiar de pestañas
const option1 = document.getElementById('option1');
const option2 = document.getElementById('option2');
const content1 = document.getElementById('content1');
const content2 = document.getElementById('content2');

let chose = 2; //Determina cual pestaña esta activa por defecto

//Funcion para cambiar la pestaña activa
const changeOption = () => {
	chose == 1 ? (
		option1.classList.value = 'option option-active',
		content1.classList.value = 'content content-active'
		): 
		
		(
		option1.classList.value = 'option',
		content1.classList.value = 'content'
		)

	chose == 2 ? (
		option2.classList.value = 'option option-active',
		content2.classList.value = 'content content-active'
		):
		
		(
		option2.classList.value = 'option',
		content2.classList.value = 'content'
		)
}

option1.addEventListener('click', () => {
	chose = 1;
	changeOption();
}
)

option2.addEventListener('click', () => {
	chose = 2;
	changeOption();
}
)

