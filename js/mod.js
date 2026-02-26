let modInfo = {
	name: "一人做一层 One Dev One Layer",
	id: "1dev1layer-QUFB",
	author: "1 Dev 1 Layer Team",
	pointsName: "点数",
	discordName: "加入我们的QQ群",
	discordLink: "https://qm.qq.com/q/ViamMhqpqk",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
	modFiles: ["layers.js", "layers/layer4.js", "tree.js"]
}

// Set your version in num and name
let VERSION = {
	num: "1",
	name: "第一层级",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>v1</h3><br>
		- 新增了？个层级<br>
		- 终局：0点数`

let winText = `3`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]
function n(x) {
	return new Decimal(x)
}
function getStartPoints(){
	let sPExp = layers['l1'].sPExp();
	if(sPExp.gt(0)) return player.points.pow(sPExp);
    return new Decimal(modInfo.initialStartPoints);
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	gain=gain.mul(tmp.AC.ach1)
	if(hasUpgrade('l1',11))gain=gain.mul(upgradeEffect('l1',11))
	gain=gain.mul(tmp.l1.replEff1)
	if(hasUpgrade('l1',15))gain=gain.mul(upgradeEffect('l1',15))

		if(hasMilestone('l4', 0)) gain=gain.mul(layers.l4.total_bars().add(1));

	if(hasMilestone('l2',0)) gain = gain.mul(2)
	
	gain = gain.mul(tmp.l3.ptsEff1);
	if(hasUpgrade('l3', 11)) gain = gain.mul(upgradeEffect('l3', 11));
    
	if(hasUpgrade('l4', 21)) gain = gain.mul(upgradeEffect('l4', 21));
	if(hasUpgrade('l4', 36)) gain = gain.mul(buyableEffect('l4', 33));
	if(hasUpgrade('l4', 61)) gain = gain.mul(layers.l2.coreEffect5());

	if(hasUpgrade("l2",24)) gain = gain.pow(1.1)
	if(hasUpgrade('l3', 44)) gain = gain.pow(upgradeEffect('l3', 44));
	if(hasUpgrade('l3', 65)) gain = gain.pow(tmp.l3.singEff1);
	
	if(inChallenge('l3', 11)) gain = Decimal.pow(10,gain.add(10).log10().pow(layers.l3.challenges[11].dPower()));
	// 挑战效果在软上限前面
    
    if(gain.gte('1e3500') && !(hasUpgrade("l4",42) && hasUpgrade("l4",43)))gain = gain.pow(0.2).mul('1e2800')
    
    return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!
var backgroundStyle = {

}


// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(86400) // Default is 1 day which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}