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
            ["display-text", function () { return `核心增益I: 复制器获取变为^${format(buyableEffect("l2", 11)[0], 3)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2", 12)[0])})` : ``) }],
            ["display-text", function () { return hasUpgrade("l2", 23) ? `核心增益II: 转生点数获取x${format(buyableEffect("l2", 11)[1])}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(buyableEffect("l2", 12)[1])})` : ``) : `` }],
            ["display-text", function () { return getBuyableAmount('l2', 12).gt(0) ? `核心增益III: 奇点获取x${format(buyableEffect("l2", 12)[2])}` : `` }],
            ["display-text", function () { return hasMilestone('l4', 20) ? `核心增益IV: 第5行增幅器的效果^${format(tmp.l2.coreEffect4)}` : `` }],
            ["display-text", function () { return hasUpgrade('l4', 61) ? `核心增益V: 点数获取x${format(tmp.l2.coreEffect5)}` + (getBuyableAmount('l2', 12).gt(0) ? `(二阶核心使其^${format(tmp.l2.coreEffect5b)})` : ``) : `` }],
                "blank",
                "buyables",
                "blank",
            ["upgrades", [1, 2, 3]],
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
                ["upgrades", [4, 5, 6, 7, 8]]
            ], unlocked() { return hasUpgrade('l2', 25) }
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
    doReset(resettingLayer) {
        let keep = [], km = [];
        if (player.l3.total.gte(1)) km.push(0);
        if (player.l3.total.gte(2)) km.push(1);
        if (player.l3.total.gte(8)) km.push(2);
        if (player.l3.total.gte(64)) km.push(3);
        if (player.l3.total.gte(1024)) km.push(4);
        if (player.l3.total.gte(32768)) km.push(5);
        if (hasMilestone("l4", 6)) keep.push("upgrades");
        if (hasMilestone("l4", 14)) keep.push("milestones");
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
        if (hasUpgrade("l2", 22)) mult = mult.times(upgradeEffect("l2", 22))
        if (hasUpgrade("l2", 23)) mult = mult.times(buyableEffect("l2", 11)[1])
        if (hasUpgrade("l1", 24)) mult = mult.times(upgradeEffect("l1", 24))
        if (hasUpgrade('l3', 13)) mult = mult.mul(upgradeEffect('l3', 13));
        mult = mult.mul(tmp.l3.ptsEff2);
        if (hasUpgrade('l4', 23)) mult = mult.mul(upgradeEffect('l4', 23));
        if (hasUpgrade('l4', 26)) mult = mult.mul(buyableEffect('l4', 32));
        mult = mult.mul(tmp.l5.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        if (hasUpgrade('l3', 63)) mult = 1;
        if (hasMilestone('l4', 7)) mult = 1e3;

        return mult
    },
    replBaseGain() {
        let a = n(1)
        return a
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    branches: ['l1'],
    hotkeys: [
        { key: "2", description: "2：进行第二层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    layerShown() {
        return hasUpgrade("l1", 16) || player.l2.unlocked;
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
                if (hasUpgrade('l4', 52)) return "基于转生时间增加数据获取,1s达到硬上限"; if (hasUpgrade('l4', 33)) return "基于转生时间增加数据获取,10s达到硬上限"; return "基于转生时间增加数据获取,1000s达到硬上限"
            },
            effect() {
                if (!hasUpgrade('l2', 11)) return n(1)
                let eff = n(player.l1.resetTime).min(1000).add(1).pow(0.1)
                if (hasUpgrade('l4', 33)) eff = Decimal.pow(10, n(player.l1.resetTime).min(10).pow(1.5));
                if (hasUpgrade('l4', 33)) eff = Decimal.pow('1e100', n(player.l1.resetTime).min(1).pow(2));
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
                let eff = Decimal.pow(4, player.l2.total.add(1).log10())
                if (eff.gte('1e500')) eff = eff.pow(0.1).mul('1e450');
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("l2", 11) },
        },
        13: {
            title: "协同加成",
            description: "解锁复制器的第三个效果",
            cost: new Decimal(2),
            unlocked() { return hasUpgrade("l2", 12) },
        },
        14: {
            title: "永无止境的起点",
            description: "第一个数据升级的效果变为^3",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("l2", 13) },
        },
        15: {
            title: "转生复制器",
            description: "第二个复制器效果在软上限之前基于转生点数变强",
            cost: new Decimal(10),
            unlocked() { return hasUpgrade("l2", 14) },
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
            unlocked() { return hasUpgrade("l2", 15) },
        },
        22: {
            title: "又来这一套",
            description: "基于点数增强转生点数获取",
            cost: new Decimal(500),
            unlocked() { return hasUpgrade("l2", 21) },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).log10().pow(0.2).add(1)
                if (hasUpgrade("l2", 34)) eff = Decimal.pow(10, player.points.add(10).log10().root(2.5));
                if (hasUpgrade("l2", 52)) eff = eff.times(upgradeEffect("l2", 52))
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        23: {
            title: "紧密核心",
            description: "解锁第二个核心增益",
            cost: new Decimal(1e4),
            unlocked() { return hasUpgrade("l2", 22) },
        },
        24: {
            title: "超立方",
            description: "点数获取^1.1",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade("l2", 23) },
        },
        25: {
            title: "更加艰难的抉择",
            description: "解锁转生增幅器",
            cost: new Decimal(1e11),
            unlocked() { return hasUpgrade("l2", 24) },
        },
        31: {
            title: "限制突破",
            description: "第一个复制器效果使用更好的公式",
            cost: new Decimal(5e13),
            unlocked() { return hasUpgrade("l2", 25) },
        },
        32: {
            title: "致密核心",
            description: "解锁第三行增幅器",
            cost: new Decimal(1e18),
            unlocked() { return hasUpgrade("l2", 31) },
        },
        33: {
            title: "更远之境",
            description: "解锁下一层",
            cost: new Decimal(1e19),
            unlocked() { return hasUpgrade("l2", 32) },
        },
        34: {
            title: "还来这一套",
            description: "转生升级“又来这一套”的效果更好。",
            cost: new Decimal('1e1200'),
            unlocked() { return hasMilestone("l4", 21) },
        },
        35: {
            title: "增幅增幅",
            description: "增幅器III-A效果更好。",
            cost: new Decimal('1e1500'),
            unlocked() { return hasMilestone("l4", 21) },
        },
        41: {
            title: "增幅器I-A",
            description: "移除第三个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() { return (!hasUpgrade("l2", 42) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[41].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 41)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 41)) cc = "#000000"
                    return cc
                }
            }
        },
        42: {
            title: "增幅器I-B",
            description: "移除第五个数据升级的一重软上限",
            cost: new Decimal(5e10),
            canAfford() { return (!hasUpgrade("l2", 41) || hasUpgrade('l3', 42)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 42),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[42].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 42)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 42)) cc = "#000000"
                    return cc
                }
            }
        },
        51: {
            title: "增幅器II-A",
            description: "复制器获取^2",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 52) && !hasUpgrade("l2", 53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[51].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 51)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 51)) cc = "#000000"
                    return cc
                }
            }
        },
        52: {
            title: "增幅器II-B",
            description: "第二行第二个转生升级基于点数变得更好",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 51) && !hasUpgrade("l2", 53) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[52].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 52)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 52)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).ln().pow(0.1).add(1)
                if (hasUpgrade('l3', 52)) eff = eff.pow(upgradeEffect('l3', 52));
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        53: {
            title: "增幅器II-C",
            description: "核心更便宜(^0.9)",
            cost: new Decimal(1e12),
            canAfford() { return (!hasUpgrade("l2", 51) && !hasUpgrade("l2", 52) || hasUpgrade('l3', 51)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 25) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 51),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[53].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 53)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 53)) cc = "#000000"
                    return cc
                }
            },
        },
        61: {
            title: "增幅器III-A",
            description: "基于转生点数加强核心增益I",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 62) && !hasUpgrade("l2", 63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[61].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 61)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 61)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().pow(0.5).div(3)
                if (eff.gte(5) && !hasUpgrade("l2", 35)) eff = eff.minus(5).div(10).add(5)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        62: {
            title: "增幅器III-B",
            description: "基于转生点数加强核心增益II",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 61) && !hasUpgrade("l2", 63) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[62].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 62)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 62)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(0)
                let eff = player.l2.points.add(1).log10().div(7)
                if (hasUpgrade('l2', 72)) eff = eff.mul(upgradeEffect('l2', 72));
                if (eff.gte(10)) eff = eff.minus(10).div(5).add(10)
                if (!hasUpgrade('l4', 71)) eff = eff.min(50)
                eff = eff.softcap(50, 10, 3)
                return eff
            },
            effectDisplay() { let a = "+" + format(this.effect()) + "有效等级"; return a; },
        },
        63: {
            title: "增幅器III-C",
            description: "基于点数,核心变得更便宜",
            cost: new Decimal(1e17),
            canAfford() { return (!hasUpgrade("l2", 61) && !hasUpgrade("l2", 62) || hasUpgrade('l3', 61)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l2", 32) },
            ignoreAutoUpgrade: () => !hasUpgrade('l3', 61),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[63].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 63)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 63)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                if (!hasUpgrade('l2', this.id)) return n(1)
                let eff = player.points.add(1).pow(2).log10().add(1)
                if (hasUpgrade('l3', 53)) eff = eff.pow(upgradeEffect('l3', 53));
                if (eff.gte(1e20)) eff = eff.div(1e20).pow(0.25).add(1).times(1e20)
                return eff
            },
            effectDisplay() { let a = "/" + format(this.effect()); return a; },
        },
        71: {
            title: "增幅器IV-A",
            description: "基于致密点数，复制器第一效果更强",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 72) && !hasUpgrade("l2", 73) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[71].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 71)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 71)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(2);
                base = base.add(player.l3.points.root(4).div(4));
                if (base.gte(10)) base = base.log10().pow(0.5).pow_base(10);
                if (base.gte(20)) base = base.mul(5).log10().mul(10);
                return base;
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        72: {
            title: "增幅器IV-B",
            description: "基于致密点数，增幅器III-B更强",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 73) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[72].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 72)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 72)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(2);
                base = base.add(player.l3.points.add(1).log10().div(4));
                if (hasUpgrade('l3', 62)) base = base.mul(2);
                base = base.mul(layers.l5.challenges[21].effect())
                if (!hasUpgrade('l4', 71)) base = base.min(50)
                base = base.softcap(50, 0.8)
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        73: {
            title: "增幅器IV-C",
            description: "复制器降低核心价格",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 72) && !hasUpgrade("l2", 74) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[73].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 73)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 73)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = n(1);
                base = base.add(player.l1.repl.add(1).log10().div(20));
                if (base.gte(2)) base = base.div(2).log10().add(2);
                return base.pow(-1);
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        74: {
            title: "增幅器IV-D",
            description: "基于核心等级和总转生点数提升致密点数获取",
            cost: new Decimal(1e60),
            canAfford() { return (!hasUpgrade("l2", 71) && !hasUpgrade("l2", 72) && !hasUpgrade("l2", 73) || hasMilestone('l4', 8)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasUpgrade("l3", 55) },
            ignoreAutoUpgrade: () => !hasMilestone('l4', 8),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[74].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 74)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 74)) cc = "#000000"
                    return cc
                }
            },
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
            canAfford() { return (!hasUpgrade("l2", 82) || hasUpgrade('l5', 11)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4", 17) },
            ignoreAutoUpgrade: () => !hasUpgrade('l5', 11),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[81].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 81)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 81)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = Decimal.pow(1.01, player.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
                if (hasUpgrade("l5", 23)) base = base.pow(upgradeEffect('l5', 23))
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        82: {
            title: "增幅器V-B",
            description: "数据增加攻击力获取",
            cost: new Decimal('1e940'),
            canAfford() { return (!hasUpgrade("l2", 81) || hasUpgrade('l5', 11)) && player.l2.points.gte(this.cost) },
            unlocked() { return hasMilestone("l4", 17) },
            ignoreAutoUpgrade: () => !hasUpgrade('l5', 11),
            style: {
                "border-color": "#ff00c3", "border-radius": "0%", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.upgrades[82].canAfford) bg = "#ff00c333"
                    if (hasUpgrade("l2", 82)) bg = "#ff00c3"
                    return bg
                }, "color"() {
                    let cc = "#ff00c3"
                    if (hasUpgrade("l2", 82)) cc = "#000000"
                    return cc
                }
            },
            effect() {
                let base = Decimal.pow(1.01, player.l1.points.add(10).log10().sqrt().mul(tmp.l2.coreEffect4));
                if (hasUpgrade("l5", 23)) base = base.pow(upgradeEffect('l5', 23))
                return base;
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
    },
    clickables: {
        31: {
            display() { return `重置转生增幅器设置(这将使得你的复制器^0.5,并重置点数和转生点数!)` },
            style: { "height": "30px", "width": "500px", "background-color": "#ff00c333", "border-radius": "0%", "border": "2px solid", "border-color": "#ff00c3", "color": "#ff00c3", "text-shadow": "0 0 15px #ff00c3", "font-size": "15px" },
            unlocked() { return hasUpgrade("l2", 25) },
            onClick() {
                player.l2.upgrades = player.l2.upgrades.filter(n => n < 36)//重置编号大于36的升级
                player.l2.points = n(0)
                player.l1.repl = player.l1.repl.times(0.5)
                player.points = n(0)
            },
            canClick() { return true }
        },
    },
    coreEffect4() {
        if (!hasMilestone("l4", 20)) return new Decimal(1);
        let ret = player.l2.buyables[11].root(6);
        if (hasUpgrade("l4", 51)) ret = ret.mul(player.l2.buyables[12].root(4));
        ret = ret.add(1);
        return ret;
    },
    coreEffect5() {
        if (!hasUpgrade("l4", 61)) return new Decimal(1);
        let ret = Decimal.pow(10, player.l2.buyables[11]);
        ret = ret.pow(layers.l2.coreEffect5b());
        return ret;
    },
    coreEffect5b() {
        if (!hasUpgrade("l4", 61)) return new Decimal(1);
        let ret = player.l2.buyables[12].root(2).add(1);
        return ret;
    },
    corePointScale() {
        let p = player.l2.points;
        p = p.root(layers.l5.crystaleff())
        if (hasUpgrade('l3', 73)) p = p.root(upgradeEffect('l3', 73));
        if (hasUpgrade('l3', 65)) p = p.root(0.95);
        if (hasUpgrade('l2', 73)) p = p.root(upgradeEffect('l2', 73));
        if (hasUpgrade("l2", 53)) p = p.root(0.9)
        if (hasUpgrade("l4", 24)) p = p.mul(upgradeEffect("l4", 24));
        if (hasUpgrade('l3', 24)) p = p.div(upgradeEffect('l3', 24));
        if (hasUpgrade("l2", 63)) p = p.mul(upgradeEffect("l2", 63));
        return p;
    },
    firstCoreScale() {
        let base = n(10);
        if (hasMilestone('l4', 18)) base = n(5);
        if (hasMilestone('l4', 22)) base = n(3);
        if (hasMilestone('l4', 24)) base = n(6).sub(layers.l4.total_bars().max(400).root(5).min(4));
        return base;
    },
    buyables: {
        11: {
            title() { return `核心等级${formatWhole(getBuyableAmount("l2", 11))}` },

            cost(x) {
                if (x.gte(64)) x = x.div(64).pow(tmp.l2.firstCoreScale).mul(64);
                if ((x.gte(20) && !hasUpgrade('l3', 64)) || inChallenge('l5', 21)) return n('1F9e15');
                let ct = Decimal.pow(2, x.pow(2)).div(x.add(1));
                if (hasUpgrade('l3', 64)) ct = Decimal.pow(1.75, x.pow(2));
                if (hasUpgrade("l2", 63)) ct = ct.div(upgradeEffect("l2", 63));
                if (hasUpgrade('l3', 24)) ct = ct.mul(upgradeEffect('l3', 24));
                if (hasUpgrade("l4", 24)) ct = ct.div(upgradeEffect("l4", 24));
                if (hasUpgrade("l2", 53)) ct = ct.pow(0.9)
                if (hasUpgrade('l2', 73)) ct = ct.pow(upgradeEffect('l2', 73));
                if (hasUpgrade('l3', 65)) ct = ct.pow(0.95);
                if (hasUpgrade('l3', 73)) ct = ct.pow(upgradeEffect('l3', 73));
                ct = ct.pow(layers.l5.crystaleff())
                return ct;
            },
            effect(x) {
                let eff1 = Decimal.pow(x.add(upgradeEffect("l2", 61)).pow(0.2).add(1), x.add(upgradeEffect("l2", 61)).times(0.25))
                eff1 = eff1.pow(buyableEffect("l2", 12)[0]);
                //if(eff1.gte(100000)) eff1 = eff1.div(100000).pow(0.25).mul(100000);
                let eff2 = Decimal.pow(5, x.add(upgradeEffect("l2", 62)).pow(0.6)).max(1)
                eff2 = eff2.pow(buyableEffect("l2", 12)[1]);
                return [eff1, eff2]
            },
            display() { return `花费: ${format(this.cost())} 转生点数` },
            canAfford() { return player.l2.points.gte(this.cost()) },
            buy() {
                if (!tmp.l2.buyables[11].canAfford) return
                player.l2.points = player.l2.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("l2", 0) },
            style: {
                "height": "150px", "width": "350px", "font-size": "12.5px", "border-color": "#ff00c3", "border-radius": "2%", "color": "#ff00c3", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.buyables[11].canAfford) bg = "#ff00c333"
                    return bg
                }
            }
        },
        12: {
            title() { return (inChallenge('l3', 11) ? '已保存' : '') + `二阶核心等级${formatWhole(getBuyableAmount("l2", 12))}` },

            cost(x) {
                let ct = n(2).pow(x.mul(0.1).add(5.0001));
                return ct.floor();
            },
            effect(x) {
                let eff1 = x.div(2).add(1).pow(0.5);
                //if(eff1.gte(5)) eff1 = eff1.div(5).root(3).mul(5);
                if (hasMilestone('l3', 3)) eff1 = eff1.pow(1.25);
                let eff2 = x.mul(1.5).add(1);
                if (eff2.gte(10)) eff2 = eff2.div(10).root(2).mul(10);
                let eff3 = x.add(1);
                if (hasUpgrade('l4', 41)) eff3 = x.mul(player.l2.buyables[11].root(2)).add(1);
                if (hasMilestone('l3', 2)) eff3 = eff3.pow(1.5);
                if (hasUpgrade('l3', 74)) eff3 = eff3.pow(1.25);
                return [eff1, eff2, eff3]
            },
            display() { return inChallenge('l3', 11) ? '' : `需求: ${format(this.cost(), 0)} 核心等级` },
            canAfford() { return getBuyableAmount('l2', 11).gte(this.cost()) && !inChallenge('l3', 11) },
            buy() {
                if (!tmp.l2.buyables[12].canAfford) return
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("l3", 0) },
            style: {
                "height": "150px", "width": "350px", "font-size": "12.5px", "border-color": "#ffaae3", "border-radius": "2%", "color": "#ffaae3", "background-color"() {
                    let bg = "#00000000"
                    if (tmp.l2.buyables[12].canAfford) bg = "#ffaae333"
                    return bg
                }
            }
        },
    },
    update(diff) {
        if (hasUpgrade('l3', 64) && !inChallenge('l5', 21)) //注意：原本的核心价格公式无法逆向计算，因此必须有这个升级才能自动核心
        {
            let ncl = tmp.l2.corePointScale.max(1).log(1.75).root(2);
            if (ncl.gte(64)) ncl = ncl.div(64).root(tmp.l2.firstCoreScale).mul(64);
            ncl = ncl.add(1).floor();
            setBuyableAmount('l2', 11, getBuyableAmount('l2', 11).max(ncl));
        }
    },
    autoUpgrade() { return (player.l3.total.gte(1) && player.l2.total.gte(tmp.l3.ptsEff3)) }
})