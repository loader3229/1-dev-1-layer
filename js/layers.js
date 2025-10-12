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
            name: "复制器可以复制一切",
            done() { return hasUpgrade('l1',12) },
            onComplete(){player.AC.points=player.AC.points.add(1)},
            tooltip: "解锁复制器。",
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)
addLayer("l1", {
  infoboxes: {
 introBox: {
  title: "一人做一层 1 Dev 1 Layer",
  body(){return "欢迎游玩游戏，本游戏特色为每一层都是一个人制作而成，且每15层不会出现相同的作者，这意味着你可以玩到很多不同的风格<br>本层由 aCwAtLe308 制作！<br>欢迎加交流群：657445803"},
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
   "复制器": {
        content: [
   "main-display","blank",
    ["display-text",function(){return "<h3>你有"+format(n(2).pow(player.l1.repl))+"复制器 (x"+format(n(2).pow(tmp.l1.replGain))+"/s)</h3>"+(player.l1.repl.gte(10)?"<br><p style=\"color:yellow;\">由于复制器溢出，你的复制器增长被开"+format(tmp.l1.replBaseGain.div(tmp.l1.replGain))+"次根！":"")+(player.l1.repl.gte(1e5)?"<br><p style=\"color:orange;\">由于复制器溢出^2，你的复制器增长更慢了！":"")}],
    "blank",
    ["display-text",function(){return "<h4>复制器效果: </h4>";}],
    "blank",
    ["display-text",function(){return hasUpgrade('l1',12)?"1. 点数获取x"+format(tmp.l1.replEff1):"";}],
    ["display-text",function(){return hasUpgrade('l1',14)?"2. 数据获取x"+format(tmp.l1.replEff2):"";}],
],
unlocked(){return hasUpgrade('l1',12)}
    },
    },
    name: "第一层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "\\/", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new ExpantaNum(0),
        repl: new ExpantaNum(0),
    }},
    color: "#FFFFFF",
    requires: new ExpantaNum(10), // Can be a function that takes requirement increases into account
    resource: "数据", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1/3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new ExpantaNum(1)
        if(hasUpgrade('l1',13))mult=mult.mul(upgradeEffect('l1',13))
        mult=mult.mul(tmp.l1.replEff2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new ExpantaNum(1)
    },
    passiveGeneration() {
        mult = n(0)
        return mult
    },
    replBaseGain(){
        let a=n(1)
        return a
    },
    replGain(){
        let a=tmp.l1.replBaseGain
        if(player.l1.repl.gte(10))a=a.mul(player.l1.repl.div(10).pow(-0.8))
        if(player.l1.repl.gte(1e5))a=a.mul(player.l1.repl.div(1e5).pow(-2))
        return a
    },
    replEff1(){
        if(!hasUpgrade('l1',12))return n(1)
        let a=player.l1.repl.pow(0.65).add(1)
        if(a.gte(1e5))a=a.div(1e5).pow(0.35).mul(1e5)
        return a
    },
    replEff2(){
        if(!hasUpgrade('l1',14))return n(1)
        let a=player.l1.repl.div(50).max(1).pow(1.35).add(1)
        if(a.gte(100))a=a.div(100).pow(0.55).mul(100)
        if(a.gte(1e7))a=a.div(1e7).pow(0.35).mul(1e7)
        return a
    },
    update(diff){
        if(hasUpgrade('l1',12))player.l1.repl=player.l1.repl.add(tmp.l1.replGain.mul(diff).min(tmp.l1.replGain))
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
            title: "重复了无数遍的开始",
            description: "数据增加点数获取。",
            effect() {
                if(!hasUpgrade('l1',11))return n(1)
                let eff = player.l1.points.add(1).pow(0.5).add(1)
                if(eff.gte(100))eff=eff.div(100).pow(0.5).mul(100)
                if(eff.gte(1e66))eff=eff.div(1e66).pow(0.125).mul(1e66)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(1),
            unlocked() {return true },
        },
        12: {
            title: "或许完全不同？",
            description: "解锁复制器。",
            cost: new ExpantaNum(8),
            unlocked() {return hasUpgrade('l1',11) },
        },
        13: {
            title: "又来了",
            description: "点数增加数据获取。",
            effect() {
                if(!hasUpgrade('l1',13))return n(1)
                let eff = player.points.add(1).pow(0.15).add(1)
                if(eff.gte(100))eff=eff.div(100).pow(0.3).mul(100)
                if(eff.gte(1e13))eff=eff.div(1e13).pow(0.125).mul(1e13)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(150),
            unlocked() {return hasUpgrade('l1',12) },
        },
        14: {
            title: "时间墙是这样的",
            description: "解锁复制器的第二个效果（大约1e15复制器开始）。",
            cost: new ExpantaNum(700),
            unlocked() {return hasUpgrade('l1',13) },
        },
        15: {
            title: "就这内容吗？",
            description: "点数增加点数获取。",
            effect() {
                if(!hasUpgrade('l1',15))return n(1)
                let eff = player.points.add(1).pow(0.24).add(1)
                if(eff.gte(1e4))eff=eff.div(1e4).pow(0.5).mul(1e4)
                if(eff.gte(1e32))eff=eff.div(1e32).pow(0.16).mul(1e32)
                if(eff.gte(1e200))eff=n(10).pow(eff.log10().div(200).pow(0.15).mul(100))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect());return a; },
            cost: new ExpantaNum(5000),
            unlocked() {return hasUpgrade('l1',14) },
        },
        16: {
            title: "另一个世界",
            description: "解锁下一层。",
            cost: new ExpantaNum(2e4),
            unlocked() {return hasUpgrade('l1',15) },
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
    branches:['l1'],
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
    layerShown() { return hasUpgrade('l1',16)||player.l2.unlocked }
})
