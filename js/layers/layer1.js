
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
            resetTime: 0,
        }
    },
    sPExp() {
        let base = n(0);
        if (hasUpgrade('l3', 33)) base = base.add(upgradeEffect('l3', 33));
        return base;
    },
    doReset(resettingLayer) {
        let keep = []
        if (hasMilestone("l2", 2)) keep.push("repl")
        if (hasMilestone("l2", 5)) keep.push("points")
        if (hasMilestone("l4", 5)) keep.push("upgrades")
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
        if (hasUpgrade('l3', 12)) mult = mult.mul(upgradeEffect('l3', 12));
        if (hasMilestone('l4', 1)) mult = mult.mul(layers.l4.total_bars().add(1));
        if (hasUpgrade('l4', 22)) mult = mult.mul(upgradeEffect('l4', 22));
        if (hasUpgrade('l4', 16)) mult = mult.mul(buyableEffect('l4', 31));
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        let base = new Decimal(1);
        if (hasUpgrade('l3', 43)) base = base.mul(upgradeEffect('l3', 43));
        if (inChallenge("l5", 12)) base = base.mul(0.1)
        return base;
    },
    passiveGeneration() {
        let mult = 0
        if (hasMilestone("l2", 4)) mult = 0.2
        if (hasMilestone("l2", 5)) mult = 2
        if (hasMilestone("l4", 3)) mult = 1000
        return mult
    },
    replBaseGain() {
        let a = n(1)
        a = a.times(buyableEffect("l2", 11)[0])
        if (hasUpgrade("l2", 51)) a = a.times(2)
        if (hasUpgrade('l3', 21)) a = a.mul(upgradeEffect('l3', 21));
        if (hasUpgrade('l3', 54)) a = a.mul(2);
        if (hasUpgrade('l4', 46)) a = a.mul(buyableEffect('l4', 41));
        if (hasUpgrade('l4', 62)) a = a.mul(upgradeEffect('l4', 62));
        return a
    },
    newRepl(diff) {
        if (inChallenge('l5', 11)) return n(0)
        let a = player.l1.repl;
        let st = n(10), str = n(1 / 0.8);
        st = Decimal.pow(2, st).times(tmp.l1.replEff3).log2();
        if (hasUpgrade('l3', 22)) st = st.mul(upgradeEffect('l3', 22));
        if (hasUpgrade('l3', 23)) str = str.pow(upgradeEffect('l3', 23));
        let str2 = n(1 / 0.1);
        if (hasUpgrade('l3', 72)) str2 = str2.pow(upgradeEffect('l3', 72));

        if (hasMilestone("l4", 4)) {
            if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4', 29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).pow(str2).mul(layers.l1.replEff3().log2().add(5e5));
        } else {
            if (a.gte(5e5)) a = a.div(5e5).pow(str2).mul(5e5);
            if (a.gte(st)) a = a.div(st).pow(str).mul(st);
        }
        //挑战效果在软上限前面
        if (inChallenge('l3', 11)) a = Decimal.pow(10, a.add(10).log10().root(layers.l3.challenges[11].dPower())).sub(10);
        a = a.add(tmp.l1.replBaseGain.mul(diff))
        if (inChallenge('l3', 11)) a = Decimal.pow(10, a.add(10).log10().pow(layers.l3.challenges[11].dPower())).sub(10);
        if (hasMilestone("l4", 4)) {
            if (a.gte(layers.l1.replEff3().log2().add(5e5)) && !hasMilestone('l4', 29)) a = a.div(layers.l1.replEff3().log2().add(5e5)).root(str2).mul(layers.l1.replEff3().log2().add(5e5));
        } else {
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
        if (hasUpgrade('l4', 34)) {
            let a = player.l1.repl.pow(0.6).add(1).pow(hasUpgrade('l2', 71) ? upgradeEffect('l2', 71) : 1);
            if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
            return a;
        }
        let a = player.l1.repl.pow(0.65).add(1)
        if (hasUpgrade("l2", 31)) a = player.l1.repl.pow(a).add(1).ln().pow(1.5).add(1)
        a = a.min(1e50)
        if (hasUpgrade('l2', 71)) a = a.pow(upgradeEffect('l2', 71));
        if (a.gte(1e5)) a = a.div(1e5).pow(0.35).mul(1e5)
        if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        return a
    },
    replEff2() {
        if (!hasUpgrade('l1', 14)) return n(1)
        let a = player.l1.repl.div(50).max(1).pow(1.35).add(1)
        if (hasUpgrade("l2", 15)) a = a.pow(upgradeEffect("l2", 15))
        if (a.gte(100)) a = a.div(100).pow(0.55).mul(100)
        if (a.gte(1e7)) a = a.div(1e7).pow(0.35).mul(1e7)
        if (a.gte(1e100)) a = a.log10().div(100).pow(0.65).mul(100).pow_base(10);
        if (a.gte('1e500')) a = a.pow(0.1).mul('1e450')
        return a
    },
    replEff3() {
        if (!hasUpgrade("l2", 13)) return n(1)
        if (hasMilestone("l4", 4)) {
            return Decimal.pow(2, player.l1.repl.div(1000));
        }
        let a = Decimal.pow(100, player.l1.repl.div(40)).add(1)
        if (a.gte(1e20)) a = a.div(1e10).pow(0.75).mul(1e20)
        if (a.gte(1e80)) a = a.div(1e20).pow(0.5).mul(1e80)
        return a
    },
    replEff4() {
        if (!hasMilestone("l4", 2)) return n(1)
        let a = player.l1.repl.add(1).pow(0.5);
        return a
    },
    replEff5() {
        if (!hasMilestone("l4", 25)) return n(1)
        let a = player.l1.repl.add(10).log10();
        return a
    },
    update(diff) {
        if (hasUpgrade('l1', 12)) player.l1.repl = layers.l1.newRepl(diff);
        player.l1.resetTime += ((1 / 4) * diff)
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
                if (eff.gte(100) && !hasUpgrade("l4", 64)) eff = eff.div(100).pow(0.5).mul(100)
                if (eff.gte(1e66)) eff = eff.div(1e66).pow(0.125).mul(1e66)
                if (eff.gte('1e333')) eff = eff.div('1e333').pow(0.6).mul('1e333')
                if (hasUpgrade("l2", 14)) eff = eff.pow(3)
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
                if (eff.gte(100) && (!hasUpgrade("l2", 41))) eff = eff.div(100).pow(0.3).mul(100)
                if (eff.gte(1e13)) eff = eff.div(1e13).pow(hasUpgrade("l5", 21)? 0.25 : 0.125).mul(1e13)
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
                if (eff.gte(1e4) && !hasUpgrade("l2", 42)) eff = eff.div(1e4).pow(0.5).mul(1e4)
                if (eff.gte(1e32) && !hasUpgrade("l4", 42)) eff = eff.div(1e32).pow(0.16).mul(1e32)
                eff = eff.softcap('1e4000', 0.25)
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
                let b = upgradeEffect("l1", 22).add(0.2)
                let eff = player.l1.points.add(1).pow(b)
                if (hasUpgrade("l4", 31)) {
                    if (eff.gte('1e500') && !hasUpgrade("l1", 16)) eff = eff.pow(0.5).mul(1e250)
                    if (eff.gte('1e1500')) eff = eff.pow(0.1).mul('1e1350')
                } else {
                    if (eff.gte(1e10)) eff = eff.div(1e10).pow(0.1).times(1e10)
                    if (eff.gte(1e250)) eff = eff.pow(0.1).mul(1e225)
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
                let b = upgradeEffect("l1", 23).add(0.3)
                let eff = player.l1.points.add(1).pow(b).log10().div(100)
                if (eff.gte(0.2)) eff = eff.minus(0.2).div(3).pow(1.1).add(0.2)
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
                if (eff.gte(0.2)) eff = eff.minus(0.2).div(5).pow(1.1).add(0.2)
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
                let b = upgradeEffect("l1", 25).add(0.05)
                let eff = upgradeEffect("l1", 21).pow(b)
                if (eff.gte(1e50)) eff = eff.div(1e50).pow(hasUpgrade("l1", 26) ? 0.1 : 0.01).times(1e50)
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
                let eff = player.l1.points.add(1).ln().add(1).ln().pow(2).div(600)
                if (hasUpgrade('l5', 14)) eff = eff.add(player.l1.points.add(1).log10().div(150000)).min(0.3)
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
    autoUpgrade() { return hasMilestone("l2", 1) || (player.l3.total.gte(1) && player.l2.points.gte(tmp.l3.ptsEff3)); },
    resetsNothing() { return hasMilestone("l2", 3) },
    softcap() { if (hasUpgrade("l4", 31) && hasUpgrade("l4", 32)) return new Decimal("F9e15"); return new Decimal("1e3500"); },
    softcapPower() { return new Decimal(0.2); },
})