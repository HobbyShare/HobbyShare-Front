describe('EventDetail', () => {

  // ✅ Test 1: Carga de detalles del evento
  it('should load and display event details on init', async () => {
    // Verifica que cargue evento y muestre título, descripción, etc.
  });

  // ✅ Test 2: Permisos del creador
  it('should show edit and delete buttons only for event creator', async () => {
    // Verifica que isCreator() funcione y muestre botones correctos
  });

  // ✅ Test 3: Unirse a evento
  it('should allow non-creator to join event', async () => {
    // Simula click en "Unirme" y verifica que actualice participantes
  });

  // ✅ Test 4: Eliminar evento
  it('should delete event and navigate back when creator clicks delete', async () => {
    // Verifica que solo el creador pueda eliminar
  });

  // ✅ Test 5: Renderizado del mapa
  it('should display embedded map with event location', () => {
    // Verifica que el iframe del mapa se renderice con las coordenadas
  });
});
