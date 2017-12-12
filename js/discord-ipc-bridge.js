/**
 * discord-ipc-bridge.js
 *
 * discord rich presence stuff.
 *
 * This talks to a websocket server which in turn talks to the discord-ipc
 * named pipe.
 *
 * This is basically a toy because discord-ipc-bridge will never be approved :p
 */

const DISCORD_IPC_BRIDGE_START_PORT = 6313

function send_ipc_msg(client_id, activity) {
	let ws = new WebSocket("ws://127.0.0.1:" + DISCORD_IPC_BRIDGE_START_PORT);
	ws.onopen = () => {
		ws.send(JSON.stringify({
		opcode: "Hand",
		cmd: {
			v: 1,
			client_id: client_id
		}
	}));

		setTimeout(() => {
		ws.send(JSON.stringify({
			opcode: "Activity",
			cmd: activity}))
	}, 200);

		
	}
	ws.onerror = console.log;
	ws.onclose = console.log;
	ws.onmessage = console.log;
}

function discord_ipc_update(song) {
	send_ipc_msg("387837135568502785",{
		state: (song.artist || "Unknown Artist") + " - " + (song.album || "Unknown Album"),
		details: (song.title || "Unknown Song"),
		timestamps: {
			start: parseInt(new Date().getTime() / 1000 - song.position),
			end: parseInt(new Date().getTime() / 1000 + (song.time - song.position))
		},
		assets: {
			large_image: "ayano-14",
			large_text: song.album || "Unknown Album"
		}
	});
}
