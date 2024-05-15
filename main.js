const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

// Elemento HTML para mostrar las coordenadas
const coordinatesDisplay = document.createElement("div");
coordinatesDisplay.style.position = "absolute";
coordinatesDisplay.style.top = "10px";
coordinatesDisplay.style.left = "10px";
coordinatesDisplay.style.color = "black";
document.body.appendChild(coordinatesDisplay);

class Circle {
    constructor(x, y, radius, color, text) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.defaultColor = color; 
        this.color = color;
        this.text = text;
        this.velocityX = 0; // Velocidad X fija
        this.velocityY = -1; // Velocidad Y negativa para ir hacia arriba
        this.appeared = false; // Bandera para indicar si la esfera ha aparecido
    }

    draw(Context) {
        Context.beginPath();
        Context.fillText(this.text, this.posX, this.posY);
        Context.strokeStyle = this.color; // Establece el color del contorno
        Context.textAlign = 'center'; // Centra el texto en el eje X
        Context.font = '30px Arial';
        Context.lineWidth = 3; // Tamaño de la línea de los círculos
        Context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false); // Coordenadas del centro del círculo (this.posX, this.posY), el radio del círculo (this.radius), el ángulo inicial (0), el ángulo final (Math.PI * 2, que representa un círculo completo) y la dirección del dibujo (false para dibujar en sentido horario).
        Context.stroke(); // Trazar el contorno del círculo en el lienzo.
        Context.closePath(); // Cerrar el trazado de camino actual
    }

    update() {
        // Si la esfera aún no ha aparecido completamente
        if (!this.appeared) {
            // Si la posición Y de la esfera es menor que la altura de la pantalla menos el radio de la esfera
            if (this.posY < window_height - this.radius) {
                // Incrementa la posición Y para mover la esfera hacia arriba
                this.posY += this.velocityY;
            } else {
                // La esfera ha aparecido completamente
                this.appeared = true;
            }
        } else {
            // Si la esfera ha aparecido completamente, continúa moviéndola hacia arriba
            this.posY += this.velocityY;
    
            // Si la posición Y de la esfera es menor o igual que el radio de la esfera
            if (this.posY <= this.radius) {
                // Elimina la esfera del array
                arrayCircle.splice(arrayCircle.indexOf(this), 1);
            }
        }
        
        // Detectar colisión con los bordes izquierdo y derecho de la pantalla
        if (this.posX - this.radius <= 0 || this.posX + this.radius >= window_width) {
            // Cambiar la dirección de la velocidad X para simular rebote
            this.velocityX *= -1;
        }
    }
}

let arrayCircle = [];

// Función para agregar una esfera al array con un retardo
function addCircleWithDelay() {
    if (arrayCircle.length < 10) {
        let randomX = Math.random() * (window_width - 100) + 50; // Limita la posición X entre 50 y window_width - 50
        let randomRadius = Math.floor(Math.random() * 100 + 25); // Radio de los círculos va de 1 a 99 y no es más pequeño que 25
        let color = arrayCircle.length % 2 === 0 ? 'green' : 'red'; // Alterna entre verde y rojo
        let circleNumber = arrayCircle.length + 1; // Numero del círculo
        let miCirculo = new Circle(randomX, window_height + randomRadius, randomRadius, color, circleNumber); // Posición inicial en la parte inferior del lienzo
        arrayCircle.push(miCirculo);
        setTimeout(addCircleWithDelay, 1000 * arrayCircle.length); // Aumenta el retraso en función de la cantidad de círculos
    }
}
let circleCounter = 0; // Variable para llevar la cuenta de cuántos círculos se han creado

