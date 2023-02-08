//Handles all the code for the actual game


//To start, pull the userdata out of the cookie
let usersCookie = document.cookie;
document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


//Player Class


//Player Hand Class


//Deck Class
//When a card is discarded, put it at the bottom of the deck.


//Table Class
//Whenever the table is updated, write the game status to a cookie
document.cookie = "UNOGameState=None;expires=" + today.setTime(today.getTime() + (365*24*60*60*1000)); + "; path=/";


//Computer Player Class


//Computer Player Next Play Function
    //Logic, with some randomization & prioritization, when deciding what card to play and/or who to play it against


//Shuffle Deck Function


//Player Move Function


//Current Player Function


//Check Win Status Function


//Restart Game function
    //Cancel the existing cookie
    document.cookie = "UNOusers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
