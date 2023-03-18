//Handles all the code for the actual game
var debug = true;


//Global variables.  Not strictly best practice, but it's easier to track the deck & players globally than constantly passing them between functions, since they are referenced frequently
//Note: There's 1 more global, var gameDeck, after the Deck class (Otherwise it threw an error)
//TODO: Might want to put them in a wrapper or namespace for better handling
//EX: https://stackoverflow.com/questions/1841916/how-to-avoid-global-variables-in-javascript
var playersArray = [];
var discardCard;
var activePlayer = 0;
var gameDirection = Boolean(true); //true = top to bottom, false = bottom to top

if(debug){console.log("Game Board JS is loading");}



//TODO for the overall game:
/*

How to track which card is which?  store its Global Number somewhere in the HTML?
Tie each card to an OnClick function, that passes in the card identifier

Fix the Flexbox for the player boxes


Change the GlobalID for a card to ALWAYS BE A NUMBER.  No implicit conversions to numbers/strings
    EX: let num = Number(cardID);


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

    getPlayerHandSize() {
        return Number(this.playerHand.length);
    }

    addPlayerCard(addedCard){
        let handLengthStart = this.playerHand.length;
        this.playerHand.push(addedCard);
        //If the players hand array increased, the card was added successfully.
        return handLengthStart < this.playerHand.length;
    }

    peekPlayerCard(cardGlobalID){ //WITHOUT REMOVING!
        //Anytime this function is called, make sure a number is passed into it
        //TODO: Throw in an error handler to make sure its a number
        let cardGlobalIDNum = Number(cardGlobalID);
        for(let i=0; i<this.playerHand.length; i++){
            if(Number(this.playerHand[i].getGlobalNumber()) === cardGlobalIDNum){
                return this.playerHand[i]
            }
        }
        return false;
    }
    removePlayerCard(cardGlobalID){
        //Anytime this function is called, make sure a number is passed into it
        //TODO: Throw in an error handler to make sure its a number
        let cardGlobalIDNum = Number(cardGlobalID);

        //TODO: Refactor this logic, could be a single IF
        //Make sure the player hand has at least 1 card in it.  Should never have 0 without the game ending, but you never know
        if(Number(this.playerHand.length) === 0){
            //TODO: DO SOMETHING HERE!!!!
            return false;
        }
        else {
            for (let i = 0; i < this.playerHand.length; i++) {
                if (Number(this.playerHand[i].getGlobalNumber()) === cardGlobalIDNum) {
                    let removedCard = this.playerHand.splice(i,1);
                    return removedCard[0]; //SPLICE returns an array
                }
            }
        }
        return false;

    }
}


//Card Class
class Card {
    constructor(color, number, file, globalNumber) {
        //Colors: Red, Blue, Green, Yellow, Wild
        this.color = color;
        //0: once per color
        //1-9, draw, reverse, skip: Twice per color
        //20 = draw
        //21 = reverse
        //22 = skip
        //11 = 1 Wild, 14 = Wild Draw 4
        this.number = Number(number);
        this.file = file;

        //globalNumber is used to keep every single card unique
        this.globalNumber = Number(globalNumber);

    }
    getColor(){
        return this.color;
    }
    getNumber(){
        return Number(this.number);
    }
    getFile(){
        return this.file;
    }
    getGlobalNumber(){
        return Number(this.globalNumber);
    }

}


//Deck Class, holds all cards at the start and then all cards not in a player hand or the discard card
class Deck{

    constructor(){
        this.deck = []; //Javascript doesn't support hashmaps by default, so just using an array.
        //this.deckSize = 0;  //For easy reference to the size.  Might need for a check in each player move that the deck hasn't run out of cards.
    }

    getSize(){
        return Number(this.deck.length);
    }
    getDeckContents(){
        return this.deck;
    }
    addCard(newCard){
        this.deck[this.deck.length] = newCard;
    }

    removeCardByGlobalID(cardGlobalID){
        //Anytime this function is called, make sure a number is passed into it
        //TODO: Throw in an error handler to make sure its a number
        let cardGlobalIDNum = Number(cardGlobalID);

        //TODO: Refactor this logic, could be a single IF
        //Removed based on the cards Global Number
        if(this.deck.length < 1){
            console.log("No more cards, the game is unplayable!!!!!!")
            //TODO: Throw up a modal box to notify the player and reset the game board

            return false;
        }
        else {
            for (let iDeck = 0; iDeck < this.deck.length; iDeck++){
                if(Number(this.deck[iDeck].getGlobalNumber()) === Number(cardGlobalIDNum)){
                    let removedCard = this.deck.splice(iDeck,1);
                    return removedCard[0]; //SPLICE returns an array
                }
            }
            return false;
        }

    }
    removeTopCard(){
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
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
        }
//Two of the 1-9 cards per color
        if(cardFileNumber[0] > 0 && cardFileNumber[0] < 10){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;

        }
//Two of the draw/reverse/skip cards
        if(cardFileNumber[0] >= 20){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;

        }
//Four of the 2 different wild cards
        if(cardFileNumber[0] >= 11 && cardFileNumber[0] <= 14){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], Number(cardGlobalNumber)));
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

//Once the starting UI has loaded, begin the backend game prep (That modifies some of the UI)
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
            playersArray.push(new Player(iPlayerSetup, playersTempArray[iPlayerSetup]));
        }
        //Add the computer player
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
            playersArray[iPlayerHandSetup].addPlayerCard(gameDeck.removeTopCard());
            dealingNumber++;
        }
    }
    (debug ? console.log("Players dealt their hands:") : null);
    if(debug){console.log(playersArray)};

    //Fourth pick the first card for the discard pile.
    //To make life easier, if it's a WIlD/SKIP/DRAW/REVERSE card, just draw another card, then shuffle the deck again at the end.
    discardCard = gameDeck.removeTopCard();
    while(Number(discardCard.getNumber()) > 10){
        (debug ? console.log(discardCard) : null);
        (debug ? console.log("Discard card was wild/skip/draw/reverse, redrawing") : null);
        gameDeck.addCard(discardCard);
        discardCard = gameDeck.removeTopCard();
    }
    (debug ? console.log("Final discard card:") : null);
    (debug ? console.log(discardCard) : null);
    gameDeck.shuffle();


    //Last, update the UI to hide un-needed players, match player names, display hands, show the new discard card, and the state of the game.

    //Set the top discard card
    let UIDiscardCard = document.getElementById("UIDiscardCard");
    UIDiscardCard.src = "/Code/Cards/" + discardCard.getFile();

    //Adjust the player boxes to match # of players
    let playerBoxes;
    (debug ? console.log("Players: " + playersArray.length) : null);
    switch(playersArray.length) {
        case 3:
            (debug ? console.log("Case 3") : null);

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
            playerBoxes.style.height="40%"; //40
            playerBoxes = document.getElementById("player4Box");
            playerBoxes.style.height="40%";


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
    else{
        //Loop over all players
        for(let iUIPnames = 0; iUIPnames < playersArray.length; iUIPnames++) {
            let playerHTML = '<div id="player'+(iUIPnames+1)+'Name" style="height:10%; border: white solid 1px; text-align: center;">'+playersArray[iUIPnames].getPlayerName() + '</div>';
            let playerHand = playersArray[iUIPnames].getPlayerHand();
            //88% height to prevent the cards from slightly going over the player box
            playerHTML = playerHTML + '<div id="player1Hand" className="playerHand" style="height:88%; border: purple solid 3px; overflow-y: auto">';

            //Loop over the players hand
            for(let iUIPhand = 0; iUIPhand < playerHand.length; iUIPhand++){
                //Starting player
                if(iUIPnames == 0){
                    //TODO: Add a CSS CLASS for the active player hand
                    playerHTML = playerHTML + '<img class="playerActive" onclick="processCard(this.id)" id="'+playerHand[iUIPhand].getGlobalNumber()+
                        '" src="/Code/Cards/'+playerHand[iUIPhand].getFile()+'" style="height:45%; margin-left: 1%; margin-bottom: .5%;"/>';
                    activePlayer = iUIPnames;
                }
                //Other players, they get the back of the card
                else{
                    playerHTML = playerHTML + '<img id="'+playerHand[iUIPhand].getGlobalNumber()+
                        '" class="backOfCardImages" style="height:45%; margin-left: 1%; margin-bottom: .5%;"/>';
                }

            }
            playerHTML = playerHTML + '</div>';
            UIPlayerNames[iUIPnames].innerHTML = playerHTML;
        }
    }

    //Put starting player & next player into the UI
    console.log("Starting active player: " + activePlayer);
    document.getElementById("activePlayerUIplayer").innerHTML = "<h1>" + playersArray[activePlayer].getPlayerName() + "</h1>";
    document.getElementById("nextPlayerUIplayer").innerHTML = "<h2>" + playersArray[Number(getNextPlayer())].getPlayerName() + "</h2>";


});

// END GAME PREP -------------------------------------------------------------------------------------------------------------------------


function processCard(cardID){
    let cardIDNum = Number(cardID);
    (debug ? console.log("CARD CLICKED. Card ID:" + playersArray.length) : null);
    (debug ? console.log(cardIDNum) : null);

    //Get the card info
    let playedCard = playersArray[activePlayer].peekPlayerCard(cardIDNum);

    //Make sure that a valid card is being played
    let validPlay = Boolean(false);

    //Valid play: Any wild card
        //Or match either by the number, color, or the symbol/Action
    if(Number(playedCard.getNumber()) === 11 || Number(playedCard.getNumber()) === 14 || String(playedCard.getColor()) === String(discardCard.getColor()) || Number(playedCard.getNumber()) === Number(discardCard.getNumber())){
        validPlay = true;
    }

    //If it wasn't a valid play, exit this function.  And throw up a message to the user
    if(!validPlay){
        showModalBoxFunction(null, "<div><h2>Invaild card played.  It must match the discard card's number, color, or action, or must be wild.  Click Help & Game Rules if you need assistance with valid plays</h2></div>");
        return false;
    }


    //We've already determine the card is a valid one.  So just need to make it the new discard card, and then process any wild or action cards.
    if(Number(playedCard.getNumber()) >= 0 && Number(playedCard.getNumber()) <= 9){

            if(!activePlayer.removePlayerCard(cardIDNum)){
                console.log("Card was not found in the player hand.  Need to handle this somehow???");
            }
            //make sure it returns a Card and not False

            //Move the previous discard card into the deck & put the new discard card into the UI
            updateDiscardCard(playedCard)

            //Update the player hand
    }
    //Wild 1
        /*
        This card represents all four colors, and can be placed on any card.
        The player has to state which color it will represent for the next player.
         */
    else if(Number(playedCard.getNumber()) === 11){

    }
    //Wild 4
        /*
        This acts just like the wild card except that the next player also has to draw four cards as well as forfeit his/her turn.
        With this card, you must have no other alternative cards to play that matches the color of the card previously played.
        If you play this card illegally, you may be challenged by the other player to show your hand to him/her. If guilty, you need to draw 4 cards.
        If not, the challenger needs to draw 6 cards instead.
            //CHALLENGES ARE NOT PART OF THE GAME!!!!
         */
    else if(Number(playedCard.getNumber()) === 14){

    }
    //Draw Two
        /*
        When a person places this card, the next player will have to pick up two cards and forfeit his/her turn.
        It can only be played on a card that matches by color, or on another Draw Two.
         */
    else if(Number(playedCard.getNumber()) === 20){

    }
    //Reverse
        /*
        If going clockwise, switch to counterclockwise or vice versa. It can only be played on a card that matches by color, or on another Reverse card.
         */
    else if(Number(playedCard.getNumber()) === 21){
        gameDirection = !Boolean(gameDirection);
        //Update the UI to display the new direction & next player
    }
    //Skip
        /*
        When a player places this card, the next player has to skip their turn. It can only be played on a card that matches by color, or on another Skip card.
         */
    else if(Number(playedCard.getNumber()) === 22){
        changeActivePlayer(1);
    }
    else{
        console.log("Card number was invalid.  What the heck happened???");
    }

    //Check if the player won the game, after having verified that the played card was valid & if it is, its been removed from the players hand
    checkWinCondition();

    //If they didn't win, advance to the next player
    changeActivePlayer(1);
    //If the next player is the computer player, need to have it make a move




    //Display the Modal box to block out the game board, and for the next player to being their turn
        //Change the class of the modal background to one that's completely blacked out?
        //Or just change that style???
    //Maybe just add the new class to the modal background. Then remove it when the next turn starts????
    //Maybe it would just be better to have a different modal box for this situation.  And clicking CONTINUE is required?  Clicking out of it does nothing?
    var modalBackground = document.getElementById("modalBackground");


}

