"use strict";
//不要删掉上面这行
//passiveGeneration返回的数是普通的数，不用加Decimal/Decimal/PowiainaNum，因为超过1e308之后照样炸
addLayer("AC", {
    name: "ach",
    symbol: "Ac",
    startData() {
        return {
            unlocked: true,
            points: n(0),
        }
    },
    color: "#ffdd33",
    resource: "成就",
    row: "side",
    devSpeedCal() {
        let dev = n(1)
        //if(isEndgame())dev=n(0)
        return dev
    },
    effectDescription() {
        return "使点数获取x" + format(tmp.AC.ach1)
    },
    ach1() {
        return n(1.025).pow(player.AC.points)
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "复制器可以复制一切",
            done() { return hasUpgrade('l1', 12) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: "解锁复制器。",
            textStyle: { 'color': '#FFDD33' },
        },
        12: {
            name: "来世再见",
            done() { return player.l2.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: "进行一次转生重置。",
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)
addLayer("l1", {
    infoboxes: {
        introBox: {
            title: "一人做一层 1 Dev 1 Layer",
            body() { return "欢迎游玩游戏，本游戏特色为每一层都是一个人制作而成，且每15层不会出现相同的作者，这意味着你可以玩到很多不同的风格<br>本层由 aCwAtLe308 制作！<br>欢迎加交流群：657445803" },
        },
    },
    tabFormat: {
        "主页": {
            content: [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
            ],
        },
        "复制器": {
            content: [
                "main-display", "blank",
                ["display-text", function () { return "<h3>你有" + format(n(2).pow(player.l1.repl)) + "复制器 (x" + format(n(2).pow(tmp.l1.replGain)) + "/s)</h3>" + (player.l1.repl.gte(10) ? "<br><p style=\"color:yellow;\">由于复制器溢出，你的复制器增长被开" + format(tmp.l1.replBaseGain.div(tmp.l1.replGain)) + "次根！" : "") + (player.l1.repl.gte(5e5) ? "<br><p style=\"color:orange;\">由于复制器溢出^2，你的复制器增长更慢了！" : "") }],
                "blank",
                ["display-text", function () { return "<h4>复制器效果: </h4>"; }],
                "blank",
                ["display-text", function () { return hasUpgrade('l1', 12) ? "1. 点数获取x" + format(tmp.l1.replEff1) : ""; }],
                ["display-text", function () { return hasUpgrade('l1', 14) ? "2. 数据获取x" + format(tmp.l1.replEff2) : ""; }],
                ["display-text", function () { return hasUpgrade('l2', 13) ? "3. 复制器溢出开始延后x" + format(tmp.l1.replEff3) : ""; }],
            ],
            unlocked() { return hasUpgrade('l1', 12) }
        },
    },
    name: "第一层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "\\/", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            repl: new Decimal(0),
            resetTime:0,
        }
    },
    doReset(resettingLayer){
        let keep=[]
        if(hasMilestone("l2",2)) keep.push("repl")
        if(hasMilestone("l2",5)) keep.push("points")
        if (layers[resettingLayer].row > this.row) layerDataReset("l1", keep)
    },
    color: "#FFFFFF",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "数据", // Name of prestige currency
    baseResource: "点数", // Name of resource prestige is based on
    baseAmount() { return player.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 3, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if (hasUpgrade('l1', 13)) mult = mult.mul(upgradeEffect('l1', 13))
        if (hasUpgrade("l1", 21)) mult = mult.mul(upgradeEffect("l1", 21))
        mult = mult.mul(tmp.l1.replEff2)
        if (hasUpgrade("l2", 11)) mult = mult.mul(upgradeEffect("l2", 11))
        if (hasUpgrade("l2", 12)) mult = mult.mul(upgradeEffect("l2", 12))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        if(hasMilestone("l2",4)) mult = 0.2
        if(hasMilestone("l2",5)) mult = 2
        return mult
    },
    replBaseGain() {
        let a = n(1)
        a = a.times(buyableEffect("l2",11)[0])
        if(hasUpgrade("l2",51)) a=a.times(2)
        return a
    },
    newRepl(diff) {
        let a = player.l1.repl;
        let st = 10
        st = Decimal.pow(2,st).times(tmp.l1.replEff3).log2()
        if (a.gte(5e5)) a = a.div(5e5).pow(1/0.1);
        if (a.gte(st)) a = a.div(st).pow(1/0.8).mul(st);
        a = a.add(tmp.l1.replBaseGain.mul(diff))
        if (a.gte(st)) a = a.div(st).pow(0.8).mul(st)
        if (a.gte(5e5)) a = a.div(5e5).pow(0.1).mul(5e5)
        return a
    },
    replGain() {
        let a = layers.l1.newRepl(1).sub(player.l1.repl);
        return a
    },
    replEff1() {
        if (!hasUpgrade('l1', 12)) return n(1)
        let a = player.l1.repl.pow(0.65).add(1)
        if (hasUpgrade("l2",31)) a = player.l1.repl.pow(a).add(1).ln().pow(1.5).add(1)
        if (a.gte(1e5)) a = a.div(1e5).pow(0.35).mul(1e5)
        return a
    },
    replEff2() {
        if (!hasUpgrade('l1', 14)) return n(1)
        let a = player.l1.repl.div(50).max(1).pow(1.35).add(1)
        if (hasUpgrade("l2",15)) a = a.pow(upgradeEffect("l2",15))
        if (a.gte(100)) a = a.div(100).pow(0.55).mul(100)
        if (a.gte(1e7)) a = a.div(1e7).pow(0.35).mul(1e7)
        return a
    },
    replEff3(){
        if (!hasUpgrade("l2", 13)) return n(1)
        let a = Decimal.pow(100,player.l1.repl.div(40)).add(1)
        if (a.gte(1e20)) a = a.div(1e10).pow(0.75).mul(1e20)
        if (a.gte(1e80)) a = a.div(1e20).pow(0.5).mul(1e80)
        return a
    },
    update(diff) {
        if (hasUpgrade('l1', 12)) player.l1.repl = layers.l1.newRepl(diff);
        player.l1.resetTime += ((1/4)*diff)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        { key: "1", description: "1：进行第一层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
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
                if (!hasUpgrade('l1', 11)) return n(1)
                let eff = player.l1.points.add(1).pow(0.5).add(1)
                if (eff.gte(100)) eff = eff.div(100).pow(0.5).mul(100)
                if (eff.gte(1e66)) eff = eff.div(1e66).pow(0.125).mul(1e66)
                if (hasUpgrade("l2",14)) eff = eff.pow(3)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        12: {
            title: "或许完全不同？",
            description: "解锁复制器。",
            cost: new Decimal(8),
            unlocked() { return hasUpgrade('l1', 11) },
        },
        13: {
            title: "又来了",
            description: "点数增加数据获取。",
            effect() {
                if (!hasUpgrade('l1', 13)) return n(1)
                let eff = player.points.add(1).pow(0.15).add(1)
                if (eff.gte(100) && (!hasUpgrade("l2",41))) eff = eff.div(100).pow(0.3).mul(100)
                if (eff.gte(1e13)) eff = eff.div(1e13).pow(0.125).mul(1e13)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(150),
            unlocked() { return hasUpgrade('l1', 12) },
        },
        14: {
            title: "时间墙是这样的",
            description: "解锁复制器的第二个效果（大约1e15复制器开始）。",
            cost: new Decimal(700),
            unlocked() { return hasUpgrade('l1', 13) },
        },
        15: {
            title: "就这内容吗？",
            description: "点数增加点数获取。",
            effect() {
                if (!hasUpgrade('l1', 15)) return n(1)
                let eff = player.points.add(1).pow(0.24).add(1)
                if (eff.gte(1e4) && !hasUpgrade("l2",42)) eff = eff.div(1e4).pow(0.5).mul(1e4)
                if (eff.gte(1e32)) eff = eff.div(1e32).pow(0.16).mul(1e32)
                if (eff.gte(1e200)) eff = n(10).pow(eff.log10().div(200).pow(0.15).mul(100))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(5000),
            unlocked() { return hasUpgrade('l1', 14) },
        },
        16: {
            title: "另一个世界",
            description: "解锁下一层。",
            cost: new Decimal(2e4),
            unlocked() { return hasUpgrade('l1', 15) },
        },
        21: {
            title: "递归",
            description: "数据增强自身获取",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(1)
                let b = upgradeEffect("l1",22).add(0.2)
                let eff = player.l1.points.add(1).pow(b)
                if(eff.gte(1e10)) eff = eff.div(1e10).pow(0.1).times(1e10)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(2e11),
            unlocked() { return hasUpgrade('l2', 21) },
        },
        22: {
            title: "递归递归",
            description: "数据增强上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let b = upgradeEffect("l1",23).add(0.3)
                let eff = player.l1.points.add(1).pow(b).log10().div(100)
                if(eff.gte(0.2)) eff = eff.minus(0.2).div(3).pow(1.1).add(0.2)
                eff = eff.min(0.5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e23),
            unlocked() { return hasUpgrade('l2', 21) },
        },
        23: {
            title: "递归递归递归",
            description: "数据增强上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let eff = player.l1.points.add(1).pow(0.1).log10().div(50)
                if(eff.gte(0.2)) eff = eff.minus(0.2).div(5).pow(1.1).add(0.2)
                eff = eff.min(0.5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e38),
            unlocked() { return hasUpgrade('l2', 21) },
        },
        24: {
            title: "递归递归递归递归",
            description: "本行第一个升级以更弱(^0.05)的效果对转生点数有效",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(1)
                let  b = upgradeEffect("l1",25).add(0.05)
                let eff = upgradeEffect("l1",21).pow(b)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1e50),
            unlocked() { return hasUpgrade('l2', 21) },
        },
        25: {
            title: "递归递归递归递归递归",
            description: "基于数据加成上一个升级的指数",
            effect() {
                if (!hasUpgrade('l1', this.id)) return n(0)
                let eff = player.l1.points.add(1).ln().add(1).ln().pow(2).div(600).min(0.3)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()); return a; },
            cost: new Decimal(1e80),
            unlocked() { return hasUpgrade('l2', 21) },
        },
    },
    layerShown() { return true },
    autoUpgrade() { return hasMilestone("l2",1) },
    resetsNothing() {return hasMilestone("l2",3) },
}),
addLayer("l2", {
    infoboxes: {
        introBox: {
            title: "欢迎来到第二层",
            body() { return "本层由 UserIncremental 制作！<br>欢迎加交流群：657445803" },
        },
    },
    tabFormat: {
        "主页": {
            content: [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () { return `核心增益I: 复制器获取变为^${format(buyableEffect("l2",11)[0],3)}` }],
                ["display-text", function () { return hasUpgrade("l2",23) ? `核心增益II: 转生点数获取x${format(buyableEffect("l2",11)[1])}` : ``}],
                "blank",
                "buyables",
                "blank",
                ["upgrades",[1,2,3]],
            ],
        },
        "里程碑": {
            content: [
                "main-display", "blank",
                "milestones"
            ],
        },
        "增幅器": {
            content: [
                "main-display", "blank",
                ["display-text", function () { return `注意你一般只能购买一行中的一个增幅器!` }],
                "blank",
                "clickables",
                "blank",
                ["upgrades",[4,5,6]]
            ],
        },
    },
    name: "第二层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            total: new Decimal(0),
        }
    },
    color: "#ff00c3",
    requires: new Decimal(1e4), // Can be a function that takes requirement increases into account
    resource: "转生点数", // Name of prestige currency
    baseResource: "数据", // Name of resource prestige is based on
    baseAmount() { return player.l1.points }, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1 / 6, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
        if(hasUpgrade("l2",23)) mult = mult.times(buyableEffect("l2",11)[1])
        if(hasUpgrade("l1",24)) mult = mult.times(upgradeEffect("l1",24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        return mult
    },
    replBaseGain() {
        let a = n(1)
        return a
    },
    update(diff) {
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches:['l1'],
    hotkeys: [
        { key: "2", description: "2：进行第二层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
        0: {
            requirementDescription: "1 总转生点数",
            effectDescription: "解锁核心, 点数获取x2",
            done() { return player.l2.points.gte(1) },
        },
        1: {
            requirementDescription: "4 总转生点数",
            effectDescription: "自动购买数据升级",
            done() { return player.l2.total.gte(4) },
        },
        2: {
            requirementDescription: "30 总转生点数",
            effectDescription: "转生不重置复制器",
            done() { return player.l2.total.gte(30) },
        },
        3: {
            requirementDescription: "5000 总转生点数",
            effectDescription: "数据不重置任何东西",
            done() { return player.l2.total.gte(5000) },
        },
        4: {
            requirementDescription: "1e9 总转生点数",
            effectDescription: "每秒自动获取20%重置可获得的数据",
            done() { return player.l2.total.gte(1e9) },
        },
        5: {
            requirementDescription: "5e13 总转生点数",
            effectDescription: "转生不再重置数据, 上一个里程碑的效果x10",
            done() { return player.l2.total.gte(5e13) },
        },
    },
    upgrades: {
        11: {
            title: "艰难的抉择",
            description: "基于转生时间增加数据获取,1000s达到硬上限",
            effect() {
                if (!hasUpgrade('l2', 11)) return n(1)
                let eff = n(player.l1.resetTime).min(1000).add(1).pow(0.1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        12: {
            title: "内存升级",
            description: "基于总转生点数提升数据获取",
            effect() {
                if (!hasUpgrade('l2', 12)) return n(1)
                let eff = Decimal.pow(4,player.l2.total.add(1).log10())
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("l2",11) },
        },
        13: {
            title: "协同加成",
            description: "解锁复制器的第三个效果",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("l2",12) },
        },
        14: {
            title: "永无止境的起点",
            description: "第一个数据升级的效果变为^3",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("l2",13) },
        },
        15: {
            title: "转生复制器",
            description: "第二个复制器效果在软上限之前基于转生点数变强",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("l2",14) },
            effect() {
                if (!hasUpgrade('l2', 15)) return n(1)
                let eff = player.l2.points.add(1).log10().pow(2).div(2).add(1)
                if (eff.gte(3)) eff = eff.div(3).pow(0.33).times(3)
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        21: {
            title: "更好的数据强度",
            description: "解锁更多数据升级",
            cost: new Decimal(88),
            unlocked() { return hasUpgrade("l2",15) },
        },
        22: {
            title: "又来这一套",
            description: "基于点数增强转生点数获取",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade("l2",21) },
             effect() {
                if (!hasUpgrade('l2',this.id)) return n(1)
                let eff = player.points.add(1).log10().pow(0.2).add(1)
                if (hasUpgrade("l2",52)) eff = eff.times(upgradeEffect("l2",52))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        23: {
            title: "紧密核心",
            description: "解锁第二个核心增益",
            cost: new Decimal(1e4),
            unlocked() { return hasUpgrade("l2",22) },
        },
        24: {
            title: "超立方",
            description: "点数获取^1.1",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade("l2",23) },
        },
        25: {
            title: "更加艰难的抉择",
            description: "解锁转生增幅器",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade("l2",24) },
        },
        31: {
            title: "限制突破",
            description: "第一个复制器效果使用更好的公式",
            cost: new Decimal(5e13),
            unlocked() { return hasUpgrade("l2",25) },
        },
        32: {
            title: "致密核心",
            description: "解锁第三行增幅器",
            cost: new Decimal(1e18),
            unlocked() { return hasUpgrade("l2",31) },
        },
        33: {
            title: "更远之境",
            description: "解锁下一层",
            cost: new Decimal(1e20),
            unlocked() { return hasUpgrade("l2",32) },
        },
        41: {
            title: "增幅器I-A",
            description: "移除第三个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() {return !hasUpgrade("l2",42) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[41].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",41)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",41)) cc = "#000000"
                return cc
            }}
        },
        42: {
            title: "增幅器I-B",
            description: "移除第五个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() {return !hasUpgrade("l2",41) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[42].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",42)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",42)) cc = "#000000"
                return cc
            }}
        },
        51: {
            title: "增幅器II-A",
            description: "复制器获取^2",
            cost: new Decimal(1e12),
            canAfford() {return !hasUpgrade("l2",52) && !hasUpgrade("l2",53) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[51].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",51)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",51)) cc = "#000000"
                return cc
            }}
        },
        52: {
            title: "增幅器II-B",
            description: "第二行第二个转生升级基于点数变得更好",
            cost: new Decimal(1e12),
            canAfford() {return !hasUpgrade("l2",51) && !hasUpgrade("l2",53) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[52].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",52)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",52)) cc = "#000000"
                return cc
            }},
            effect() {
                if (!hasUpgrade('l2',this.id)) return n(1)
                let eff = player.points.add(1).ln().pow(0.1).add(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        53: {
            title: "增幅器II-C",
            description: "核心更便宜(^0.9)",
            cost: new Decimal(1e12),
            canAfford() {return !hasUpgrade("l2",51) && !hasUpgrade("l2",52) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[53].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",53)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",53)) cc = "#000000"
                return cc
            }},
        },
        61: {
            title: "增幅器III-A",
            description: "基于转生点数加强核心增益I",
            cost: new Decimal(1e17),
            canAfford() {return !hasUpgrade("l2",62) && !hasUpgrade("l2",63) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[61].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",61)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",61)) cc = "#000000"
                return cc
            }},
            effect() {
                if (!hasUpgrade('l2',this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().pow(0.5).div(3)
                if(eff.gte(5)) eff = eff.minus(5).div(10).add(5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        62: {
            title: "增幅器III-B",
            description: "基于转生点数加强核心增益II",
            cost: new Decimal(1e17),
            canAfford() {return !hasUpgrade("l2",61) && !hasUpgrade("l2",63) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[62].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",62)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",62)) cc = "#000000"
                return cc
            }},
            effect() {
                if (!hasUpgrade('l2',this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().div(7)
                if(eff.gte(10)) eff = eff.minus(10).div(25).add(10)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        63: {
            title: "增幅器III-C",
            description: "基于点数,核心变得更便宜",
            cost: new Decimal(1e17),
            canAfford() {return !hasUpgrade("l2",61) && !hasUpgrade("l2",62) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[63].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",63)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",63)) cc = "#000000"
                return cc
            }},
            effect() {
                if (!hasUpgrade('l2',this.id)) return n(1)
                let eff = player.points.add(1).pow(2).log10().add(1)
                if(eff.gte(1e20)) eff = eff.div(1e20).pow(0.25).add(1).times(1e20)
                return eff
            },
            effectDisplay() { let a = "/" + format(this.effect()); return a; },
        },
    },
    clickables:{
        31:{
            display(){return `重置转生增幅器设置(这将使得你的复制器^0.5,并重置点数和转生点数!)`},
            style:{"height":"30px","width":"500px","background-color":"#ff00c333","border-radius":"0%","border":"2px solid","border-color":"#ff00c3","color":"#ff00c3","text-shadow":"0 0 15px #ff00c3","font-size":"15px"},
            unlocked(){return hasUpgrade("l2",25)},
            onClick(){
                player.l2.upgrades = player.l2.upgrades.filter(n => n<36)//重置编号大于36的升级
                player.l2.points = n(0)
                player.l1.repl = player.l1.repl.times(0.5)
                player.points = n(0)
            },
            canClick(){return true}
        },
    },
    buyables:{
         11:{
            title(){return `核心等级${formatWhole(getBuyableAmount("l2",11))}`},
            cost(x) {
                 let ct = Decimal.pow(2,x.pow(2)).div(x.add(1)).div(upgradeEffect("l2",63)).max(1)
                 if (hasUpgrade("l2",53)) ct = ct.pow(0.9)
                 return ct
            },
            effect(x) {
                let eff1 = Decimal.pow(x.add(upgradeEffect("l2",61)).pow(0.2).add(1),x.add(upgradeEffect("l2",61)).times(0.25))
                let eff2 = Decimal.pow(5,x.add(upgradeEffect("l2",62)).pow(0.6)).max(1)
                return [eff1,eff2]
            },
            display() { return `花费: ${format(this.cost())} 转生点数` },
            canAfford() { return player.l2.points.gte(this.cost()) },
            buy(){
                if(!tmp.l2.buyables[11].canAfford) return
                player.l2.points = player.l2.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return hasMilestone("l2",0)},
            style:{"height":"150px","width":"350px","font-size":"12.5px","border-color":"#ff00c3","border-radius":"2%","color":"#ff00c3","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.buyables[11].canAfford) bg="#ff00c333"
                return bg
            }}
        },
    },
    layerShown() { return true },
    autoUpgrade() { return false }
})

