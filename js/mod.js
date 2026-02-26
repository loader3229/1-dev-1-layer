let modInfo = {
	name: "一人做一层 One Dev One Layer",
	id: "1dev1layer-QUFB",
	author: "1 Dev 1 Layer Team",
	pointsName: "点数",
	discordName: "加入我们的QQ群",
	discordLink: "https://qm.qq.com/q/ViamMhqpqk",
	initialStartPoints: new Decimal (0), // Used for hard resets and new players
	
	offlineLimit: 168,  // In hours
	modFiles: ["layers/layer1.js","layers/layer2.js", "layers/layer3.js", "layers/layer4.js", "layers/layer5.js", "layers/achievements.js", "tree.js"]
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

//e后数字开根
function expRoot(num, root) {
    return n(10).pow(num.max(1).log10().add(1).root(root).sub(1))
}

//e后数字乘方
function expPow(num, pow) {
    return n(10).pow(num.max(1).log10().add(1).pow(pow).sub(1))
}

//软上限
function Softcap(num, start, power, mode = 0, dis) {
    let x = n(num)
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).pow(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).mul(power).add(start)
        if ([2, "exp"].includes(mode)) x = expPow(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = x.div(start).log(power).add(1).mul(start)
    }
    return x
}

//反向软上限
function anti_softcap(num, start, power, mode = 0, dis) {
    let x = num
    start = n(start)
    if (x.gte(start) && !dis) {
        if ([0, "pow"].includes(mode)) x = x.div(start).max(1).root(power).mul(start)
        if ([1, "mul"].includes(mode)) x = x.sub(start).div(power).add(start)
        if ([2, "exp"].includes(mode)) x = expRoot(x.div(start), power).mul(start)
        if ([3, "log"].includes(mode)) x = Decimal.pow(power, x.div(start).sub(1)).mul(start)
    }
    return x
}

//溢出软上限
function overflow(num, start, power, meta = 1) {
    if (isNaN(num.mag)) return new Decimal(0)
    start = n(start)
    if (num.gt(start)) {
        if (meta == 1) {
            let s = start.log10()
            num = num.log10().div(s).pow(power).mul(s).pow10()
        } else {
            let s = start.iteratedlog(10, meta)
            num = Decimal.iteratedexp(10, meta, num.iteratedlog(10, meta).div(s).pow(power).mul(s));
        }
    }
    return num;
}

//Decimal类的软上限
Decimal.prototype.softcap = function (start, power, mode, dis) {
    return Softcap(this, start, power, mode, dis)
}
Decimal.prototype.anti_softcap = function (start, power, mode, dis) {
    return anti_softcap(this, start, power, mode, dis)
}
Decimal.prototype.overflow = function (start, power, meta) {
    return overflow(this, start, power, meta)
}


//计算溢出软上限效果
function calcOverflow(x,y,s,height=1) { return x.gte(s) ? height === 1 ? x.max(1).log10().div(y.max(1).log10()) : x.max(1).iteratedlog(10,height).div(y.max(1).iteratedlog(10,height)) : n(1) }