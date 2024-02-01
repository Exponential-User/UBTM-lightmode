function make_server_bullet(data) {
	var bullet_type = "bullet";
	var size = 11;
	var sound;

	if (data.type == 2) {
		bullet_type = "flashbangBullet";
		size = 30;
	}
	if (data.type == 1) {
		bullet_type = "grenadeBullet";
		size = 30;
	}
	if (data.type == 8) {
		size = 8;
	}
	if (data.type == 6) {
		bullet_type = "rocketBullet";
		size = 30;
	}
	if (data.type == 9) {
		bullet_type = "bottlebombBullet";
		size = 50;
	}
	if (data.type == 4) {
		bullet_type = "volcanoBullet";
		size = SERVER_MATCH_DATA.match_bomb_size * 100 + 3;
	}


	if (MODE === "ffa") {
		data.team = data.username == name ? "b" : "r";
	}

	var bullet_key = bullet_type + " " + data.team;

	if (server_tanks[name] !== undefined) {
		if (data.team == server_tanks[name].team) {
			bullet_key = bullet_type;
		}
		if (!(data.team == "r" && server_tanks[name].team == "b") && darkModeEnabled()) {
			bullet_key += "_dark";
		}
		if (spookyTime() && data.type == 4) {
			bullet_key = 'bomb' + (data.team == server_tanks[name].team ? '' : ' ' + data.team) + '_spooky';
		}
	}


	var new_bullet = game.add.sprite(data.points[0].x, data.points[0].y, bullet_key);

	if (server_tanks[data.username] !== undefined && data.username != name) {
		server_tanks[data.username].arm.angle = server_tanks[data.username].arm.targetAngle = toDegrees(data.angle);
	}

	if (data.type == 5) {
		dynamicSound(new_bullet.x, new_bullet.y, "explodeShort", 50);
	}
	else if (data.type == 6) {
		new_bullet.sound = new Phaser.Sound(game, 'slide', 0); //store the sound so it can be adjusted later.
		new_bullet.sound.play();
	}
	dynamicSound(new_bullet.x, new_bullet.y, "bullet" + random_int(1, 3), 15);

	/*	var end_bullet = game.add.sprite(data.points[data.points.length-1].x,data.points[data.points.length-1].y,"bullet");
		end_bullet.alpha = 0.8
		end_bullet.width = size;
		end_bullet.height = size;
		end_bullet.anchor.set(0.5);
	*/


	new_bullet.team = data.team;
	new_bullet.anchor.set(0.5);
	new_bullet.name = data.username;
	new_bullet.width = size;
	new_bullet.height = size;
	new_bullet.t = new Date().getTime();
	new_bullet.i = 0;
	new_bullet.points = data.points;
	new_bullet.type = data.type;
	if (spookyTime() && data.type == 4) {
		new_bullet.height = 48;
		new_bullet.width = 48;
		new_bullet.rotationDir = random_int(0, 1) == 0 ? 1 : -1;
	}
	if (data.type == 9 || data.type == 2 || data.type == 1) {
		new_bullet.rotationDir = random_int(0, 1) == 0 ? 1 : -1;
	}
	return new_bullet;

}
function clientPredictBullets() {
	for (var i = 0; i < bullets.length; i++) {
		if (bullets[i].type != 9 && bullets[i].type != 2 && bullets[i].type != 1) {
			if (bullets[i].points[bullets[i].i + 1] !== undefined) {
				if (tempTime - bullets[i].t > bullets[i].points[bullets[i].i + 1].t) {
					bullets[i].i += 1;
					bulletBounceSound(bullets[i]);

					if (bullets[i].type == 4 && spookyTime()) {
						bullets[i].rotationDir *= -1;
					}
				}
			}
			if (bullets[i].points[bullets[i].i + 1] === undefined) {


				if (christmasTime() && bullets[i].type == 6) {
					var key = bullets[i].team;
				}
				else if (bullets[i].key.split(" ").length == 1) {
					var key = "n";
					if (darkModeEnabled()) {
						key = "n_dark";
					}
				}
				else {
					if (bullets[i].key.split(" ")[1] == "r") {
						var key = "r";
					}
					else {
						var key = "b";
					}
				}
				bullets[i].x = bullets[i].points[bullets[i].i].x; //make the explosion happen in the proper place
				bullets[i].y = bullets[i].points[bullets[i].i].y;

				if (bullets[i].type == 6) {
					bullets[i].sound.stop();
					particleExplode(christmasTime() ? "christmas/presents/" + key + "/" : "explosion/0/" + key + "/", bullets[i].x, bullets[i].y, {
						amount: Math.round(20 / (bullets.length / 50 + 1)),
						speed: 15,
						drag: christmasTime() ? .875 : .85,
						life: christmasTime() ? 100 : 50,
						scale: christmasTime() ? .25 : .5,
						rotate: christmasTime(),
						count: christmasTime() ? 1 : 6
					});
					smokeExplosion(bullets[i].x, bullets[i].y, SERVER_MATCH_DATA.match_rocket_effectRange * 100, 20);
				}
				else {
					particleExplode("explosion/0/" + key + "/", bullets[i].x, bullets[i].y, {
						amount: Math.round(20 / (bullets.length / 10 + 1)),
						speed: 5,
						drag: .85,
						life: 25,
						scale: .2
					});
				}
				bullets[i].destroy();
				bullets.splice(i, 1);
				i -= 1;
				continue;
			}

			var dX = bullets[i].points[bullets[i].i + 1].x - bullets[i].points[bullets[i].i].x;
			var dY = bullets[i].points[bullets[i].i + 1].y - bullets[i].points[bullets[i].i].y;
			if (bullets[i].type == 6) {
				bullets[i].rotation = Math.atan2(-dY, -dX);
			}
			if (bullets[i].type == 4) {
				bullets[i].rotation += .05 * (bullets[i].i + 1) * (bullets[i].i % 2 == 0 ? -1 : 1);
			}
			var dT = tempTime - bullets[i].t;

			var pT = (dT - bullets[i].points[bullets[i].i].t) / (bullets[i].points[bullets[i].i + 1].t - bullets[i].points[bullets[i].i].t)

			bullets[i].x = bullets[i].points[bullets[i].i].x + dX * pT;
			bullets[i].y = bullets[i].points[bullets[i].i].y + dY * pT;
			if (bullets[i].type == 6) {
				bullets[i].sound.volume = getVolume(bullets[i].x, bullets[i].y, 50);
				puffSmoke(bullets[i].x + Math.cos(bullets[i].rotation) * 20, bullets[i].y + Math.sin(bullets[i].rotation) * 20, 0.8, 25);
			}
		}
		else if (calculateFlashbang(i)) {
			i -= 1;
		}
	}
}

