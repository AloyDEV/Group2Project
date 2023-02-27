//Handles all the code for the actual game
var debug = true;

//Global variables.  Not strictly best practice, but it's easier to track the deck & players globally than constantly passing them between functions, since they are referenced frequently
    //Note: There's 1 more global, var gameDeck, after the Deck class (Otherwise it threw an error)
//TODO: Might want to put them in a wrapper or namespace for better handling
    //EX: https://stackoverflow.com/questions/1841916/how-to-avoid-global-variables-in-javascript
var playersArray = [];
var discardCard;
var currentPlayer = 0;
var gameDirection = true; //true = top to bottom, false = bottom to top

if(debug){console.log("Game Board JS is loading");}



//TODO:
/*
Event handler for each button, that passes in the HTML in the modal box.

How to track which card is which?  store its Global Number somewhere in the HTML?
Tie each card to an OnClick function, that passes in the card identifier

 */


//Player Class
class Player {
    constructor(playerNumber, playerName) {
        this.playerNumber = playerNumber;
        this.playerName = playerName;
        this.playerHand = [];
    }

    getPlayerNumber() {
        return this.playerNumber;
    }

    getPlayerName() {
        return this.playerName;
    }

    getPlayerHand() {
        return this.playerHand;
    }

    getNumberOfCards() {
        return this.playerHand.length;
    }

    addCard(addedCard){
        let handLengthStart = this.playerHand.length;
        this.playerHand.push(addedCard);
        //If the players hand array increased, the card was added successfully.
        return handLengthStart < this.playerHand.length;
    }

    //TODO: Need to change how getting cards in the hand is handled
    removeCard(cardGlobalNumber){

    }
    getCardSecific(){

    }
    getPlayerCardFile(cardNumber){
        return this.playerHand[cardNumber].getFile();
    }

}


// //Player Hand Class
// class PlayerHand{
//     //Does this class need to do any sorting?  Or random order should be fine?
//     constructor(){
//
// }

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
        this.deck = []; //Javascript doesn't support hashmaps by default, so just using an array.
        //this.deckSize = 0;  //For easy reference to the size.  Might need for a check in each player move that the deck hasn't run out of cards.
    }

    getSize(){
        //return this.deckSize;
        return this.deck.length;
    }
    getDeckContents(){
        return this.deck;
    }
    addCard(newCard){
        this.deck[this.deck.length] = newCard;
        //this.deckSize++;
    }

    getCard(removedCard){
        //Removed based on the cards Global Number
        if(this.deck.length < 1){
            console.log("No more cards!!!!!")
            //TODO: Do something here

            return false;
        }
        else {
            for (let iDeck = 0; iDeck < this.deck.length; iDeck++){
                if(this.deck[iDeck].getGlobalNumber() == removedCard.getGlobalNumber()){
                    let tempRemove = this.deck.splice(iDeck,1);
                    return true;
                }
            }
            return false;
        }

    }
    getTopCard(){
        //Make sure there is at least 1 card in the deck
        if(this.deck.length < 1){
            console.log("No more cards!!!!!")
            //TODO: Do something here
        }
        else {
            //TODO: Add in a check that this successfully pulls back a card.
            return this.deck.splice(0,1)[0];  //SPLICE returns an array.  We need the card IN that array
        }
    }

    //To shuffle the deck, loop over it 10000 times, randomly swapping items in it
    shuffle(){
        for(let iShuffle = 0; iShuffle < 10000; iShuffle++){
            let position1 = Math.floor(Math.random() * this.deck.length);
            let position2 = Math.floor(Math.random() * this.deck.length);
            let card1 = this.deck[position1];
            this.deck[position1] = this.deck[position2];
            this.deck[position2] = card1;
        }
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
//Color: Red, Blue, Green, Yellow, Wild
//Number: 0-9, Draw, Reverse, Skip

// BEGIN DECK BUILDING ---------------------------------------------------------------------------------------------------------------------
//Since there is no backend, the JS can't access files on the server directly.  To get all the card files, names of them are hardcoded below.
//  Folder with the cards: /Code/Cards/

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


var gameDeck = new Deck();
function createDeck(){
    //Build the deck, then shuffle it
    //Used to globally identify different cards, since there are duplicates of almost every card.
    let cardGlobalNumber = 1; //Start global number at 1, up to 108, for slightly easier tracking

    for(let iCardFilenames = 0; iCardFilenames<cardFilenames.length; iCardFilenames++){
        //Card filenames are hard coded to always be consistent.  So there are no checks needed for the processing in this loop

        //Split the card color from the card number
        let cardFileInfo = cardFilenames[iCardFilenames].split("_");

        //Split the card number from the PNG extension
        let cardFileNumber = cardFileInfo[1].split(".");

        //let tempCard = new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber);
        //if(debug){console.log(tempCard)}

//TODO: put into a loop.  Or a function where the # of cards to be added (and the card) is passed in)
//One zero card per color
        if(cardFileNumber[0] == 0){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
        }
//Two of the 1-9 cards per color
        if(cardFileNumber[0] > 0 && cardFileNumber[0] < 10){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;

        }
//Two of the draw/reverse/skip cards
        if(cardFileNumber[0] >= 20){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;

        }
//Four of the 2 different wild cards
        if(cardFileNumber[0] >= 11 && cardFileNumber[0] <= 14){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber));
            cardGlobalNumber++;
        }

        //This should technically end up 1 over 108, since it is always incremented up even in the final loop
        if(cardGlobalNumber>109){
            if(debug){console.log("ISSUE: Somehow there are more than 108 cards:")};
            if(debug){console.log("Card Global Number: " + cardGlobalNumber)};
            if(debug){console.log("Deck:")};
            if(debug){console.log(gameDeck)};
        }
    }

    if(debug){console.log(gameDeck)}

}


