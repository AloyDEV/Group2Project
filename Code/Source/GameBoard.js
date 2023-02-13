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
    constructor(color, number, file, globalNumber) {
        //Color: Red, Blue, Green, Yellow, Wild
        this.color = color;
        //Number: 0-9, Draw, Reverse, Skip
        this.number = number;
        this.file = file;

        //globalNumber is used to keep every single card unique
        this.globalNumber = globalNumber;

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
    getGlobalNumber(){
        return this.globalNumber;
    }

}


//Deck Class
class Deck{

    constructor(){
        this.deck = []; //TODO: Maybe this could be a Hashmap, for better performance?
        this.deckSize = 0;  //For easy reference to the size.  Might need for a check in each player move that the deck hasn't run out of cards.
    }

    getSize(){
        return this.deckSize;
    }
    getDeckContents(){
        return this.deck;
    }
    addCard(newCard){
        this.deck[this.deckSize] = newCard;
        this.deckSize++;
    }
    //TODO: Add logic to remove cards
    removeCard(removedCard){
        //Removed based on the cards Global Number
        removedCard.getGlobalNumber();

    }
    //Loop over the deck 10000 times, randomly swapping items in it
    shuffle(){

    }


}
//108 cards
    //0: once per color
    //1-9, draw, reverse, skip: Twice per color
        //20 = draw
        //21 = reverse
        //22 = skip
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
//TODO: Put deck creation in a function.  Maybe a separate file
const cardFilenames = [
        "Blue_0.png",
        "Blue_1.png",
        "Blue_2.png",
        "Blue_3.png",
        "Blue_4.png",
        "Blue_5.png",
        "Blue_6.png",
        "Blue_7.png",
        "Blue_8.png",
        "Blue_9.png",
        "Blue_20.png",
        "Blue_21.png",
        "Blue_22.png",

        "Green_0.png",
        "Green_1.png",
        "Green_2.png",
        "Green_3.png",
        "Green_4.png",
        "Green_5.png",
        "Green_6.png",
        "Green_7.png",
        "Green_8.png",
        "Green_9.png",
        "Green_20.png",
        "Green_21.png",
        "Green_22.png",

        "Red_0.png",
        "Red_1.png",
        "Red_2.png",
        "Red_3.png",
        "Red_4.png",
        "Red_5.png",
        "Red_6.png",
        "Red_7.png",
        "Red_8.png",
        "Red_9.png",
        "Red_20.png",
        "Red_21.png",
        "Red_22.png",

        "Yellow_0.png",
        "Yellow_1.png",
        "Yellow_2.png",
        "Yellow_3.png",
        "Yellow_4.png",
        "Yellow_5.png",
        "Yellow_6.png",
        "Yellow_7.png",
        "Yellow_8.png",
        "Yellow_9.png",
        "Yellow_20.png",
        "Yellow_21.png",
        "Yellow_22.png",

        "Wild_11.png",
        "Wild_14.png",
];

let gameDeck = new Deck();

for(let iCardFilenames = 0; iCardFilenames<cardFilenames.length; iCardFilenames++){

    //Used to globally identify different cards, since there are duplicates of almost every card.
    let cardGlobalNumber = 1; //Start global number at 1, up to 108, for slightly easier tracking

    //Split the card color from the card number
    let cardFileInfo = cardFilenames[iCardFilenames].split("_");

    //Split the card number from the PNG extension
    let cardFileNumber = cardFileInfo[1].split(".");

    let tempCard = new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber);
    if(debug){console.log(tempCard)}

//One zero card per color
    if(cardFileNumber[0] == 0){
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
    }
//Two of the 1-9 cards per color
    if(cardFileNumber[0] > 0 && cardFileNumber[0] < 10){
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;

    }
//Two of the draw/reverse/skip cards
    if(cardFileNumber[0] >= 20){
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;

    }
//Four of the 2 different wild cards
    if(cardFileNumber[0] >= 11 && cardFileNumber[0] <= 14){
        //TODO: put into a loop.  Or a function where the # of cards to be added (and the card) is passed in)
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
        gameDeck.addCard(tempCard);
        cardGlobalNumber++;
    }

    if(cardGlobalNumber>108){
        if(debug){console.log("ISSUE: Somehow there are more than 108 cards:")};
        if(debug){console.log(gameDeck)};
    }

    if(debug){console.log(gameDeck)};
}

if(debug){console.log(gameDeck)}
if(debug){console.log(gameDeck.getSize())}



// //Pulls out all elements, and the src tag contains the filename
// let allCardsStart = document.getElementsByClassName("cardIndividual");
// for (let ii = 0; )
// let deckCardsStart = document.getElementsByClassName("cardIndividual")[0].src.split("/");
// let deckCard = deckCardsStart[deckCardsStart.length-1];
// let cardInfo = deckCard.split("_");
// //
// //One zero card per color
// if(cardInfo[1] == 0){
//
// }
// //Two of the 1-9 cards per color
// if(cardInfo[1] > 0 && cardInfo[1] < 10){
//
// }
// //Two of the draw/reverse/skip cards
// if(cardInfo[1] >= 20){
//
// }
// //Four of the 2 different wild cards
// if(cardInfo[1] >= 11 && cardInfo[1] <= 14){
//
// }
//
// //Build an array of the cards
//     //ALSO include a check for the type of card, to add multiples of it.
//
// if(debug){console.log("Deck of cards: " + deckCardsStart)};
// if(debug){console.log("Individual Card: " + deckCard)};




//Table Class
//Whenever the table is updated, write the game status to a cookie
    //Actually this might be too much data for a cookie.  Maybe local storage?
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

