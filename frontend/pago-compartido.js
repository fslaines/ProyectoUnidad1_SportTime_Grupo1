// Reserva de ejemplo del prototipo de Figma
const TARIFA = 1;
const HORAS = 4;
const TOTAL = TARIFA * HORAS;

// Cada aporte es un objeto: { nombre, monto, estado }
let aportes = [];

const selParticipantes = document.getElementById('num-participantes');
const btnCrear = document.getElementById('btn-crear');
const divAportes = document.getElementById('aportes');
const pResumen = document.getElementById('resumen');
const btnCompletar = document.getElementById('btn-completar');
const pMsgPago = document.getElementById('msg-pago');

function totalConfirmado() {
  let suma = 0;
  for (const a of aportes) {
    if (a.estado === 'Confirmado') suma += a.monto;
  }
  return suma;
}

function crearPagoCompartido() {
  const n = Number(selParticipantes.value);
  const monto = TOTAL / n;
  aportes = [];
  for (let i = 0; i < n; i++) {
    aportes.push({
      nombre: i === 0 ? 'Tú (creador)' : 'Invitado ' + i,
      monto: monto,
      estado: 'Pendiente',
    });
  }
  pMsgPago.textContent = '';
  mostrarAportes();
}

function pagar(indice) {
  aportes[indice].estado = 'Confirmado';
  mostrarAportes();
}

function mostrarAportes() {
  divAportes.innerHTML = '';
  aportes.forEach((a, i) => {
    const fila = document.createElement('p');
    fila.textContent = a.nombre + ' · US$' + a.monto + ' · ' + a.estado + ' ';
    if (a.estado === 'Pendiente') {
      const boton = document.createElement('button');
      boton.textContent = 'Pagar';
      boton.onclick = () => pagar(i);
      fila.appendChild(boton);
    }
    divAportes.appendChild(fila);
  });

  const confirmado = totalConfirmado();
  pResumen.textContent =
    'Confirmado: US$' + confirmado + ' de US$' + TOTAL +
    ' · Saldo pendiente: US$' + (TOTAL - confirmado);
  btnCompletar.disabled = confirmado < TOTAL;
}

function completarReserva() {
  const codigo = 'SP-' + Math.floor(1000 + Math.random() * 9000);
  pMsgPago.className = 'exito';
  pMsgPago.textContent = 'Reserva confirmada. Código: ' + codigo;
  btnCompletar.disabled = true;
}

btnCrear.onclick = crearPagoCompartido;
btnCompletar.onclick = completarReserva;