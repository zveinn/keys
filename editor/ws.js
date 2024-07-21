import { STATE } from "./state"
import STORE from "./store"


var WS = {
	sockets: {
		logs: undefined,
		state: undefined,
	},
	NewSocket: (url, tag, onOpen, onMessage) => {
		if (WS.sockets[tag]) {
			return
		}

		let sock = undefined
		try {
			sock = new WebSocket(url);
			WS.sockets[tag] = sock
		} catch (error) {
			console.dir(error)
			setTimeout(() => {
				STATE.globalRerender()
			}, 2000)
			return
		}

		sock.onopen = onOpen
		sock.onmessage = onMessage
		sock.onclose = (event) => {
			console.dir(event)
			if (!event.wasClean) {
				// connection not closed cleanly..
			}
			console.log("WS:", event.type, url)
			if (WS.sockets[tag]) {
				WS.sockets[tag].close()
				WS.sockets[tag] = undefined
			}
			setTimeout(() => {
				WS.NewSocket(url, tag, messageHandler)
			}, 1000)
		}
		sock.onerror = (event) => {
			console.dir(event)
			console.log("WS:", event.type, url)
			if (WS.sockets[tag]) {
				WS.sockets[tag].close()
				WS.sockets[tag] = undefined
			}
			setTimeout(() => {
				WS.NewSocket(url, tag, messageHandler)
			}, 1000)

		}

	},
}

export default WS
