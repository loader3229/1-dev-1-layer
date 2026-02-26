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
		13: {
			name: '无违引力',
			done() { return player.l3.points.gt(0) },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '进行一次致密重置。',
			textStyle: { 'color': '#FFDD33' },
		},
		14: {
			name: '最后的压缩',
			done() { return player.l3.sing.gt(0) },
			onComplete() { player.AC.points = player.AC.points.add(1) },
			tooltip: '获得奇点。',
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
                ["display-text", function () { return hasMilestone('l4', 2) ? "4. 对loader3229造成的伤害x" + format(tmp.l1.replEff4) : ""; }],
                ["display-text", function () { return hasMilestone('l4', 25) ? "5. 奇点获取x" + format(tmp.l1.replEff5) : ""; }],
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
	sPExp(){
		let base = n(0);
		if(hasUpgrade('l3', 33)) base = base.add(upgradeEffect('l3', 33));
		return base;
	},
    doReset(resettingLayer){
        let keep=[]
        if(hasMilestone("l2",2)) keep.push("repl")
        if(hasMilestone("l2",5)) keep.push("points")
        if(hasMilestone("l4",5)) keep.push("upgrades")
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
		if(hasUpgrade('l3', 12)) mult = mult.mul(upgradeEffect('l3', 12));
		if(hasMilestone('l4', 1)) mult = mult.mul(layers.l4.total_bars().add(1));
	if(hasUpgrade('l4', 22)) mult = mult.mul(upgradeEffect('l4', 22));
	if(hasUpgrade('l4', 16)) mult = mult.mul(buyableEffect('l4', 31));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let base = new Decimal(1);
		if(hasUpgrade('l3', 43)) base = base.mul(upgradeEffect('l3', 43));
		return base;
    },
    passiveGeneration() {
        let mult = 0
        if(hasMilestone("l2",4)) mult = 0.2
        if(hasMilestone("l2",5)) mult = 2
        if(hasMilestone("l4",3)) mult = 1000
        return mult
    },
    replBaseGain() {
        let a = n(1)
        a = a.times(buyableEffect("l2",11)[0])
        if(hasUpgrade("l2",51)) a=a.times(2)
		if(hasUpgrade('l3', 21)) a = a.mul(upgradeEffect('l3', 21));
		if(hasUpgrade('l3', 54)) a = a.mul(2);
	if(hasUpgrade('l4', 46)) a = a.mul(buyableEffect('l4', 41));
		if(hasUpgrade('l4', 62)) a = a.mul(upgradeEffect('l4', 62));
        return a
    },
    newRepl(diff) {
        let a = player.l1.repl;
        let st = n(10), str = n(1 / 0.8);
        st = Decimal.pow(2,st).times(tmp.l1.replEff3).log2();
		if(hasUpgrade('l3', 22)) st = st.mul(upgradeEffect('l3', 22));
		if(hasUpgrade('l3', 23)) str = str.pow(upgradeEffect('l3', 23));
		let str2 = n(1 / 0.1);
		if(hasUpgrade('l3', 72)) str2 = str2.pow(upgradeEffect('l3', 72));
	
	if(hasMilestone("l4",4)){
        	if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4',29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).pow(str2).mul(layers.l1.replEff3().log2().add(5e5));
	}else{
        	if (a.gte(5e5)) a = a.div(5e5).pow(str2).mul(5e5);
        	if (a.gte(st)) a = a.div(st).pow(str).mul(st);
	}
//挑战效果在软上限前面
	if (inChallenge('l3', 11)) a = Decimal.pow(10,a.add(10).log10().root(layers.l3.challenges[11].dPower())).sub(10);
        a = a.add(tmp.l1.replBaseGain.mul(diff))
	if (inChallenge('l3', 11)) a = Decimal.pow(10,a.add(10).log10().pow(layers.l3.challenges[11].dPower())).sub(10);

	if(hasMilestone("l4",4)){
        	if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4',29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).root(str2).mul(layers.l1.replEff3().log2().add(5e5));
	}else{
        	if (a.gte(st)) a = a.div(st).root(str).mul(st)
        	if (a.gte(5e5)) a = a.div(5e5).root(str2).mul(5e5)
	}

        return a
    },
    replGain() {
        let a = layers.l1.newRepl(1).sub(player.l1.repl);
        return a
    },
    replEff1() {
        if (!hasUpgrade('l1', 12)) return n(1)
        if(hasUpgrade('l4',34)){
            let a = player.l1.repl.pow(0.6).add(1).pow(hasUpgrade('l2', 71)?upgradeEffect('l2', 71):1);
		    if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
            return a;
        }
        let a = player.l1.repl.pow(0.65).add(1)
        if (hasUpgrade("l2",31)) a = player.l1.repl.pow(a).add(1).ln().pow(1.5).add(1)
        a = a.min(1e50)
		if(hasUpgrade('l2', 71)) a = a.pow(upgradeEffect('l2', 71));
        if (a.gte(1e5)) a = a.div(1e5).pow(0.35).mul(1e5)
		if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        return a
    },
    replEff2() {
        if (!hasUpgrade('l1', 14)) return n(1)
        let a = player.l1.repl.div(50).max(1).pow(1.35).add(1)
        if (hasUpgrade("l2",15)) a = a.pow(upgradeEffect("l2",15))
        if (a.gte(100)) a = a.div(100).pow(0.55).mul(100)
        if (a.gte(1e7)) a = a.div(1e7).pow(0.35).mul(1e7)
		if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        if (a.gte('1e500')) a = a.pow(0.1).mul('1e450')
        return a
    },
    replEff3(){
        if (!hasUpgrade("l2", 13)) return n(1)
	if(hasMilestone("l4",4)){
		return Decimal.pow(2,player.l1.repl.div(1000));
	}
        let a = Decimal.pow(100,player.l1.repl.div(40)).add(1)
        if (a.gte(1e20)) a = a.div(1e10).pow(0.75).mul(1e20)
        if (a.gte(1e80)) a = a.div(1e20).pow(0.5).mul(1e80)
        return a
    },
    replEff4(){
        if (!hasMilestone("l4", 2)) return n(1)
        let a = player.l1.repl.add(1).pow(Decimal.pow(0.5,player.l4.level));
        return a
    },
    replEff5(){
        if (!hasMilestone("l4", 25)) return n(1)
        let a = player.l1.repl.add(10).log10();
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
                if (eff.gte(100) && !hasUpgrade("l4",64)) eff = eff.div(100).pow(0.5).mul(100)
                if (eff.gte(1e66)) eff = eff.div(1e66).pow(0.125).mul(1e66)
                if (eff.gte('1e333')) eff = eff.div('1e333').pow(0.6).mul('1e333')
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
                if (eff.gte(1e32) && !hasUpgrade("l4",42)) eff = eff.div(1e32).pow(0.16).mul(1e32)
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
                if(hasUpgrade("l4",31)){
                    if(eff.gte('1e500') && !hasUpgrade("l1",16)) eff = eff.pow(0.5).mul(1e250)
                    if(eff.gte('1e1500')) eff = eff.pow(0.1).mul('1e1350')
                }else{
                    if(eff.gte(1e10)) eff = eff.div(1e10).pow(0.1).times(1e10)
                    if(eff.gte(1e250)) eff = eff.pow(0.1).mul(1e225)
                }
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
                if(eff.gte(1e50)) eff = eff.div(1e50).pow(hasUpgrade("l1",16)?0.1:0.01).times(1e50)
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
        26: {
            title: "递归递归递归递归递归递归",
            description: "本行第一个升级更好，本行第四个升级的第一软上限更弱",
            cost: new Decimal('1e3840'),
            unlocked() { return hasMilestone('l4', 19) },
        },
    },
    layerShown() { return true },
    autoUpgrade() { return hasMilestone("l2",1) || (player.l3.total.gte(1) && player.l2.points.gte(tmp.l3.ptsEff3)); },
    resetsNothing() {return hasMilestone("l2",3) },
    softcap(){ if(hasUpgrade("l4",31) && hasUpgrade("l4",32))return new Decimal("F9e15");return new Decimal("1e3500");},
    softcapPower(){ return new Decimal(0.2);},
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
                ["display-text", function () { return `核心增益I: 复制器获取变为^${format(buyableEffect("l2",11)[0],3)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2",12)[0])})` : ``) }],
                ["display-text", function () { return hasUpgrade("l2",23) ? `核心增益II: 转生点数获取x${format(buyableEffect("l2",11)[1])}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2",12)[1])})` : ``) : ``}],
                ["display-text", function () { return getBuyableAmount('l2', 12).gt(0) ? `核心增益III: 奇点获取x${format(buyableEffect("l2",12)[2])}` : ``}],
                ["display-text", function () { return hasMilestone('l4',20) ? `核心增益IV: 第5行增幅器的效果^${format(tmp.l2.coreEffect4)}` : ``}],
                ["display-text", function () { return hasUpgrade('l4',61) ? `核心增益V: 点数获取x${format(tmp.l2.coreEffect5)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(tmp.l2.coreEffect5b)})` : ``) : ``}],
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
                ["upgrades",[4,5,6,7,8]]
            ],unlocked(){return hasUpgrade('l2',25)}
        },
    },
    name: "第二层 制作：[author]", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            total: new Decimal(0),
        }
    },
	doReset(resettingLayer){
        let keep=[], km = [];
        if(player.l3.total.gte(1)) km.push(0);
        if(player.l3.total.gte(2)) km.push(1);
        if(player.l3.total.gte(8)) km.push(2);
        if(player.l3.total.gte(64)) km.push(3);
        if(player.l3.total.gte(1024)) km.push(4);
        if(player.l3.total.gte(32768)) km.push(5);
	if(hasMilestone("l4",6))keep.push("upgrades");
	if(hasMilestone("l4",14))keep.push("milestones");
        if (layers[resettingLayer].row > this.row) layerDataReset("l2", keep, km);
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
        if(hasUpgrade("l2",22)) mult = mult.times(upgradeEffect("l2",22))
        if(hasUpgrade("l2",23)) mult = mult.times(buyableEffect("l2",11)[1])
        if(hasUpgrade("l1",24)) mult = mult.times(upgradeEffect("l1",24))
		if(hasUpgrade('l3', 13)) mult = mult.mul(upgradeEffect('l3', 13));
		mult = mult.mul(tmp.l3.ptsEff2);
	if(hasUpgrade('l4', 23)) mult = mult.mul(upgradeEffect('l4', 23));
	if(hasUpgrade('l4', 26)) mult = mult.mul(buyableEffect('l4', 32));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
		if(hasUpgrade('l3', 63)) mult = 1;
		if(hasMilestone('l4', 7)) mult = 1e3;

        return mult
    },
    replBaseGain() {
        let a = n(1)
        return a
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches:['l1'],
    hotkeys: [
        { key: "2", description: "2：进行第二层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() {
        return hasUpgrade("l1",16) || player.l2.unlocked;
   },
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
            description() {
                if(hasUpgrade('l4',52))return "基于转生时间增加数据获取,1s达到硬上限"; if(hasUpgrade('l4',33))return "基于转生时间增加数据获取,10s达到硬上限"; return "基于转生时间增加数据获取,1000s达到硬上限"
            },
            effect() {
                if (!hasUpgrade('l2', 11)) return n(1)
                let eff = n(player.l1.resetTime).min(1000).add(1).pow(0.1)
                if(hasUpgrade('l4',33))eff = Decimal.pow(10,n(player.l1.resetTime).min(10).pow(1.5));
                if(hasUpgrade('l4',33))eff = Decimal.pow('1e100',n(player.l1.resetTime).min(1).pow(2));
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
                if(eff.gte('1e500'))eff = eff.pow(0.1).mul('1e450');
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
                if (hasUpgrade("l2",34)) eff = Decimal.pow(10,player.points.add(10).log10().root(2.5));
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
            cost: new Decimal(1e19),
            unlocked() { return hasUpgrade("l2",32) },
        },
        34: {
            title: "还来这一套",
        description: "转生升级“又来这一套”的效果更好。",
            cost: new Decimal('1e1200'),
            unlocked() { return hasMilestone("l4",20) },
        },
        35: {
            title: "增幅增幅",
        description: "增幅器III-A效果更好。",
            cost: new Decimal('1e1500'),
            unlocked() { return hasMilestone("l4",20) },
        },
        41: {
            title: "增幅器I-A",
            description: "移除第三个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() {return (!hasUpgrade("l2",42) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
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
            canAfford() {return (!hasUpgrade("l2",41) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
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
            canAfford() {return (!hasUpgrade("l2",52) && !hasUpgrade("l2",53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
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
            canAfford() {return (!hasUpgrade("l2",51) && !hasUpgrade("l2",53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
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
				if(hasUpgrade('l3', 52)) eff = eff.pow(upgradeEffect('l3', 52));
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        53: {
            title: "增幅器II-C",
            description: "核心更便宜(^0.9)",
            cost: new Decimal(1e12),
            canAfford() {return (!hasUpgrade("l2",51) && !hasUpgrade("l2",52) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",25) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
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
            canAfford() {return (!hasUpgrade("l2",62) && !hasUpgrade("l2",63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
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
                if(eff.gte(5) && !hasUpgrade("l2",35)) eff = eff.minus(5).div(10).add(5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        62: {
            title: "增幅器III-B",
            description: "基于转生点数加强核心增益II",
            cost: new Decimal(1e17),
            canAfford() {return (!hasUpgrade("l2",61) && !hasUpgrade("l2",63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
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
				if(hasUpgrade('l2', 72)) eff = eff.mul(upgradeEffect('l2', 72));
                if(eff.gte(10)) eff = eff.minus(10).div(5).add(10)
                eff = eff.min(50)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        63: {
            title: "增幅器III-C",
            description: "基于点数,核心变得更便宜",
            cost: new Decimal(1e17),
            canAfford() {return (!hasUpgrade("l2",61) && !hasUpgrade("l2",62) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2",32) },
			ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
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
				if(hasUpgrade('l3', 53)) eff = eff.pow(upgradeEffect('l3', 53));
                if(eff.gte(1e20)) eff = eff.div(1e20).pow(0.25).add(1).times(1e20)
                return eff
            },
            effectDisplay() { let a = "/" + format(this.effect()); return a; },
        },
        71: {
            title: "增幅器IV-A",
            description: "基于致密点数，复制器第一效果更强",
            cost: new Decimal(1e60),
            canAfford() {return (!hasUpgrade("l2",72) && !hasUpgrade("l2",73) && !hasUpgrade("l2",74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3",55) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[71].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",71)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",71)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = n(2);
				base = base.add(player.l3.points.root(4).div(4));
				if(base.gte(10)) base = base.log10().pow(0.5).pow_base(10);
				if(base.gte(20)) base = base.mul(5).log10().mul(10);
				return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        72: {
            title: "增幅器IV-B",
            description: "基于致密点数，增幅器III-B更强",
            cost: new Decimal(1e60),
            canAfford() {return (!hasUpgrade("l2",71) && !hasUpgrade("l2",73) && !hasUpgrade("l2",74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3",55) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[72].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",72)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",72)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = n(2);
				base = base.add(player.l3.points.add(1).log10().div(4));
				if(hasUpgrade('l3', 62)) base = base.mul(2);
                base = base.min(50)
				return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        73: {
            title: "增幅器IV-C",
            description: "复制器降低核心价格",
            cost: new Decimal(1e60),
            canAfford() {return (!hasUpgrade("l2",71) && !hasUpgrade("l2",72) && !hasUpgrade("l2",74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3",55) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[73].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",73)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",73)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = n(1);
				base = base.add(player.l1.repl.add(1).log10().div(20));
				if(base.gte(2)) base = base.div(2).log10().add(2);
				return base.pow(-1);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        74: {
            title: "增幅器IV-D",
            description: "基于核心等级和总转生点数提升致密点数获取",
            cost: new Decimal(1e60),
            canAfford() {return (!hasUpgrade("l2",71) && !hasUpgrade("l2",72) && !hasUpgrade("l2",73) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3",55) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[74].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",74)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",74)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = n(1);
				base = base.add(player.l2.total.add(1).log10().root(2).mul(getBuyableAmount('l2', 11).sub(18).max(0)).div(4));
				return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        81: {
            title: "增幅器V-A",
            description: "点数增加攻击力获取",
            cost: new Decimal('1e940'),
            canAfford() {return (!hasUpgrade("l2",82) && !hasUpgrade("l2",83)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4",17) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[81].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",81)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",81)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = Decimal.pow(1.01,player.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
				return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        82: {
            title: "增幅器V-B",
            description: "数据增加攻击力获取",
            cost: new Decimal('1e940'),
            canAfford() {return (!hasUpgrade("l2",81) && !hasUpgrade("l2",83)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4",17) },
			ignoreAutoUpgrade: () => true,
            style:{"border-color":"#ff00c3","border-radius":"0%","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.upgrades[82].canAfford) bg = "#ff00c333"
                if(hasUpgrade("l2",82)) bg = "#ff00c3"
                return bg
            },"color"(){
                let cc = "#ff00c3"
                if(hasUpgrade("l2",82)) cc = "#000000"
                return cc
            }},
            effect() {
				let base = Decimal.pow(1.01,player.l1.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
				return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
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
    coreEffect4(){
        if(!hasMilestone("l4",20))return new Decimal(1);
        let ret=player.l2.buyables[11].root(6);
        if(hasUpgrade("l4",51))ret = ret.mul(player.l2.buyables[12].root(4));
        ret = ret.add(1);
        return ret;
    },
    coreEffect5(){
        if(!hasUpgrade("l4",61))return new Decimal(1);
        let ret=Decimal.pow(10,player.l2.buyables[11]);
        ret = ret.pow(layers.l2.coreEffect5b());
        return ret;
    },
    coreEffect5b(){
        if(!hasUpgrade("l4",61))return new Decimal(1);
        let ret=player.l2.buyables[12].root(2).add(1);
        return ret;
    },
	corePointScale() {
		let p = player.l2.points;
		
				if(hasUpgrade('l3', 73)) p = p.root(upgradeEffect('l3', 73));
				if(hasUpgrade('l3', 65))  p = p.root(0.95);
		if(hasUpgrade('l2', 73)) p = p.root(upgradeEffect('l2', 73));
		if (hasUpgrade("l2",53)) p = p.root(0.9)
		if(hasUpgrade("l4",24)) p = p.mul(upgradeEffect("l4",24));
		if(hasUpgrade('l3', 24)) p = p.div(upgradeEffect('l3', 24));
		if(hasUpgrade("l2",63)) p = p.mul(upgradeEffect("l2",63));
		return p;
	},
	firstCoreScale() {
		let base = n(10);
		if(hasMilestone('l4', 18)) base = n(5);
		if(hasMilestone('l4', 22)) base = n(3);
		if(hasMilestone('l4', 24)) base = n(6).sub(layers.l4.total_bars().max(400).root(5).min(4));
		return base;
	},
    buyables:{
        11:{
            title(){return `核心等级${formatWhole(getBuyableAmount("l2",11))}`},
			
            cost(x) {
				if(x.gte(64)) x = x.div(64).pow(tmp.l2.firstCoreScale).mul(64);
				if(x.gte(20) && !hasUpgrade('l3', 64)) return n('1F9e15');
                let ct = Decimal.pow(2,x.pow(2)).div(x.add(1));
				if(hasUpgrade('l3', 64)) ct = Decimal.pow(1.75, x.pow(2));
				if(hasUpgrade("l2",63)) ct = ct.div(upgradeEffect("l2",63));
				if(hasUpgrade('l3',24)) ct = ct.mul(upgradeEffect('l3',24));
				if(hasUpgrade("l4",24)) ct = ct.div(upgradeEffect("l4",24));
                		if (hasUpgrade("l2",53)) ct = ct.pow(0.9)
				if(hasUpgrade('l2', 73)) ct = ct.pow(upgradeEffect('l2', 73));
				if(hasUpgrade('l3', 65)) ct = ct.pow(0.95);
				if(hasUpgrade('l3', 73)) ct = ct.pow(upgradeEffect('l3', 73));
                return ct;
            },
            effect(x) {
                let eff1 = Decimal.pow(x.add(upgradeEffect("l2",61)).pow(0.2).add(1),x.add(upgradeEffect("l2",61)).times(0.25))
				eff1 = eff1.pow(buyableEffect("l2",12)[0]);
				//if(eff1.gte(100000)) eff1 = eff1.div(100000).pow(0.25).mul(100000);
                let eff2 = Decimal.pow(5,x.add(upgradeEffect("l2",62)).pow(0.6)).max(1)
				eff2 = eff2.pow(buyableEffect("l2",12)[1]);
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
		12:{
            title(){return (inChallenge('l3', 11) ? '已保存' : '') + `二阶核心等级${formatWhole(getBuyableAmount("l2",12))}`},
			
            cost(x) {
				let ct = n(2).pow(x.mul(0.1).add(5.0001));
                return ct.floor();
            },
            effect(x) {
                let eff1 = x.div(2).add(1).pow(0.5);
				//if(eff1.gte(5)) eff1 = eff1.div(5).root(3).mul(5);
				if(hasMilestone('l3', 3)) eff1 = eff1.pow(1.25);
				let eff2 = x.mul(1.5).add(1);
				if(eff2.gte(10)) eff2 = eff2.div(10).root(2).mul(10);
				let eff3 = x.add(1);
                if(hasUpgrade('l4',41))eff3 = x.mul(player.l2.buyables[11].root(2)).add(1);
				if(hasMilestone('l3', 2)) eff3 = eff3.pow(1.5);
				if(hasUpgrade('l3', 74)) eff3 = eff3.pow(1.25);
                return [eff1, eff2, eff3]
            },
            display() { return inChallenge('l3', 11) ? '' : `需求: ${format(this.cost(), 0)} 核心等级` },
            canAfford() { return getBuyableAmount('l2', 11).gte(this.cost()) && !inChallenge('l3', 11) },
            buy(){
                if(!tmp.l2.buyables[12].canAfford) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return hasMilestone("l3",0)},
            style:{"height":"150px","width":"350px","font-size":"12.5px","border-color":"#ffaae3","border-radius":"2%","color":"#ffaae3","background-color"(){
                let bg = "#00000000"
                if(tmp.l2.buyables[12].canAfford) bg="#ffaae333"
                return bg
            }}
        },
    },
    update(diff) {
		if(hasUpgrade('l3', 64)) //注意：原本的核心价格公式无法逆向计算，因此必须有这个升级才能自动核心
		{
			let ncl = tmp.l2.corePointScale.max(1).log(1.75).root(2);
			if(ncl.gte(64)) ncl = ncl.div(64).root(tmp.l2.firstCoreScale).mul(64);
ncl = ncl.add(1).floor();
			setBuyableAmount('l2', 11, getBuyableAmount('l2', 11).max(ncl));
		}
    },
    autoUpgrade() { return (player.l3.total.gte(1) && player.l2.total.gte(tmp.l3.ptsEff3)) }
})
addLayer("l3", {
    infoboxes: {
        introBox: {
            title: "Layer 3",
            body() { return "本层由 Seanxlx 制作。" },
        },
    },
    name: "第三层 制作：Seanxlx",
	symbol: "D",
	position: 0,
	startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            total: new Decimal(0),
			bhUnlocked: false,
			sing: n(0),
			storedSecondCore: n(0),
        }
    },
    color: "#00d2e0",
    requires: new Decimal(1e19),
	resource: "致密点数",
	baseResource: "转生点数",
	baseAmount() { return player.l2.points },
	type: "normal",
	exponent: 1 / 10,
	gainMult() {
		let mult = new Decimal(1)
		if(hasUpgrade('l3', 14)) mult = mult.mul(upgradeEffect('l3', 14));
		if(hasUpgrade('l2', 74)) mult = mult.mul(upgradeEffect('l2', 74));
		if(hasUpgrade('l4', 13)) mult = mult.mul(upgradeEffect('l4', 13));
		if(hasUpgrade('l4', 14)) mult = mult.mul(upgradeEffect('l4', 14));
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
		if(hasMilestone('l4', 9)) mult = 1;
        return mult
    },
	ptsEff1() {
		let base = n(1);
		base = base.add(player.l3.total.mul(2).root(2));
		if(hasUpgrade('l3', 34)) base = base.pow(upgradeEffect('l3', 34));
		return base;
	},
	ptsEff2() {
		let base = n(1);
		base = base.add(player.l3.total.mul(5).root(5));
		if(hasUpgrade('l3', 41)) base = base.pow(upgradeEffect('l3', 41));
		return base;
	},
	ptsEff3() {
		let base = n(1000);
		base = base.div(n(1).add(player.l3.total.mul(100).root(2))).sub(1).max(0);
		return base;
	},
	ptsEff4() {
		if(player.l3.total.gte(32768)) return 6;
		if(player.l3.total.gte(1024)) return 5;
		if(player.l3.total.gte(64)) return 4;
		if(player.l3.total.gte(8)) return 3;
		if(player.l3.total.gte(2)) return 2;
		if(player.l3.total.gte(1)) return 1;
		return 0;
	},
	singEff1() {
		let base = n(1);
		base = base.add(player.l3.sing.max(1).mul(10).ln().pow(3).root(2).div(1000)).min(1.2);
		return base;
	},
	singEff2() {
		let base = player.l3.sing.div(1e10).add(1).root(5);
        if(hasMilestone("l4",30))base = player.l3.sing.add(1).root(4);
		return base;
	},
	singAvail() {
		let base = n(0);
		if(!inChallenge('l3', 11)) return base;
		base = base.add(player.points.pow(0.6).div(100));
		base = base.mul(layers.l3.singMult());
		return base.floor();
	},
	singMult() {
		let mult = n(1);
		mult = mult.mul(buyableEffect("l2",12)[2]);
		if(hasUpgrade('l3', 71)) mult = mult.mul(3);
		if(hasMilestone('l4', 13)) mult = mult.mul(hasMilestone('l4',27)?layers.l4.total_bars().add(1):hasMilestone('l4',17)?layers.l4.total_bars().div(50).add(1):layers.l4.total_bars().add(1).root(5));
		if(hasUpgrade('l4', 11)) mult = mult.mul(upgradeEffect('l4', 11));
		if(hasUpgrade('l4', 53)) mult = mult.mul(upgradeEffect('l4', 53));
		if(hasMilestone('l4', 25)) mult = mult.mul(layers.l1.replEff5());
		if(hasUpgrade('l4', 56)) mult = mult.mul(buyableEffect('l4', 42));
		return mult;
	},
    update(diff) {
		if(getBuyableAmount('l2', 11).gte(32) && hasUpgrade('l3', 65)) player.l3.bhUnlocked = true;
		player.l3.storedSecondCore = player.l3.storedSecondCore.max(getBuyableAmount('l2', 12));
		if(inChallenge('l3', 11) || hasMilestone('l3', 3)) setBuyableAmount('l2', 12, player.l3.storedSecondCore);
    },
    row: 2,
	branches:['l2'],
    hotkeys: [
        { key: "3", description: "3：进行第三层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    milestones: {
		0: {
            requirementDescription: "20 奇点",
            effectDescription: "解锁二阶核心(压缩奇点时，会保留最高二阶核心数量但无法购买二阶核心)",
            done() { return player.l3.sing.gte(20) },
        },
		1: {
            requirementDescription: "100 奇点",
            effectDescription: "解锁更多升级",
            done() { return player.l3.sing.gte(100) },
		},
		2: {
            requirementDescription: "2000 奇点",
            effectDescription: "二阶核心的第三效果增强(^1.5)",
            done() { return player.l3.sing.gte(2000) },
		},
		3: {
            requirementDescription: "200000 奇点",
            effectDescription: "二阶核心不被重置，且第一效果增强(^1.25)",
            done() { return player.l3.sing.gte(200000) },
		},
    },
    upgrades: {
        11: {
            title: "你曾从这里开始",
            description: "基于致密点数，提升点数产量",
            effect() {
				let base = n(8);
				base = base.add(player.l3.points.sub(1).max(0).root(1.5));
				if(hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        12: {
            title: "你曾在这里经过",
            description: "基于致密点数，提升数据产量",
            effect() {
				let base = n(6);
				base = base.add(player.l3.points.sub(1).max(0).root(2));
				if(hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        13: {
            title: "你曾于这里驻足",
            description: "基于致密点数，提升转生点数产量",
            effect() {
				let base = n(4);
				base = base.add(player.l3.points.sub(1).max(0).root(8));
				if(hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        14: {
            title: "你再次回到这里",
            description: "基于致密点数，提升致密点数产量",
            effect() {
				let base = n(2);
				base = base.add(player.l3.points.sub(1).max(0).root(15));
				if(hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return true },
        },
        15: {
            title: "略有小成",
            description: "解锁下一行升级（价格为2）",
            cost: new Decimal(1),
            unlocked() { return true },
        },
        21: {
            title: "让生命蓬勃生长",
            description: "基于致密点数，提升复制器速度",
            effect() {
				let base = n(1.5);
				base = base.add(player.l3.points.sub(1).max(0).root(10));
				if(hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('l3', 15) },
        },
        22: {
            title: "让死亡放慢脚步",
            description: "基于致密点数，延迟复制器第一次溢出",
            effect() {
				let base = n(2);
				base = base.add(player.l3.points.sub(1).max(0).root(7.5));
				if(hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('l3', 15) },
        },
        23: {
            title: "让时间冲刷伤痕",
            description: "基于致密点数，弱化复制器第一次溢出",
            effect() {
				let base = n(1.25);
				base = base.add(player.l3.points.sub(1).max(0).root(10).div(5));
				if(hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
                return base.pow(-1);
            },
            effectDisplay() { let a = "/" + format(this.effect().pow(-1)); return a; },
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('l3', 15) },
        },
        24: {
            title: "让空间压缩能量",
            description: "基于致密点数，降低核心价格",
            effect() {
				let base = n(2);
				base = base.add(player.l3.points.sub(1).max(0).root(5));
				if(hasUpgrade('l4', 54)) base = player.l3.points.add(2);
				if(hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
                return base.pow(-1);
            },
            effectDisplay() { let a = "/" + format(this.effect().pow(-1)); return a; },
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('l3', 15) },
        },
        25: {
            title: "略有大成",
            description: "解锁下一行升级（价格为5）",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade('l3', 15) },
        },
        31: {
            title: "回望往事",
            description: "基于致密点数，提升第一行前四个升级的效果",
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10()).root(4);
                if(hasMilestone("l4",26)&&base.gte(2)){
                    return base.log2().div(5).add(1.8).min(2.5);
                }
                return base.min(2);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('l3', 25) },
        },
        32: {
            title: "驻足现在",
            description: "基于致密点数，提升第二行前四个升级的效果",
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10()).root(6);
                return base.min(1.5);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('l3', 25) },
        },
        33: {
            title: "重聚之地",
            description: "基于致密点数，在重置中保留一定量点数",
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10()).div(10);
                return base.min(1);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('l3', 25) },
        },
        34: {
            title: "收入囊中",
            description: "基于致密点数，提升致密点数总量第一效果",
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10().root(1.5));
                return base.add(1).min(10);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('l3', 25) },
        },
        35: {
            title: "青出于蓝",
            description: "解锁下一行升级（基础价格为16，价格乘数1.5）",
            cost: new Decimal(5),
            unlocked() { return hasUpgrade('l3', 25) },
        },
        41: {
            title: "轮回武装",
            description: "基于转生点数，提升致密点数总量第二效果",
            effect() {
				let base = n(1);
				base = base.add(player.l2.points.max(1).log10().root(1.5).div(10));
				if(base.gte(2)) base = base.div(2).root(3).mul(2);
				if(base.gte(10)) base = base.log10().root(2).pow_base(10);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
				let base = new Decimal(16);
				for(let i = 41;i <= 45;i++)
					if(hasUpgrade('l3', i)) base = base.mul(1.5);
				return base.floor();
			},
            unlocked() { return hasUpgrade('l3', 35) },
        },
        42: {
            title: "结构重载I",
            description: "你可以同时购买第一行2个增幅器，并自动化",
            cost() {
				let base = new Decimal(16);
				for(let i = 41;i <= 45;i++)
					if(hasUpgrade('l3', i)) base = base.mul(1.5);
				return base.floor();
			},

            unlocked() { return hasUpgrade('l3', 35) },
        },
        43: {
            title: "尘埃回荡",
            description: "基于致密点数，提升数据产量",
            effect() {
                if(hasUpgrade("l4",31))return new Decimal(1);
                let base = n(1);
				base = base.add(player.l3.points.max(1).log10().root(1.5).div(10));
                base = base.min(1.5);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
				let base = new Decimal(16);
				for(let i = 41;i <= 45;i++)
					if(hasUpgrade('l3', i)) base = base.mul(1.5);
				return base.floor();
			},

            unlocked() { return hasUpgrade('l3', 35) },
        },
        44: {
            title: "两面突击",
            description: "基于致密点数，提升点数产量",
            effect() {
                if(hasUpgrade("l4",42))return new Decimal(1);
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10().root(1.5).div(20));
                                                 base = base.min(1.25);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
				let base = new Decimal(16);
				for(let i = 41;i <= 45;i++)
					if(hasUpgrade('l3', i)) base = base.mul(1.5);
				return base.floor();
			},

            unlocked() { return hasUpgrade('l3', 35) },
        },
        45: {
            title: "炉火纯青",
            description: "解锁下一行升级（基础价格为1e5，价格乘数3）",
            cost() {
				let base = new Decimal(16);
				for(let i = 41;i <= 45;i++)
					if(hasUpgrade('l3', i)) base = base.mul(1.5);
				return base.floor();
			},

            unlocked() { return hasUpgrade('l3', 35) },
        },
        51: {
            title: "结构重载II",
            description: "你可以同时购买第二行3个增幅器，并自动化",
            cost() {
				let base = new Decimal(1e5);
				for(let i = 51;i <= 55;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            unlocked() { return hasUpgrade('l3', 45) },
        },
        52: {
            title: "核心重组I",
            description: "基于致密点数，核心增益II-B更强",
            cost() {
				let base = new Decimal(1e5);
				for(let i = 51;i <= 55;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10().root(2));
                return base.min(10);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        53: {
            title: "核心重组II",
            description: "基于致密点数，核心增益III-C更强",
            cost() {
				let base = new Decimal(1e5);
				for(let i = 51;i <= 55;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            effect() {
				let base = n(1);
				base = base.add(player.l3.points.max(1).log10().mul(2).root(3));
                return base.min(10);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        54: {
            title: "急迫增生",
            description: "复制器获取速度^2",
            cost() {
				let base = new Decimal(1e5);
				for(let i = 51;i <= 55;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            unlocked() { return hasUpgrade('l3', 45) },
        },
        55: {
            title: "神乎其技",
            description: "解锁下一行升级和第四行增幅器",
            cost() {
				let base = new Decimal(1e5);
				for(let i = 51;i <= 55;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            unlocked() { return hasUpgrade('l3', 45) },
        },
        61: {
            title: "结构重载III",
            description: "你可以同时购买第三行3个增幅器，并自动化",
            cost() {
				let base = new Decimal(1e7);
				for(let i = 61;i <= 65;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},
            unlocked() { return hasUpgrade('l3', 55) },
        },
        62: {
            title: "核心重组III",
            description: "核心增益IV-B更强（x2）",
            cost() {
				let base = new Decimal(1e7);
				for(let i = 61;i <= 65;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},

            unlocked() { return hasUpgrade('l3', 55) },
        },
        63: {
            title: "自我增生",
            description: "每秒自动获取100%重置可获得的转生点数",
            cost() {
				let base = new Decimal(1e7);
				for(let i = 61;i <= 65;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},

            unlocked() { return hasUpgrade('l3', 55) },
        },
        64: {
            title: "核心进化",
            description: "改善核心价格公式，并自动购买核心",
            cost() {
				let base = new Decimal(1e7);
				for(let i = 61;i <= 65;i++)
					if(hasUpgrade('l3', i)) base = base.mul(3);
				return base;
			},

            unlocked() { return hasUpgrade('l3', 55) },
        },
        65: {
            title: "无懈可击",
            description: "核心等级的价格^0.95。并且在32核心等级，解锁黑洞压缩",
            cost: new Decimal(1e16),
            unlocked() { return hasUpgrade('l3', 55) },
        },
        71: {
            title: "黑洞衍变",
            description: "奇点获取速度x3",
            cost: new Decimal(200),
            unlocked() { return hasMilestone('l3', 1) },
			currencyDisplayName: '奇点',
			currencyInternalName: 'sing',
			currencyLayer: 'l3',
        },
        72: {
            title: "打破籓篱",
            description: "基于奇点，弱化复制器第二次溢出的效果",
            cost: new Decimal(10000),
            effect() {
				let base = n(1);
				base = base.add(player.l3.sing.max(1).root(10).div(10));
                return base.pow(-1).max(0.1);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 71) },
			currencyDisplayName: '奇点',
			currencyInternalName: 'sing',
			currencyLayer: 'l3',
        },
        73: {
            title: "核心共振",
            description: "基于超过7的最高二阶核心等级，减少核心的价格",
            cost: new Decimal(15000),
            effect() {
				let base = n(1);
				base = Decimal.pow(0.975,player.l3.storedSecondCore.sub(7).max(0).root(1.5));
                return base.max(0.5);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 72) },
			currencyDisplayName: '奇点',
			currencyInternalName: 'sing',
			currencyLayer: 'l3',
        },
        74: {
            title: "再次升华",
            description: "二阶核心的第三效果增强(^1.25)",
            cost: new Decimal(20000),
            unlocked() { return hasUpgrade('l3', 73) },
			currencyDisplayName: '奇点',
			currencyInternalName: 'sing',
			currencyLayer: 'l3',
        },
        75: {
            title: "步入门扉",
            description: "解锁下一层",
            cost: new Decimal(50000),
            unlocked() { return hasUpgrade('l3', 74) },
			currencyDisplayName: '奇点',
			currencyInternalName: 'sing',
			currencyLayer: 'l3',
        },
    },
	challenges: {
		11: {
			name: "奇点压缩",
			completionLimit: 1,
			challengeDescription() {return (inChallenge('l3', 11) ? ('将压缩的奇点：<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + formatWhole(tmp.l3.singAvail) + '</h2><br/>') : '') + "点数获取量的指数和复制器数量的指数的指数^"+format(layers.l3.challenges[11].dPower())},
			unlocked() { return hasUpgrade('l3', 65); },
			canComplete() {
				return false;
			},
			goal() {
				return player.l3.sing.add(1).div(layers.l3.singMult()).mul(100).pow(1/0.6);
			},
			rewardDescription: "基于挑战内的点数获得奇点",
			onComplete() {
			},
			onEnter() {
				player.points = n(0);
				player.l1.points = n(0);
				player.l1.repl = n(0);
			},
			onExit() {
				player.l3.sing = player.l3.sing.max(tmp.l3.singAvail);
			},
			style()
			{
				return {'border-color': 'silver', 'background-color': 'black', 'color': 'white', 'background-image': 'radial-gradient(circle at center, black, silver)', 'box-shadow': inChallenge('l3', 11) ? '0px 0px 24px silver' : ''};
			},
            dPower() {
                if(hasUpgrade("l4",44))return 0.3;
                return 0.25;
            },
		},
	},
    tabFormat: {
        "主页": {
            content: [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", '致密点数总量效果：'],
                ["display-text", function () { return "1. 点数获取x<h2 style='color: white'>" + format(tmp.l3.ptsEff1) + '</h2>'; }],
                ["display-text", function () { return "2. 转生点数获取x<h2 style='color: #ff00c3'>" + format(tmp.l3.ptsEff2) + '</h2>'; }],
                ["display-text", function () { return "3. 在<h2 style='color: #ff00c3'>" + format(tmp.l3.ptsEff3) + '</h2>转生点数后获得自动购买数据和转生升级'; }],
                ["display-text", function () { return "4. 保留<h2 style='color: #ff00c3'>" + tmp.l3.ptsEff4 + '</h2>个转生里程碑'; }],
                ["upgrades",[1, 2, 3, 4, 5, 6]],
            ],
        },
		"黑洞压缩": {
			content: [
				"main-display",
				"prestige-button",
				"resource-display",
				"blank",
				["display-text", function () { return '你压缩了<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + formatWhole(player.l3.sing) + '</h2>个奇点'; }],
				["display-text", function () { return '奇点让点数获取^<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + format(tmp.l3.singEff1,4) + '</h2>'}],
				["display-text", function () { if(!hasMilestone('l4',28))return ''; return '奇点让攻击力获取x<h2 style="color: #FF9911;">' + format(tmp.l3.singEff2) + '</h2>'}],
				["challenges",[1]],
				["upgrades",[7]],
				["milestones",[0, 1, 2, 3]],
			],
			unlocked() {
				return player.l3.bhUnlocked;
			},
			buttonStyle(){return {'border-color': 'silver', 'color': 'silver', 'box-shadow': '0px 0px 12px silver'};},
		},
    },
    layerShown() { return hasUpgrade('l2', 33) || player.l3.total.gt(0) || player.l4.unlocked },
    autoUpgrade() { return false },
doReset(resettingLayer){
        let keep=[];
	if(hasMilestone("l4",12))keep.push("upgrades");
	if(hasMilestone("l4",14))keep.push("milestones");
	if(hasUpgrade("l4",11))keep.push("sing");
    if(hasMilestone("l4",15))keep.push("storedSecondCore");
        if (layers[resettingLayer].row > this.row) layerDataReset("l3", keep);
    },
})