function getSoundPOV() {
	if (server_tanks[name] !== undefined) {
		var sourceX = server_tanks[name].body.x;
		var sourceY = server_tanks[name].body.y;
		return [sourceX, sourceY];
	}
	else if (FLAGS.dynamicSpectate) {
		var sourceX = game.world.pivot.x + getGameWidth() / 2;
		var sourceY = game.world.pivot.y + getGameHeight() / 2;
		return [sourceX, sourceY];
	}
	else {
		return null;
	}
}

function dynamicSound(x, y, key, falloff) {
	if (FLAGS.FLASHED) {
		return;
	}
	var VOLUME;
	VOLUME = getVolume(x, y, falloff);
	SOUNDS[key].play("", 0, VOLUME);
}

function getVolume(x, y, falloff) {
	var source = getSoundPOV();
	if (source === null) {
		return 0;
	}
	var dX = x - source[0];
	var dY = y - source[1];
	var dist = Math.sqrt(dX * dX + dY * dY);
	VOLUME = Math.min(1, falloff / dist);
	if (typeof VOLUME === "number" && VOLUME >= 0.005 && VOLUME <= 1) {
		return VOLUME;
	}
	return 0;
}

function playSound(key, vol) {
	if (FLAGS.FLASHED) {
		return;
	}
	SOUNDS[key].play("", 0, vol);
}

