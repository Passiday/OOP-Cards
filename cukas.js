class CukasGameException {
	constructor(type, message) {
		this.type = type;
		this.message = message;
	}

	toString() {
		return `Type: ${this.type}, message: ${this.message}`;
	}
}

class CukasGame {
	/* eslint-disable lines-between-class-members */
	players = []; // 2-6 players
	deck = null; // CardSet
	trump = null; // Card
	attack = []; // Attack cards
	defence = []; // Defence cards
	hands = []; // Player hands

	gameState;
	activePlayerId;
	turnPhase;
	/* eslint-enable lines-between-class-members */


	// Constructor 1 - creates a regular game object with 2 to 6 players.
	constructor(playerCount) {
		this.controller = null;
		if (Number.isNaN(playerCount) || playerCount < 2 || playerCount > 6) {
			throw new CukasGameException("player count", `Can't make a game with ${playerCount} players`);
		}
		this.playerCount = playerCount;
		this.gameState = CukasGame.STATE_UNINITIALIZED
	}

	init() {
		this.gameState = CukasGame.STATE_INIT;
		this.deck = CardSet.standardPack();

		/**
		 * TODO: shuffle the deck and then just give the players top 6 cards.
		 * Also, just pick the trump card from the top.
		 */

		for (let x = 0; x < this.playerCount; x++) {
			const playerHand = this.deck.getRandomSet(6);
			this.players[x] = new CukasPlayer(playerHand);
			this.event("hand", { playerId: x, cards: playerHand });
		}

		this.trump = this.deck.getRandomSet(1);
		this.deck.addCard(this.trump); // TODO: Must add at the end

		this.gameState = CukasGame.STATE_GAME;

		this.event("supply", { cards: this.deck, trump: this.trump });
	}

	event(eventType, eventInfo) {
		if (!this.controller) return;
		this.controller.update(eventType, eventInfo);
	}

	// method that return a ready-to-send info about the situation about the game
	createPerspective(playerId) {
		const otherHands = []; // int[] contains number of cards for the next players in order

		// fills otherHands array
		for (let i = playerId; i !== playerId; i = (i + 1) % this.players.length) {
			otherHands.push(this.players[i].count);
		}

		let playersState = 0;
		// CukasPlayerPerspective.STATE_WAITING;
		if (playerId === this.activePlayerId) playersState = 1;
		// CukasPlayerPerspective.STATE_ATTACKING;
		if (playerId === (this.activePlayerId + 1) % this.players.length) playersState = 2;
		// CukasPlayerPerspective.STATE_DEFENDING;
		// var Perspective=new CukasPlayerPerspective(CardSet.copy(his.players[playerId].hand),
		// [...this.attack], [...this.defence], otherHands, Card.copy(this.trump), playersState);
		// {hand,attack,defence,otherHands,trumpis,state}
		return {
			hand: CardSet.copy(this.players[playerId].hand),
			attack: [...this.attack],
			defence: [...this.defence],
			others: otherHands,
			trump: Card.copy(this.trump),
			state: playersState,
		};
	}

