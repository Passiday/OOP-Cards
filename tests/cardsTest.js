import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';
fixture `Cards Testd`
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
    await t.expect(result).ok();
});