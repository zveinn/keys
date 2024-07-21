import { useState } from "react";


const state = (page) => {
	const [value, reload] = useState({ x: 0 })
	const update = () => {
		let x = { ...value }
		x.x += 1
		reload({ ...x })
	}
	STATE.updates[page] = update

	return STATE
}

export var STATE = {
	updates: [],
	debug: true,
	rerenderAll: () => {
		Object.keys(STATE.updates).forEach(k => {
			if (STATE.debug) {
				console.log("FULL RR:", k)
			}
			STATE.updates[k]()
		})
	},
	renderPage: (page) => {
		if (STATE.updates[page]) {
			if (STATE.debug) {
				console.log("RR:", page)
			}
			STATE.updates[page]()
		}
	},

}


export default state
