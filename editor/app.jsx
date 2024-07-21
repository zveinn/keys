import { HashRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./assets/style/app.scss";

import WS from "./ws";
import GLOBAL_STATE from "./state";
import STORE from "./store";
import Dashboard from "./views/Dashboard";
import Editor from "./components/Editor";

const appElement = document.getElementById('editor')
const root = createRoot(appElement);
STORE.Cache.Set("debug", false)

const LaunchApp = () => {
	const state = GLOBAL_STATE("root")
	appElement.classList.add("light")


	return (
		< HashRouter >
			<Routes>
				<Route path="/file/:path" element={<Editor />} />
				<Route path="/" element={<Dashboard />} />
			</Routes>
		</HashRouter >
	)
}



root.render(<React.StrictMode>
	<LaunchApp />
</React.StrictMode>)
