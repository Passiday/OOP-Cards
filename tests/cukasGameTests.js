import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';
fixture `CukasGame tests`
    .page `../index.html`;

const cukasGameTest = ClientFunction(() => {
    try {
        new CukasGame(17);
        return false;
    } catch(e) {
        return true;
    }
});

test('CukasGame test', async t => {
    const result = cukasGameTest();
    await t.expect(result).ok("Incorrect amount of players was not handled!");
});

const cukasGameEqualsTest = ClientFunction(() => {
    let x = new CukasGame(3);
    return x.compareCards(new Card(Card.TYPE_NORMAL, 2, 6), new Card(Card.TYPE_NORMAL, 2, 7)) == -1;
});

test('CukasGame.compareCards test', async t => {
    const result = cukasGameEqualsTest();
    await t.expect(result).ok("Card B was not recognised as greater than A!");
});

const cukasGameSavePlayersTest = ClientFunction(()=>{
    let originalGame = new CukasGame(4);
    const deck = CardSet.standardPack();

    originalGame.players[2] = new CukasPlayer(deck.getRandomSet(6));

    const gameSave = CukasGame.saveToJSON(originalGame);
    const loadedGame = CukasGame.loadFromJSON(gameSave).saveData;

    return loadedGame.players[2].hand.cards[4].equals(originalGame.players[2].hand.cards[4]);
});

test("(Save and load) Players", async t => {
    const result = cukasGameSavePlayersTest();
    await t.expect(result).ok("Player save data was corrupted!"); 
});

const cukasGameSaveDeckTest = ClientFunction(()=>{
    let originalGame = new CukasGame(4);
    originalGame.deck = CardSet.standardPack();

    const gameSave = CukasGame.saveToJSON(originalGame);
    const loadedGame = CukasGame.loadFromJSON(gameSave).saveData;

    return loadedGame.deck.indexOf(originalGame.deck.cards[21]) === 21;
});

test("(Save and load) Deck", async t => {
    const result = cukasGameSaveDeckTest();
    await t.expect(result).ok("Deck save data was corrupted!"); 
});

const cukasGameSaveOtherCardsTest = ClientFunction(()=>{
    let originalGame = new CukasGame(4);
    const deck = CardSet.standardPack();

    originalGame.trump = new Card(Card.TYPE_NORMAL, 2, 6);
    originalGame.attack = deck.getRandomSet(3);
    originalGame.defence = deck.getRandomSet(2);

    const gameSave = CukasGame.saveToJSON(originalGame);
    const loadedGame = CukasGame.loadFromJSON(gameSave).saveData;

    return (
        loadedGame.attack.indexOf(originalGame.attack.cards[2]) === 2 
        && loadedGame.defence.indexOf(originalGame.defence.cards[1]) === 1
        && loadedGame.trump.equals(originalGame.trump)
    );
});

test("(Save and load) Attack/Defence/Trump card", async t => {
    const result = cukasGameSaveOtherCardsTest();
    await t.expect(result).ok("Attack/Defence/Trump card save data was corrupted!"); 
});

const cukasGameSaveOtherValueTest = ClientFunction(()=>{
    let originalGame = new CukasGame(4);
    originalGame.gameState = 3;
    originalGame.turnPhase = 0;
    originalGame.activePlayerId = 1;

    const gameSave = CukasGame.saveToJSON(originalGame);
    const loadedGame = CukasGame.loadFromJSON(gameSave).saveData;

    return (
        originalGame.gameState === loadedGame.gameState
        && originalGame.turnPhase === loadedGame.turnPhase
        && originalGame.activePlayerId === loadedGame.activePlayerId
    );
});

test("(Save and load) Other value", async t => {
    const result = cukasGameSaveOtherValueTest();
    await t.expect(result).ok("GameState/TurnPhase/ActivePlayer save data was corrupted!"); 
});

const cukasGameSaveTimestampTest = ClientFunction(()=>{
    let originalGame = new CukasGame(4);

    const saveTime = new Date();
    const gameSave = CukasGame.saveToJSON(originalGame);
    const loadedGame = CukasGame.loadFromJSON(gameSave);

    return saveTime.getMinutes() === loadedGame.created.getMinutes();
});

test("(Save and load) Timestamp", async t => {
    const result = cukasGameSaveTimestampTest();
    await t.expect(result).ok("Timestamp wasn't saved properly!"); 
});