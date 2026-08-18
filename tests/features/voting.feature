Feature: Votación con Cartas Fibonacci
  Como miembro del equipo
  Quiero seleccionar y cambiar mi carta de estimación
  Para expresar mi valoración del esfuerzo de forma síncrona

  Scenario: Votación sincronizada entre múltiples jugadores
    Given una sala activa con "Alice" y "Bob"
    When "Alice" vota la carta "5"
    And "Bob" vota la carta "8"
    Then el indicador de votos muestra "2 / 2 votos" tanto para "Alice" como para "Bob"

  Scenario: Un jugador cambia su voto antes del revelado
    Given una sala activa con "Alice" y "Bob"
    When "Alice" vota la carta "3"
    And "Alice" cambia su voto por la carta "8"
    Then la carta seleccionada por "Alice" es la "8"
