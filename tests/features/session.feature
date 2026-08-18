Feature: Gestión de Salas y Participantes
  Como facilitador o participante de un equipo ágil
  Quiero crear salas y unirme a sesiones existentes
  Para poder estimar historias de usuario en equipo

  Scenario: Crear una nueva sala de estimación exitosamente
    Given que un usuario entra a la pantalla de inicio
    When crea una sala con el nombre "Alice"
    Then ve el tablero de la sala con un identificador único
    And "Alice" aparece en la lista de participantes

  Scenario: Unirse a una sala existente mediante enlace directo
    Given que "Alice" ha creado una sala de estimación
    When "Bob" accede mediante el enlace de invitación de la sala
    And confirma su entrada con el nombre "Bob"
    Then "Bob" entra a la sala
    And "Alice" y "Bob" se ven mutuamente en la sala de estimación

  Scenario: Validaciones de campos obligatorios en el formulario
    Given que un usuario entra a la pantalla de inicio
    Then el botón de comenzar sesión está deshabilitado si el nombre está vacío
