ver = '0.1-beta.1'
modName = ' Unofficial Blocktanks Mod, '
modName0 = ' Unofficial Blocktanks Mod.'
function specialLog(name, suffix, vip, serverMessage = false) {
	var table = document.getElementById("console");
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	var p = document.createElement("p");
	var username = document.createElement("span");
	var text = document.createElement("span");

	if(credentials.guest) {
		console.log('%cVERSION ' + ver + ' || Welcome Guest to the' + modName0, 'font-size: 20px; color: #9d00ff; font-weight: bold;');
		console.log('%cCan not get User stats, Logged in as a Guest', 'font-size: 15px; color: #f00; font-weight: bold;');
		console.log('%cYou\'re logged in as a guest, Some of the UBTM features are unavailable','font-size:12px; color: #f00; font-weigth: bold;')
	}


	username.innerText = name;
	text.innerText = suffix;

	if (vip) {
		username.classList.add("vipText");
	}

	if (serverMessage) {
		username.classList.add('serverMessage');
		console.log("ServerMessage");
	}

	username.classList.add('preserve-whitespace');

	p.appendChild(username);
	p.appendChild(text);
	p.style.width = "30vmin";
	td.appendChild(p);
	tr.appendChild(td);
	table.appendChild(tr);

	var objDiv = document.getElementById("consoleDiv");
	objDiv.scrollTop = objDiv.scrollHeight;
	return username;
}

function log(string, admin) {

	var table = document.getElementById("console");
	var tr = document.createElement("tr");
	var td = document.createElement("td");
	var p = document.createElement("p");

	p.innerText = string;
	p.style.width = "30vmin";
	td.appendChild(p);
	tr.appendChild(td);
	table.appendChild(tr);

	var objDiv = document.getElementById("consoleDiv");
	objDiv.scrollTop = objDiv.scrollHeight;
}

function resetConsolePlaceholder() {
	let chatbox = document.getElementById('chat_type');
	if (credentials.controls) {
		let boundTo = getStringFromKeycode(credentials.controls.talk[0], true);
		chatbox.placeholder = `Press ${boundTo.toLowerCase()} to talk`;
	}
	else {
		chatbox.placeholder = 'Press "t" to talk, Like wow and nice.';
	}
}

function enableConsole() {
	if (!credentials.kidMode && !credentials.guest && window.location.hostname != 'simple.blocktanks.net') {
		consoleEnabled = true;

		const consoleDiv = document.getElementById('consoleDiv');
		consoleDiv.style.display = 'block';

		const consoleHidden = (sessionStorage.getItem('consoleHidden') === 'true');
		if (consoleHidden) {
			hideConsole();
		} else {
			showConsole();
		}
	}
}

function disableConsole() {
	consoleEnabled = false;

	const consoleDiv = document.getElementById('consoleDiv');
	const chat_type = document.getElementById('chat_type');
	consoleDiv.style.display = 'none';
	chat_type.style.display = 'none';
}

function showConsole() {
	if (!consoleEnabled) return;

	const console = document.getElementById('console');
	const chat_type = document.getElementById('chat_type');
	resetConsolePlaceholder();
	console.style.display = 'table';
	chat_type.style.display = 'block';
	collapseConsole();

	consoleHidden = false;
	sessionStorage.setItem('consoleHidden', 'false');
}

function hideConsole() {
	const console = document.getElementById('console');
	const chat_type = document.getElementById('chat_type');
	console.style.display = 'none';
	chat_type.style.display = 'none';

	consoleHidden = true;
	sessionStorage.setItem('consoleHidden', 'true');
}

function expandConsole() {
	if (!consoleEnabled || consoleHidden) return;

	consoleExpanded = true;
	const chat_type = document.getElementById('chat_type');
	const consoleDiv = document.getElementById('consoleDiv');
	consoleDiv.classList.add('toggledConsole');
	consoleDiv.scrollTop = consoleDiv.scrollHeight;
	chat_type.select();
}

function collapseConsole() {
	consoleExpanded = false;
	const consoleDiv = document.getElementById('consoleDiv');
	const chat_type = document.getElementById('chat_type');
	consoleDiv.classList.remove('toggledConsole');
	consoleDiv.scrollTop = consoleDiv.scrollHeight;
	chat_type.blur();
}

function showRespawnUI() {
	if (state != "game" || gameEnded) {
		return;
	}
	document.getElementById("respawnCopyLink").innerText = "Copy";
	var respawn_button = document.getElementById("respawn_button");

	tankdisabled = true;
	respawn_button.onclick = null;

	document.getElementById("respawn_screen").style.display = "block";
	if (!credentials.vip) {
		show("respawnAds");
	}
	hide('respawnSwap');
	var initialTime = Date.now();
	var countdownInterval = setInterval(function() {
		var timeElapsed = (Date.now() - initialTime) / 1000;
		var timeLeft = SERVER_MATCH_DATA.match_general_respawnTime - timeElapsed;
		if (timeLeft <= 0) {
			clearInterval(countdownInterval);
			respawn_button.innerHTML = SERVER_MATCH_DATA.elimination && !SERVER_MATCH_DATA.calculated.inWarmup ? "Click to Spectate" : "Click to Respawn";
			respawn_button.onclick = () => {
				if (SERVER_MATCH_DATA.elimination && !SERVER_MATCH_DATA.calculated.inWarmup) {
					startEliminationSpectate();
				}
				else {
					respawn_user();
					if (SERVER_MATCH_DATA.match_general_enableSwapTeam) {
						show('respawnSwap');
					}
				}
				respawn_button.onclick = null;
			};
		}
		else {
			respawn_button.innerHTML = (SERVER_MATCH_DATA.elimination && !SERVER_MATCH_DATA.calculated.inWarmup ? "Spectating in" : "Respawning in") + " " + timeLeft.toFixed(1) + "...";
		}
	}, 100);



	if (server_tanks[name].deaths >= 1 && !credentials.vip) {
		showRespawnAd();
		if(window.gtag){
			gtag('event', 'conversion', {'send_to': 'AW-467085040/ysoyCOq_i4sDEPDN3N4B'});		
		}
	}


}

function updateTanksAliveCount() {
	var players = 0;
	for (var i in server_tanks) {
		if (SERVER_MATCH_DATA.calculated.inWarmup === true || (server_tanks[i].body && server_tanks[i].body.alpha != 0)) {
			players += 1;
		}
	}
	if (document.getElementById("tanksAlive").style.display != "block") {
		document.getElementById("tanksAlive").style.display = "block";
	}
	document.getElementById("tanksAliveText").innerText = players;
}

function startEliminationSpectate() {
	startDynamicSpectate();
	document.getElementById("teamButtonAuto").style.display = "none";
	document.getElementById("teamButtonBlue").style.display = "none";
	document.getElementById("teamButtonRed").style.display = "none";
	document.getElementById("teamButton").style.display = "none";
}

function getGameWidth() {
	return game.width / SCALE;
}

function getGameHeight() {
	return game.height / SCALE;
}

function resize_game() {
	game.scale.setGameSize(window.innerWidth, window.innerHeight);
	SCALE = getCameraScale();
	game.camera.scale.x = game.camera.scale.y = SCALE;

	if (window.state && state == "title") {
		positionProfileTank();
		title_gradient.destroy();
		title_gradient = createGradient(getGameWidth(), getGameHeight());
		title_background.width = window.innerWidth * (window.devicePixelRatio > 1 ? window.devicePixelRatio : 1) + 58;
		title_background.height = window.innerHeight * (window.devicePixelRatio > 1 ? window.devicePixelRatio : 1) + 58;
	}
}

function showGameList(yes) {
	var titleMain = document.getElementsByClassName("titleMain");
	for (var i = 0; i < titleMain.length; i++) {
		titleMain[i].style.display = yes ? "none" : "table-row";
	}
	document.getElementById("gamesList").style.display = yes ? "table-row" : "none";
	positionProfileTank();
	if (credentials.guest) {
		document.getElementById("homepageAdContainer").style.display = yes ? "none" : "table-row";
	}
}

function fillGameList(games) {
	var html = '';

	for (var i in games) {
		if (games[i].searchable === false) continue;

		if (games[i].host.split("_")[0] !== CHOSEN_REGION) {
			continue;
		}
		if (games[i].playerCount != games[i].maxPlayers) {
			if (document.getElementById(i) !== null) {
				if (document.getElementById(i).classList.contains("selectedGame")) {
					var newRow = "<tr id= '" + i + "' class='selectedGame' onclick='selectGame(this,\"" + i + "\")'><td>" + games[i].map + "</td><td>" + readableMode(games[i].mapGroup) + "</td><td>" + games[i].humanCount + "/" + games[i].maxPlayers + " Online</td></tr>";
				}
				else {
					var newRow = "<tr id= '" + i + "' onclick='selectGame(this,\"" + i + "\")'><td>" + games[i].map + "</td><td>" + readableMode(games[i].mapGroup) + "</td><td>" + games[i].humanCount + "/" + games[i].maxPlayers + " Online</td></tr>";
				}
			}
			else {
				var newRow = "<tr id= '" + i + "' onclick='selectGame(this,\"" + i + "\")'><td>" + games[i].map + "</td><td>" + readableMode(games[i].mapGroup) + "</td><td>" + games[i].humanCount + "/" + games[i].maxPlayers + " Online</td></tr>";
			}
		}
		else {
			if (document.getElementById(i) !== null) {
				if (document.getElementById(i).classList.contains("selected")) {
					document.getElementById("startMatchButton").classList.add("invalidButton");
					document.getElementById("startMatchButton").onclick = null;
				}
			}
			var newRow = "<tr id= '" + i + "' class='invalid'><td>" + games[i].map + "</td><td>" + readableMode(games[i].mapGroup) + "</td><td>" + games[i].playerCount + "/" + games[i].maxPlayers + "<br>Game Full</td></tr>";
		}
		html += newRow;
	}
	if (html == "") {
		document.getElementById("gamesListTable").innerHTML = "Loading games, please wait...";
		return;
	}

	document.getElementById("gamesListTable").innerHTML = html;

}

function readableMode(mode) {
	// Supports either a preset name or a mode name as input
	var modeNames = {
		"tdm": translate("modeTDM"),
		"tdm_huge": translate("modeTDM"),
		"tdm_big": translate("modeTDM"),
		"tdm_small": translate("modeTDM"),
		"cp": translate("modeCP"),
		"ffa": translate("modeFFA"),
		"br": translate("modeBR"),
		"ctf": translate("modeCTF")
	};
	if (modeNames[mode]) {
		return modeNames[mode];
	}
	else {
		return presetMetaData[mode]?.name ?? 'Unknown LTM';
	}
}

function readableModeObjective(mode) {
	var modeObjs = {
		"tdm": translate("modeObjTDM"),
		"cp": translate("modeObjCP"),
		"ffa": translate("modeObjFFA"),
		"ctf": translate("modeObjCTF")
	};
	return modeObjs[mode];
}

function logout() {
	removeStoredData("username");
	removeStoredData("hash");
}

function sortTeamBoard(team) {
	var playerList = [];
	for (var i in server_tanks) {
		if (server_tanks[i].team == team || MODE === "ffa") {
			playerList.push({ name: i, k: server_tanks[i].kills, d: server_tanks[i].deaths });
		}
	}

	function compare(a, b) {
		if (a.k < b.k)
			return 1;
		if (a.k > b.k)
			return -1;
		if (a.d > b.d)
			return 1;
		if (a.d < b.d)
			return -1;
		return 0;
	}

	playerList.sort(compare);

	for (var i = 0; i < playerList.length; i++) {
		var target = document.getElementById("teamBoardEntry_" + playerList[i].name);
		if (target) {
			target.style.top = (5 * i) + "vmin";
		}
	}
}

function getMatchWinner() {
	if (SERVER_MATCH_DATA.elimination) {
		updateWorld(latestUpdate, true);
		for (var i in server_tanks) {
			if (latestUpdate.tanks[i] && latestUpdate.tanks[i].o != 0) {
				return server_tanks[i].displayName;
			}
		}
		return "Nobody"
	}

	var playerList = [];
	for (var i in server_tanks) {
		if (server_tanks[i].team == team || MODE === "ffa") {
			playerList.push({ name: server_tanks[i].displayName, k: server_tanks[i].kills, d: server_tanks[i].deaths });
		}
	}

	function compare(a, b) {
		if (a.k < b.k)
			return 1;
		if (a.k > b.k)
			return -1;
		if (a.d > b.d)
			return 1;
		if (a.d < b.d)
			return -1;
		return 0;
	}

	playerList.sort(compare);
	if (playerList.length > 0) {
		return playerList[0].name;
	}
	else {
		return "Unknown";
	}
}