function bulletBounceSound(bullet) {
	dynamicSound(bullet.x, bullet.y, "bullet" + random_int(1, 3), 15);
}

function calculateFlashbang(i) {
	if (bullets[i].type == 1) {
		var x = (tempTime - bullets[i].t) / (SERVER_MATCH_DATA.match_grenade_life * 1000);
	}
	else {
		var x = (tempTime - bullets[i].t) / (SERVER_MATCH_DATA.match_flashbang_life * 1000);
	}
	if (x >= 1) {
		if (bullets[i].type == 2) {
			smokeExplosion(bullets[i].x, bullets[i].y, 125, 20, "lightBurst", 5);
			puffSmoke(bullets[i].x, bullets[i].y, 125, 10, "lightBurst");
		}
		else {
			if (bullets[i].key.split(" ").length == 1) {
				var key = "n";
				if (darkModeEnabled()) {
					key = "n_dark";
				}
				if (christmasTime()) {
					key = bullets[i].team;
				}
			}
			else {
				if (bullets[i].key.split(" ")[1] == "r") {
					var key = "r";
				}
				else {
					var key = "b";
				}
			}
			particleExplode(christmasTime() ? "christmas/presents/" + key + "/" : "explosion/0/" + key + "/", bullets[i].x, bullets[i].y, {
				amount: Math.round(20 / (bullets.length / 50 + 1)),
				speed: 30,
				drag: christmasTime() ? .875 : .85,
				life: christmasTime() ? 100 : 50,
				scale: christmasTime() ? .25 : .5,
				rotate: christmasTime(),
				count: christmasTime() ? 1 : 6
			});
			smokeExplosion(bullets[i].x, bullets[i].y, SERVER_MATCH_DATA.match_grenade_effectRange * 100, 20);
		}
		bullets[i].destroy();
		bullets.splice(i, 1);
		return true;
	}

	var distance = 1.02 * (1 - Math.pow(50, -x));



	distance *= bullets[i].points[bullets[i].points.length - 1].t;

	if (bullets[i].points[bullets[i].i + 1] !== undefined) {
		if (distance > bullets[i].points[bullets[i].i + 1].t) {
			bullets[i].i += 1;
			bullets[i].rotationDir *= -1;
		}
	}



	var dX = bullets[i].points[bullets[i].i + 1].x - bullets[i].points[bullets[i].i].x;
	var dY = bullets[i].points[bullets[i].i + 1].y - bullets[i].points[bullets[i].i].y;
	var cA = bullets[i].rotationDir * (1 - x) * 10;
	bullets[i].angle += cA;
	var dT = distance;

	var pT = (dT - bullets[i].points[bullets[i].i].t) / (bullets[i].points[bullets[i].i + 1].t - bullets[i].points[bullets[i].i].t)

	bullets[i].x = bullets[i].points[bullets[i].i].x + dX * pT;
	bullets[i].y = bullets[i].points[bullets[i].i].y + dY * pT;
	return false;
}

function fireBullet(angle, power) {
	if (angle === undefined) {
		angle = server_tanks[name].arm.rotation;
	}
	if (getArrayQueryCount(bullets, "name", name) < 5 || weaponSelected == 8) {

		if(power === undefined){
			power = 0;
			if (weaponSelected == 2 || weaponSelected == 1 || weaponSelected == 9) {
				var rX = cursorX - (getGameWidth() / 2);
				var rY = cursorY - (getGameHeight() / 2);
				power = Math.sqrt(rX*rX + rY*rY) / (getGameWidth() / 2);
			}
		}

		
		if (gamepad.getControllerActive()) {
			power = 0.5; // Shoot at half power if playing on controller
		}
		gamepad.vibrate(60, true);

		socket.send("bullet", {
			angle: angle,
			type: weaponSelected,
			power: Math.max(Math.min(power, 1), 0)
		});
	}
}