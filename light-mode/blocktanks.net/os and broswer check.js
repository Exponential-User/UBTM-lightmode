// Feature detection for browser type
function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

// Feature detection for browser type
function isFirefox() {
    return typeof InstallTrigger !== 'undefined';
}

// Feature detection for browser type
function isEdge() {
    return /Edg\//.test(navigator.userAgent);
}

// Feature detection for browser type
function isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

// Feature detection for browser type
function isOpera() {
    return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
}

// Feature detection for operating system
function isWindows() {
    return navigator.platform.indexOf('Win') > -1;
}

// Feature detection for operating system
function isMacOS() {
    return navigator.platform.indexOf('Mac') > -1;
}

// Feature detection for operating system
function isLinux() {
    return navigator.platform.indexOf('Linux') > -1;
}

// Feature detection for operating system
function isChromeOS() {
    return /CrOS/.test(navigator.userAgent);
}

// Example usage
if (isChrome()) {
    console.log("Welcome Chrome user!");
} else if (isFirefox()) {
    console.log("Welcome Firefox user!");
} else if (isEdge()) {
    console.log("Welcome Edge user!");
} else if (isSafari()) {
    console.log("Welcome Safari user!");
} else if (isOpera()) {
    console.log("Welcome Opera user!");
} else {
    console.log("Unknown browser. Please proceed with caution.");
}

if (isWindows()) {
    console.log("You are using Windows.");
} else if (isMacOS()) {
    console.log("You are using macOS.");
} else if (isLinux()) {
    console.log("You are using Linux.");
} else if (isChromeOS()) {
    console.log("You are using ChromeOS.");
} else {
    console.log("Unknown operating system. Please proceed with caution.");
}