function addPlayerToTeamBoard(username) {
	if (document.getElementById("teamBoardEntry_" + username) != undefined) {
		return; //fixes the annoying bug with the scoreboard
	}

	function noReport(t) {
		return t == name || credentials.guest || t.slice(0, 5) == "[bot]";
	}

	const escapedUsername = escapeHTML(username);
	const escapedDisplayName = escapeHTML(server_tanks[username].displayName);

	let usernameTD = "<p style='margin:0px;margin-top:1.2vmin;'>" + escapedDisplayName + "</p>";

	if (!server_tanks[username].guest) {
		usernameTD = `<table class="userWithImage" cellpadding=0 cellspacing=0><tr><td><img src="assets/ranks/${(server_tanks[username].bot ? "ai" : server_tanks[username].level)}.png"></td><td align="left"><p class="preserve-whitespace ${(server_tanks[username].vip ? "vipText" : "")}">${escapedDisplayName}</p></td></tr></table>`;
	}

	const html = '<tr class="teamBoardEntry"' + (server_tanks[username].guest || noReport(username) ? "" : 'onclick="reportPlayer(\'' + escapedUsername + '\');" style="cursor:pointer;"') + '" id="teamBoardEntry_' + escapedUsername + '"><td style="position:absolute;width:70%;">' + usernameTD + '</td><td style="position:absolute;width:15%;left:70%;padding-top:1.2vmin;">0</td><td style="position:absolute;width:15%;left:85%;padding-top:1.2vmin;">0</td></tr>';

	if (MODE !== "ffa") {
		if (server_tanks[username].team == "r") {
			document.getElementById("redTeam").innerHTML += html;
		}
		else {
			document.getElementById("blueTeam").innerHTML += html;
		}
	}
	else {
		document.getElementById("team").innerHTML += html;
	}
	updateTeamButtons();

	const el = document.getElementById('teamBoardEntry_' + username);

	// Remove the existing styles
	el.childNodes.forEach(child => {
		child.setAttribute('style', '');
	});
	el.querySelectorAll('td:nth-child(1)>p').forEach(child => {
		child.style.marginTop = '0px';
	});

	// Add custom K/D field
	el.appendChild(document.createElement('td'));

	// Update listeners for player info
	updatePlayerInfoListeners(username);
}

function updateTeamButtons() {
	if (MODE === 'ffa') {
		const ffaTeamCount = document.querySelector('#team').children.length;
		const ffaTeamFull = (ffaTeamCount >= SERVER_MATCH_DATA.maxPerTeam);

		const ffaButton = document.querySelector('#teamButton');
		const ffaButtonText = document.querySelector('#teamButtonText');

		if (FLAGS.BLUE_VALID !== false) {
			ffaButtonText.innerText = (ffaTeamFull) ? 'Full' : 'Join';
			ffaButtonText.style.fontSize = '';
			ffaButton.style.cursor = (ffaTeamFull) ? 'default' : 'pointer';
			ffaButton.style.opacity = (ffaTeamFull) ? 0.5 : 1;
			ffaButton.onclick = (ffaTeamFull) ? null : () => joinTeam('a');
		} else {
			ffaButtonText.innerText = 'Requirements\n Not Met';
			ffaButtonText.style.fontSize = '3vmin';
			ffaButton.style.cursor = 'default';
			ffaButton.style.opacity = '0.5';
			ffaButton.onclick = null;
		}

		return;
	}

	const blueTeamCount = document.querySelector('#blueTeam').children.length;
	const redTeamCount = document.querySelector('#redTeam').children.length;
	const blueTeamFull = (blueTeamCount >= SERVER_MATCH_DATA.maxPerTeam);
	const redTeamFull = (redTeamCount >= SERVER_MATCH_DATA.maxPerTeam);

	const blueButton = document.querySelector('#teamButtonBlue');
	const blueButtonText = document.querySelector('#teamButtonBlueText');
	const redButton = document.querySelector('#teamButtonRed');
	const redButtonText = document.querySelector('#teamButtonRedText');
	const autoButton = document.querySelector('#teamButtonAuto');

	if (FLAGS.BLUE_VALID !== false) {
		blueButtonText.innerText = (blueTeamFull) ? 'Full' : 'Join';
		blueButtonText.style.fontSize = '';
		blueButton.style.cursor = (blueTeamFull) ? 'default' : 'pointer';
		blueButton.style.opacity = (blueTeamFull) ? 0.5 : 1;
		blueButton.onclick = (blueTeamFull) ? null : () => joinTeam('b');
	} else {
		blueButtonText.innerText = 'Requirements\n Not Met';
		blueButtonText.style.fontSize = '3vmin';
		blueButton.style.cursor = 'default';
		blueButton.style.opacity = '0.5';
		blueButton.onclick = null;
	}

	if (FLAGS.RED_VALID !== false) {
		redButtonText.innerText = (redTeamFull) ? 'Full' : 'Join';
		redButtonText.style.fontSize = '';
		redButton.style.cursor = (redTeamFull) ? 'default' : 'pointer';
		redButton.style.opacity = (redTeamFull) ? 0.5 : 1;
		redButton.onclick = (redTeamFull) ? null : () => joinTeam('r');
	} else {
		redButtonText.innerText = 'Requirements\n Not Met';
		redButtonText.style.fontSize = '3vmin';
		redButton.style.cursor = 'default';
		redButton.style.opacity = 0.5;
		redButton.onclick = null;
	}

	if (FLAGS.BLUE_VALID !== false && FLAGS.RED_VALID !== false) {
		const bothTeamsFull = (blueTeamFull && redTeamFull);
		autoButton.innerText = (bothTeamsFull) ? 'Both Full' : 'Auto Join';
		autoButton.style.cursor = (bothTeamsFull) ? 'default' : 'pointer';
		autoButton.style.opacity = (bothTeamsFull) ? 0.5 : 1;
		autoButton.style.visibility = 'visible';
		autoButton.onclick = (bothTeamsFull) ? null : () => joinTeam('a');
	} else {
		autoButton.style.visibility = 'hidden';
	}
}

function reportPlayer(username) {
	window.onbeforeunload = function(e) { };
	var r = confirm("Are you sure you want to report this player? This will make you exit the current game.");
	if (r) {
		socket.send("report", { aggressor: username, reportType: 'user' });
	}
	else {
		window.onbeforeunload = askBeforeExit;
	}

}

function reportMatch() {
	if (credentials.guest) return;

	window.onbeforeunload = function(e) { };
	var r = confirm("Are you sure you want to make a report? This will make you exit the current game.");
	if (r) {
		socket.send("report", { aggressor: SERVER_MATCH_DATA.id, reportType: 'match' });
	}
	else {
		window.onbeforeunload = askBeforeExit;
	}
}

/**
 * Sets the game's sound to the user's preference
 */
function setupSound() {
	const SFX_STORAGE_KEY = 'sfxEnabled';
	const SFX_STRING = localStorage.getItem(SFX_STORAGE_KEY) ?? 'true';
	const soundEnabled = (SFX_STRING === 'true');
	toggleSound(soundEnabled);
}

/**
 * Toggles the user's sound preference
 * @param {boolean} [force] An optional override that enables sound if `true` and disables sound if `false`
 */
function toggleSound(force = null) {
	const SFX_STORAGE_KEY = 'sfxEnabled';
	const ENABLED_ICON = '/assets/ui/icon-sound.png';
	const DISABLED_ICON = '/assets/ui/icon-nosound.png';
	
	const soundEnabled = (force ?? game.sound.mute); // Set sound enabled to the opposite of the current state
	
	game.sound.mute = !soundEnabled;

	const toggleSoundButton = document.querySelector('#toggleSoundButton');
	toggleSoundButton.src = (soundEnabled) ? ENABLED_ICON : DISABLED_ICON;

	localStorage.setItem(SFX_STORAGE_KEY, soundEnabled);
}

function updateTeamBoardKD(i) {
	// Update the displayed KD value
	let target = document.getElementById('teamBoardEntry_' + i);
	if (target) {
		let tank = server_tanks[i];
		if (tank.deaths == 0) {
			target.childNodes[3].innerHTML = tank.kills.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		} else {
			target.childNodes[3].innerHTML = (tank.kills / tank.deaths).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
			//console.log("K/D: ", Math.round(tank.kills / tank.deaths * 100) / 100)
		target.childNodes[3].classList.add('labs-kd');
		target.childNodes[3].style.display = credentials.labs?.kdRatio ? '' : 'none';
	}

	if (target) {
		target.childNodes[1].innerHTML = server_tanks[i].kills;
		target.childNodes[2].innerHTML = server_tanks[i].deaths;
	}
	sortTeamBoard("b");
	sortTeamBoard("r");
		
	}
}

function removePlayerFromTeamBoard(i) {
	var target = document.getElementById("teamBoardEntry_" + i);
	if (target) {
		target.parentNode.removeChild(target);
	}
	updateTeamButtons();

	// Hide player stats if it was showing the removed player
	let stats = document.getElementById('playerinfo');
	let targetPlayer = stats.getAttribute('targetPlayer');
	if (targetPlayer) {
		if (targetPlayer == i) {
			// Hide the player stats
			stats.classList.remove('visible');
			stats.classList.add('hidden');
			stats.removeAttribute('targetPlayer');
		}
	}
}

function updateClock() {
	if (latestUpdate.c < 0) {
		var time = SERVER_MATCH_DATA.calculated.voteTime + latestUpdate.c;
		if (time < 0 && SERVER_MATCH_DATA.match_general_oneRound && SERVER_MATCH_DATA.calculated.oneRoundEnding !== true) {
			console.log(time);
			console.log(SERVER_MATCH_DATA.calculated.voteTime);
			console.log(latestUpdate.c);
			SERVER_MATCH_DATA.calculated.oneRoundEnding = true;
			showScoreboard(false, true);
			document.getElementById("mapVote").style.display = "none";
			document.getElementById("kill_screen").style.display = "none";
			document.getElementById("trueMatchEnding").style.display = "block";
			document.getElementById("trueMatchEndingLink").href = "/match/" + SERVER_MATCH_DATA.id; //uniq for every single match in existence
			gameEnded = true;
		}
	}
	else if (latestUpdate.c > SERVER_MATCH_DATA.calculated.startTime && latestUpdate.c !== Infinity) {
		var time = latestUpdate.c - SERVER_MATCH_DATA.calculated.startTime;
		if (SERVER_MATCH_DATA.calculated.inWarmup !== true) {
			SERVER_MATCH_DATA.calculated.inWarmup = true;
			document.getElementById("warmupIndicator").style.display = "block";
		}

	}
	else if (latestUpdate.c !== Infinity) {
		var time = latestUpdate.c;
		if (!FLAGS.dynamicSpectate && server_tanks[name] === undefined && SERVER_MATCH_DATA.elimination) {
			startEliminationSpectate();
		}
		if (SERVER_MATCH_DATA.calculated.inWarmup === true) {
			SERVER_MATCH_DATA.calculated.inWarmup = false;
			document.getElementById("clock").classList.remove('clockCountdown');
			document.getElementById("warmupIndicator").style.display = "none";
			if (server_tanks[name] !== undefined) {
				respawn_user(true);
				flashText("Warmup is over, let the games begin!");
				for (var p in server_tanks[name].powerUps) {
					server_tanks[name].powerUps[p] = 0;
				}
				updateWeaponUI();
			}
			SOUNDS.jingle.play("", 0, 0.5);
		}
	}

	var minutes = Math.floor(time / 1000 / 60);
	var seconds = Math.floor(time / 1000) % 60;

	var tempString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;


	if (tempString != clockString) {
		if (!gameEnded && time < 10000 && time > 0) {
			if (!document.getElementById("clock").classList.contains("clockCountdown")) {
				document.getElementById("clock").classList.add("clockCountdown")
			}
			SOUNDS.beep2.play("", 0, 0.5);
		}
		clockString = tempString;
		document.getElementById("clock").innerHTML = clockString;
	}

	if (latestUpdate.c < 0 && !gameEnded) {
		prepareEndGame();
	}
}

