// eslint-disable-next-line no-unused-vars
class CukasController {
	constructor(model, view) {
		this.model = model;
		this.model.controller = this;
		this.view = view;
	}

	update(eventType, eventInfo) {
		if (eventType === "supply") {
			const { cards, trump } = eventInfo;

			this.setText("supply", `Cards: ${cards.count}, trump:${trump}`);
		} else
		if (eventType === "hand") {
			const { playerId, cards } = eventInfo;

			this.setText(`hand_${playerId + 1}`, `Cards: ${cards}`);
		}
	}

	setText(key, text) {
		const placeholder = this.view.querySelector(`[bind='${key}']`);
		if (!placeholder) throw `Bad key: ${key}`; // FIXME: Throw an error object
		placeholder.innerText = text;
	}
}
