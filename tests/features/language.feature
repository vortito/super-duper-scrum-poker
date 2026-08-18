Feature: Internacionalización y Cambio de Idioma
  Como usuario de la aplicación
  Quiero cambiar el idioma de la interfaz
  Para utilizar la herramienta en mi idioma preferido

  Scenario: Cambiar idioma a Inglés y Francés en la pantalla inicial
    Given que un usuario entra a la pantalla de inicio
    When selecciona el idioma "EN"
    Then el título y subtítulo se muestran en inglés
    When selecciona el idioma "FR"
    Then el título y subtítulo se muestran en francés
    When selecciona el idioma "ES"
    Then el título y subtítulo se muestran en español
