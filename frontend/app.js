// Datos de ejemplo (simulan la base de datos)
const canchas = [
  { id: 1, nombre: 'Cancha 01 · Exterior', precio: 1 },
  { id: 2, nombre: 'Cancha 02 · Cubierta', precio: 1 },
  { id: 3, nombre: 'Cancha 03 · Exterior', precio: 1 },
  { id: 4, nombre: 'Cancha 04 · Cubierta', precio: 1 },
];
const HORA_INICIO = 8;
const HORA_FIN = 22;

const hoy = new Date().toLocaleDateString('en-CA');
const reservas = [
  { canchaId: 1, fecha: hoy, hora: '18:00', codigo: 'SP-0001' },
  { canchaId: 1, fecha: hoy, hora: '19:00', codigo: 'SP-0002' },
];

const selFecha = document.getElementById('fecha');
const selCancha = document.getElementById('cancha');
const selDuracion = document.getElementById('duracion');
const divHorarios = document.getElementById('horarios');
const pPrecio = document.getElementById('precio');
const pMensaje = document.getElementById('mensaje');

function horaTexto(h) {
  return String(h).padStart(2, '0') + ':00';
}

function estaOcupado(canchaId, fecha, hora) {
  return reservas.some(
    (r) => r.canchaId === canchaId && r.fecha === fecha && r.hora === hora
  );
}

function bloqueLibre(canchaId, fecha, horaInicio, duracion) {
  if (horaInicio + duracion > HORA_FIN) return false;
  for (let i = 0; i < duracion; i++) {
    if (estaOcupado(canchaId, fecha, horaTexto(horaInicio + i))) return false;
  }
  return true;
}

function mostrarHorarios() {
  const canchaId = Number(selCancha.value);
  const duracion = Number(selDuracion.value);
  const cancha = canchas.find((c) => c.id === canchaId);
  pPrecio.textContent =
    'Tarifa: US$' + cancha.precio + ' por hora · Total: US$' + cancha.precio * duracion;
  divHorarios.innerHTML = '';

  for (let h = HORA_INICIO; h < HORA_FIN; h++) {
    const boton = document.createElement('button');
    boton.textContent = horaTexto(h) + ' – ' + horaTexto(h + duracion);
    boton.className = 'hora';

    if (bloqueLibre(canchaId, selFecha.value, h, duracion)) {
      boton.classList.add('libre');
      boton.onclick = () => reservar(h);
    } else {
      boton.classList.add('ocupado');
      boton.disabled = true;
    }
    divHorarios.appendChild(boton);
  }
}

function reservar(horaInicio) {
  const canchaId = Number(selCancha.value);
  const duracion = Number(selDuracion.value);
  const fecha = selFecha.value;
  const cancha = canchas.find((c) => c.id === canchaId);
  const total = cancha.precio * duracion;

  // Si alguien lo reservó mientras tanto, mostrar error
  if (!bloqueLibre(canchaId, fecha, horaInicio, duracion)) {
    pMensaje.className = 'error';
    pMensaje.textContent = 'El horario ya no está disponible. Elige otro.';
    mostrarHorarios();
    return;
  }

  const rango = horaTexto(horaInicio) + ' – ' + horaTexto(horaInicio + duracion);
  if (!confirm('¿Reservar ' + rango + ' el ' + fecha + '? Total: US$' + total)) return;

  const codigo = 'SP-' + Math.floor(1000 + Math.random() * 9000);
  for (let i = 0; i < duracion; i++) {
    reservas.push({ canchaId, fecha, hora: horaTexto(horaInicio + i), codigo });
  }
  pMensaje.className = 'exito';
  pMensaje.textContent = 'Reserva confirmada. Código: ' + codigo + ' · Total: US$' + total;
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
selDuracion.onchange = mostrarHorarios;
mostrarHorarios();