// END DECK BUILDING ---------------------------------------------------------------------------------------------------------------------



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


//Player Move Function
//When a card is discarded, immediately move the previous discard card  back into the deck



//Regular rules:
/*

// Two & Four Player Rules:
//
// For two or four players, there is a slight change of rules:
//
//     Reverse works like Skip
// Play Skip, and you may immediately play another card
// If you play a Draw Two or Wild Draw Four card, your opponent has to draw the number of cards required, and then play immediately resumes back on your turn.

*/


//Check Win Status Function


//Restart Game function
    //Cancel the existing cookie
    //document.cookie = "UNOGameState=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //document.cookie = "UNOusers=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    //Reset the deck & discard card

    //Reset all player hands

    //Reset the UI




// BEGIN GAME PREP -------------------------------------------------------------------------------------------------------------------------
//Game prep function:
//Starting code: pull the userdata out of the cookie
//let usersCookie = document.cookie;
//document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//After the DOM has loaded, adjust the player boxes based on the number of players



//I don't think this is needed.  I can just grab the playerArray length if I need the number of players
//var totalPlayerNumber = 0;


//Once the original page structure has loaded, begin the backend game prep
document.addEventListener('DOMContentLoaded', function gamePrep(){

    //First build the deck
    createDeck();
    gameDeck.shuffle();
    if(debug){console.log("Starting deck has been built & shuffled:")};
    if(debug){console.log(gameDeck)};

    //Second create the players by pulling their info out of the cookie
    let playersCookie = getCookie("UNOusers");
    if(playersCookie == ""){
        console.log("Something has gone wrong, the player info is not in the cookie");
        console.log("Defaulting to 3 players with default names");
        var player1 = new Player(1,"Player1");
        var player2 = new Player(2,"Player2");
        var player3 = new Player(3,"Player3");
        var player4 = new Player(4,"Computron");
        playersArray.push(player1, player2, player3, player4);
    }
    else{
        let playersTempArray = playersCookie.split("|");
        for(let iPlayerSetup = 0; iPlayerSetup < playersTempArray.length-1; iPlayerSetup++){ //Minus one off the array length, the players in the cookie always end with a "|" which puts an empty string as the last array item after its split
            //totalPlayerNumber++;
            playersArray.push(new Player(iPlayerSetup, playersTempArray[iPlayerSetup]));
        }
        //Add the computer player
        //totalPlayerNumber++;
        playersArray.push(new Player(playersArray.length, "Mike the All Knowing"));
    }

    if(debug){console.log("Players created:")};
    if(debug){console.log(playersArray)};


    //Third deal each player their hand
        //Nested loops! Always a good idea!
    //At this point, there is no need to check that the deck has enough cards
    for(let iPlayerHandSetup = 0; iPlayerHandSetup < playersArray.length; iPlayerHandSetup++){
        let dealingNumber = 0;
        while(dealingNumber < 7){
            //TODO: Make sure it returns TRUE after each push
            playersArray[iPlayerHandSetup].addCard(gameDeck.getTopCard());
            dealingNumber++;
        }
    }
    (debug ? console.log("Players dealt their hands:") : null);
    if(debug){console.log(playersArray)};

    //Fourth pick the first card for the discard pile.
    discardCard = gameDeck.getTopCard();
    if(debug){console.log("Starting Discard Card:")};
    if(debug){console.log(discardCard)};

    //Last, update the UI to hide un-needed players, match player names, display hands, show the new discard card, and the state of the game.

    //Set the top discard card
    let UIDiscardCard = document.getElementById("UIDiscardCard");
    UIDiscardCard.src = "/Code/Cards/" + discardCard.getFile();

    //Hide players 2 & 3
    let playerBoxes;
    (debug ? console.log("Players: " + playersArray.length) : null);
    switch(playersArray.length) {
        case 3:
            (debug ? console.log("Case 3") : null);

            //ISSUE: RESUME HERE, FLEXBOX CONVERSION!!!!!!!!!!!!!!!!!!!!!!!!
            //  Don't forget to merge this branch into the WIP one when flexbox is working.

            //TODO: Change this to use a FLEXBOX, that would be MUCH easier
            //TODO: Make this variable, could give all player boxes a starting class, loop over those elements, and start the loop backwards to hide the higher numbers
            playerBoxes = document.getElementById("player3Box");
            playerBoxes.className="playerBoxHide";

            playerBoxes = document.getElementById("player2Box");
            playerBoxes.style.height="26.66%" //26.66%
            playerBoxes = document.getElementById("player1Box");
            playerBoxes.style.height="26.66%"
            playerBoxes = document.getElementById("player4Box");
            playerBoxes.style.height="26.66%"

            break;
        case 2:
            (debug ? console.log("Case 2") : null);

            playerBoxes = document.getElementById("player3Box");
            playerBoxes.className="playerBoxHide";
            playerBoxes = document.getElementById("player2Box");
            playerBoxes.className="playerBoxHide";

            playerBoxes = document.getElementById("player1Box");
            playerBoxes.style.height="40%" //40
            playerBoxes = document.getElementById("player4Box");
            playerBoxes.style.height="40%"

            break;
        default:
            //DO NOTHING!!!!
    }

    //Put player names into the UI
    let UIPlayerNames = document.getElementsByClassName("playerBoxShow");

    if(playersArray.length != UIPlayerNames.length){
        console.log("Somethings gone wrong. The # of players in the cookie is not matching the # players in the UI.")
        console.log("ABORT!!!!!")
        //TODO: Reset the game, and default the players (3 players, default names)
    }
    /*
    Player box in the UI:
        <div id="player1Box" class="playerBoxShow">
            <div id="player1Name">Player 1</div>
            <div id="player1Hand" class="playerHand"> HAND!!!</div>
        </div>
     */
    else{
        //Loop over all players
        for(let iUIPnames = 0; iUIPnames < playersArray.length; iUIPnames++) {
            let playerHTML = '<div id="player'+(iUIPnames+1)+'Name" style="height:10%; border: white solid 1px;">'+playersArray[iUIPnames].getPlayerName() + '</div>';
            let playerHand = playersArray[iUIPnames].getPlayerHand();
            playerHTML = playerHTML + '<div id="player1Hand" className="playerHand" style="height:90%; border: purple solid 3px;">';

            //ISSUE: Put the player cards into a flexbox
            //  Once this flexbox and the one for the overall player boxes are done, merge this branch into the WIP branch
            //Loop over the players hand
            for(let iUIPhand = 0; iUIPhand < playerHand.length; iUIPhand++){
                //TODO: Resize the cards, and stack then next to each other
                playerHTML = playerHTML + '<img id="'+playerHand[iUIPhand].getGlobalNumber()+
                    '" src="/Code/Cards/'+playerHand[iUIPhand].getFile()+'" style="height:50%; margin-left: 1%;"/>';
            }
            playerHTML = playerHTML + '</div>';
            UIPlayerNames[iUIPnames].innerHTML = playerHTML;

            //TODO: For non-active players, flip the cards over and only show the back
        }
    }
});

