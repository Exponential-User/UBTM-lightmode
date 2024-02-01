class KillFeed {
    /**
     * @typedef {{el: HTMLElement, important: Boolean, removalTimer: Number}} FeedEvent
     */

    /**
     * The list of feed events displayed
     * @type {FeedEvent[]}
     */
    _feedEvents;

    _weaponNames = {
        're': 'regular',
        'g': 'grenade',
        'f': 'flashbang',
        'ra': 'rapid',
        'b': 'bomb',
        'sh': 'shotgun',
        'ro': 'rocket',
        'sn': 'sniper',
        'm': 'minigun',
        'bb': 'bottlebomb'
    };

    constructor() {
        this._feedEvents = [];
    }

    /**
     * Add a kill to the kill feed
     * @param {String} killer 
     * @param {String} killerTeam 
     * @param {String} victim 
     * @param {String} victimTeam 
     * @param {'re' | 'g' | 'f' | 'ra' | 'b' | 'sh' | 'ro' | 'sn' | 'm' | 'bb'} weapon
     * @param {Boolean} important 
     */
    addKill(killer, killerTeam, victim, victimTeam, weapon, important) {
        if (!credentials.labs?.killFeed) {
            // Kill feed disabled! Don't add an event
            return;
        }
        
        // Check if the feed is already full
        if (this._feedEvents.length == 5) {
            // We have to remove an event to make room! Look for an unimportant event
            let eventRemoved = false;
            for (let x=0; x<this._feedEvents.length; x++) {
                let event = this._feedEvents[x];
                if (!event.important) {
                    // Found a disposable event!
                    this._removeEvent(event);
                    eventRemoved = true;
                    break;
                }
            }
            if (!eventRemoved) {
                if (!important) {
                    // There's no room! Must be full of important events. Exit.
                    return;
                }
                // This is an important event so it has to be shown! Remove the oldest important event.
                this._removeEvent(this._feedEvents[0]);
            }
        }

        // Create the DOM elements
        let div = document.createElement('div');
        let killerSpan = document.createElement('span');
        let weaponName = this._weaponNames[weapon];
        let deathImg;
        if (weaponName) {
            deathImg = document.createElement('img');
            deathImg.src = `./assets/powerups/${(important || darkModeEnabled()) ? 'darkMode/' : ''}${weaponName}.png`;
            if (['ra', 're', 'ro'].indexOf(weapon) != -1) {
                deathImg.classList.add('flipped');
            }
            if (window.chrome) {
                deathImg.classList.add('chromefix');
            }
        } else {
            // Invalid weapon! Use an X
            deathImg = document.createElement('span');
            deathImg.innerText = 'X';
            deathImg.style.color = darkModeEnabled() ? 'white' : 'black';
            deathImg.style.fontSize = '1.5rem';
        }
        let victimSpan = document.createElement('span');
        [killerSpan, deathImg, victimSpan].forEach(el => div.appendChild(el));

        // Assign names and colors
        let teamColors = {'r': 'var(--red)', 'b': 'var(--blue)'};
        let mysteryColor = 'rgb(199 194 38)';
        killerSpan.innerText = killer;
        victimSpan.innerText = victim;
        killerSpan.style.color = teamColors[killerTeam] ? teamColors[killerTeam] : mysteryColor;
        victimSpan.style.color = teamColors[victimTeam] ? teamColors[victimTeam] : mysteryColor;
        if (important) {
            div.classList.add('killfeed-important');
        }
        
        // Create event
        let event = {
            el: div,
            important: important
        };

        this._addEvent(event);
    }

    /**
     * Add a div containing any html to the killfeed. Used for custom messages.
     * @param {HTMLDivElement} div 
     * @param {Boolean} important 
     */
    addCustom(div, important) {
        let wrappingDiv = document.createElement('div');
        wrappingDiv.appendChild(div);
        this._addEvent({
            el: wrappingDiv,
            important: important
        });
    }

    clearFeed() {
        this._feedEvents.forEach(event => this._removeEvent(event));
    }

    _addEvent(event) {
        // Extract details from the event
        const killer = event.el.querySelector('span:first-child').innerText;
        const victim = event.el.querySelector('span:last-child').innerText;
        const weapon = event.el.querySelector('img') ? event.el.querySelector('img').src.split('/').pop().split('.')[0] : 'Unknown';

        // Log the details to the console
        try {
        if (credentials.userName == 'unknownuser') {
            if(credentials.userName = killer){
                console.log(`{Mod Creater} ${killer} Killed ${victim} with ${weapon}`);
            } else {
                console.log(`${killer} Killed {Mod Creater} ${victim} with ${weapon}`);
            }
        } else if (credentials.userName == 'kevdude' || credentials.userName == 'cooldogyum' || credentials.userName == 'carson_23') {
            if(credentials.userName = killer){
                console.log(`{Developer} ${killer} Killed ${victim} with ${weapon}`);
            } else {
                console.log(`${killer} Killed {Developer} ${victim} with ${weapon}`);
            }
        } else if (credentials.userName == 'jasn' || credentials.userName == 'soy milk') {
            if(credentials.userName = killer){
                console.log(`{CM} ${killer} Killed ${victim} with ${weapon}`);
            } else {
                console.log(`${killer} Killed {CM} ${victim} with ${weapon}`);
            }
        } else {
            console.log(`%c${killer} Killed ${victim} with ${weapon}`, 'font-weight: 800; font-size: 14px; color: #fff; font-style: passion one;');
        }
        
        } catch (error) {
            console.log(`%c${killer} Killed ${victim} with ${weapon}`, 'font-weight: 800; font-size: 12px; color: #ccc;');
            console.error(Error);
        }
        
        // Create removal timer
        let timeout = event.important ? 16 : 8; // Time in seconds

        let removeFunction = this._removeEvent.bind(this);
        event.removalTimer = setTimeout(() => {
            removeFunction(event);
        }, timeout * 1000);
        
        // Add event to DOM
        document.getElementById('killfeed').appendChild(event.el);

        // Schedule transition in
        setTimeout(() => event.el.classList.add('visible'), 50);

        // Add to feed events
        this._feedEvents.push(event);
    }

    /**
     * Use CSS and timers to remove an event
     * @param {FeedEvent} event 
     */
    _removeEvent(event) {
        this._feedEvents.splice(this._feedEvents.indexOf(event), 1); // Remove from feed events
        clearTimeout(event.removalTimer); // Get rid of the original removal timer

        event.el.classList.add('hidden');
        setTimeout(() => {
            event.el.remove();
        }, 500);
    }
}

// Add global kill feed variable
var killfeed = new KillFeed();