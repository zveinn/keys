import dayjs from "dayjs";
const DATA = "data_";

var STORE = {
	debug: Boolean(window.localStorage.getItem("debug")),
	Cache: {
		MEMORY: {
			FetchingState: false,
			DashboardData: undefined,
		},
		Clear: function() {
			return window.localStorage.clear()
		},
		Get: function(key) {
			let item = window.localStorage.getItem(key)
			if (item === null) {
				return undefined
			}
			return item
		},
		GetBool: function(key) {
			let data = window.localStorage.getItem(key)
			if (data === null) {
				return undefined
			}
			if (data === "true") {
				return true
			}
			return false
		},
		Set: function(key, value) {
			window.localStorage.setItem(key, value)
		},
		Del: function(key) {
			window.localStorage.removeItem(key)
		},
		DelObject: function(key) {
			window.localStorage.removeItem(DATA + key)
			window.localStorage.removeItem(DATA + key + "_ct")
		},
		GetObject: function(key) {
			let jsonData = undefined
			try {
				let object = window.localStorage.getItem(DATA + key)
				if (object === "undefined") {
					return undefined
				}
				jsonData = JSON.parse(object)
				if (STORE.debug) {
					console.log("%cGET OBJECT:", 'background: lightgreen; color: black', key, jsonData)
				}

			} catch (e) {
				if (STORE.debug) {
					console.log("trying to get:", key)
					console.log(e)
				}
				return undefined
			}

			if (jsonData === null) {
				return undefined
			}

			return jsonData
		},
		SetObject: function(key, object) {
			try {
				if (STORE.debug) {
					console.log("%cSET OBJECT:", 'background: lightgreen; color: black', key, object)
				}
				window.localStorage.setItem(DATA + key, JSON.stringify(object))
				window.localStorage.setItem(DATA + key + "_ct", dayjs().unix())
			} catch (e) {
				if (STORE.debug) {
					console.log("trying to set:", key, object)
					console.log(e)
				}
			}
		},
		GetCatchTimer(key) {
			try {
				let time = window.localStorage.getItem(DATA + key + "_ct")
				if (time === null) {
					return undefined
				}
				return time
			} catch (e) {
				console.log(e)
			}
			return undefined
		}
	},

};


export default STORE;
