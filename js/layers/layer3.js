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
    requires: () => inChallenge('l5', 22) ? new Decimal(1/0) : new Decimal(1e19),
    resource: "致密点数",
    baseResource: "转生点数",
    baseAmount() { return player.l2.points },
    type: "normal",
    exponent: 1 / 10,
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade('l3', 14)) mult = mult.mul(upgradeEffect('l3', 14));
        if (hasUpgrade('l2', 74)) mult = mult.mul(upgradeEffect('l2', 74));
        if (hasUpgrade('l4', 13)) mult = mult.mul(upgradeEffect('l4', 13));
        if (hasUpgrade('l4', 14)) mult = mult.mul(upgradeEffect('l4', 14));
        if (hasUpgrade('l5', 12)) mult = mult.mul(upgradeEffect('l5', 12));
        mult = mult.mul(layers.l5.challenges[22].effect())
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        if (hasMilestone('l4', 9)) mult = 1;
        return mult
    },
    ptsEff1() {
        let base = n(1);
        base = base.add(player.l3.total.mul(2).root(2));
        if (hasUpgrade('l3', 34)) base = base.pow(upgradeEffect('l3', 34));
        return base.softcap('1e2000', 0.25);
    },
    ptsEff2() {
        let base = n(1);
        base = base.add(player.l3.total.mul(5).root(5));
        if (hasUpgrade('l3', 41)) base = base.pow(upgradeEffect('l3', 41));
        return base.softcap('1e500', 0.5);
    },
    ptsEff3() {
        let base = n(1000);
        base = base.div(n(1).add(player.l3.total.mul(100).root(2))).sub(1).max(0);
        return base;
    },
    ptsEff4() {
        if (player.l3.total.gte(32768)) return 6;
        if (player.l3.total.gte(1024)) return 5;
        if (player.l3.total.gte(64)) return 4;
        if (player.l3.total.gte(8)) return 3;
        if (player.l3.total.gte(2)) return 2;
        if (player.l3.total.gte(1)) return 1;
        return 0;
    },
    ptsEff5() {
        if (!hasUpgrade('l5', 32)) return new Decimal(1)
        let base = player.l3.points.max(1).log10().mul(0.04).add(1).pow(2)
        return base;
    },
    singEff1() {
        let base = n(1);
        base = base.add(player.l3.sing.max(0.1).mul(10).ln().pow(3).root(2).div(1000)).min(1.2);
        return base;
    },
    singEff2() {
        let base = player.l3.sing.div(1e10).add(1).root(5);
        if (hasMilestone("l4", 30)) base = player.l3.sing.add(1).root(4);
        return base;
    },
    singAvail() {
        let base = n(0);
        if (hasUpgrade('l5', 22) && !inChallenge('l3', 11)) {
            base = base.add(expPow(player.points, layers.l3.challenges[11].dPower()).pow(0.6).div(100))
            base = base.mul(layers.l3.singMult());
            return base.floor();
        }
        if (!inChallenge('l3', 11)) return base;
        if (inChallenge('l3', 11)) {
            base = base.add(player.points.pow(0.6).div(100));
            base = base.mul(layers.l3.singMult());
            return base.floor();
        }
    },
    singMult() {
        let mult = n(1);
        mult = mult.mul(buyableEffect("l2", 12)[2]);
        if (hasUpgrade('l3', 71)) mult = mult.mul(3);
        if (hasMilestone('l4', 13)) mult = mult.mul(hasMilestone('l4', 27) ? layers.l4.total_bars().add(1) : hasMilestone('l4', 17) ? layers.l4.total_bars().div(50).add(1) : layers.l4.total_bars().add(1).root(5));
        if (hasUpgrade('l4', 11)) mult = mult.mul(upgradeEffect('l4', 11));
        if (hasUpgrade('l4', 53)) mult = mult.mul(upgradeEffect('l4', 53));
        if (hasUpgrade('l4', 74)) mult = mult.mul(upgradeEffect('l4', 74));
        if (hasMilestone('l4', 25)) mult = mult.mul(layers.l1.replEff5());
        if (hasUpgrade('l4', 56)) mult = mult.mul(buyableEffect('l4', 42));
        mult = mult.mul(layers.l5.challenges[12].effect())
        return mult;
    },
    update(diff) {
        if (getBuyableAmount('l2', 11).gte(32) && hasUpgrade('l3', 65)) player.l3.bhUnlocked = true;
        player.l3.storedSecondCore = player.l3.storedSecondCore.max(getBuyableAmount('l2', 12));
        if (inChallenge('l3', 11) || hasMilestone('l3', 3)) setBuyableAmount('l2', 12, player.l3.storedSecondCore);
        if (hasUpgrade('l5', 22)) {
            player.l3.sing = player.l3.sing.max(tmp.l3.singAvail);
        }
    },
    row: 2,
    branches: ['l2'],
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
                if (hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
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
                if (hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
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
                if (hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
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
                if (hasUpgrade('l3', 31)) base = base.pow(upgradeEffect('l3', 31));
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
                if (hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
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
                if (hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
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
                if (hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
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
                if (hasUpgrade('l4', 54)) base = player.l3.points.add(2);
                if (hasUpgrade('l3', 32)) base = base.pow(upgradeEffect('l3', 32));
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
                if (hasMilestone("l4", 26) && base.gte(2)) {
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
                if (base.gte(2)) base = base.div(2).root(3).mul(2);
                base = base.min(10)
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
                let base = new Decimal(16);
                for (let i = 41; i <= 45; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(1.5);
                return base.floor();
            },
            unlocked() { return hasUpgrade('l3', 35) },
        },
        42: {
            title: "结构重载I",
            description: "你可以同时购买第一行2个增幅器，并自动化",
            cost() {
                let base = new Decimal(16);
                for (let i = 41; i <= 45; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(1.5);
                return base.floor();
            },

            unlocked() { return hasUpgrade('l3', 35) },
        },
        43: {
            title: "尘埃回荡",
            description: "基于致密点数，提升数据产量",
            effect() {
                if (hasUpgrade("l4", 31)) return new Decimal(1);
                let base = n(1);
                base = base.add(player.l3.points.max(1).log10().root(1.5).div(10));
                base = base.min(1.5);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
                let base = new Decimal(16);
                for (let i = 41; i <= 45; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(1.5);
                return base.floor();
            },

            unlocked() { return hasUpgrade('l3', 35) },
        },
        44: {
            title: "两面突击",
            description: "基于致密点数，提升点数产量",
            effect() {
                if (hasUpgrade("l4", 42)) return new Decimal(1);
                let base = n(1);
                base = base.add(player.l3.points.max(1).log10().root(1.5).div(20));
                base = base.min(1.25);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            cost() {
                let base = new Decimal(16);
                for (let i = 41; i <= 45; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(1.5);
                return base.floor();
            },

            unlocked() { return hasUpgrade('l3', 35) },
        },
        45: {
            title: "炉火纯青",
            description: "解锁下一行升级（基础价格为1e5，价格乘数3）",
            cost() {
                let base = new Decimal(16);
                for (let i = 41; i <= 45; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(1.5);
                return base.floor();
            },

            unlocked() { return hasUpgrade('l3', 35) },
        },
        51: {
            title: "结构重载II",
            description: "你可以同时购买第二行3个增幅器，并自动化",
            cost() {
                let base = new Decimal(1e5);
                for (let i = 51; i <= 55; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        52: {
            title: "核心重组I",
            description: "基于致密点数，增幅器II-B更强",
            cost() {
                let base = new Decimal(1e5);
                for (let i = 51; i <= 55; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            effect() {
                let base = n(1);
                base = base.add(player.l3.points.max(1).log10().root(2));
                if (!hasUpgrade("l4", 72)) base.min(10);
                if (hasUpgrade("l4", 72)) base = base.mul(4);
                return base
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        53: {
            title: "核心重组II",
            description: "基于致密点数，增幅器III-C更强",
            cost() {
                let base = new Decimal(1e5);
                for (let i = 51; i <= 55; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            effect() {
                let base = n(1);
                base = base.add(player.l3.points.max(1).log10().mul(2).root(3));
                if (!hasUpgrade("l4", 72)) base.min(10);
                if (hasUpgrade("l4", 72)) base = base.mul(4);
                return base
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        54: {
            title: "急迫增生",
            description: "复制器获取速度^2",
            cost() {
                let base = new Decimal(1e5);
                for (let i = 51; i <= 55; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        55: {
            title: "神乎其技",
            description: "解锁下一行升级和第四行增幅器",
            cost() {
                let base = new Decimal(1e5);
                for (let i = 51; i <= 55; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            unlocked() { return hasUpgrade('l3', 45) },
        },
        61: {
            title: "结构重载III",
            description: "你可以同时购买第三行3个增幅器，并自动化",
            cost() {
                let base = new Decimal(1e7);
                for (let i = 61; i <= 65; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },
            unlocked() { return hasUpgrade('l3', 55) },
        },
        62: {
            title: "核心重组III",
            description: "增幅器IV-B更强（x2）",
            cost() {
                let base = new Decimal(1e7);
                for (let i = 61; i <= 65; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },

            unlocked() { return hasUpgrade('l3', 55) },
        },
        63: {
            title: "自我增生",
            description: "每秒自动获取100%重置可获得的转生点数",
            cost() {
                let base = new Decimal(1e7);
                for (let i = 61; i <= 65; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
                return base;
            },

            unlocked() { return hasUpgrade('l3', 55) },
        },
        64: {
            title: "核心进化",
            description: "改善核心价格公式，并自动购买核心",
            cost() {
                let base = new Decimal(1e7);
                for (let i = 61; i <= 65; i++)
                    if (hasUpgrade('l3', i)) base = base.mul(3);
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
                base = Decimal.pow(0.975, player.l3.storedSecondCore.sub(7).max(0).root(1.5));
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
            challengeDescription() { return (inChallenge('l3', 11) ? ('将压缩的奇点：<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + formatWhole(tmp.l3.singAvail) + '</h2><br/>') : '') + "点数获取量的指数和复制器数量的指数的指数^" + format(layers.l3.challenges[11].dPower()) },
            unlocked() { return hasUpgrade('l3', 65); },
            canComplete() {
                return false;
            },
            goal() {
                return player.l3.sing.add(1).div(layers.l3.singMult()).mul(100).pow(1 / 0.6);
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
            style() {
                return { 'border-color': 'silver', 'background-color': 'black', 'color': 'white', 'background-image': 'radial-gradient(circle at center, black, silver)', 'box-shadow': inChallenge('l3', 11) ? '0px 0px 24px silver' : '' };
            },
            dPower() {
                if (hasUpgrade("l4", 44)) return 0.3;
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
            ["display-text", function () { if(hasUpgrade('l5', 32)) return "5. 飞升精华x<h2 style='color: #ffff00'>" + format(tmp.l3.ptsEff5) + '</h2>'; }],
            ["upgrades", [1, 2, 3, 4, 5, 6]],
            ],
        },
        "黑洞压缩": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["display-text", function () { return '你压缩了<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + formatWhole(player.l3.sing) + '</h2>个奇点'; }],
                ["display-text", function () { return '奇点让点数获取^<h2 style="color: silver; text-shadow: 0px 0px 12px silver">' + format(tmp.l3.singEff1, 4) + '</h2>' }],
                ["display-text", function () { if (!hasMilestone('l4', 28)) return ''; return '奇点让攻击力获取x<h2 style="color: #FF9911;">' + format(tmp.l3.singEff2) + '</h2>' }],
                ["challenges", [1]],
                ["upgrades", [7]],
                ["milestones", [0, 1, 2, 3]],
            ],
            unlocked() {
                return player.l3.bhUnlocked;
            },
            buttonStyle() { return { 'border-color': 'silver', 'color': 'silver', 'box-shadow': '0px 0px 12px silver' }; },
        },
    },
    layerShown() { return hasUpgrade('l2', 33) || player.l3.total.gt(0) || player.l4.unlocked },
    autoUpgrade() { return false },
    doReset(resettingLayer) {
        let keep = [];
        if (hasMilestone("l4", 12)) keep.push("upgrades");
        if (hasMilestone("l4", 14)) keep.push("milestones");
        if (hasUpgrade("l4", 11)) keep.push("sing");
        if (hasMilestone("l4", 15)) keep.push("storedSecondCore");
        if (layers[resettingLayer].row > this.row) layerDataReset("l3", keep);
    },
})