function updateDiscardCard(newDiscardCard){
    //Put the previous discard card into the deck
    gameDeck.addCard(discardCard);

    //Set the new discard card
    discardCard = newDiscardCard;

    //Update the UI with the new discard card
    //Set the top discard card
    let UIDiscardCard = document.getElementById("UIDiscardCard");
    UIDiscardCard.src = "/Code/Cards/" + discardCard.getFile();
    (debug ? console.log("Discard card updated, new card:"):null);
    (debug ? console.log(discardCard):null);

}

function changeActivePlayer(numPlayersToAdvance){

    let playersToAdvanceNum = Number(numPlayersToAdvance);
    //Direction is determined by gameDirection global
    //Need to change the CLASS used by the IMG tags.  Remove that class from the current player, add it to the next player

    let nextPlayer = -1;

    //TODO: Implement this.
    if (gameDirection){
        if(Number(activePlayer) === playersArray.length-1){
            nextPlayer = 0;
        }
        else{
            nextPlayer = activePlayer + 1;
        }
    }
    else{
        if(Number(activePlayer) === 0){
            nextPlayer = playersArray.length-1;
        }
        else{
            nextPlayer = activePlayer - 1;
        }
    }
}

//Returns the array position number of the next player
function getNextPlayer(){

    (debug ? console.log("Active Player: " + activePlayer) : null);

    let nextPlayer = -1;

    //Game direction determines which payer comes next.  True = top to bottom.  False = Bottom to top
    if (gameDirection){
        if(Number(activePlayer) === playersArray.length-1){
            nextPlayer = 0;
        }
        else{
            nextPlayer = activePlayer + 1;
        }
    }
    else{
        if(Number(activePlayer) === 0){
            nextPlayer = playersArray.length-1;
        }
        else{
            nextPlayer = activePlayer - 1;
        }
    }

    (debug ? console.log("Next Player: " + nextPlayer) : null);

    return Number(nextPlayer);
}