function prepareEndGame(){
	// Executes if the clock is below zero. Determines what contents should be displayed based on the player and game state.
	if (state != "game") {
		return;
	}
	gameEnded = true;
	if (latestUpdate.c > -4000) {
		console.log("Starting endgame sequence...");
		SOUNDS.jingle.play("", 0, 0.5);
		showHelp(false, true);
		showScoreboard(false, true);
		displayShadow(false, true);
		minimap.setMaximized(false);
		hide("respawn_screen");
		hide("respawnAds");
		document.getElementById("clock").classList.remove('clockCountdown');

		// Calculate the game's winner
		if (MODE == "ffa") {
			flashText("Time's Up - " + getMatchWinner() + " Wins!")
			document.getElementById("gameWinner").innerHTML = "<tr><td style='width:80vw;'>" + getMatchWinner() + " wins the game!</td></tr>";
		}
		else if (blue_kills > red_kills) {
			flashText(translate("timeUpBlue"));
			document.getElementById("gameWinner").innerHTML = "<tr><td>" + translate("winner") + "</td><td>" + translate("loser") + "</td></tr>";
		}
		else if (blue_kills < red_kills) {
			flashText(translate("timeUpRed"));
			document.getElementById("gameWinner").innerHTML = "<tr><td>" + translate("loser") + "</td><td>" + translate("winner") + "</td></tr>";
		}
		else {
			flashText(translate("timeUpTie"))
			document.getElementById("gameWinner").innerHTML = "<tr><td style='width:80vw;'>" + translate("tie") + "</td></tr>";
		}
		if(FLAGS.joined_game){
			setTimeout(endGameStage1, 4000 + latestUpdate.c); // Come back and do the first stage when the time is right
		}
		else{
			setTimeout(endGameStage2, 4000 + latestUpdate.c); // The user did not play this round. Skip to the second stage.
		}
	}
	else{
		// If the clock is NOT in the 0 to -4 second range, go straight to the second stage.
		// (This action is based on the assumption that the user just joined, and did not participate in the round.)		
		endGameStage2();
	}
}

function endGameStage1() {
	showScoreboard(false, true);
	showHelp(false, true);
	displayShadow(true, true);
	hide("respawn_screen");

	// Runs if and only if the user actually participated in the previous game.
	if(credentials.guest){
		// Persuade the user to sign up if guest
		setStoredData("firstTime", "f");
		show("signup-promo");
	}
	else{
		// Level up the player if signed in
		if (xpInfo.l !== undefined) {
			if (xpInfo.l == credentials.xpInfo.l) {
				decorateXpBar("endGame-xpDiv", xpInfo.l, credentials.xpInfo.cP / credentials.xpInfo.cT, xpInfo.cP / xpInfo.cT);
			}
			else {
				var levelUpList = [];
				for (var l = credentials.xpInfo.l; l <= xpInfo.l; l++) {
					if (l == credentials.xpInfo.l) {
						levelUpList.push([l, credentials.xpInfo.cP / credentials.xpInfo.cT, 1]);
					}
					else if (l == xpInfo.l) {
						levelUpList.push([l, 0, xpInfo.cP / xpInfo.cT]);
					}
					else {
						levelUpList.push([l, 0, 1]);
					}
				}
				levelUp("endGame-xpDiv", levelUpList);
			}
			credentials.xpInfo = xpInfo;
		}
		displayExperienceBreakdown(xpInfo.breakdown);
	}
}

function endGameStage2() {
	// Displays the scoreboard and map vote box
	console.log("Starting end game stage 2");
	hide("teamButtonAuto");
	hide("teamButtonBlue");
	hide("teamButtonRed");
	hide("teamButtonSpectate");
	hide("teamButton");
	hide('swapButton');

	hideExperienceBreakdown();
	hide("signup-promo");
	show("mapVote");
	showScoreboard(true, true);

	addGlobalEventListener('click', '#mapVote .mapVoteButton:not(.disabled, .selected)', (e) => voteMap(e.target));
}

function voteMap(element) {
	const buttons = document.querySelectorAll('.mapVoteButton');
	for (const button of buttons) {
		button.classList.remove('selected');
		button.classList.add('disabled');
	}

	element.classList.add('selected');
	socket?.send('vote', { vote: parseInt(element.id.charAt(13)) });

	setTimeout(() => {
		for (const button of buttons) {
			button.classList.remove('disabled');
		}
	}, 1000);
}

function positionProfileTank() {
	if (window.profileTank === undefined) {
		return;
	}
	var rect = document.getElementById("itemSaveButton").getBoundingClientRect();
	var y = (rect.bottom + rect.top) / 2;
	var x = rect.left - 75;
	// Default scale
	var scale = 1.6
	if (y == 0) {
		rect = document.getElementById("tank_container").getBoundingClientRect();
		y = (rect.bottom + rect.top) / 2;
		x = (rect.left + rect.right) / 2;
		var width = (rect.right - rect.left);
		scale = 1.6 * width / 120;
	}
	if (y == 0) {
		profileTank.body.alpha = profileTank.decal.alpha = profileTank.arm.alpha = profileTank.sticker.alpha = 0;
		return; //no available reference point, hide the tank
	}
	profileTank.body.scale.set(scale);
	profileTank.decal.scale.set(scale);
	profileTank.arm.scale.set(scale * profileTank.arm.proportionalScale);
	profileTank.sticker.scale.set(scale * profileTank.sticker.proportionalScale);
	profileTank.body.alpha = profileTank.decal.alpha = profileTank.arm.alpha = profileTank.sticker.alpha = 1;
	profileTank.body.x = profileTank.decal.x = profileTank.arm.x = profileTank.sticker.x = x;
	profileTank.body.y = profileTank.decal.y = profileTank.arm.y = profileTank.sticker.y = y;
}

function loadAppearanceChanger(yes) {
	if (credentials.guest) {
		return;
	}
	if (yes) {
		loadItemMenu("arm");
		showItems("arm");
		document.getElementById("itemNameLabel").style.display = 'none';
		document.getElementById("itemSaveButton").style.opacity = 1;
		document.getElementById("itemSaveButton").onclick = function() {
			this.style.opacity = 0.5;
			this.onclick = null;
			sendToServer('/itemChange', { appearance: credentials.appearance, username: getStoredData("username"), password: getStoredData("hash") }, function() {
				loadAppearanceChanger(false);
			});
		}

	}
	document.getElementById("titleScreen").style.display = yes ? 'none' : 'block';
	document.getElementById("appearanceChanger").style.display = yes ? 'block' : 'none';
	positionProfileTank()

	/*	if(!credentials.vip){
			document.getElementById("signedInProfile").style.display = "none";
			document.getElementById("appearanceProfile").style.display = "block";
		}*/
}

function showItems(type) {
	if (!itemMenusLoaded[type]) {
		loadItemMenu(type);
	}
	var availableTypes = ["sticker", "arm", "decal", "explosion"];
	for (var i = 0; i < availableTypes.length; i++) {
		document.getElementById("itemsDiv-" + availableTypes[i]).style.display = "none";
		document.getElementById("itemTab-" + availableTypes[i]).classList.remove("selectedTab");
		document.getElementById("itemTab-" + availableTypes[i]).classList.add("unselectedTab");
	}
	document.getElementById("itemsDiv-" + type).style.display = "block";
	document.getElementById("itemTab-" + type).classList.remove("unselectedTab");
	document.getElementById("itemTab-" + type).classList.add("selectedTab");
}

function loadNewPlayerContent(){
	// Loads any relevant content to new players.
	let referrer = getStoredData("referral");
	if (referrer){
		let data = JSON.parse(referrer);
		showSignUp(data.displayName + " has referred you to BlockTanks! Sign up now and receive 1000 XP!");
		// Transfer the referral from stored data to session data.
		// Now, if the user refreshes, the referral goes away.
		removeStoredData("referral");
		FLAGS.referral = referrer;
	}
}

function showSignUp(message){
	hide('login-prompt');
	hide('titleScreen');
	show('signup-prompt');
	show('credentials');
	show('shadow');
	if(message){
		show("good-signup-message")
		document.getElementById("good-signup-message").innerText = message;
	}	
}

function setupAccountInfo() {
	document.getElementById("logInButton").style.display = document.getElementById("signUpButton").style.display = "none";
	document.getElementById("logoutButton").style.display = "block";
}

function loadAccountFromLogin() {
	document.getElementById("shadow").style.display = "none";
	document.getElementById("credentials").style.display = "none";
	document.getElementById("titleScreen").style.display = "block";
	start_title();
	loadAccountInfo();
}

