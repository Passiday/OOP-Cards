class CukasController {
    constructor(model, view) {
        this.model = model;
        this.model.controller = this;
        this.view = view;
    }
    update(eventType, eventInfo) {
        if (eventType == "supply") {
            const cards = eventInfo.cards;
            const trump = eventInfo.trump;
            this.setText("supply", `Cards: ${cards.count}, trump:${trump}`);
        } else
        if (eventType == "hand") {
            const playerId = eventInfo.playerId;
            const cards = eventInfo.cards;
            this.setText("hand_" + (playerId + 1), `Cards: ${cards}`);
        }
    }
    setText(key, text) {
        let placeholder = this.view.querySelector(`[bind='${key}']`);
        if (!placeholder) throw `Bad key: ${key}`;
        placeholder.innerText = text;
    }

    updateModel(newModel){
        this.model = newModel;
        this.model.controller = this;
    }
}