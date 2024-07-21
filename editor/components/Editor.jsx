import { useParams, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { githubDark, githubLight } from '@uiw/codemirror-theme-github';
import GLOBAL_STATE from "../state";
import { json } from "@codemirror/lang-json";
import { go } from "@codemirror/lang-go";
import { vim } from "@replit/codemirror-vim";
import CodeMirror from '@uiw/react-codemirror';
import WS from '../ws';

const Editor = (props) => {
	const state = GLOBAL_STATE()
	const [useVim, setUseVim] = useState(true)
	const [original, setOriginal] = useState("")
	const [editorRerender, setEditorRerender] = useState(0)
	const { path } = useParams()

	const reset = () => {
		setOriginal(props.data)
		setError("")
		setEditorRerender(editorRerender + 1)
		if (props.reset) {
			props.reset()
		}
	}

	const close = () => {
		props.close()
		state.globalRerender()
	}

	useEffect(() => {

		try {
			WS.NewSocket("ws://192.168.1.12:7744/control", path,
				(event) => {
					WS.sockets[path].send(`{"Signal":3,"Path":"` + path + `"}`)
				},
				(event) => {
					console.dir(event)
					console.log(event.data)
					setOriginal(event.data)
				})

		} catch (error) {
			console.dir(error)
		}

	}, [])

	let ext = [go()]
	if (useVim) {
		ext.push(vim())
	}

	return (
		<CodeMirror
			key={editorRerender}
			value={original}
			onChange={(newValue) => props.onChange(newValue)}
			theme={githubDark}
			extensions={ext}
			readOnly={props.readOnly}
			basicSetup={{ autocompletion: true }}
		/>
	);

}

export default Editor;