function loadAccountInfo() {
	
	// Using async/await
	async function delay() {
    		try {
				console.log("TEST :: Start");
				await new Promise(resolve => setTimeout(resolve, 5000)); // 5000 milliseconds (5 seconds)
				console.log("TEST :: End after delay");
					console.log("Made by Unknownuser with a help of chatGPT since i can't code advanced lines like in some Javascript, HTML and CSS.\nBut I did create the arrow and border by myself in CP, I'm kinda new to digital art/Photoshop you might see some curves or other stuff, but try to ignore it okay?");
					if(credentials.username == 'unknownuser') {
						console.log('%cVERSION ' + ver +' || Welcome [Blocktanks Mod Creater] UnknownUser to the' + modName + 'The Mod is happy you\'re back!', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
					} else if(credentials.username == 'kevdude') {
						console.log('%cVERSION ' + ver +' || Welcome [Owner] KevDude to the' + modName + 'Lets hope you approve of this Mod! :)', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
					} else if(credentials.username == 'cooldogyum' || credentials.userName == 'carson_23') {
						if(credentials.vip) {
							console.log('%cVERSION ' + ver + ' || Welcome [VIP] [Developer]' + credentials.displayName + ' to ' + modName + 'You\'re a very great coder on blocktanks! :)', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
						} else {
							console.log('%cVERSION ' + ver +' || Welcome [Developer] ' + credentials.displayName + ' to' + modName + 'You\'re a very great coder on blocktanks! :)', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
						}
					} else if (credentials.username == 'jasn' || credentials.username == 'soymilk' || credentials.username == 'wellwright') {
						if(credentials.vip) {
							console.log('%cVERSION ' + ver + ' || Welcome [VIP] [community Manager]' + credentials.displayName + ' to ' + modName + 'You\'re a very great helper on discord and blocktanks! :)', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
						} else {
							console.log('%cVERSION ' + ver +' || Welcome [Community Manager] ' + credentials.displayName + ' to' + modName + 'You\'re a very great helper on discord and blocktanks! :)', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
						}
					} else if(credentials.username == 'raccon-' || credentials.userName == 'duck' || credentials.userName == 'zera' || credentials.userName == '') {
						console.log('%cVERSION ' + ver + ' || Welcome [In-game Mods] Raccon- to the' + modName + 'I hope you like it!', 'font-size: 20px; color: #9d00ff; font-weight: bold;');
					} else if(credentials.vip) {
						console.log('%cVERSION ' + ver + ' || Welcome [VIP] [In-game Mods] ' + credentials.displayName + ' to ' + modName0, 'font-size: 20px; color: #9d00ff; font-weight: bold;');
					} else {
						if(credentials.nameStatus?.shadowBan) {
							console.log('%cShawdow banned User detected, This mod may not work Based on you\'re account Status.', 'font-size: 18px; color: #f00; font-weight: bold;');
						} else {
							console.log('%cVERSION ' + ver + ' || Welcome ' + credentials.displayName + ' to ' + modName0, 'font-size: 20px; color: #9d00ff; font-weight: bold;');
						}
				}
				console.warn('%c:: If you see another mod like this one and not provided by me, DO NOT DOWNLOAD/INSERT, It might do something Bad.', 'font-size: 18px; color: #fd3535; font-weight: bold;');
				if(credentials.nameStatus?.shadowBan) {
					console.log('%cUser is Shadow Banned', 'font-size: 16px; color: #f00; font-weight: bold;')
				} else {
					console.log('%cUser is not Shadow Banned', 'font-size: 16px; color: #3f0; font-weight: bold;')
				}
				console.log('%cif the game is broken, refresh, If that doesnt work show me the errors/warns, Then I\'ll try and see if i can fix it.', 'font-size: 15px; color: darkgrey; font-weight: bold;');
				console.log('%cTotal Kills: ' + credentials.leaderboardComp.kills, 'font-size: 14px; color: #f00; font-weight: bold;');
				console.log('%cTotal Deaths: ' + credentials.leaderboardComp.deaths, 'font-size: 14px; color: #ff479c; font-weight: bold;');
				console.log('%cTotal bullets shot: ' + credentials.leaderboardComp.bullets, 'font-size: 14px; color: grey; font-weight: bold;');
				console.log('%cJoined: ' + readableTimeStamp(credentials.joinDate), 'font-size: 14px; color: darkgreen; font-weight: bold;');
				console.log('%cTotal XP: ' + credentials.xpInfo.xp + ', If Floored: ' + Math.floor(credentials.xpInfo.xp), 'font-size: 14px; color: green; font-weight: bold;');
				console.log('%cTotal KD: ' + credentials.leaderboardComp.kd + ', If rounded: ' + Math.round(credentials.leaderboardComp.kd * 100) / 100, 'font-size: 14px; color: white; font-weight: bold;');
				console.log("Executing async function...");
		   		} catch (error) {
			 		console.error("Error:", error);
		   		}
	}
	delay();
		



	showGameList(false);
	NUM_GAMES_PLAYED = 0;
	if (!credentials.guest) {
		checkUnlock(function(list) { unlockItems(list); });
		if (credentials.vip) {
			setDarkMode(credentials.darkMode);
		}
	}
	document.getElementById("homepageAdContainer").style.display = "none";
	document.getElementById("accountInfoContainer").style.display = "block";
	let accountButtons = "community settings logout friends".split(" ");
	for(let i of accountButtons){
		document.getElementById(`${i}Button`).style.display = "inline-block";
	}
	document.getElementById("logInButton").style.display = document.getElementById("signUpButton").style.display = "none";

	if (credentials.friends?.incoming?.length) {
		const communityButtonBadge = document.querySelector('#communityButton .badge');
		communityButtonBadge.innerText = credentials.friends.incoming.length;
		communityButtonBadge.style.display = 'inline-block';
	}

	let currentAnnouncementIndex = parseInt(document.querySelector('#announcement').dataset.index);
	if (credentials.announcementSeen < currentAnnouncementIndex) {
		credentials.announcementSeen = currentAnnouncementIndex;
		loadPrompt("announcement");
	}

	if (!credentials.messageSeen && credentials.message !== undefined) {
		credentials.messageSeen = true;
		document.getElementById("messagePromptText").innerHTML = credentials.message;
		loadPrompt("messagePrompt");
	}

	document.getElementById("profile-username").innerText = credentials.displayName;
	if (credentials.vip) {
		document.getElementById("profile-username").style.background = "linear-gradient(45deg, #b68814, #fac422)"; // #ffc94c :: Background|Color|
	}
	let xpString = Math.floor(credentials.xpInfo.cP) + "/" + credentials.xpInfo.cT + " XP Earned";
	let accountXPInfo = document.getElementById("accountInfo-xpDiv").querySelector(".xpCount");
	accountXPInfo.style.opacity = "0.0";
	loadStats();
	decorateXpBar("accountInfo-xpDiv", credentials.xpInfo.l, 0, (credentials.xpInfo.cP / credentials.xpInfo.cT), function() {
		accountXPInfo.innerText = xpString;
		accountXPInfo.style.opacity = "1.0";
		calculateRank(function(rank, percentile, total){
			var rankString = "World Rank: " + Math.round(rank) + " / " + total + " Players";
			document.getElementById("xpCaption").innerText = rankString;
		});
	});
	var missionsLoaded = loadMissions();
	var eventsLoaded = loadEvents();
	if (!(missionsLoaded || eventsLoaded)) {
		loadAccountTab("xp"); // Load the XP tab if no special tabs were loaded.
	}
	document.getElementById("accountInfo").style.display = "table-row";

	CommunityCalendar.initialize();
	updateLabsVisibility('replays');
}

function loadAccountTab(id) {
	var c = ["events", "missions", "xp", "stats", "replays"];
	for (var i = 0; i < c.length; i++) {
		document.getElementById("accountInfo-" + c[i]).style.display = "none";
		document.getElementById("accountTabs-" + c[i]).classList.remove("selectedTab");
		document.getElementById("accountTabs-" + c[i]).classList.add("unselectedTab");
	}
	document.getElementById("accountInfo-" + id).style.display = "block";
	document.getElementById("accountTabs-" + id).classList.add("selectedTab");
	document.getElementById("accountTabs-" + id).classList.remove("unselectedTab");
}

function loadMissions(selectTab = true) {
	var none = true;
	document.getElementById("accountInfo-missions").innerHTML = "";
	var titles = {};
	var ENDTIME = Infinity;
	var endtimePrint = false;
	var tabColor = null;
	for (const key in missions) {
		const mission = missions[key];
		let correctLocation = (CHOSEN_REGION === mission.location || mission.location == "*");
		let missionPublic = mission.isPublic === true || devMode;
		if (missionActive(mission) && correctLocation && missionPublic) {
			if (credentials.missions === undefined) {
				credentials.missions = {};
			}
			if (credentials.missions[key] === undefined) {
				credentials.missions[key] = 0;
			}
			none = false;
			if (tabColor === null) {
				tabColor = mission.color;
			}
			if (titles[mission.name] === undefined) {
				if (endtimePrint) {
					document.getElementById("accountInfo-missions").innerHTML += "<em style='margin-top:-1vmin;font-size:1.5vmin;'>" + timeUntil(ENDTIME) + "</em>";
				}
				titles[mission.name] = true;
				endtimePrint = true;
				var titleHTML = "<p style='margin-bottom:.3vmin;margin-top:.5vmin;'>";
				titleHTML += mission.name;
				titleHTML += "</p>";
				document.getElementById("accountInfo-missions").innerHTML += titleHTML;
			}
			let description = mission.description;
			description += " (Prize: ";
			for (let t = 0; t < mission.prize.length; t++) {
				let prize = mission.prize[t];
				if (t > 0) { description += ", " }
				if (prize.rewardType == "xp") {
					description += prize.amt + " XP";
				}
				else {
					description += titleCase(prize.rewardType) + " Item";
				}
			}
			description += ")";
			document.getElementById("accountInfo-missions").innerHTML += "<span style='display:inline-block;max-width:25vmin;margin-top:-0.5vmin;font-size:1.5vmin;'>" + description + "</span>";

			if (mission.requirements.number > 1) {
				var missionText = Math.floor(credentials.missions[key]) + "/" + mission.requirements.number + " " + mission.suffix;
			}
			else {
				var missionText = credentials.missions[key] > 0 ? "Mission Completed!" : "Not Completed";
			}
			spawnProgressBar(
				"missions" + key, "accountInfo-missions",
				credentials.missions[key] / mission.requirements.number,
				mission.color,
				missionText,
				(key % 2 == 1)
			);
			ENDTIME = mission.endTime;

			if (mission.contest?.enabled) {
				// Add leaderboard button.
				document.getElementById("accountInfo-missions").innerHTML += `<button style="background-color: ${mission.color};" onclick="loadStatsLeaderboard(true, '${mission.id}');">Leaderboard</button><br>`;

				try {
					// Add tab to stats leaderboard.
					const tabSelector = document.querySelector('#stats-leaderboard .tab-selector');
					
					// If the tab already exist return.
					const tabAlreadyExist = tabSelector.querySelector(`[data-stat="${mission.id}"`);
					if (tabAlreadyExist) return;
					
					const template = document.querySelector('#stats-leaderboard-tab-template');
					const node = template.content.cloneNode(true);
					const tab = node.querySelector('.tab');

					tab.dataset.stat = mission.id;
					tab.innerText = mission.name;
					tab.style.setProperty('--selected-bg', mission.color);

					tabSelector.append(tab);
				} catch (error) {
					console.error('ERROR ADDING MISSION LEADERBOARD TAB:\n' + error);
				}
			}
		}
	}
	if (none) {
		return false;
	}
	else {
		document.getElementById("accountInfo-missions").innerHTML += "<em style='margin-top:-1vmin;font-size:1.5vmin;'>" + timeUntil(ENDTIME) + "</em>";
		document.getElementById("accountTabs-missions").style.backgroundColor = tabColor;
		if (selectTab) loadAccountTab("missions");
		document.getElementById("accountTabs-missions").style.display = "table-cell";
		return true;
	}
}

var eventUpdateInterval;

function onRegionChange(newRegion) {
	CHOSEN_REGION = newRegion;
	fillGameList(GAMES);
	if (!credentials.guest) {
		loadEvents();
	}
}

function loadEvents(selectTab = true) {
	var none = true;
	var titles = {};
	var now = Date.now();

	const eventsDiv = document.querySelector('#accountInfo-event-list');
	eventsDiv.innerHTML = '';
	for (var i in events) {
		const correctLocation = devMode || (CHOSEN_REGION === events[i].location || events[i].location == "*");
		const eventActive = events[i].startTime - now < 86400000 * (events[i].preNotice ?? 3) && now < events[i].endTime || (events[i].instantiated !== undefined);
		const eventPublic = events[i].isPublic === true || devMode;
		const eventOfficial = (events[i].official !== false);
		let inEvent = false;
		for(let uA of events[i].usersAttending){
			if(uA.username == credentials.username){
				inEvent = true;
				break;
			}
		}
		if (correctLocation && eventActive && eventPublic && (eventOfficial || inEvent)) {
			eventsDiv.innerHTML += "<p>" + events[i].name + "</p>";
			eventsDiv.innerHTML += "<em style='font-size:14px;margin:5px;'>" + events[i].description + "</em>";
			none = false;
			eventsDiv.innerHTML += "<br><button id='event_button_" + i + "' style='background:#b136d6;opacity:.5;cursor:not-allowed;'>" + (events[i].button || "Join") + "</button>";
			eventsDiv.innerHTML += "<br><p id='event_countdown_" + i + "' style='font-family:Consolas;font-size:16px;'></p>";
			events[i].loaded = true;
			events[i].joinEarly = inEvent; // Allow participants to join early.
		}
		else {
			events[i].loaded = false;
		}
	}
	const communityCalendarButton = document.querySelector('#event-calendar-open-button');
	if (credentials.nameStatus?.shadowBan) {
		// Hide the community calendar if the user is shadow banned.
		communityCalendarButton.style.display = 'none';
	}
	else{
		communityCalendarButton.style.display = 'inline-block';
	}
	if (none) {
		document.getElementById("accountTabs-events").style.display = "none";
		if (eventUpdateInterval != undefined) {
			clearInterval(eventUpdateInterval);
		}
		return false;
	}
	else {
		if (selectTab) loadAccountTab("events");
		updateEventTab();
		eventUpdateInterval = setInterval(updateEventTab, 1000);
		document.getElementById("accountTabs-events").style.display = "table-cell";
		return true;
	}
}

function updateEventTab() {
	var now = Date.now();
	for (var i in events) {
		if (!events[i].loaded) {
			continue;
		}
		var timeDiff = events[i].startTime - now;
		let eventUnlocked = (timeDiff < 0) || events[i].joinEarly || (credentials.roles && credentials.roles.communityManager && FLAGS.devTools);
		if (eventUnlocked) {
			if (document.getElementById("event_countdown_" + i).getAttribute("live") != "true") {
				document.getElementById("event_countdown_" + i).setAttribute("live", "true");
				document.getElementById("event_countdown_" + i).innerHTML = "<img class='blinking' src='assets/ui/live.png'>";
				let endingCounter = document.createElement("span");
				endingCounter.id = "event_end_countdown_" + i;
				document.getElementById("event_countdown_" + i).appendChild(endingCounter);
				document.getElementById("event_button_" + i).style.opacity = "1";
				document.getElementById("event_button_" + i).style.cursor = "pointer";
				if(events[i].link.split("::")[0] == "JAVASCRIPT"){
					// Run custom code on button press
					let customCode = events[i].link.split("::")[1]
					customCode = new Function(customCode);
					document.getElementById("event_button_" + i).onclick = customCode;
				}
				else{
					document.getElementById("event_button_" + i).onclick = function(e) {
						let str = e.target.id;
						let list = str.split("_");
						let id = list[list.length - 1];
						if(events[id].eventType == "mode" && !events[id].isScheduled) {
							// The "link" attribute is the id of the mode to find.
							requestServer(null, events[id].id);
						} else{
							// Just assume the id of the mission is a BlockTanks redirect, and send the user there.
							window.location.href = "/" + events[id].id;
						}
					};
				}
			}
			let endingCounter = document.getElementById("event_end_countdown_" + i);
			endingCounter.innerHTML = "<br>Ends in " + generateCountdownString(events[i].endTime - now);

		}
		else {
			document.getElementById("event_countdown_" + i).innerText = "Starts in " + generateCountdownString(timeDiff);
		}
	}
}

function loadCallout() {
	console.log("Loading callout...")
	getFromServer("/callout", function(r) {
		const overrideElement = document.getElementById("callout-override");
		const streamerElement = document.getElementById("callout-streamer");
		const youtuberElement = document.getElementById("callout-youtuber");
		let overrideDisplay = false;
		let streamerDisplay = false;
		let youtuberDisplay = false;

		console.debug(r);
		switch (r.type) {
			case "override":
				console.debug("OVERRIDE");
				overrideElement.innerHTML = r.data;

				overrideDisplay = true;
				break;
			case "streamer":
				console.debug("STREAM");
				console.log(r.data[0]);
				const streamerImage = document.getElementById("callout-streamerImage");
				const streamerName = document.getElementById("callout-streamerName");
				const streamerViewers = document.getElementById("callout-streamerViewers");

				let imageUrl = r.data[0].thumbnail_url;
				imageUrl = imageUrl.replace("{width}", "1080");
				imageUrl = imageUrl.replace("{height}", "720");

				streamerImage.src = imageUrl;
				streamerName.innerText = r.data[0].user_name;
				streamerViewers.innerText = numberWithCommas(r.data[0].viewer_count); // If this function ever actually does something
				// (ie: Someone ACTUALLY streams BlockTanks with > 1,000 viewers)
				// That would be amazing
				streamerElement.href = `https://twitch.tv/${r.data[0].user_name}`;

				streamerDisplay = true;
				break;
			case "youtuber":
				// TODO: Make youtuber callout more in-line with streamer callout, allowing for video support.
				console.debug("YOUTUBER");
				const youtuberText = document.getElementById("callout-youtuberName");
				youtuberText.innerText = r.data.name;
				youtuberElement.href = r.data.url;

				youtuberDisplay = true;
				break;
			default:
				console.debug("NO CALLOUT");
				break;
		}

		overrideElement.style.display = overrideDisplay ? "block" : "none";
		streamerElement.style.display = streamerDisplay ? "block" : "none";
		youtuberElement.style.display = youtuberDisplay ? "block" : "none";
	});
}

function loadMailingList(yes = true){
	if(!yes){
		hide("mailingList");
		hide("promptShadow");
	}
	else{
		if(credentials.email){
			document.getElementById("mailingListEmail").value = credentials.email;
		}
		show("promptShadow");
		show("mailingList");
		show("mailingListStart");
		hide("mailingListDone");
	}
}

function loadMatchPrompt(yes) {
	document.getElementById("matchPrompt").style.display = document.getElementById("shadow").style.display = yes ? "block" : "none";
	document.getElementById("titleScreen").style.display = yes ? "none" : "block";
	positionProfileTank();
	var selectedMode = getRadioValue("matchMode");
	filterMaps(selectedMode);
	if (matchFields.loaded) {
		return;
	}
	if (credentials.roles && credentials.roles.esports) {
		defaultMaps.official.push({
			id: "zm5z6sf22kbicxroc",
			supportedModes: ["ffa"],
			name: "Mega Map (Esports Exclusive)"
		});
	}
	loadMaps("official");
	matchFields.loaded = true;
	loadAdvancedWeaponSettings();
	document.getElementById("matchAdvancedSettings").innerHTML = loadInputFields(matchFields.advancedSettings);
	document.getElementById("matchMainSettings").innerHTML = loadInputFields(matchFields.mainSettings);
	if (credentials.roles?.communityManager) {
		document.getElementById("matchDeveloperSettingsContainer").style.display = "block";
		document.getElementById("matchDeveloperSettings").innerHTML = loadInputFields(matchFields.superDeveloperSettings);
	}

	// Community Event Section
	if (FLAGS.CAN_CREATE_COMMUNITY_EVENTS) {
		document.querySelector('#match-community-event-settings-container').style.display = 'block';
	}

	loadModeSettings(getRadioValue("matchMode"));
	document.getElementById("matcheventSettings").innerHTML = loadInputFields(matchFields.eventSettings);
}

function loadModeSettings(mode){
	if(matchFields[mode + "Settings"]){
		document.getElementById("matchModeSettingsLabel").innerText = readableMode(mode) + " Settings";
		show("matchModeSettingsLabel");
		document.getElementById("matchModeSettings").innerHTML = loadInputFields(matchFields[mode + "Settings"]);
	}
	else{
		hide("matchModeSettingsLabel");
		document.getElementById("matchModeSettings").innerHTML = "";
	}
}

function initiateMapSearch(elm) {
	//This code makes sure the user actually changed their search (prevents things like CTRL-A)
	//elm refers to the DOM object of the search bar
	var value = elm.value;
	var prevValue = elm.getAttribute("previousValue");
	elm.setAttribute("previousValue", value);
	if (value == prevValue) {
		return;
	}


	//This code will wait until the user stops typing before making a search.
	if (FLAGS.mapSearchTimer === undefined) {
		document.getElementById("mapGrid").innerHTML = '<img class="loadingTank" src="assets/Tank Icon.png" style="text-align:center;width:100px;">';
	}
	var d1 = FLAGS.mapSearchTimer = Date.now();
	setTimeout(function(d1) {
		if (d1 == FLAGS.mapSearchTimer) {
			loadMaps();
			delete FLAGS.mapSearchTimer;
		}
	}, 700, d1);
}

function getCurrentMapType(){
	// Returns the currently selected map tab.
	let elm = document.getElementById("mapSourceTabs").querySelector(".selectedTab");
	return elm.id.split("-")[1];
}

function changeMapPage(inc) {
	if (FLAGS.mapPage === undefined) {
		FLAGS.mapPage = 1;
	}
	FLAGS.mapPage += inc;
	var changed = updateMapPage();
	if (changed) {
		loadMaps(getCurrentMapType(), FLAGS.mapPage);
	}
}

function updateMapPage() {
	if (FLAGS.mapPage === undefined) {
		FLAGS.mapPage = 1;
		return false;
	}
	if (FLAGS.mapPage < 1) {
		FLAGS.mapPage = 1;
		return false;
	}
	document.getElementById("mapControls_pageText").setAttribute("page", FLAGS.mapPage);
	document.getElementById("mapControls_pageText").innerText = ((FLAGS.mapPage - 1) * 25 + 1) + "-" + ((FLAGS.mapPage) * 25);
	return true;
}

function loadMaps(type, page) {
	if(!type){
		type = getCurrentMapType();
		console.log("type not specified, going with selected tab of " + type);
	}
	show("mapControls");
	document.getElementById("mapGrid").innerHTML = '<img class="loadingTank" src="assets/Tank Icon.png" style="text-align:center;width:100px;">';
	var c = document.getElementById("mapSourceTabs").children;
	for (var i = 0; i < c.length; i++) {
		c[i].classList.remove("selectedTab");
		c[i].classList.add("unselectedTab");
	}
	var tab = document.getElementById("mapSourceTabs-" + type);
	tab.classList.add("selectedTab");
	tab.classList.remove("unselectedTab");
	if (defaultMaps[type] !== undefined) {
		// The type is a predetermined set of maps (ex: official maps)
		hide("mapControls");
		loadMapsCallback(defaultMaps[type], type);
		filterMaps(getRadioValue("matchMode"));
	}
	else if (credentials.guest) {
		// The user is a guest but wants to load custom maps. Display an ad to sign up
		var mapGrid = document.getElementById("mapGrid");
		mapGrid.innerHTML = "<br><p style='margin:0px;'>Create an account to make custom maps and use community maps!</p>";
		var button = "<a href='/signup'><button>Sign Up</button></a>";
		mapGrid.innerHTML += button;
	}
	else{
		// Loading community maps
		var minTime = Date.now();
		var minTimeSubtract = {
			"day": 1000 * 60 * 60 * 24,
			"week": 1000 * 60 * 60 * 24 * 7,
			"month": 1000 * 60 * 60 * 24 * 30,
			"any": minTime
		};
		var key = document.getElementById("mapControls_time").value;
		minTime = minTime - minTimeSubtract[key];

		var selectedMode = getRadioValue("matchMode");
		if (selectedMode == "br") {
			selectedMode = "ffa";
		}
		let query = {"supportedModes": selectedMode};
		switch(type){
			case "personal":
				query.username = credentials.username;
				break;
			case "favorites":
				query.id = { $in: credentials.mapFavorites };
				break;
			case "community":
				query["community.approved"];
				query["community.approvedTime"] = { $gt: minTime };
		}
		
		var search = document.getElementById("mapControls_search").value;
		if (search.trim() != "") {
			query["$text"] = {
				"$search": search,
				"$language": "en",
				"$caseSensitive": false,
				"$diacriticSensitive": false
			};
		}
		

		if (page == undefined) {
			page = FLAGS.mapPage = 1;
			updateMapPage(); //If the page has not been specified, assume we need to reset to page 1.
		}

		sendToServer("/mapSearch", { page: page, sortBy: document.getElementById("mapControls_sort").value, query: JSON.stringify(query) }, function(response) {
			if (response == "ERROR") {
				alert("There was an error loading the maps");
			}
			else {
				loadMapsCallback(JSON.parse(response), type);
			}
		});
	}
}

function loadMapsCallback(list, type) {
	let mapGrid = document.getElementById("mapGrid");
	mapGrid.innerHTML = "";

	let showFavorites = true;
	let showFavoriteNumbers = false;
	let showUsernames = false;

	if(FLAGS.mapPage != 1 && list.length == 0){
		mapGrid.innerHTML = "We couldn't find any maps matching your search.<br><br>";
		return;
	}

	if (type == "personal") {
		showFavoriteNumbers = true;
		mapGrid.innerHTML += "<a href='/maps/manage'><button style='font-size:16px;margin-bottom:-8px;'>Create/Manage Maps</button></a><br><br>";
	}
	if (type == "favorites") {
		showFavoriteNumbers = true;
		showUsernames = true;
		if (list.length == 0) {
			mapGrid.innerHTML = "<br><br>You don't have any favorited maps yet. Why not add some from the \"Community\" tab?<br><br>";
			return;
		}
	}
	if (type == "community") {
		mapGrid.innerHTML += "<a href='/maps/manage'><button style='font-size:16px;margin-bottom:-8px;'>Add your own maps</button></a><br><br>";
		showFavoriteNumbers = true;
		showUsernames = true;
		if (list.length == 0) {
			mapGrid.innerHTML = "We couldn't find any maps matching your search.<br><br>";
			return;
		}
	}

	let selectedMode = getRadioValue("matchMode");
	if (selectedMode == "br") {
		selectedMode = "ffa";
	}

	for (var i = 0; i < list.length; i++) {
		const map = list[i];
		let prefix = "";
		if(devMode){
			prefix = "https://blocktanks.io";
		}
		
		thumbnailUrl = getCorrectMapThumbnail(map.id, 'base', map.version);

		let html = `<div data-modes='${map.supportedModes}' version='${map.version || ''}' id='matchMap_${map.id}' class='mapGridItem' style='position:relative;display:inline-block;'><img onclick='selectMap(this.parentNode);' src='${thumbnailUrl}'>`;
		if (showFavorites && credentials.guest !== true) {
			const numFavorites = map.favorites ? map.favorites : 0;
			const isFavorited = credentials.mapFavorites ? credentials.mapFavorites.indexOf(map.id) != -1 : false;
			if (isFavorited) {
				html += "<p id=\"" + map.id + "_favorite_div\" onclick='toggleFavoriteMap(\"" + map.id + "\");' class='favoriteCounter favoritedMap'>";
			}
			else {
				html += "<p id=\"" + map.id + "_favorite_div\" onclick='toggleFavoriteMap(\"" + map.id + "\");' class='favoriteCounter'>";
			}
			if(showFavoriteNumbers){
				html += "<span id=\"" + map.id + "_favorite_counter\">" + numFavorites + "</span>";
			}
			html += `<span id="${map.id}_favorite_symbol">${isFavorited ? "&#9733;" : "&#9734;"}<span></p>`;
		}
		if (showUsernames) {
			const username = map.usernameFormatted ? map.usernameFormatted : map.username; //backwards compatibility
			html += "<p onclick='selectMap(this.parentNode);' class='mapName'>" + escapeHTML(map.name) + "<br><span style='font-size:16px;text-decoration:none;'>Created by: " + username + "</span></p>";
		}
		else {
			html += "<p onclick='selectMap(this.parentNode);' class='mapName'>" + escapeHTML(map.name) + "</p>";
		}
		if (FLAGS.devTools) {
			html += `<p style="line-height:10px;"><span style="font-size:16px;">(${map.plays?.toLocaleString() ?? 0} Views)</span></p>`;
			html += "<input onclick='select(this);' readonly value='" + map.id + "'>"
		}
		html += "</div>";
		mapGrid.innerHTML += html;
	}
}

function toggleFavoriteMap(id) {
	sendToServer("/mapFavorite", { id: id }, function(response) {
		var data;
		try {
			data = JSON.parse(response);
		}
		catch (e) {
			alert(response);
			return;
		}
		let counter = document.getElementById(id + "_favorite_counter");
		if(counter){
			counter.innerText = parseInt(counter.innerText) + data.incValue;
		}
		if (data.incValue == 1) {
			document.getElementById(id + "_favorite_div").classList.add("favoritedMap");
			document.getElementById(id + "_favorite_symbol").innerHTML = "&#9733";
			credentials.mapFavorites.push(id);
		}
		else {
			document.getElementById(id + "_favorite_div").classList.remove("favoritedMap");
			document.getElementById(id + "_favorite_symbol").innerHTML = "&#9734";
			var index = credentials.mapFavorites.indexOf(id);
			if (index != -1) {
				credentials.mapFavorites.splice(index, 1);
			}
		}
	})
}

function updateSelectedMapCount() {
	var m = document.getElementById("mapGrid");
	var sel = 0;
	for (var i = 0; i < m.children.length; i++) {
		if (m.children[i].classList.contains("selectedMap")) {
			sel += 1;
		}
	}
	document.getElementById("matchMapsSelected").innerText = sel;
}

function filterMaps(mode) {
	if (defaultMaps[getCurrentMapType()] == undefined) {
		loadMaps(); // if we are on a non-static map category, reload the maps to match the current mode.
		return;
	}
	if (mode == "br") {
		mode = "ffa"; // Battle Royale Maps operate on FFA maps
	}
	var m = document.getElementById("mapGrid");
	var sel = 0;
	for (var i = 0; i < m.children.length; i++) {
		if (m.children[i].getAttribute("data-modes") == undefined) {
			continue;
		}
		var str = m.children[i].getAttribute("data-modes") + ",";
		if (str.indexOf(mode + ",") !== -1) {
			m.children[i].style.display = "inline-block";

			const id = m.children[i].getAttribute("id").substring(9);
			const version = m.children[i].getAttribute("version");

			m.children[i].querySelector('img').src = getCorrectMapThumbnail(id, mode, version);
		}
		else {
			m.children[i].style.display = "none";
			m.children[i].classList.remove("selectedMap");
		}
	}
	updateSelectedMapCount();
}

function selectMap(elm) {
	if (elm.classList.contains("selectedMap")) {
		elm.classList.remove("selectedMap");
	}
	else if (parseInt(document.getElementById("matchMapsSelected").innerText) < 6) {
		elm.classList.add("selectedMap");
	}
	updateSelectedMapCount();
}

function loadAdvancedWeaponSettings() {
	var html = '';
	for (var i = 0; i < matchFields.advancedWeaponSettings.length; i++) {
		var w = matchFields.advancedWeaponSettings[i];
		html += "<tr><td colspan=3><h3 style='margin-bottom:-3px;'>" + w.name + "</h3></td></tr>";
		html += loadInputFields(w);
	}
	document.getElementById("advancedWeaponSettings").innerHTML = html;
}

function loadInputFields(w) {
	var html = '';
	if (w.sliders) {
		for (var t = 0; t < w.sliders.length; t++) {
			var s = w.sliders[t];
			html += '<tr><td align="right" style="width:35%;"><p style="margin:5px;">' + s[5] + ':</p></td><td style="width:33%;"><input oninput="updateSlider(this.id,this.value,' + s[7] + ');" type="range" min="' + s[1] + '" max="' + s[2] + '" step="' + s[4] + '" value="' + s[3] + '" class="slider" id="match_' + w.code + "_" + s[0] + '"></td><td align="left"><p style="margin:0px;"><span id="match_' + w.code + "_" + s[0] + '_text">' + s[3].toFixed(s[7]) + '</span>' + s[6] + '</p></td></tr>';
		}
	}
	if (w.dropdowns) {
		for (var t = 0; t < w.dropdowns.length; t++) {
			var d = w.dropdowns[t];
			html += '<tr><td colspan=3><p style="margin-bottom:-3px;">' + d.name + ': <select id="match_' + w.code + "_" + d.code + '">';
			var v = d.values;
			for (var i = 0; i < v.length; i++) {
				html += '<option value="' + v[i][0] + '" ' + (v[i][2] ? 'selected' : '') + '>' + v[i][1] + "</option>";
			}
			html += '</select></p></td></tr>';
		}
	}
	if (w.checkboxes) {
		for (const checkbox of w.checkboxes) {
			html += `<tr><td colspan=3><p style="margin-bottom:5px;"><label style="cursor:pointer;" for="match_${w.code}_${checkbox[0]}">${checkbox[1]}: </label><input style="cursor:pointer;" id="match_${w.code}_${checkbox[0]}" type="checkbox" ${checkbox[2] ? `onchange="updateRequisites(this.checked, '${checkbox[2]}');"` : ''}></p></td></tr>`;
		}
	}
	if (w.inputs) {
		for (var t = 0; t < w.inputs.length; t++) {
			var c = w.inputs[t];
			var type;
			switch (c[3]) {
				case "datetime-local":
					type = "type=\"datetime-local\"";
					break;
				default:
					type = "";
			}
			html += '<tr><td colspan=3><p style="margin-bottom:5px;"><label style="cursor:pointer;" for="match_' + w.code + "_" + c[0] + '">' + c[1] + ': </label><input style="cursor:pointer;" id="match_' + w.code + "_" + c[0] + '" ' + type + '></p></td></tr>';
		}
	}
	return html;
}

function updateRequisites(checked, requisites) {
	requisites = requisites.replace(/\./g, '_').split(',');
	for (const requisite of requisites) {
		const element = document.querySelector(`#match_${requisite}`);
		if (!element) continue;

		if (checked) {
			element.dataset.currentValue = element.checked;
			element.checked = true;
			element.disabled = true;
		} else {
			element.disabled = false;
			element.checked = (element.dataset.currentValue === 'true');
		}
	}
}

function toggleAdvancedSettings() {
	var c = document.getElementById("matchAdvancedSettings");
	var cB = document.getElementById("advancedSettingsButton");
	if (c.style.display == "none" || c.style.display == "") {
		c.style.display = "table";
		cB.innerText = "Hide Advanced Settings";
	}
	else {
		c.style.display = "none";
		cB.innerText = "Show Advanced Settings";
	}
}

function toggleAdvancedWeaponSettings() {
	var c = document.getElementById("advancedWeaponSettings");
	var cB = document.getElementById("advancedWeaponSettingsButton");
	if (c.style.display == "none" || c.style.display == "") {
		c.style.display = "table";
		cB.innerText = "Hide Weapon Customization";
	}
	else {
		c.style.display = "none";
		cB.innerText = "Weapon Customization";
	}
}

function backToTitle(errored) {
	// Recording stuff
	if (recorder?.isRecording()) {
		// Only save replay if recording was in progress
		recorder.stopRecording();
		let recording = recorder.saveRecording();
		manager.uploadReplay(recording);
	} else if (player?.isPlaying()) {
		// Stop the replay
		player.stopReplay();
	}

	// Hide CrazyGames match invite button if on CrazyGames
	if (globalThis.CrazyGames) {
		try {
			const { SDK: CrazySDK } = globalThis.CrazyGames;
			CrazySDK.game.hideInviteButton();
		} catch { }
	}

	state = "loading";
	setDarkMode(credentials.vip && credentials.darkMode);
	minimap.setVisible(false);
	document.getElementById("gameOverlay").style.display = "none";
	for (var i = 0, row; row = document.getElementById("gamesListTable").rows[i]; i++) {
		row.classList.remove("selectedGame");
	}
	document.getElementById("startMatchButton").classList.add("invalidButton");
	game.sound.stopAll();
	game.camera.scale.set(1);
	game.world.setBounds(0, 0, getGameWidth(), getGameHeight());
	init();
	if (window.ws && window.ws.close) {
		ws.close();
	}
	socket = undefined;
	document.getElementById("redkills").innerHTML = red_kills = 0;
	document.getElementById("bluekills").innerHTML = blue_kills = 0;
	profileTank = undefined;
	NUM_GAMES_PLAYED = 0;


	if (credentials.guest || errored) {
		document.getElementById("shadow").style.display = "none";
		document.getElementById("titleScreen").style.display = "block";
		start_title();
	}
	else {
		document.getElementById("loading").style.display = "block";
		displayShadow(true, true);
		setTimeout(function() {
			sendToServer("/userStats", { username: getStoredData("username"), password: getStoredData("hash") }, function(response) {
				if (response.split("->>")[0] != "SUCCESS") {
					logOut();
				}
				else {
					var data = JSON.parse(response.split("->>").slice(1));

					credentials.mR = data.user.mR;
					credentials.missions = data.user.missions;
					credentials.leaderboardComp = data.user.leaderboardComp;
					credentials.stuffBought = data.user.stuffBought;

					var lowerBound = credentials.xpInfo.l;
					var upperBound = data.xpInfo.l;
					var somethingUnlocked = false;

					if (lowerBound != upperBound) {
						var types = ["sticker", "arm", "decal", "explosion"];
						types.forEach(function(i) {
							for (var t = 0; t < items[i].length; t++) {
								let level;
								if (items[i][t].unlock && items[i][t].unlock.level) {
									level = items[i][t].unlock.level;
									if (level > lowerBound && level <= upperBound) {
										somethingUnlocked = true;
										credentials.stuffBought[i].push(-t);
									}
								}
							}
						});
					}

					credentials.xpInfo = data.xpInfo;
					document.getElementById("loading").style.display = "none";
					document.getElementById("shadow").style.display = "none";
					document.getElementById("titleScreen").style.display = "block";
					start_title();
					loadAccountInfo();
				}
			});
		}, 500);
	}
}

function makeIconsLight(light) {
	if (darkModeEnabled()) light = true;
	var elms = document.getElementById("gameIconBar").children;
	for (var i = 0; i < elms.length; i++) {
		elms[i].style.filter = light ? "invert(100%)" : "invert(20%)";
	}
}
/**
 * Display background shadow and update the color of the icons.
 * @param {Boolean} display - Whether to hide or show the shadow.
 * @param {Boolean} [force] - Whether to ignore other open panels.
 */
function displayShadow(display, force = false) {
	const shadow = document.querySelector('#shadow');

	if (force) {
		makeIconsLight(display);
		shadow.style.display = display ? 'block' : 'none';
		return;
	}

	const shadowNeeded = (display ||
		controls.tab || // Scoreboard
		controls.shift || // Help menu
		minimap?.isMaximized() ||
		FLAGS.experienceBreakdownVisible);

	shadow.style.display = shadowNeeded ? 'block' : 'none';
	makeIconsLight(shadowNeeded);
}

function copyMatchLink(button, prefix) {
	var elm = document.getElementById(prefix + "_matchLink");
	elm.select();
	document.execCommand("copy");
	button.innerText = "Copied!";
}

function updateTitleTank() {
	profileTank.arm.angle = Math.round(toDegrees(Math.atan2(cursorX - profileTank.arm.x, profileTank.arm.y - cursorY)) / 4) * 4;
	if (credentials.turnSticker) {
		profileTank.sticker.angle = profileTank.arm.angle;
	}
	else {
		profileTank.sticker.angle = 0;
	}
}

function loadTitleTank() {
	var y = null;
	var x = null;
	profileTank.body = game.add.sprite(x, y, "body r");
	profileTank.decal = game.add.sprite(x, y);
	profileTank.arm = game.add.sprite(x, y, "arm/0");
	profileTank.sticker = game.add.sprite(x, y);
	profileTank.body.anchor.set(0.5);
	profileTank.decal.anchor.set(0.5);
	profileTank.sticker.anchor.set(0.5);
	profileTank.arm.anchor.set(0.5);
	profileTank.body.scale.set(1.6);
	profileTank.decal.scale.set(1.6);
	profileTank.arm.proportionalScale = 0.35
	profileTank.sticker.proportionalScale = 0.5
	profileTank.arm.scale.set(profileTank.arm.proportionalScale);
	positionProfileTank();
	profileTank.team = "r";
	if (!credentials.guest) {
		document.getElementById("appearanceButton").style.display = "block";
		document.getElementById("tank_container").style.cursor = "pointer";
		setTimeout(function(){
			equipItem("arm", credentials.appearance.arm, false);
			equipItem("sticker", credentials.appearance.sticker, false);
			equipItem("decal", credentials.appearance.decal, false);
			// Fade in the sticker and decal for a nice aesthetic
			profileTank.sticker.alpha = profileTank.decal.alpha = 0;
		    game.add.tween(profileTank.sticker).to( { alpha:1 }, 200, Phaser.Easing.Linear.None, true, -1);
		    game.add.tween(profileTank.decal).to( { alpha:1 }, 200, Phaser.Easing.Linear.None, true, -1);

		},50);
	}
}

function loadStats() {
	document.getElementById("profile-time").innerText = getAgeString(credentials.leaderboardComp.time);
	document.getElementById("stats-kills").innerText = credentials.leaderboardComp.kills;
	document.getElementById("stats-deaths").innerText = credentials.leaderboardComp.deaths;
	document.getElementById("stats-bullets").innerText = credentials.leaderboardComp.bullets;
	document.getElementById("stats-join").innerText = readableTimeStamp(credentials.joinDate);
	document.getElementById("stats-xp").innerText = Math.floor(credentials.xpInfo.xp);
	document.getElementById("stats-kd").innerText = Math.round(credentials.leaderboardComp.kd * 100) / 100;
}

function loadStatsLeaderboard(yes, query) {
	document.getElementById('titleScreen').style.display = yes ? 'none' : 'block';
	document.getElementById('stats-leaderboard').style.display = document.getElementById('shadow').style.display = yes ? 'block' : 'none';
	if (yes) {
		var html = "<table cellspacing=0 cellpadding=0 style='width:100%;'><tbody style='max-height:30vh;overflow-y:scroll;'>";
		getFromServer("/stats/" + query + ".json", function(r) {
			// Unselect all the tabs
			const selector = document.querySelector('#stats-leaderboard .tab-selector');
			const tabs = Array.from(selector.children);
			tabs.forEach(e => e.classList.remove('selected-tab'));

			// Select the correct tab
			const correctTab = selector.querySelector(`[data-stat="${query}"]`);
			if (correctTab) correctTab.classList.add('selected-tab');

			document.getElementById("stats-leaderboard-name").innerText = r.name;
			document.getElementById("stats-leaderboard-description").innerHTML = r.description;

			if (query == "xp") {
				document.querySelector("#stats-leaderboard-table-header thead").innerHTML = "<tr align='left'><th colspan=2 style='width:20%';></th><th style='width:30%;'>Name</th><th style='width:25%;'>Level</th><th style='width:25%;'>XP</th></tr>";
			}
			else {
				document.querySelector("#stats-leaderboard-table-header thead").innerHTML = "<tr align='left'><th colspan=2 style='width:20%';></th><th style='width:30%;'>Name</th><th style='width:50%;'>" + r.label + "</th></tr>";
			}
			var c = 1;
			r.contents.forEach(function(p) {
				if (query != "xp" && p[2] == 0) {
					return;
				}
				html += "<tr onclick='window.open(\"/user/" + p[0] + "\",false);' align='left' style='height:45px;cursor:pointer;'>" + "<td style='width:10%;'></td><td style='width:10%;'>" + c + ".</td><td style='width:30%;'>" + p[1] + "</td>";
				if (query == "xp") {
					html += "<td style='width:25%;padding:0px;'><img style='margin-left:5px;width:40px;'src='assets/ranks/" + p[2] + ".png'></td>" + "<td style='width:25%;'>" + p[3].toLocaleString() + "</td></tr>";
				}
				else {
					html += "<td style='width:90%;'><span>" + p[2].toLocaleString() + "</span></td></tr>";
				}
				c++;
			})
			html += "</tbody></table>";
			document.getElementById("stats-leaderboard-table-content").innerHTML = html;
		});
	}
	positionProfileTank();
}

function restoreDefaultHotkeys() {
	for (var setting in settingsSchema) {
		if (settingsSchema.hasOwnProperty(setting)) {
			var type = settingsSchema[setting].type;
			if (type === "keycode") {
				var defaultTo = settingsSchema[setting].defaultTo;
				var elm = document.getElementById(`settings.${setting}`);
				const value = defaultTo[0];
				elm.value = keycodeMap[value] ? keycodeMap[value] : "Unknown Input";
				if (!value) elm.value = "Unbound";
				elm.setAttribute("keycode", defaultTo);
			} else if (type === "buttoncode") {
				let defaultTo = settingsSchema[setting].defaultTo;
				let elm = document.getElementById(`settings.${setting}`);
				const value = defaultTo[0];
				elm.value = buttonCodeMap[value] ? buttonCodeMap[value] : "Unknown Input";
				if (!value) elm.value = "Unbound";
				elm.setAttribute("buttoncode", defaultTo);
			}
		}
	}
}

function hotkeysModeChanged() {
	var proelm = document.getElementById("settings.proGamerHotkeys");
	var noobelm = document.getElementById("settings.NoobGamer");
	var weaponHotkeysDiv = document.getElementById("weaponHotkeys");
	var slotHotkeysDiv = document.getElementById("slotHotkeys");
	weaponHotkeysDiv.style.display = proelm.checked ? "block" : "none";
	slotHotkeysDiv.style.display = noobelm.checked ? "block" : "none";
}

function loadSettings(yes) {
	if (yes) {
		for (var setting in settingsSchema) {
			if (settingsSchema.hasOwnProperty(setting)) {
				var type = settingsSchema[setting].type;
				var defaultTo = settingsSchema[setting].defaultTo;
				var value = getObjectProperty(credentials, setting);
				if (value == undefined || (Array.isArray(value) && !value.length)) value = defaultTo || false;
				switch (type) {

					case "string":
						document.getElementById(`settings.${setting}`).value = value;
						break;
					case "boolean":
						document.getElementById(`settings.${setting}`).checked = value;
						break;
					case "keycode":
						let elm = document.getElementById(`settings.${setting}`);
						elm.value = keycodeMap[value[0]] ? keycodeMap[value[0]] : "Unknown Input";
						if (value == "") elm.value = "Unbound";
						elm.setAttribute("keycode", value);
						break;
					case "buttoncode":
						let buttonElement = document.getElementById(`settings.${setting}`);
						buttonElement.value = buttonCodeMap[value[0]] ? buttonCodeMap[value[0]] : "Unknown Input";
						if (value == "") buttonElement.value = "Unbound";
						buttonElement.setAttribute("buttoncode", value);
						break;
					default:
						console.log(`Unknown setting type: "${type}"`);
						break;
				}
			}
		}
		document.getElementById("settings.NoobGamer").checked = !credentials.proGamerHotkeys;
		hotkeysModeChanged();

		const emailInput = document.getElementById('settings.email');
		emailInput.readOnly = true;
		emailInput.style.backgroundColor = 'var(--settings-email-bg)';

		// Email Verification Notice
		if (!credentials.verified) {
			const notice = document.querySelector('#verification-notice');
			const link = notice.querySelector('[data-link]');
			const message = notice.querySelector('[data-confirmation]');
			show(notice);
			link.style.display = 'unset';

			link.innerText = (!credentials.verificationToken) ? 'Verify' : 'Resend Email';
			link.addEventListener('click', async () => {
				try {
					hide(message);

					await new Promise((resolve, reject) => {
						server.POST('/verify-email', undefined, resolve, reject);
					});

					show(message);
					hide(link);
					credentials.verificationToken ||= true;
				} catch (error) {
					console.log(error);
					alert(error);
				}
			});
		}

		if (credentials.discord) {
			document.getElementById("settings.discordText").innerText = "Your account is connected to Discord!";
			document.getElementById("settings.discordButton").innerText = "Connect with different account";
		}

		if (credentials.vip) {
			document.getElementById("settings.darkMode").checked = credentials.darkMode;
			document.getElementById("settings.darkMode").onclick = function() {
				setDarkMode(this.checked);
			}
		}
		else {
			document.getElementById("vipButton2").style.display = "inline-block";
			document.getElementById("settings.darkMode").readOnly = true;
			document.getElementById("settings.darkMode").onclick = function() { return false };
		}
		show("settings.integrations");
	}
	document.getElementById("settings").style.display = document.getElementById("shadow").style.display = yes ? "block" : "none";
	document.getElementById("titleScreen").style.display = yes ? "none" : "block";
	positionProfileTank();

	updateLabsVisibility('kdRatio');
	updateLabsVisibility('replays');
	updateLabsVisibility('controller');
	if (!credentials.labs?.replays && document.getElementById('accountInfo-replays').style.display == 'block') {
		// Select another tab if replays are disabled from settings but the replay tab is open
		loadAccountTab('xp');
	}
}



function toDecimalString(num) {
	parseFloat(Math.round(num * 100) / 100).toFixed(2);
}

function decorateXpBar(elm, l, p1, p2, callback, showPercent=true) {
	if(typeof elm == "string"){
		elm = document.getElementById(elm); // Get the actual HTML reference to the element
	}
	let xpColors = [
		[55, "amethyst"],
		[50, "emerald"],
		[45, "fire"],
		[40, "diamond"],
		[30, "gold"],
		[20, "silver"],
		[10, "bronze"],
		[0, "charcoal"]
	]
	let colorFound = false;
	let xpBar = elm.querySelector(".xpBar");
	for(let i=0;i<xpColors.length;i++){
		xpBar.classList.remove(xpColors[i][1]);
		if(l > xpColors[i][0] && !colorFound){
			xpBar.classList.add(xpColors[i][1]);
			colorFound = true;
		}
	}
	
	var tempP = p1;

	function setPosition(elm, position){
		var clipValue = Math.round(position * 100 * 100) / 100;
		if (showPercent) {
			elm.querySelector(".xpCount").innerText = (Math.floor(position * 100 * 100) / 100).toString() + "%";
		}
		xpBar.style.clipPath = "polygon(0% 0%, " + clipValue + "% 0%, " + clipValue + "% 100%, 0% 100%)";
	}

	var xpInterval = setInterval(function() {
		var difP = (p2 - tempP);
		tempP += (p2 - p1)/120;
		setPosition(elm, tempP);
		if (difP < 0.001) {
			clearInterval(xpInterval);
			setTimeout(callback, 200);
			setPosition(elm, p2);
		}
	}, 16)

	elm.querySelector(".xpCircle").src = "/assets/ranks/" + l + ".png";
}

function countTextTo(id, num) {
	var tempP = 0;
	var countInterval = setInterval(function() {
		var difP = (1 - tempP);
		var value = Math.round(tempP * num);
		document.getElementById(id).innerText = value;
		tempP += difP * 0.06;
		if (difP < 0.01) {
			document.getElementById(id).innerText = num;
			clearInterval(countInterval);
		}
	}, 16);
}

function spawnProgressBar(id, container, percentage, color, text, rightAligned) {
	var html = "";
	html += '<div style="width:36vmin;height:6vmin;position:relative;">';
	html += '<div id="' + id + 'BarCrop" class="xpBarBackground" style="position:absolute;border-radius:2vmin;' + (rightAligned ? 'left' : 'right') + ':0%;top:15%;height:70%;width:92%;"></div>';
	html += '<div id="' + id + 'Bar" style="position:absolute;border-radius:2vmin;' + (rightAligned ? 'left' : 'right') + ':0%;top:15%;width:92%;height:70%;background:linear-gradient(to bottom, ' + color + ' 0%, ' + color + ' 100%);"></div>';
	html += '<div id="' + id + 'Circle" style="background:' + color + ';position:absolute;top:0%;' + (rightAligned ? 'right' : 'left') + ':0%;border-radius:100%;width:16.667%;height:100%;">';
	html += '<span id="' + id + 'Percentage" style="position:absolute;font-size:2.8vmin;top:50%;margin-top:-1.4vmin;left:0%;width:100%;color:white;font-family:\'Passion One\';text-align:center;"></span>';
	html += '</div>';
	html += '<div id="' + id + 'Count" style="font-family:\'Passion One\';' + (rightAligned ? 'left' : 'right') + ':0%;width:84%;transition:.2s;position:absolute;top:50%;text-align:center;color:white;font-size:2.75vmin;margin:0px;padding:0px;margin-top:-1.5vmin;opacity:0.0;letter-spacing:.5px;">' + text + '</div>';
	html += '</div>';

	if (percentage >= 1) {
		percentage = 1;
	}

	var tempP = 0;
	var xpInterval = setInterval(function() {
		var difP = (percentage - tempP);
		var clipValue = Math.round(tempP * 100 * 100) / 100 + (rightAligned ? 0 : 8);
		tempP += difP * 0.075;
		document.getElementById(id + "Percentage").innerText = Math.floor(tempP * 100).toString() + "%";
		document.getElementById(id + "Bar").style.clipPath = document.getElementById(id + "Bar").style.webkitClipPath = "polygon(0% 0%, " + clipValue + "% 0%, " + clipValue + "% 100%, 0% 100%)";
		if (difP < 0.02) {
			clearInterval(xpInterval);
			if (percentage == 1) {
				document.getElementById(id + "Percentage").innerText = "✔"; //checkmark
				document.getElementById(id + "Percentage").style.marginTop = "-1.8vmin";
			}
			else {
				document.getElementById(id + "Percentage").innerText = Math.floor(percentage * 100).toString() + "%";
			}
			document.getElementById(id + "Count").style.opacity = "1.0";
		}
	}, 33);
	document.getElementById(container).innerHTML += html;
}

function levelUp(id, testCase) {
	var recur = {
		action: function(i) {
			decorateXpBar(id, testCase[i][0], testCase[i][1], testCase[i][2], function() {
				if (i < testCase.length - 1) {
					this.action(i + 1);
				}
			}.bind(this))
		}
	}
	recur.action(0);
}

function throwError(message, recoverable) {
	if (!window.devMode) {
		Sentry.captureMessage("FATAL ERROR! " + message);
	}


	document.getElementById("loading").style.display = "none";
	document.getElementById("connecting").style.display = "block";
	document.getElementById("connectionContainer").style.display = "none";
	document.getElementById("gameError").style.display = "block";
	document.getElementById("gameError-message").innerText = message;
	history.replaceState({}, "BlockTanks", "/");

	if (window.ws !== undefined) {
		if (ws.close !== undefined) {
			ws.close();
		}
	}

	if (recoverable == true) {
		setTimeout(start_title, 50);
		backToTitle(true);
	}
	else {
		document.getElementById("gameError-button").onclick = function() {
			window.location.reload();
		};
	}
}

function updateLeaderboard() {
	var leaders = [];
	for (var i in server_tanks) {
		var score = server_tanks[i].killStreak;
		if (server_tanks[i].body.alpha == 0) {
			score = 0;
		}
		leaders.push({ displayName: server_tanks[i].displayName, username: i, score: score });
	}

	function compare(a, b) {
		if (a.score < b.score)
			return 1;
		if (a.score > b.score)
			return -1;
		return 0;
	}

	leaders.sort(compare);

	document.getElementById("leaderboardText_0").style.display = document.getElementById("leaderboardText_1").style.display = document.getElementById("leaderboardText_2").style.display = document.getElementById("leaderboardText_extra").style.display = "none";

	for (var i = 0; i < leaders.length; i++) {
		if (i < 3) {
			const leaderboardTextElement = document.getElementById("leaderboardText_" + i);
			leaderboardTextElement.innerText = (i + 1) + ". " + leaders[i].displayName + " - " + Math.ceil(leaders[i].score);
			leaderboardTextElement.style.color = "#888888";
			leaderboardTextElement.style.display = "inline";
			leaderboardTextElement.classList.add('preserve-whitespace');
			if (leaders[i].username == name) {
				leaderboardTextElement.style.color = server_tanks[name].team == "r" ? "#e72b2b" : "#345cd2";
			}
		}
		else if (leaders[i].username == name) {
			document.getElementById("leaderboardText_extra").innerText = (i + 1) + ". " + leaders[i].displayName + " - " + Math.ceil(leaders[i].score);
			document.getElementById("leaderboardText_extra").style.color = server_tanks[name].team == "r" ? "#e72b2b" : "#345cd2";
			document.getElementById("leaderboardText_extra").style.display = "inline";
		}
	}
	if (leaders[0] !== undefined && leaders[0].score > 0) {
		if (crown.name != leaders[0].username) {
			crown.nameChange = true;
		}
		crown.name = leaders[0].username;
	}
	else {
		if (crown.crown !== undefined && crown.crown !== null) {
			crown.crown.destroy();
			crown.arrow.destroy();
		}
		crown.crown = null;
		crown.name = undefined;
	}
}

function calculateScore(k, d) {
	return k;
}

function showNotification(message) {
	document.getElementById("unlockAnnouncement").innerHTML = message;
	document.getElementById("unlockAnnouncement").style.display = "block";
	document.getElementById("unlockAnnouncement").style.transitionDuration = "0s";
	document.getElementById("unlockAnnouncement").style.marginRight = "-500px";
	setTimeout(function() {
		document.getElementById("unlockAnnouncement").style.transitionDuration = "1s";
		document.getElementById("unlockAnnouncement").style.marginRight = "0px";
	}, 500)
}

function swapTeam() {
	AFK = new Date().getTime();
	socket.send("swapTeam", {});
}

function runAds(clock) {
	// Cases in which to NOT show a video ad
	// - The user is VIP
	// - AdBlock is enabled
	// - It has been less than X minutes since an ad was shown.
	
	if (credentials.vip || (Date.now() - FLAGS.VIDEO_AD_SHOWN) < 60000 * VIDEO_AD_INTERVAL) {
		return;
	}
	
	startVideoAd();
}

function updateLabsVisibility(featureName) {
	document.querySelectorAll('.labs-' + featureName).forEach(child => {
		child.style.display = credentials.labs?.[featureName] ? '' : 'none';
	});
}

function forceLabsVisibility(featureName, value) {
	document.querySelectorAll('.labs-' + featureName).forEach(child => {
		child.style.display = value ? '' : 'none';
	});
}

var PLAYER_INFO = {};
function updatePlayerInfoListeners(username) {
	if (!credentials.labs?.playerStats) {
		// Player stats are disabled!
		return;
	}

	// Every player on the team needs to have their listeners refreshed since html is directly re-written on player update...
	let stats = document.getElementById('playerinfo');

	// Set default info
	let defaultInfo = {};
	['kd', 'hours', 'accuracy', 'xpHour', 'killsHour', 'strength'].forEach(val => defaultInfo[val] = '?');
	PLAYER_INFO[username] = defaultInfo;

	// Fetch stats and eventually update info
	(async () => {
		try {
			if (window.server_tanks[username].bot || window.server_tanks[username].guest) return; // This is a bot/guest

			let response = await fetch('/user/stats/data/' + username);
			let data = await response.json();

			let info = PLAYER_INFO[username];
			info.kd = data.leaderboardComp.kd.toLocaleString(undefined, {maximumFractionDigits: 3});
			if (data.leaderboardComp.bullets == 0) data.leaderboardComp.bullets = 1;
			info.accuracy = ((data.leaderboardComp.kills / data.leaderboardComp.bullets) * 100).toLocaleString(undefined, {maximumFractionDigits: 3}) + '%';

			let weaponKills = {};

			data.completedGames.forEach(game => {
				if (!game.kB) return;
				Object.keys(game.kB).forEach(weapon => {
					if (!weaponKills[weapon]) {
						weaponKills[weapon] = 0;
					}
					weaponKills[weapon] += game.kB[weapon];
				});
			});

			let hours = data.leaderboardComp.time / 60;
			info.hours = hours.toLocaleString(undefined, {maximumFractionDigits: 1});
			if (hours == 0) hours = 1;
			info.xpHour = (data.leaderboardComp.xp / hours).toLocaleString(undefined, {maximumFractionDigits: 1});
			info.killsHour = (data.leaderboardComp.kills / hours).toLocaleString(undefined, {maximumFractionDigits: 1});

			weaponKills.re = 0; // Ignore regular bullets

			let highestCount = Object.values(weaponKills).sort((a, b) => b - a)[0];
			let highestWeapon = Object.keys(weaponKills).find(key => weaponKills[key] == highestCount);

			info.strength = {
				're': 'Regular',
				'g': 'Grenade',
				'ra': 'Rapid',
				'b': 'Bomb',
				'sh': 'Shotgun',
				'ro': 'Rocket',
				'sn': 'Sniper',
				'm': 'Minigun',
				'bb': 'Bottle Bomb'
			}[highestWeapon];
		} catch (error) {
			// Swallow the error
		}

	})();

	let team = 'team';
	if (window.MODE != 'ffa') {
		team = {'r': 'redTeam', 'b': 'blueTeam'}[window.server_tanks[username].team];
	}

	document.querySelectorAll(`#${team}>tr`).forEach(el => {
		let name = el.id.substring(el.id.indexOf('_') + 1);

		if (window.server_tanks[name].bot || window.server_tanks[name].guest) {
			// This is a bot/guest
			return;
		}

		let moveStats = mouseEvent => {
			let x = mouseEvent.pageX;
			let y = mouseEvent.pageY;
			let offset = 5;
			let rect = stats.getBoundingClientRect();

			if (x + rect.width + offset < window.innerWidth) {
				// Stats are on page
				stats.style.top = (y + offset) + 'px';
				stats.style.left = (x + offset) + 'px';
			} else {
				// Stats would go off page, flip them
				stats.style.top = (y + offset) + 'px';
				stats.style.left = ((x - rect.width) - offset) + 'px';
			}
		}

		el.addEventListener('mousemove', moveStats);

		el.addEventListener('mouseleave', mouseEvent => {
			stats.classList.remove('visible');
			stats.classList.add('hidden');
			stats.removeAttribute('targetPlayer');
		});

		el.addEventListener('mouseenter', mouseEvent => {
			stats.classList.remove('hidden');
			stats.classList.add('visible');
			stats.setAttribute('targetPlayer', name);

			// Update stats with the player info
			Object.keys(PLAYER_INFO[name]).forEach(key => {
				document.getElementById('playerstats-' + key).innerText = PLAYER_INFO[name][key];
			});

			moveStats(mouseEvent);
		});
	});
}

function playVideo(sourceFile, cb){
	// Creates a fullscreen video container, and plays a video from a certain source.
	// Callback fires when the video is complete.
	let videoElm = document.createElement("video");
	videoElm.classList.add("fullscreenVideo");
	let source = document.createElement("source");
	source.src = sourceFile;
	source.type = "video/webm";
	videoElm.appendChild(source);
	videoElm.addEventListener("canplaythrough",function(){
		// The video is ready to start.
		videoElm.play();
	});
	videoElm.addEventListener("ended",function(){
		// The video has ended. Remove the elements from the screen.
		videoElm.parentNode.removeChild(videoElm);
		completeVideoAd();
	});
	document.body.appendChild(videoElm);
	prepareVideoAd();
}
