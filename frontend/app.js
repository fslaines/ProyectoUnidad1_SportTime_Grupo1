// Datos de ejemplo (simulan la base de datos)
const canchas = [
  { id: 1, nombre: 'Cancha de fútbol 1', precio: 20 },
  { id: 2, nombre: 'Cancha de fútbol 2', precio: 15 },
  { id: 3, nombre: 'Cancha de fútbol 3', precio: 12 },
];
const HORA_INICIO = 8;
const HORA_FIN = 22;

const hoy = new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD
// Reservas ya hechas por "otras personas"
const reservas = [
  { canchaId: 1, fecha: hoy, hora: '18:00', codigo: 'SP-0001' },
  { canchaId: 1, fecha: hoy, hora: '19:00', codigo: 'SP-0002' },
];

const selFecha = document.getElementById('fecha');
const selCancha = document.getElementById('cancha');
const divHorarios = document.getElementById('horarios');
const pPrecio = document.getElementById('precio');
const pMensaje = document.getElementById('mensaje');

function estaOcupado(canchaId, fecha, hora) {
  return reservas.some(
    (r) => r.canchaId === canchaId && r.fecha === fecha && r.hora === hora
  );
}

// HU-01: mostrar disponibilidad por hora
function mostrarHorarios() {
  const canchaId = Number(selCancha.value);
  const cancha = canchas.find((c) => c.id === canchaId);
  pPrecio.textContent = 'Precio por hora: $' + cancha.precio;
  divHorarios.innerHTML = '';

  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    const hora = String(h).padStart(2, '0') + ':00';
    const boton = document.createElement('button');
    boton.textContent = hora;
    boton.className = 'hora';

    if (estaOcupado(canchaId, selFecha.value, hora)) {
      boton.classList.add('ocupado');
      boton.disabled = true;
    } else {
      boton.classList.add('libre');
      boton.onclick = () => reservar(hora);
    }
    divHorarios.appendChild(boton);
  }
}

// HU-05: reservar un horario
function reservar(hora) {
  const canchaId = Number(selCancha.value);
  const fecha = selFecha.value;

  // Si alguien lo reservó mientras tanto, mostrar error
  if (estaOcupado(canchaId, fecha, hora)) {
    pMensaje.className = 'error';
    pMensaje.textContent = 'El horario ya no está disponible. Elige otro.';
    mostrarHorarios();
    return;
  }

  if (!confirm('¿Reservar ' + hora + ' el ' + fecha + '?')) return;

  const codigo = 'SP-' + Math.floor(1000 + Math.random() * 9000);
  reservas.push({ canchaId, fecha, hora, codigo });
  pMensaje.className = 'exito';
  pMensaje.textContent = 'Reserva confirmada. Código: ' + codigo;
  mostrarHorarios();
}

// Inicio
canchas.forEach((c) => {
  const op = document.createElement('option');
  op.value = c.id;
  op.textContent = c.nombre;
  selCancha.appendChild(op);
});
selFecha.value = hoy;
selFecha.min = hoy;
selFecha.onchange = mostrarHorarios;
selCancha.onchange = mostrarHorarios;
mostrarHorarios();