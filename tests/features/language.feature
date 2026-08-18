Feature: Internationalisation and Language Switching
  As an application user
  I want to change the interface language
  So I can use the tool in my preferred language

  Scenario: Switch language to English and French on the home screen
    Given a user visits the home screen
    When they select the language "EN"
    Then the title and subtitle are shown in English
    When they select the language "FR"
    Then the title and subtitle are shown in French
    When they select the language "ES"
    Then the title and subtitle are shown in Spanish
