Feature: Reserved seating tests 
    Scenario: Reserved standart seat
        Given user is on "http://qamid.tmweb.ru/" page
        When user choose day of week by 13
        When user choose film by 1 and "13:00"
        When user choose row 1 seat 1
        When user click button for reserved
        Then user sees the 100 price of ticket
        Then user sess button "Получить код бронирования"


    Scenario: Reserved VIP seat
        Given user is on "http://qamid.tmweb.ru/" page
        When user choose day of week by 20
        When user choose film by 2 and "20:00"
        When user choose row 1 seat 11 
        When user click button for reserved
        Then user sees the 650 price of ticket
        Then user sess button "Получить код бронирования"

    Scenario: Cannot book the same seat twice
        Given user is on "http://qamid.tmweb.ru/" page
        When user choose day of week by 20
        When user choose film by 2 and "20:00"
        When user choose row 1 seat 7
        When user click button for reserved
        When user click button for get code
        Given user is on "http://qamid.tmweb.ru/" page 
        When user choose day of week by 20
        When user choose film by 2 and "20:00"
        When user choose row 1 seat 7
        Then user sess that button is disabled 