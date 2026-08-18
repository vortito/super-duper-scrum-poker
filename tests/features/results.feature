Feature: Revelado de Cartas y Resultados
  Como equipo de desarrollo
  Quiero ver los votos revelados, el promedio o el consenso alcanzado
  Y poder iniciar nuevas rondas de estimación

  Scenario: Revelar cartas y calcular el promedio de estimaciones diferentes
    Given una sala activa con "Alice" y "Bob"
    And "Alice" vota la carta "5"
    And "Bob" vota la carta "8"
    When "Alice" pulsa en "Revelar Cartas"
    Then las cartas se revelan mostrando "5" y "8" en el tablero
    And el promedio mostrado en pantalla es "6.5"

  Scenario: Detección automática de consenso unánime
    Given una sala activa con "Alice" y "Bob"
    And "Alice" vota la carta "5"
    And "Bob" vota la carta "5"
    When "Alice" pulsa en "Revelar Cartas"
    Then se muestra el mensaje de consenso "¡Trato hecho!" con el valor acordado "5"

  Scenario: Reiniciar la sala para una nueva ronda
    Given una sala con votos revelados entre "Alice" y "Bob"
    When "Alice" pulsa en "Nueva Ronda"
    Then las cartas del tablero se ocultan y los votos se reinician a "0 / 2 votos"
