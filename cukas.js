class CukasGame {
    players: []; // 2-6 players
    deck: null; // CardSet
    trump: null; // Card
    attack: []; // Attack cards
    defence: []; // Defence cards

    gameState;
    activePlayerId;
    turn = 0;
    turnPhase;

    getGameInfo() {
        return true;
    }

    turn() {
        const attackPlayerId = this.activePlayerId;
        const defencePlayerId = (this.activePlayerId + 1) % this.players.length;
        this.turnPhase = CukasGame.PHASE_ATTACK;
        const attack = this.players[attackPlayerId].attack(this.getGameInfo());
        // TODO: validate if this is a valid attack
        this.attack = attack;
        this.turnPhase = CukasGame.PHASE_DEFEND;
        const defence = this.players[decencePlayerId].defend(this.getGameInfo());
        // TODO: validate if this is a valid defence
        this.defence = defence;
    }
}

CukasGame.STATE_INIT = 1;
CukasGame.STATE_GAME = 2;
CukasGame.STATE_FINISHED = 3;

CukasGame.PHASE_ATTACK = 1;
CukasGame.PHASE_DEFEND = 2;

class CukasPlayer {
    hand: null; // CardSet

    attack(gameInfo) {
        // Returns array of attack cards
        return [];
    }

    defend(gameInfo) {
        // Returns array of defence cards or null, if the player picks up
    }
}
