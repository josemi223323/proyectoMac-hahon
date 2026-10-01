export function crearInterfaz(seleccionada) {
  const modal = document.getElementById("modal");
  const modalTitulo = document.getElementById("modal-titulo");
  const modalTexto = document.getElementById("modal-texto");

  modalTitulo.textContent = seleccionada.nombre;
  modalTexto.textContent = seleccionada.pais;
  modal.showModal();
}
