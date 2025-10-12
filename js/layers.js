addLayer("AC", {
    name: "ach",
    symbol: "Ac",
    startData() {
        return {
            unlocked: true,
            points:n(0),
        }
    },
    color: "#ffdd33",
    resource: "成就",
    row: "side",
    update(diff) {
        player.devSpeed = layers.AC.devSpeedCal()
    },
    devSpeedCal() {
        let dev = n(1)
        //if(isEndgame())dev=n(0)
        return dev
    },
    effectDescription() {
        return "使点数获取x"+format(tmp.AC.ach1)
    },
    ach1(){
        return n(1.025).pow(player.AC.points)
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "一个成就",
            done() { return false },
            onComplete(){player.AC.points=player.AC.points.add(1)},
            tooltip: "这是一个成就",
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)
addLayer("l1", {
  infoboxes: {
 introBox: {
  title: "一人做一层 1 Dev 1 Layer",
  body(){return "欢迎游玩游戏，本游戏特色为每一层都是一个人制作而成，且每15层不会出现相同的作者，这意味着你可以玩到很多不同的风格<br>本层由 [author] 制作！<br>欢迎加交流群：657445803"},
        },
},
tabFormat: {
   "主页": {
        content: [ ["infobox","introBox"],
   "main-display",
    "prestige-button",
    "resource-display",
    "upgrades",
],
    },
    },
    name: "第一层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TBD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
    }},
    color: "#FFFFFF",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "TBD", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(true)mult=mult.mul(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        mult = n(0)
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "1", description: "1：进行第一层重置", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones: {
        0: {
            requirementDescription: "",
            effectDescription: "",
            done() { return false },
        },
    },
    upgrades: {
        11: {
            title: "TBD",
            description: "TBD",
            effect() {
                let eff = n(2)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1e309),
            unlocked() {return true },
        },
    },
    layerShown(){return true}
})
addLayer("l2", {
  infoboxes: {
 introBox: {
  title: "第二层",
  body(){return "本层由 [author] 制作！<br>欢迎加交流群：657445803"},
        },
},
tabFormat: {
   "主页": {
        content: [ ["infobox","introBox"],
   "main-display",
    "prestige-button",
    "resource-display",
    "upgrades",
],
    },
    },
    name: "第二层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TBD", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new ExpantaNum(0),
        }
    },
    color: "#00FFFF",

    requires: function () {
        let a = new ExpantaNum(1e309)
        return a
    }, // Can be a function that takes requirement increases into account
    resource: "TBD", // Name of prestige currency
    baseResource: "TBD", // Name of resource prestige is based on
    baseAmount() { return player.l1.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        mult = n(0)
        return mult
    },
    effectDescription() {
        return "TBD"
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "2", description: "2：进行第二层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    upgrades: {
    },
    layerShown() { return hasUpgrade('l1',11)||player.l2.unlocked }
})