function checkWinCondition(){
    //If the last play results in a player having 0 cards, they win and the game ends.
    //Check if the active player's hand is now empty
    return activePlayer.getPlayerHand().length === 0;

}


function drawCard(playerDrawingCard){

}

function continueToNextPlayer(){
    //TODO: Does the Continue button need to be clicked?  Or can clicking outside the Modal also allow advancing??
    //If clicking outside, I might need a second modal box to handle it.
    //And LOTS OF OTHER THINGS TO CONSIDER

}

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
var modalBackground = document.getElementById("modalBackground");
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

// END MODAL BOX FUNCTION ------------------------------------------------------------------------------------------------------------------


//Start game box: Notify the users about how to play the game.
document.addEventListener('DOMContentLoaded', (event) => { //DOMContentLoaded
    (debug ? console.log('The DOM is fully loaded, displaying welcome message') : null)
    showModalBoxFunction(event, "<h3>How to play the game</h3><p>Player 1 goes first.  Click the deck to draw a card, or pick the discard card to draw it</p>" +
        "<p> To play a card, click on it. After you play, the game board will be hidden as the next players cards are dispalyed.  Click Continue for the next player to begin their turn.</p>" +
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

//Shuffle Deck button
var shuffleButton = document.getElementById("shuffleButton");
shuffleButton.onclick = function(mouseEvent){
    gameDeck.shuffle();
    (debug ? console.log("Shuffled Deck:") : null);
    (debug ? console.log(gameDeck) : null);
    showModalBoxFunction(mouseEvent, "<h3> Deck Shuffled </h3>");
}

if(debug){console.log("Game Board JS has completed loading")};

//Reset game function
    //Just refresh the page?  That resets everything but the player names.

//Start over with new player names button?