// END GAME PREP -------------------------------------------------------------------------------------------------------------------------

function getCookie(cookieName) {
    /*
    Different way to get the players from the cookie:
    let usersCookie = document.cookie;
    console.log(usersCookie);
    console.log(document.cookie.indexOf("UNOusers"));
     */


    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cokiesArray = decodedCookie.split(';');
    for(let i = 0; i <cokiesArray.length; i++) {
        let c = cokiesArray[i];
        //Trim excess spaces from the cookie
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        //Return the cookie if its found
        if (c.indexOf(name) == 0) {
            //Pull out the value stored in the cookie, by grabbing the string after the cookie name
            return c.substring(name.length, c.length);
        }
    }
    return "";
}



// BEGIN MODAL BOX FUNCTIONS ------------------------------------------------------------------------------------------------------------------
function hideModalBoxFunction(mouseEvent){
    if (mouseEvent.target == modalBackground || mouseEvent.target ==modalCloseButton) {
        if(debug){console.log("Modal box element clicked: " + mouseEvent.target)};
        modalBackground.style.display = "none";
    }
}

function showModalBoxFunction(mouseEvent, modalHTML){
    modalBackground.style.display = "block";
    let modalContents = document.getElementById("modalContentDiv");
    modalContents.innerHTML = modalHTML;

}