	turn() {
		const attackPlayerId = this.activePlayerId;
		const defencePlayerId = (this.activePlayerId + 1) % this.players.length;
		this.turnPhase = CukasGame.PHASE_ATTACK;
		const attack = this.players[attackPlayerId].attack(this.createPerspective(attackPlayerId));
		let valid = true;

		// make sure they actually have the cards
		if (!attack.every((x) => this.hands[attackPlayerId].includes(x))) {
			valid = false;
		}

		if (!valid) {
			throw new CukasGameException("invalid move","Invalid attack"); // preferably, this should just reask for an attack, but I have no idea how to do that without making a huge mess
		}

		console.log(`Player ${attackPlayerId} attacks with:`);
		new CardSet(attack).log();

		console.log(`Player ${attackPlayerId} had this hand:`);
		this.hands[attackPlayerId].log();

		for (let x = 0; x < attack.length; x++) {
			// take the cards out of the deck
			this.hands[attackPlayerId].cards.splice(this.hands[attackPlayerId].indexOf(attack[x]), 1);
		}

		this.attack = attack;
		this.turnPhase = CukasGame.PHASE_DEFEND;
		const defence = this.players[defencePlayerId].defend(this.createPerspective(defencePlayerId));

		if (defence == null) { // if null, just pick up the attack cards
			console.log(`Player ${defencePlayerId} picks up the cards.`);
			console.log(`Player ${defencePlayerId} had this hand:`);

			this.hands[defencePlayerId].log();
			this.hands[defencePlayerId].cards.push(...attack); // add attack cards to defenders deck

			if (this.hands[attackPlayerId].count - 6 < 0) {
				// make sure the attacker ends turn with 6 cards in hand
				this.hands[attackPlayerId].cards.push(
					this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].count - 6)),
				);
			}

			// increment player id by 2 since if you pick up cards, you sit out a turn
			this.activePlayerId = (this.activePlayerId + 2) % this.players.length;
			return;
		}

		valid = true;

		// FIXME: Where is the variable x in "defence[x]" defined?
		// make sure defence has the cards
		if (!defence[x].every((x) => this.hands[defencePlayerId].includes(x))) {
			valid = false;
		}

		if (!valid) {
			// TODO: Throw error object
			throw "Invalid defence!"; // same as the invalid attack error
		}

		for (let x = 0; x < attack.length; x++) {
			// TODO: Make a card comparison function in Card class
			if (defence[x].suit !== this.trump[0].suit) { // make sure the cards can beat the attack cards
				if (
					attack[x].suit !== defence[x].suit
					|| attack[x].rank > defence[x].rank
				) {
					valid = false;
				}
			} else if (
				attack[x].suit === this.trump.suit // likewise here
				&& attack[x].rank > defence[x].rank
			) {
				valid = false;
			}
		}
		if (!valid) {
			throw new CukasGameException("invalid move", "Invalid defence");
		}

		console.log(`Player ${defencePlayerId}defends with:`);
		new CardSet(defence).log();

		console.log(`Player ${defencePlayerId} had this hand:`);
		this.hands[defencePlayerId].log();

		for (let x = 0; x < attack.length; x++) {
			// remove played cards from hand
			this.hands[defencePlayerId].splice(this.hands[defencePlayerId].indexOf(defence[x]), 1); 
		}

		this.defence = defence;

		if (this.hands[attackPlayerId].length - 6 < 0) {
			// make sure attack has 6 cards
			this.hands[attackPlayerId].push(
				this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].length - 6)),
			);
		}

		if (this.hands[defencePlayerId].length - 6 < 0) {
			// make sure defence has 6 cards
			this.hands[defencePlayerId].push(
				this.deck.getRandomSet(Math.abs(this.hands[attackPlayerId].length - 6)),
			);
		}

		// increment active player id
		this.activePlayerId = (this.activePlayerId + 1) % this.players.length;

		// console.log(this.players);
	}

	compareCards(a, b) { // 1 - a>b -1 - a<b 0 - a=b
		if (a.type === Card.TYPE_JOKER && b.type !== Card.TYPE_JOKER) return 1;
		if (a.type === Card.TYPE_JOKER && b.type === Card.TYPE_JOKER) return 0;
		if (b.type === Card.TYPE_JOKER) return -1;

		const aTrump = a.suit === this.trump;
		const bTrump = b.suit === this.trump;

		if (a.suit === b.suit) return Math.sign(a.rank - b.rank);
		if (aTrump) return 1;
		if (bTrump) return -1;

		return 0;
	}
}

CukasGame.STATE_UNINITIALIZED = 0;
CukasGame.STATE_INIT = 1;
CukasGame.STATE_GAME = 2;
CukasGame.STATE_FINISHED = 3;

CukasGame.PHASE_ATTACK = 1;
CukasGame.PHASE_DEFEND = 2;

// TODO: Make class less useless?
class CukasPlayer {
	// eslint-disable-next-line no-useless-constructor
	constructor() {}

	static attack(/* perspective */) {
		// Returns array of attack cards
		const arr = [];

		// FIXME: where tf is gameInfo?
		if (gameInfo.hand.count > 0) {
			arr.push(gameInfo.hand.cards[0]);
		}

		return arr;
	}

	defend(gameInfo) {
		// Returns array of defence cards or null, if the player picks up
		return null;
	}
}
/*
class CukasPlayerPerspective {//container for info about specific users
  hand;//current players hand (CardSet)
  attack;//cards attacking
  defence;//cards defending
  otherHandCount;//amount of cards of other players
  trump;//trump card
  state;
  constructor(iHand, iAttack, iDefence, iOtherHandCount, iTrump, iState){//i as in input NOT apple products
	hand=iHand;
	attack=iAttack;
	defence=iDefence;
	otherHandCount=iOtherHandCount;
	trump=iTrump;
	state=iState;
  }
}
CukasPlayerPerspective.STATE_ATTACKING = 0;//various states
CukasPlayerPerspective.STATE_DEFENDING = 1;
CukasPlayerPerspective.STATE_WAITING = 2;
*/
