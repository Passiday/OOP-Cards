import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';
fixture `Cards Test`
    .page `../index.html`;
//https://devexpress.github.io/testcafe/documentation/test-api/obtaining-data-from-the-client/
//Use this to write tests testing js functions.
const includesTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    const cardSet = CardSet.standardPack();
    return cardSet.includes(card);
});
test('CardSet.includes(card) test', async t => {
    const result = await includesTest();
    await t.expect(result).ok("Includes returned an incorrect result!");
});
const indexTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    const cardSet = CardSet.standardPack();
    return cardSet.indexOf(card);
});
test('CardSet.indexOf(card) test', async t => {
    const result = await indexTest();
    await t.expect(result).eql(31, "indexOf returned an incorrect result!");
});
const countTest = ClientFunction(() => {
    const cardSet = CardSet.standardPack();
    return cardSet.count;
});
test('CardSet.count test', async t => {
    const result = await countTest();
    await t.expect(result).eql(52, "Count returned an incorrect result!");
});
const arrayTest = ClientFunction(() => {
    const cardSet = CardSet.standardPack();
    return cardSet.asArray()[0].suit == cardSet.cards[0].suit && cardSet.asArray()[0].rank == cardSet.cards[0].rank;
});
test('CardSet.asArray() test', async t => {
    const result = await arrayTest();
    await t.expect(result).ok("asArray returned an incorrect result!");
});
const topTest = ClientFunction(() => {
    const cardSet = CardSet.standardPack();
    const card = cardSet.takeTop(1).cards[0];
    return card.suit == 0 && card.rank == 1;
});
test('CardSet.takeTop(n) test', async t => {
    const result = await topTest();
    await t.expect(result).ok("takeTop returned an incorrect result!");
});
const copyTest = ClientFunction(() => {
    const cardSet = CardSet.standardPack();
    const copySet = cardSet.copy();
    return cardSet.cards.every((x, n) => x.rank == copySet.cards[n].rank && x.suit == copySet.cards[n].suit);
});
test('CardSet.copy() test', async t => {
    const result = await copyTest();
    await t.expect(result).ok("copyTop returned an incorrect result!");
});
const stringTest = ClientFunction(() => {
    const cardSet = CardSet.standardPack();
    return cardSet.toString();
});
test('CardSet.copy() test', async t => {
    const result = await stringTest();
    await t.expect(result).eql("A♥, 2♥, 3♥, 4♥, 5♥, 6♥, 7♥, 8♥, 9♥, 10♥, J♥, Q♥, K♥, A♠, 2♠, 3♠, 4♠, 5♠, 6♠, 7♠, 8♠, 9♠, 10♠, J♠, Q♠, K♠, A♣, 2♣, 3♣, 4♣, 5♣, 6♣, 7♣, 8♣, 9♣, 10♣, J♣, Q♣, K♣, A♦, 2♦, 3♦, 4♦, 5♦, 6♦, 7♦, 8♦, 9♦, 10♦, J♦, Q♦, K♦", "toString returned an incorrect result!");
});
const cardSymbolTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    return card.getSuitSymbol();
});
const cardStringTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    return card.toString();
});
const cardNormalTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    return card.isNormal();
});
const cardJokerTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    return card.isJoker();
});
const cardCopyTest = ClientFunction(() => {
    const card = new Card(Card.TYPE_NORMAL, 2, 6);
    const copy = card.copy();
    return (card.rank == copy.rank && card.type == copy.type && card.suit == copy.suit);
});
test('cardObj Test', async t => {
    let result = await cardSymbolTest();
    await t.expect(result).eql("♣", "Card Symbol is incorrect!");
    result = await cardStringTest();
    await t.expect(result).eql("6♣", "Card String form is incorrect!");
    result = await cardNormalTest();
    await t.expect(result).ok("Card.isNormal() returned an incorrect result.");
    result = await cardJokerTest();
    await t.expect(result).notOk("Card.isJoker() returned an incorrect result.");
    result = await cardCopyTest();
    await t.expect(result).ok("Copy is not equal to its' original.");
});
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