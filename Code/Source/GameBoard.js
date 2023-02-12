//Handles all the code for the actual game

var debug = true;

if(debug){console.log("Game Board JS is loading");}


//Player Class
class Player {
    constructor(playerNumber, playerName) {

    }

    getPlayerNumber() {

    }

    getName() {

    }

    getHand() {

    }

    getNumberOfCards() {

    }
}


//Player Hand Class
class PlayerHand{
    //Does this class need to do any sorting?  Or random order should be fine?
    constructor(){
        this.hand = [];
    }

    addCard(){
        this.hand.add()

        return trueorfalse;
    }
    removeCard(color, number){

    }

    removeCard(){
    }
}

//Card Class
class Card {
    constructor(color, number, file) {
        //Color: Red, Blue, Green, Yellow, Wild
        this.color = color;
        //Number: 0-9, Draw, Reverse, Skip
        this.number = number;
        this.file = file;

    }
    getColor(){
        return this.color;
    }
    getNumber(){
        return this.number;
    }
    getFile(){
        return this.file;
    }
}


//Deck Class
//108 cards
    //0: once per color
    //1-9, draw, reverse, skip: Twice per color
    //Wild cards: 4 of each type
    //When a card is discarded, put it at the bottom of the deck.
    //Loop over all the card files to build the deck
    //Determine the card type based on the file name
//Color: Red, Blue, Green, Yellow, Wild
//Number: 0-9, Draw, Reverse, Skip

//It appaers to be more difficult than I expected to loop over the files in the folder.
    //Might need to load them in the DOM, hide then, then access them in the DOM when needed
    //OR: Hardcode all of the file names

//  Folder with the cards: /Code/Cards/Blue_0.png
//Pulls out all elements, and the src tag contains the filename
let deckStart = document.getElementsByClassName("cardIndividual")[0].src;
 let elements = deckStart.split("/");
 let temp = elements[elements.length-1];
// if(debug){console.log(elements.length)};
if(debug){console.log(temp)};




//Table Class
//Whenever the table is updated, write the game status to a cookie
const today = new Date();
document.cookie = "UNOGameState=None;expires=" + today.setTime(today.getTime() + (365*24*60*60*1000)); + "; path=/";


//Computer Player Class
    //Track their hand
    //Include the ability to cheat???


//Computer Player Next Play Function
    //Logic, with some randomization & prioritization, when deciding what card to play and/or who to play it against


//Shuffle Deck Function
    //10000 loops over the deck???


//Player Move Function
//Regular rules:
/*


 */

// Two Player Rules:
//
// For two players, there is a slight change of rules:
//
//     Reverse works like Skip
// Play Skip, and you may immediately play another card
// If you play a Draw Two or Wild Draw Four card, your opponent has to draw the number of cards required, and then play immediately resumes back on your turn.



//Current Player Function


//Check Win Status Function


//Modal Box for messages



//Restart Game function
    //Cancel the existing cookie
    document.cookie = "UNOGameState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


//Create new users function
    document.cookie = "UNOusers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";


//Starting code: pull the userdata out of the cookie
//let usersCookie = document.cookie;
//document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//After the DOM has loaded, adjust the player boxes based on the number of players





//TODO: Make this variable.  So that the different buttons & places can bring up a modal box
    //Pass in the HTML that will go in the Modal box
//Modal Box Script:
// Get the modal
var modalBackground = document.getElementById("myModal");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the button that opens the modal
var btn = document.getElementById("helpButton");


// When the user clicks the button, open the modal
btn.onclick = function() {
    modalBackground.style.display = "block";
}

// When the user clicks on <span>/X, close the modal
span.onclick = function() {
    modalBackground.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalBackground) {
        if(debug){console.log(event.target)};
        modalBackground.style.display = "none";
    }
    else{
        if(debug){console.log(event.target)};
    }
}






if(debug){console.log("Game Board JS has completed loading");}