//Modal Box pieces
// Background behind the modal box, that overlays the rest of the page
var modalBackground = document.getElementById("myModal");
// Get the <span>/X element that closes the modal
var modalCloseButton = document.getElementsByClassName("close")[0];
//Closing the modal box
// When the user clicks on <span>/X, close the modal
modalCloseButton.onclick = function(mouseEvent){
    hideModalBoxFunction(mouseEvent);
}
// When the user clicks anywhere outside the modal, close it
window.onclick = function(mouseEvent) {
    hideModalBoxFunction(mouseEvent);
}

//Start game box: Notify the users about how to play the game.
document.addEventListener('DOMContentLoaded', (event) => { //DOMContentLoaded
    (debug ? console.log('The DOM is fully loaded, displaying welcome message') : null)
    showModalBoxFunction(event, "<h3>How to play the game</h3><p>Player 1 goes first.  Click the deck to draw a card, or pick the discard card to draw it</p>" +
        "<p> To play a card, click on it. After you play, the game will automatically move to the next player (top to bottom).</p>" +
        "<p>Click outside of this box, or the X on the right, to start the game</p>");

});


// Help Button
var helpButton = document.getElementById("helpButton");
helpButton.onclick = function(mouseEvent) {
    showModalBoxFunction(mouseEvent, "<p><h3>Game Rules & Help Menu</h3></p>" +
        //TODO: Reformat & cleanup the text below.  Also additional rules for 2 & 4 player games
        "<p>See here for offical rules: <a href='https://www.unorules.com/'>www.unorules.com</a></p>" +
        "<p>This game is based on a 108 card deck</p>" +
        "<p>Every player views his/her cards and tries to match the card in the Discard Pile." +
        "<p>Variation from official rules: After wild card is played, the next player gets to choose the color????  No need to shout UNO.  Wild 4 does not require you to NOT have other playable cards</p>" +
        "\n" +
        "You have to match either by the number, color, or the symbol/Action. For instance, if the Discard Pile has a red card that is an 8 you have to place either a red card or a card with an 8 on it. You can also play a Wild card (which can alter current color in play).\n" +
        "\n" +
        "If the player has no matches or they choose not to play any of their cards even though they might have a match, they must draw a card from the Draw pile. If that card can be played, play it. Otherwise, keep the card, and the game moves on to the next person in turn. You can also play a Wild card, or a Wild Draw Four card on your turn.\n" +
        "\n" +
        "Take note that you can only put down one card at a time; you cannot stack two or more cards together on the same turn. For example, you cannot put down a Draw Two on top of another Draw Two, or Wild Draw Four during the same turn, or put down two Wild Draw Four cards together.\n" +
        "\n" +
        "The game continues until a player has no cards left.  That player then wins the game” </p>");
}




// END MODAL BOX FUNCTION ------------------------------------------------------------------------------------------------------------------






if(debug){console.log("Game Board JS has completed loading");}

