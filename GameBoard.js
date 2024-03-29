
//For additional logging when debugging.  Flip to FALSE when ready to deploy.
let debug = false;


//Global variables.  Not strictly best practice, but it's easier to track the deck & players globally than constantly passing them between functions, since they are referenced frequently
//Note: There's 1 more global, var gameDeck, after the Deck class (Otherwise it threw an error)
//  Might want to put them in a wrapper or namespace for better handling
//  EX: https://stackoverflow.com/questions/1841916/how-to-avoid-global-variables-in-javascript
var playersArray = [];
var discardCard;
var activePlayer = 0;
var gameDirection = Boolean(true); //true = top to bottom, false = bottom to top
var alreadyDrawnCard = false; //Makes the deck inactive after a player has drawn a card.
var wildPlayed = false;
var computerPlayer = false;

(debug ? console.log("Game Board JS is loading") : null);

//Player Class to hold the details on each player
class Player {
    constructor(playerNumber, playerName) {
        //this.playerNumber = playerNumber;
        this.playerName = playerName;
        this.playerHand = [];
    }

    getPlayerName() {
        return this.playerName;
    }

    getPlayerHand() {
        return this.playerHand;
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


//Card Class to hold the details of each individual card
//Colors: Red, Blue, Green, Yellow, Wild

//0: once per color
//1-9, draw, reverse, skip: Twice per color
//20 = draw
//21 = reverse
//22 = skip
//11 = 1 Wild, 14 = Wild Draw 4
class Card {
    constructor(color, number, file, globalNumber) {
        this.color = color;
        this.number = Number(number);
        this.file = file;

        //globalNumber is used to keep every card unique
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
    }

    addCard(newCard){
        this.deck[this.deck.length] = newCard;
    }

    removeTopCard(){
        //Make sure there is at least 1 card in the deck
        if(this.deck.length < 1){
            console.log("No more cards!!!!!, game is unplayable???")
            alert("NO MORE CARDS IN THE DECK!!! Play a card in order to continue.  If there are no valid plays, reset the game to start over");
            return false;
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
//  Folder with the cards: ./Cards/

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
    //Requirement 1.0.0 The game should use a 108 card deck.

    //Build the deck, then shuffle it
    //Used to globally identify different cards, since there are duplicates of almost every card.
    let cardGlobalNumber = 1; //Start global number at 1, up to 108, for slightly easier tracking

    for(let i = 0; i<cardFilenames.length; i++){
        //Card filenames are hard coded to always be consistent.  So there are no checks needed for the processing in this loop

        //Split the card color from the card number
        let cardFileInfo = cardFilenames[i].split("_");

        //Split the card number from the PNG extension
        let cardFileNumber = cardFileInfo[1].split(".");

        //let tempCard = new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[iCardFilenames], cardGlobalNumber);
        //if(debug){console.log(tempCard)}

//TODO: put into a loop.  Or a function where the # of cards to be added (and the card) is passed in)
//One zero card per color
        if(cardFileNumber[0] == 0){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
        }
//Two of the 1-9 cards per color
        if(cardFileNumber[0] > 0 && cardFileNumber[0] < 10){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;

        }
//Two of the draw/reverse/skip cards
        if(cardFileNumber[0] >= 20){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;

        }
//Four of the 2 different wild cards
        if(cardFileNumber[0] >= 11 && cardFileNumber[0] <= 14){
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
            gameDeck.addCard(new Card(cardFileInfo[0], cardFileNumber[0], cardFilenames[i], Number(cardGlobalNumber)));
            cardGlobalNumber++;
        }

        //This should end up 1 over 108, since it is always incremented up even in the final loop
        if(cardGlobalNumber>109){
            console.log("ISSUE: Somehow there are more than 108 cards:");
            console.log("Card Global Number: " + cardGlobalNumber);
            console.log("Deck:");
            console.log(gameDeck);
        }
    }

    (debug ? console.log(gameDeck) : null);

}


// END DECK BUILDING ---------------------------------------------------------------------------------------------------------------------


//GAME PREP -------------------------------------------------------------------------------------------------------------------------

//Once the starting UI has loaded, begin the backend game prep
//  It modifies the skeleton UI, so to avoid errors when finding UI elements it waits to initial DOM is loaded
document.addEventListener('DOMContentLoaded', function gamePrep(){

    //First build the deck
    createDeck();
    gameDeck.shuffle();
    (debug ? console.log("Starting deck has been built & shuffled:") : null);
    (debug ? console.log(gameDeck) : null);

    //Preload all the card images that will be used, so that they're already present in the cache.  This way there won't be a slight delay when a players hand is displayed with previously-unused cards
    function preloadImages(imagesArray) {
        let imageList = [];
        (debug ? console.log("Preloading Images") : null);
        for (let i = 0; i < imagesArray.length; i++) {
            let img = new Image();
            imageList.push(img);
            img.src = "./Cards/" + imagesArray[i];
            (debug ? console.log(img.src) : null);
        }
    }

    preloadImages(cardFilenames);

    //Second create the players by pulling their info out of the cookie
        //The computer player boolean is always stored at the very end
    let playersCookie = getCookie("UNOusers");
    if(playersCookie == ""){
        console.log("Something has gone wrong, the player info is not in the cookie");
        console.log("Defaulting to 3 players with default names");
        var player0 = new Player(0,"Player1");
        var player1 = new Player(1,"Player2");
        var player2 = new Player(2,"Player3");
        var player3 = new Player(3,"Computron (Computer Player)");
        computerPlayer = true;
        playersArray.push(player0, player1, player2, player3);  //If there's no cookie, default to their being a computer player (For simplicity)

    }

    else{
        let playersTempArray = playersCookie.split("|");
        //TODO: Future improvement: to make this more robust, add in checks that the split actually returns an array & there are values in it (Otherwise default player names)
        let iPlayerSetup = 0;
        for(iPlayerSetup = 0; iPlayerSetup < playersTempArray.length-1; iPlayerSetup++){ //Minus one off the array length, the players in the cookie always end with a "|" which puts an empty string as the last array item after its split
            playersArray.push(new Player(iPlayerSetup, playersTempArray[iPlayerSetup]));
        }
        //Add the computer player
        //  Needed because String to Boolean was not working as expected.
        computerPlayer = ((String(playersTempArray[iPlayerSetup]).toLowerCase() == "true") ? true: false);
        (debug ? console.log("Computer Player: " + computerPlayer) : null);

        if(computerPlayer) {
            playersArray.push(new Player(playersArray.length, "Computron (Computer Player)"));
        }
    }

    (debug ? console.log("Players created:") : null);
    (debug ? console.log(playersArray) : null);

    //Third deal each player their hand
    //Nested loops! Always a good idea!
    //At this point, there is no need to check that the deck has enough cards
    for(let i = 0; i < playersArray.length; i++){
        let dealingNumber = 0;
        while(dealingNumber < 7){
            //TODO: Make sure it returns TRUE after each push
            playersArray[i].addPlayerCard(gameDeck.removeTopCard());
            dealingNumber++;
        }
    }
    (debug ? console.log("Players dealt their hands:") : null);
    (debug ? console.log(playersArray) : null);

    //Fourth pick the first card for the discard pile.
    //To make the starting logic simpler, if it's a WIlD/SKIP/DRAW/REVERSE card, just draw another card, then shuffle the deck again at the end.
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


    //Requirement 2.1.0 Number of cards in a player’s hand is visible on the UI

    //Fifth, update the UI to hide un-needed players, match player names, display hands, show the new discard card, and the state of the game.

    //Set the top discard card
    let UIDiscardCard = document.getElementById("UIDiscardCard");
    UIDiscardCard.src = "./Cards/" + discardCard.getFile();

    //Adjust the player boxes to match # of players
    let playerBoxes;
    (debug ? console.log("Players: " + playersArray.length) : null);
    let dynamicHeight = (100/playersArray.length)-5;
    (debug ? console.log("Dynamic Height of player boxes: " + dynamicHeight):null);

    switch(Number(playersArray.length)) {
        case 3:
            (debug ? console.log("Case 3") : null);
            //TODO:  Probably could use Flex to fill available space instead of defining a height

            //Elements need to be removed in order for the game loop to process correctly.
            //The active player/next player logic is tied to the player ID, and the player ID is used to identify UI components
            playerBoxes = document.getElementById("playerBox3");
            playerBoxes.remove();

            playerBoxes = document.getElementById("playerBox0");
            playerBoxes.style.height= dynamicHeight + "%"
            playerBoxes = document.getElementById("playerBox1");
            playerBoxes.style.height= dynamicHeight + "%"
            playerBoxes = document.getElementById("playerBox2");
            playerBoxes.style.height= dynamicHeight + "%"

            break;
        case 2:
            (debug ? console.log("Case 2") : null);

            playerBoxes = document.getElementById("playerBox2");
            playerBoxes.remove();
            playerBoxes = document.getElementById("playerBox3");
            playerBoxes.remove();

            playerBoxes = document.getElementById("playerBox0");
            playerBoxes.style.height= dynamicHeight + "%"
            playerBoxes = document.getElementById("playerBox1");
            playerBoxes.style.height= dynamicHeight + "%"


            break;
        default:
        //DO NOTHING!!!!
    }

    //Put player names into the UI
    let UIPlayerNames = document.getElementsByClassName("playerBoxShow");

    if(Number(playersArray.length) !== Number(UIPlayerNames.length)){
        console.log("Somethings gone wrong. The # of players in the cookie is not matching the # players in the UI.");
        alert("The # of players is not matching.  Game might be unplayable. Try refreshing the page.");
    }
    else{

        //Loop over all players to build their hands
        //  This is the only time "i" is not used as the iterator (Just kidding, two other places don't use i), since it uses nested loops
        for(let iUIPnames = 0; iUIPnames < playersArray.length; iUIPnames++) {
            //If the player name would be too long for the box, just clip it instead of trying to wrap or truncate
            let playerHTML = '<div id="playerName'+(iUIPnames) + '" class="playerNamesClass">'+playersArray[iUIPnames].getPlayerName() + '</div>';
            let playerHand = playersArray[iUIPnames].getPlayerHand();
            //88% height to prevent the cards from slightly going over the player box
            playerHTML = playerHTML + '<div id="playerHand'+(iUIPnames)+'" class="playerHand" style="height:88%;overflow-y: auto">';

            //Loop over the players hand
            for(let iUIPhand = 0; iUIPhand < playerHand.length; iUIPhand++){
                //Starting player
                if(iUIPnames === 0){
                    playerHTML = playerHTML + '<img class="playerActive" onclick="processCard(this.id)" id="'+playerHand[iUIPhand].getGlobalNumber()+
                        '" src="./Cards/'+playerHand[iUIPhand].getFile()+'" style="height:45%; margin-left: 1%; margin-bottom: .5%;" title="Click to play this card"/>';
                    activePlayer = iUIPnames;
                }
                //Other/non-active players get the back of the card
                else{
                    playerHTML = playerHTML + '<img id="'+playerHand[iUIPhand].getGlobalNumber()+
                        '" class="backOfCardImages" style="height:45%; margin-left: 1%; margin-bottom: .5%;" title=""/>';
                }

            }
            playerHTML = playerHTML + '</div>';
            UIPlayerNames[iUIPnames].innerHTML = playerHTML;
        }
    }

    //Show the computer player hand during testing
    if(debug ){
         let compHand = document.getElementById("playerHand" + (playersArray.length-1)).children; //This is actually a pseudo-array, not a real array

         for(let i=0; i<compHand.length; i++){
             compHand[i].setAttribute("class","");
             compHand[i].setAttribute("src","./Cards/" + playersArray[playersArray.length-1].peekPlayerCard(Number(compHand[i].id)).getFile());
         }
    }

    //Put starting player & next player into the UI
    document.getElementById("activePlayerUIplayer").innerHTML = "<div style='font-size: xx-large; font-weight: bold; padding: 4px'>" + playersArray[Number(activePlayer)].getPlayerName() + "</div>";
    document.getElementById("nextPlayerUIplayer").innerHTML = "<div style='font-size: large; font-weight: bold; padding: 4px'>" + playersArray[Number(getNextPlayer())].getPlayerName() + "</div>";


});

//GAME PREP -------------------------------------------------------------------------------------------------------------------------



// ********************************************************************************************************************************************
//FUNCTION WHEN A CARD IS DRAWN
let cardDrawn = document.getElementById("UIDeck");
cardDrawn.onclick = function(mouseEvent) {
// Requirement 2.0.2 Player can pickup a card from the deck.

    if(alreadyDrawnCard){
        showModalBoxFunction(null, "<h2>You've already drawn a card this turn.  <br>Play a card in your hand, or click 'End Current Player's Turn' to end your turn & advance to the next player</h2>");
    }
    else {

        //Draw a card from the deck
        let newCard = gameDeck.removeTopCard();

        //Add the card to the player hand
        playersArray[activePlayer].addPlayerCard(newCard);
        alreadyDrawnCard = true;

        //Update the UI to add in the new card
        let activePlayerHandDraw = document.getElementById("playerHand" + (activePlayer)); //This is actually a pseudo-array, not a real array
        const newCardElement = document.createElement("img");
        //Example: <img class="playerActive" onclick="processCard(this.id)" id="3" src="./Cards/Blue_1.png" style="height:45%; margin-left: 1%; margin-bottom: .5%;">
        newCardElement.setAttribute("id", newCard.getGlobalNumber());
        newCardElement.setAttribute("class", "playerActive");
        newCardElement.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
        newCardElement.setAttribute("title", "Click to play this card");
        newCardElement.setAttribute("src", "./Cards/" + newCard.getFile());
        newCardElement.setAttribute("onclick", "processCard(this.id)");

        activePlayerHandDraw.appendChild(newCardElement);

        (debug ? console.log("Player hand after drawing a new card: ") : null);
        (debug ? console.log(playersArray[activePlayer].getPlayerHand()) : null);

        //The player can play the card they just picked up, so display the CONTINUE button to allow them to end their turn without playing a card.
        document.getElementById("continueButtonNextPlayer").setAttribute("style", "text-align: center; padding: 10px; visibility: visible;")

        //At this point, instead of the making the deck un-clickable, keep it clickable.
        //So that if the player clicks the deck again out of confusion, it'll direct them what to do next.

    }
}
// ********************************************************************************************************************************************

//Requirement 2.0.0 Players will be able to take a turn.
//  Covered by processCard() & click of the UI element UIDeck

//##################################################################################################################################################
//FUNCTION when a player clicks one of their cards to play it
function processCard(cardID){


    let cardIDNum = Number(cardID);
    (debug ? console.log("CARD CLICKED. Card ID:" + playersArray.length) : null);
    (debug ? console.log(cardIDNum) : null);

    //Get the info of the card that was played, before removing it from the player's hand, for the valid polay check
    let playedCard = playersArray[activePlayer].peekPlayerCard(cardIDNum);

    //Make sure that a valid card is being played
    let validPlay = Boolean(false);

    //Valid play: match either by the number, color, or the symbol/Action
    if(!wildPlayed && (String(playedCard.getColor()) === String(discardCard.getColor()) || Number(playedCard.getNumber()) === Number(discardCard.getNumber()))){
        (debug ? console.log("Played card matched on number/color/action"): null);
        validPlay = true;
    }
    //OR a wild is being played (Then it works regardless of if a previous wild was played)
    else if(Number(playedCard.getNumber()) === 11 || Number(playedCard.getNumber()) === 14){
        (debug ? console.log("Played card is wild"): null);
        validPlay = true;
    }
    //OR If a wild was played the last turn, make sure it matches the color selected
    else if(wildPlayed){
        let wildElement = document.getElementById("wildColorSelected").children; //Only 1 child element
        if(String(playedCard.getColor()) === String(wildElement[0].id)){
            (debug ? console.log("Played card matches previously played wild card color"): null);
            validPlay = true;
        }
    }

    //Requirement 1.3.0 Invalid cards cannot be played.
    // & Requirement 2.0.2.1 Player can discard a valid card into the discard pile.
    //If it wasn't a valid play, exit this function.  And throw up a message to the user
    if(!validPlay){
        showModalBoxFunction(null, "<div><h2>Invalid card played</h2></div>  <div>It must match the discard card's number, color, action, or be wild.  Click Help & Game Rules for information on valid plays.</div>");
        return false;
    }

    //If a wild card was played previously, need to cancel it out for this new play.
    //  Needs to be after the valid checks & invalid popup, otherwise the previous wild is cancelled before its used
    if(wildPlayed){
        let wildUI = document.getElementById("wildColorUI");
        wildUI.innerHTML = "";
        wildUI.setAttribute("style", "display:none");
        wildPlayed = false;
    }

    //We've already determined the card is a valid one.  So just need to make it the new discard card, and then process any wild or action cards.


    //Remove the card from the players hand
    let tempCard = playersArray[activePlayer].removePlayerCard(cardIDNum);
    if (tempCard === false){
        console.log("Card was not found in the player hand.  Player Hand:");
        console.log(playersArray[activePlayer].getPlayerHand());
        console.log("The ID of the played card: " + cardIDNum);
        alert("Card not found in the player hand.  Game might need to be reset");
        return false;
    }

    //Requirement 2.0.1 Player can discard a valid card into the discard pile.
    //Put the current discard card into the deck
    gameDeck.addCard(discardCard);

    //Update the Discard Card to the one that was played (UI & Backend)
    updateDiscardCard(playedCard)

    //Update the plays hand in the UI to remove the card by its ID
    document.getElementById(String(cardIDNum)).remove();

    //Check if the player won the game.
        //Done before any card processing, since playing the card isn't actually needed as long as its valid (And the discard card will already be displayed).
    if(checkWinCondition()){
        //Grab the directory that we're in, so this always leads to the correct location regardless of where the game is being played (server or locally)
        let currentDirectory = new URL(".", location.href);
        let startPage = currentDirectory.href + "index.html";

        document.getElementById("modalCloseX").remove();
        showModalBoxFunction(null, "<div><h2>"+playersArray[activePlayer].getPlayerName()+" won the game!</h2></div>" +
            "<br><div>Click here to start a new game with the same players: <br><button onclick='window.location.reload();'>NEW GAME</button></div>" +
            "<br><div>Click here to go to the player selection screen before starting the game: <br><button onclick='window.location.href =   \" "+startPage+" \"'>NEW PLAYERS & NEW GAME</button></div>");
        return false;
    }


    //Number cards
    if(Number(playedCard.getNumber()) >= 0 && Number(playedCard.getNumber()) <= 9){
        //Shouldn't need any special handling???
    }

    //Wild 1
    else if(Number(playedCard.getNumber()) === 11){

        //Use the Wild modal box.  The regular modal wouldn't work here, since it allows you to click outside of it to close it.
        showWildModal();

        //Exit out of this function. Otherwise, it'll automatically move to the next player (And show the next players hand to the current player)
        //Instead, after the color is chosen, then it advances to the next player
        return false;
    }

    //Wild 4 (+4 and Skip)
    else if(Number(playedCard.getNumber()) === 14){
        //Use the Wild modal box.  The regular modal wouldn't work here, since it allows you to click outside of it to close it.
        showWildModal();

        //Draw 4 cards from the deck, and add them to the NEXT player (Not the active player)
        for(let i = 0; i < 4; i++) {
            let newCard = gameDeck.removeTopCard();
            //Add the card to the player hand
            playersArray[getNextPlayer()].addPlayerCard(newCard);

            //Update the UI to add in the new card
            let nextPlayerHand = document.getElementById("playerHand" + (getNextPlayer())); //This is actually a pseudo-array, not a real array
            const newCardElementWild = document.createElement("img");
            newCardElementWild.setAttribute("class", "backOfCardImages");
            newCardElementWild.setAttribute("id", newCard.getGlobalNumber());
            newCardElementWild.setAttribute("src", "./Cards/" + newCard.getFile());
            newCardElementWild.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
            newCardElementWild.setAttribute("title", "Click to play this card");

            nextPlayerHand.appendChild(newCardElementWild);
        }
        //Skip the next player
        skipPlayer();

        //Exit out of this function. Otherwise, it'll automatically move to the next player (And show the next players hand to the current player)
        //Instead, after the color is chosen, then it advances to the next player

        return false;

    }

    // Draw Two (+2 and Skip)
    else if(Number(playedCard.getNumber()) === 20){

        //Draw 2 cards from the deck, and add them to the NEXT player (Not the active player)
        for(let i = 0; i < 2; i++) {
            let newCard = gameDeck.removeTopCard();
            //Add the card to the player hand
            playersArray[getNextPlayer()].addPlayerCard(newCard);

            //Update the UI to add in the new card
            let nextPlayerHand = document.getElementById("playerHand" + (getNextPlayer()));
            const newCardElementWild = document.createElement("img");
            newCardElementWild.setAttribute("class", "backOfCardImages");
            newCardElementWild.setAttribute("id", newCard.getGlobalNumber());
            newCardElementWild.setAttribute("src", "./Cards/" + newCard.getFile());
            newCardElementWild.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
            newCardElementWild.setAttribute("title", "Click to play this card");

            nextPlayerHand.appendChild(newCardElementWild);
        }
        //Skip the next player
        skipPlayer();
    }

    //Reverse
    else if(Number(playedCard.getNumber()) === 21){
        gameDirection = !Boolean(gameDirection);
        //Update the UI to update next player
        document.getElementById("nextPlayerUIplayer").innerHTML = "<div style='font-size: large; font-weight: bold; padding: 4px'>" + playersArray[Number(getNextPlayer())].getPlayerName() + "</div>";

    }

    //Skip
    else if(Number(playedCard.getNumber()) === 22){
        skipPlayer();
    }
    //Something has gone VERY wrong
    else{
        console.log("Card number was invalid from the played card.  What the heck happened??? played card:");
        console.log(playedCard);
        alert("The card's type was invalid.  Game is probably unplayable.  Click Reset Game to start over");
        return false;
    }

    beginPlayerTransition();

    return true;
}
//##################################################################################################################################################


function beginPlayerTransition(){
    //Requirement 1.1.0 Players take one turn and pass to next player

    (debug ? console.log("TRANSITIONING.  Previously drawn card from deck: " + alreadyDrawnCard) : null);

    //Reset the ability to draw a card for the next player.
    alreadyDrawnCard = false;

    //Hide the Continue button, it only displays if a card was drawn, but to be safe always un-display it
    document.getElementById("continueButtonNextPlayer").setAttribute("style","visibility: hidden; text-align: center; padding: 10px;")

    //Update the player hands in the UI.  Active player cards updated to the class that only displays the back
    let activePlayerHandOld = document.getElementById("playerHand" + activePlayer).children; //This is actually a pseudo-array, not a real array
    for(let i=0; i<activePlayerHandOld.length; i++){
        activePlayerHandOld[i].className="backOfCardImages";
        activePlayerHandOld[i].removeAttribute('onclick');
        activePlayerHandOld[i].setAttribute("title","");
        //Removing the src attribute causes all the cards to go to their default height.  Not sure why, the CSS appears to be identical
        //  Instead, just leave the src attribute in place.  The updated class will override it by using !important
        //  Creates a tiny chance of someone cheating by inspecting the source.  But that risk is acceptable, this is a casual game.
        //activePlayerHandOld[i].removeAttribute('src');
        //(debug ? console.log(activePlayerHandOld[i]) : null);
    }

    //Advance to the next player
    changeActivePlayer(1);
    (debug ? console.log("New Active Player: " + activePlayer) : null);

    //If the next player is the computer player, need to have it make a move
    if(computerPlayer && Number(activePlayer)===(playersArray.length-1)){
        computerPlayerTransition();
    }
    else{

        //Hide the screen when transitioning between players.  And the next player needs to click Continue to advance (No clicking outside the modal)
        document.getElementById("nextPlayerName").innerText=playersArray[activePlayer].getPlayerName();
        if(!debug){
            showContinueModal();
        }
    }
}

function endPlayerTransition(){
    //Requirement 2.0.2.2 Player can pass to the next player/computer.

    //With the computer player timeout, sometimes the computer cards were displayed unexpectedly.
        //Only display player hands when the Continue modal is up & has been clicked.

    //Set the active player to display their cards in the UI
    let activePlayerHandNew = document.getElementById("playerHand" + (activePlayer)).children;
    for(let i=0; i<activePlayerHandNew.length; i++){
        activePlayerHandNew[i].className="playerActive";
        activePlayerHandNew[i].setAttribute("onclick","processCard(this.id)");
        activePlayerHandNew[i].setAttribute("title","Click to play this card");
        activePlayerHandNew[i].setAttribute("src","./Cards/" + playersArray[activePlayer].peekPlayerCard(Number(activePlayerHandNew[i].id)).getFile());
        //(debug ? console.log(activePlayerHandNew[i]) : null);
    }


    //Update the UI to match the active player in the info panel
    document.getElementById("activePlayerUIplayer").innerHTML = "<div style='font-size: xx-large; font-weight: bold; padding: 4px'>" + playersArray[Number(activePlayer)].getPlayerName() + "</div>";
    document.getElementById("nextPlayerUIplayer").innerHTML = "<div style='font-size: large; font-weight: bold; padding: 4px'>" + playersArray[Number(getNextPlayer())].getPlayerName() + "</div>";

    hideContinueModal();

    //TODO: Should this include a double check that the correct cards & names are all displaying on the UI?  Might be good to have a fallback for that.

}

function computerPlayerTransition(){
    //Requirement 1.2.0 Computer player can take a turn if playing.

    (debug ? console.log("COMP PLAYER MOVE STARTS") : null);
    //Throw up an overlay, so that the UI can't be interacted with while the computer is playing.
    var modalBackgroundComputer = document.getElementById("modalBackgroundComputer");
    modalBackgroundComputer.style.display = "block";

    //Computer player move
    computerPlayerMove();

    //Hide the overlay after 5 seconds, enough time for computron to make their move
    // All code after the timeout runs immediately.  Fixed by putting the entire rest of the function into setTimeout.
    setTimeout(function () {
        modalBackgroundComputer.style.display = "none";

        //Advance to the next player.
        changeActivePlayer(1);

        //Hide the screen when transitioning between players.  And the next player needs to click Continue to advance (No clicking outside the modal)
        document.getElementById("nextPlayerName").innerText=playersArray[activePlayer].getPlayerName();
        if(!debug){
            showContinueModal();
        }

    }, 2500);
}

function computerPlayerMove(){

    //Loop over the computer players hand, and see if any cards are playable.  If they are, play the card.
    //  This will end up duplicating a lot of the Process Card function.  But there are a number of tweaks needed for the comp player
    let compHand = playersArray[activePlayer].getPlayerHand();
    let cardToPlayNum = null;

    for(let i = 0; i< compHand.length; i++){

        //Go through the various valid plays, to see if any of them apply to the card
        //      Doesn't matter if another card is playable later in the hand and this overwrites the previously playable card.  Any card can be played
        //Valid play: match either by the number, color, or the symbol/Action
        if(!wildPlayed && (String(compHand[i].getColor()) === String(discardCard.getColor()) || Number(compHand[i].getNumber()) === Number(discardCard.getNumber()))){
            (debug ? console.log("COMP PLAYER: Matched on number/color/symbol") : null);
            cardToPlayNum = compHand[i].getGlobalNumber();
        }
        //OR a wild is being played (Then it works regardless of if a previous wild was played)
        else if(Number(compHand[i].getNumber()) === 11 || Number(compHand[i].getNumber()) === 14){
            (debug ? console.log("COMP PLAYER: Wild is able to be played") : null);
            cardToPlayNum = compHand[i].getGlobalNumber();

        }
        //OR If a wild was played the last turn, see if a card matches the wild color selected
        else if(wildPlayed){
            let wildElement = document.getElementById("wildColorSelected").children; //Only 1 child element
            if(String(compHand[i].getColor()) === String(wildElement[0].id)){
                (debug ? console.log("COMP PLAYER: Matched on previous wild card color") : null);
                cardToPlayNum = compHand[i].getGlobalNumber();
            }
        }
    }

    //One of the computer's cards is playable.
    if(cardToPlayNum != null){
        (debug ? console.log("Computer player, PLAYABLE CARD FOUND") : null);

        //If a wild card was played previously, cancel it out the next time a valid card is played
        if(wildPlayed){
            let wildUI = document.getElementById("wildColorUI");
            wildUI.innerHTML = "";
            wildUI.setAttribute("style", "display:none");
            wildPlayed = false;
        }

        //Remove the card from the players hand
        let tempCard = playersArray[activePlayer].removePlayerCard(cardToPlayNum);

        //Update the UI that the card has been removed.
        //Use a transition here, to make it slightly more interesting.
        let animatedPlayCard = document.getElementById(String(cardToPlayNum));

        //APPEND a class to the element for the animated transition
        animatedPlayCard.classList.add("compPlayerDiscardTransition");
        setTimeout(function () {

            animatedPlayCard.classList.remove("compPlayerDiscardTransition");

            animatedPlayCard.remove();
        }, 2000);

        //Put the old discard card into the deck
        gameDeck.addCard(discardCard);

        //Set the played card as the new discard card
        updateDiscardCard(tempCard);


        //Check if the computer player won by playing their card
        if (checkWinCondition()){
            //Grab the directory that we're in, so this always leads to the correct location regardless of where the game is being played (server or locally)
            let currentDirectory = new URL(".", location.href);
            let startPage = currentDirectory.href + "index.html";

            //If the computer player wins, this pops the WIN box on top of the CONTINUE box, so that its a slightly bette experience
            //  Ideally, the ability to click outside of the WIN modal should also be removed.
            //  Removing the CONTINUE box entirely would also be ideal, since it is actually behind the WIN modal, but it's fine.
            document.getElementById("modalBackground").style.zIndex="100";

            document.getElementById("modalCloseX").remove();
            showModalBoxFunction(null, "<div><h2>"+playersArray[activePlayer].getPlayerName()+" won the game!</h2></div>" +
                "<br><div>Click here to start a new game with the same players: <br><button onclick='window.location.reload();'>NEW GAME</button></div>" +
                "<br><div>Click here to go to the player selection screen before starting the game: <br><button onclick='window.location.href =    \" "+startPage+" \"'>NEW PLAYERS & NEW GAME</button></div>");
            return false;
        }

        //Check the cards #/type to determine what type of move is needed.
        //Number cards need no special handling, and are played immediately.

        //Wild 1
        if(Number(tempCard.getNumber()) === 11){
            wildPlayed = true;
            //Choose a color for the wild card, randomly
            let wildColorUI = document.getElementById("wildColorUI")
            const wildColors = ["Blue", "Green", "Red", "Yellow"];
            // Returns a random integer from 0 to 3:
            let rand = Math.floor(Math.random() * 4);

            (debug ? console.log("Wild1 color chosen: " + wildColors[rand]) : null);
            wildColorUI.innerHTML = "<div style='background: black; padding: 10px; border: 10px solid white; border-radius: .5em;'><div>Wild Card Color: </div><div id='wildColorSelected'><div id='"+String(wildColors[rand])+"'>" + String(wildColors[rand]) +"</div></div></div>";
            wildColorUI.setAttribute("style", "width: 50%; text-align: center; margin: auto; font-weight: bold; font-size: xx-large; margin-top: 2%; color:" + String(wildColors[rand])+";");
        }

        //Wild 4 (+4 and Skip)
        else if(Number(tempCard.getNumber()) === 14) {
            wildPlayed = true;

            //Draw 4 cards from the deck, and add them to the NEXT player (Not the active player)
            for(let i = 0; i < 4; i++) {
                let newCard = gameDeck.removeTopCard();
                //Add the card to the player hand
                playersArray[getNextPlayer()].addPlayerCard(newCard);

                //Update the UI to add in the new card
                let nextPlayerHand = document.getElementById("playerHand" + (getNextPlayer()));
                const newCardElementWild = document.createElement("img");
                newCardElementWild.setAttribute("class", "backOfCardImages");
                newCardElementWild.setAttribute("id", newCard.getGlobalNumber());
                newCardElementWild.setAttribute("src", "./Cards/" + newCard.getFile());
                newCardElementWild.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
                //newCardElementWild.setAttribute("title", "Click to play this card");

                nextPlayerHand.appendChild(newCardElementWild);
            }
            //Choose a color for the wild card, randomly
            let wildColorUI = document.getElementById("wildColorUI")
            const wildColors = ["Blue", "Green", "Red", "Yellow"];
            // Returns a random integer from 0 to 3:
            let rand = Math.floor(Math.random() * 4);

            (debug ? console.log("Wild4 color chosen: " + wildColors[rand]) : null);
            wildColorUI.innerHTML = "<div style='background: black; padding: 10px; border: 10px solid white; border-radius: .5em;'><div>Wild Card Color: </div><div id='wildColorSelected'><div id='"+String(wildColors[rand])+"'>" + String(wildColors[rand]) +"</div></div></div>";
            wildColorUI.setAttribute("style", "width: 50%; text-align: center; margin: auto; font-weight: bold; font-size: xx-large; margin-top: 2%; color:" + String(wildColors[rand])+";");

            //Skip the next player
            // if (playersArray.length > 2){
            //     skipPlayer();
            // }
            skipPlayer();

        }

        // Draw Two (+2 and Skip)
        else if(Number(tempCard.getNumber()) === 20) {
            //Draw 2 cards from the deck, and add them to the NEXT player (Not the active player)
            for(let i = 0; i < 2; i++) {
                let newCard = gameDeck.removeTopCard();
                //Add the card to the player hand
                playersArray[getNextPlayer()].addPlayerCard(newCard);

                //Update the UI to add in the new card
                let nextPlayerHand = document.getElementById("playerHand" + (getNextPlayer()));
                const newCardElementWild = document.createElement("img");
                newCardElementWild.setAttribute("class", "backOfCardImages");
                newCardElementWild.setAttribute("id", newCard.getGlobalNumber());
                newCardElementWild.setAttribute("src", "./Cards/" + newCard.getFile());
                newCardElementWild.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
                //newCardElementWild.setAttribute("title", "Click to play this card");

                nextPlayerHand.appendChild(newCardElementWild);
            }
            //Skip the next player
            // if (playersArray.length > 2){
            //     skipPlayer();
            // }
            skipPlayer();
        }
        //Reverse
        else if(Number(tempCard.getNumber()) === 21){
            gameDirection = !Boolean(gameDirection);
            //Update the UI to update next player
            document.getElementById("nextPlayerUIplayer").innerHTML = "<div style='font-size: large; font-weight: bold; padding: 4px'>" + playersArray[Number(getNextPlayer())].getPlayerName() + "</div>";
        }

        //Skip
        else if(Number(tempCard.getNumber()) === 22){
            //Skip the next player
            // if (playersArray.length > 2){
            //     skipPlayer();
            // }
            skipPlayer();
        }
    }
    //No card to be played, draw a card
    else{
        //How about for simplicity, we just never play the drawn card?  Puts the computer player at a disadvantage, but screw that guy.
        //  I mean the game favors the human players slightly.  The house does NOT always win.

        //Draw a card from the deck
        let newCard = gameDeck.removeTopCard();

        //Add the card to the player hand
        playersArray[activePlayer].addPlayerCard(newCard);

        //Animate the card drawing
        let animatedDrawCard = document.getElementById("UIDeck")
        animatedDrawCard.classList.add("compPlayerDrawTransition")

        let activePlayerHandDraw = document.getElementById("playerHand" + (activePlayer)); //This is actually a pseudo-array, not a real array
        //Update the UI to add in the new card
        const newCardElement = document.createElement("img");
        newCardElement.setAttribute("id", newCard.getGlobalNumber());
        newCardElement.setAttribute("class", "backOfCardImages");
        newCardElement.setAttribute("style", "height:45%; margin-left: 1%; margin-bottom: .5%;");
        newCardElement.setAttribute("title", "");

        if(debug){ //For easier troubleshooting, keep the cards visible when debug is TRUE
            newCardElement.setAttribute("class", "");
            newCardElement.setAttribute("src", "./Cards/" + newCard.getFile());
        }
        activePlayerHandDraw.appendChild(newCardElement);

        setTimeout(function() {
            animatedDrawCard.classList.remove("compPlayerDrawTransition")
        }, 2000)


    }

    //Return to the original function so that it can move onto the next player
    return true;
}

function wildColor(){
    (debug ? console.log("Wildcard function begin") : null);
    //How to hide the wild color after it's been used?
    //  It's built into the card processing function, as part of the separate flow for validation after a wild play

    let inputColors = document.getElementsByClassName("wildColorInput");

    //Pull in the color that was selected.
    //By default, one color will ALWAYS start checked, so there's no need to make sure at least 1 is checked
    for (let i = 0; i < inputColors.length ;i++) {
        if(inputColors[i].checked){
            (debug ? console.log(inputColors[i].value):null);
            //Requirement 3.2.3	Wild Color box matches UNO card styling (White outline, black inside)
            let wildColorUI = document.getElementById("wildColorUI")
            //Store the color selected in the ID of the div, so that it can be retrieved later
            //Black background so that Yellow is visible.  White border to make it kinda look like a card.
            wildColorUI.innerHTML = "<div style='background: black; padding: 10px; border: 10px solid white; border-radius: .5em;'><div>Wild Card Color: </div><div id='wildColorSelected'><div id='"+String(inputColors[i].value)+"'>" + String(inputColors[i].value) +"</div></div></div>";
            wildColorUI.setAttribute("style", "width: 50%; text-align: center; margin: auto; font-weight: bold; font-size: xx-large; margin-top: 2%; color:" + String(inputColors[i].value)+";");
            wildPlayed = true;
        }
    }

    //Hide the color selection box
    hideWildModal();

    //Continue to the next player
    beginPlayerTransition();

}

function skipPlayer(){
    //Update the UI to hide the current player's cards
    let activePlayerHandOld = document.getElementById("playerHand" + activePlayer).children; //This is actually a pseudo-array, not a real array
    for (let i = 0; i < activePlayerHandOld.length; i++) {
        //If the computer player is the active one, append the class instead of replacing it, so the animation can complete.
        if(computerPlayer && Number(activePlayer)===(playersArray.length-1)){
            activePlayerHandOld[i].classList.add("backOfCardImages");
        }
        else {
            activePlayerHandOld[i].className = "backOfCardImages";
            activePlayerHandOld[i].removeAttribute('onclick');
        }

    }

    // If the computer player is doing a skip, and there are only 2 players, immediately have the computer player make another move.
    //  Without this logic, it advances back to the computer player and then treats it like a regular player.
    if(Number(computerPlayer && activePlayer === playersArray.length-1 && playersArray.length===2)){
        computerPlayerMove();
    }
    //If more than 2 players, skip can proceed normally.
    else{
        changeActivePlayer(1);
    }
}

function updateDiscardCard(newDiscardCard){

    discardCard = newDiscardCard;

    //Update the UI with the new discard card
    let UIDiscardCard = document.getElementById("UIDiscardCard");
    UIDiscardCard.src = "./Cards/" + discardCard.getFile();
    (debug ? console.log("Discard card updated, new card:"):null);
    (debug ? console.log(discardCard):null);

}

function changeActivePlayer(numPlayersToAdvance){

    (debug ? console.log("Changing the active player.  Current player: " + activePlayer) : null);
    activePlayer = Number(getNextPlayer());
    (debug ? console.log("Active player after the change: " + activePlayer) : null);
    return true;

}

//Returns the array position number of the next player
function getNextPlayer(){

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

    return Number(nextPlayer);
}

function checkWinCondition(){
    (debug ? console.log("WIN CHECK: Current players hand length: " + playersArray[activePlayer].getPlayerHand().length) : null);
    (debug ? console.log("WIN CHECK: Current player: " + activePlayer) : null);

    //If the last play results in a player having 0 cards, they win and the game ends.
    //Check if the active player's hand is now empty
    return playersArray[activePlayer].getPlayerHand().length === 0;

}

function getCookie(cookieName) {
    /*
    ALternate way to get the players from the cookie:
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
        //The first time the modal box is displayed, at the start of the game, the background is blacked out.
        //  This ensures that its set to transparent anytime its displayed in the future.
        document.getElementById("modalBackground").style.background = "rgba(0,0,0,0.4)";
        (debug ? console.log("Modal box element clicked: " + mouseEvent.target) : null);
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
//When CONTINUE is clicked in the wild card selection:
//var wildContinueButton = document.getElementById("wildContinue");

//Closing the modal box
// When the user clicks on <span>/X, close the modal
modalCloseButton.onclick = function(mouseEvent){
    hideModalBoxFunction(mouseEvent);
}
// When the user clicks anywhere outside the modal, close it
window.onclick = function(mouseEvent) {
    hideModalBoxFunction(mouseEvent);
}

//WILD CARD MODAL BOX
function showWildModal(){
    modalBackgroundWild.style.display = "block";
}
function hideWildModal(){
    modalBackgroundWild.style.display = "none";

}
var modalBackgroundWild = document.getElementById("modalBackgroundWild");


//CONTINUE BETWEEN PLAYERS MODAL BOX
function showContinueModal(){
    modalBackgroundContinue.style.display = "block";
}
function hideContinueModal(){
    modalBackgroundContinue.style.display = "none";

}
var modalBackgroundContinue = document.getElementById("modalBackgroundContinue");


// END MODAL BOX FUNCTION ------------------------------------------------------------------------------------------------------------------

//Start game box: Notify the users about how to play the game.
document.addEventListener('DOMContentLoaded', (event) => { //DOMContentLoaded
    (debug ? console.log('The DOM is fully loaded, displaying welcome message') : null)
    showModalBoxFunction(event, "<h3>How to play the game</h3><p>Player " +playersArray[0].getPlayerName()+ " goes first.  They can either play a card by clicking it, or draw a card by clicking the deck.</p>" +
        "<p>After you play, the game board will be hidden as the next player's cards are displayed.  Click 'Continue' for the next player to begin their turn.</p>" +
        "<p>To start the game & "+playersArray[0].getPlayerName()+"'s turn, click the X on the right.</p>");

    //When starting the game, black out the background so no-one is able to see the starting players cards
    document.getElementById("modalBackground").style.background = "rgba(0,0,0)"
});


// Help Button
var helpButton = document.getElementById("helpButton");
helpButton.onclick = function(mouseEvent) {
    showModalBoxFunction(mouseEvent, "<p><h3>Game Rules & Help Menu</h3></p>" +
        //TODO: Reformat & cleanup the text below.  Also additional rules for 2 & 4 player games
        "<p>See here for official rules: <a href='https://www.unorules.com/'>www.unorules.com</a></p>" +
        "<table>" +
        "<tr><th>Card</th><th>Image</th><th>Effect</th></tr>" +
        "<tr><td>Number Card</td><td><img src='./Cards/Green_0.png' style=\"height:40px;\"/></td><td>  No special effect</td></tr>" +
        "<tr><td>Reverse Card</td><td><img src='./Cards/Green_21.png' style=\"height:40px;\"/></td><td>  Reverses the order of play</td></tr>" +
        "<tr><td>Skip Card</td><td><img src='./Cards/Green_22.png' style=\"height:40px;\"/></td><td>  Skips the next player</td></tr>" +
        "<tr><td>+2</td><td><img src='./Cards/Green_20.png' style=\"height:40px;\"/></td><td>  Puts 2 cards into the next player's hand, then skips the next player.</td></tr>" +
        "<tr><td>Wild</td><td><img src='./Cards/Wild_11.png' style=\"height:40px;\"/></td><td>  Able to be played on any card.  Player selects the color for the discard pile.</td></tr>" +
        "<tr><td>Wild +4</td><td><img src='./Cards/Wild_14.png' style=\"height:40px;\"/></td><td>  Able to be played on any card.  Player selects the color for the discard pile. Puts 4 cards into the next player's hand, then skips the next player.</td></tr>" +
        "</table>" +
        "<p>This game is based on a 108 card deck</p>" +
        "<p>Every player views his/her cards and tries to match the card in the Discard Pile." +
        "<p>Variation from official rules: No need to shout UNO.  Wild 4 does not require you to NOT have other playable cards</p>" +
        "\n" +
        "When playing a card, it needs to match either the number, color, or the symbol/Action. For instance, if the Discard Card has a red card that is an 8 you have to play either a red card, a card with an 8 on it, or a wild card.\n" +
        "\n" +
        "If the player has no matches or they choose not to play any of their cards even though they might have a match, they must draw a card from the Deck. You can then play a card, or click End Current Player's Turn to move onto the next player.\n" +
        "\n" +
        "Take note that you can only put down one card at a time; you cannot stack two or more cards together on the same turn.\n" +
        "\n" +
        "The game continues until a player has no cards left.  That player then wins the game!” </p>");
}



//Shuffle Deck button
var shuffleButton = document.getElementById("shuffleButton");
shuffleButton.onclick = function(mouseEvent){
    gameDeck.shuffle();
    (debug ? console.log("Shuffled Deck:") : null);
    (debug ? console.log(gameDeck) : null);
    showModalBoxFunction(mouseEvent, "<h3> Deck Shuffled </h3>");
}

//Reset game function
    //Just refreshes the page. That resets everything but the player names.
var resetButton = document.getElementById("resetButton");
resetButton.onclick = function(mouseEvent){
    (debug ? console.log("Game being reset") : null);
    showModalBoxFunction(mouseEvent, "<h2> Click to confirm the game should be reset:<br> <button onclick='window.location.reload();'>RESET GAME</button></h2>");
}

//End game function
var endButton = document.getElementById("endButton");
endButton.onclick = function(mouseEvent){

    (debug ? console.log("Game ended") : null);
    //Grab the directory that we're in, so this always leads to the correct location regardless of where the game is being played (server or locally)
    let currentDirectory = new URL(".", location.href);
    let startPage = currentDirectory.href + "index.html";

    showModalBoxFunction(mouseEvent, "<h2> Click to end the game and return to the start page:<br> <button onclick='window.location.href =  \" "+startPage+" \"'>END GAME</button></h2>");
}