function addCircleWithDelay() {
    if (circleCounter < 10) { // Verifica si ya se han creado menos de 10 círculos
        let randomX = Math.random() * (window_width - 100) + 50; // Limita la posición X entre 50 y window_width - 50
        let randomRadius = Math.floor(Math.random() * 100 + 25); // Radio de los círculos va de 1 a 99 y no es más pequeño que 25
        let color = circleCounter % 2 === 0 ? 'green' : 'red'; // Alterna entre verde y rojo
        let circleNumber = circleCounter + 1; // Numero del círculo
        let miCirculo = new Circle(randomX, window_height + randomRadius, randomRadius, color, circleNumber); // Posición inicial en la parte inferior del lienzo
        arrayCircle.push(miCirculo);
        circleCounter++; // Incrementa el contador de círculos creados
        setTimeout(addCircleWithDelay, 1000); // Crea un círculo cada segundo
    }
}

addCircleWithDelay(); // Comienza a agregar esferas

// Función para manejar la colisión entre dos círculos
function handleCollision(miCirculo1, miCirculo2) {
    const dx = miCirculo1.posX - miCirculo2.posX;
    const dy = miCirculo1.posY - miCirculo2.posY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const over = miCirculo1.radius + miCirculo2.radius - dist;
    // Evita la superposición
    const angulo = Math.atan2(dy, dx);
    const moveX = over * Math.cos(angulo);
    const moveY = over * Math.sin(angulo);
    miCirculo1.posX += moveX / 2;
    miCirculo1.posY += moveY / 2;
    miCirculo2.posX -= moveX / 2;
    miCirculo2.posY -= moveY / 2;
    // Realizaimular el rebote
    const tempVelocityX = miCirculo1.velocityX;
    const tempVelocityY = miCirculo1.velocityY;
    miCirculo1.velocityX = miCirculo2.velocityX;
    miCirculo1.velocityY = miCirculo2.velocityY;
    miCirculo2.velocityX = tempVelocityX;
    miCirculo2.velocityY = tempVelocityY;


   // Cambia los colores de los círculos al rebotar
   const newColor = miCirculo1.color === 'green' ? 'red' : 'green';
   miCirculo1.color = newColor;
   miCirculo2.color = newColor;
}

// Función para verificar colisiones entre dos círculos
function checkCollision(miCirculo1, miCirculo2) {
    const dx = miCirculo1.posX - miCirculo2.posX;
    const dy = miCirculo1.posY - miCirculo2.posY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    return dist <= miCirculo1.radius + miCirculo2.radius;
}

canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    coordinatesDisplay.innerText = `(${mouseX.toFixed(1)}, ${mouseY.toFixed(1)})`; // Muestra las coordenadas con un decimal
});

// Agrega un evento de clic al canvas
canvas.addEventListener('click', function(event) {
    // Obtiene las coordenadas del mouse en la ventana
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Itera sobre cada burbuja en el array de burbujas
    for (let i = 0; i < arrayCircle.length; i++) {
        // Obtiene la burbuja actual en el ciclo
        const circle = arrayCircle[i];
        
        // Calcula la distancia entre el centro de la burbuja y las coordenadas del clic del mouse
        const distance = Math.sqrt((mouseX - circle.posX) * 2 + (mouseY - circle.posY) * 2);
        
        // Verifica si la distancia es menor o igual al radio de la burbuja
        if (distance <= circle.radius) {
            // Si el clic está dentro de la burbuja, la elimina del array
            arrayCircle.splice(i, 1);
            // Sale del bucle una vez que se ha eliminado la burbuja
            break;
        }
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas en todo momento
    for (let i = 0; i < arrayCircle.length; i++) {
        arrayCircle[i].update(); // Actualiza la posición de los círculos
        arrayCircle[i].draw(ctx); // Dibuja los círculos
    }

    // Verifica colisiones
    for (let i = 0; i < arrayCircle.length; i++) {
        for (let j = i + 1; j < arrayCircle.length; j++) {
            if (checkCollision(arrayCircle[i], arrayCircle[j])) {
                handleCollision(arrayCircle[i], arrayCircle[j]);
            }
        }
    }

    requestAnimationFrame(animate); // Llama el próximo frame
}

animate(); // Comienza la animación
