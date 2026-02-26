addLayer("l4", {
    infoboxes: {
        introBox: {
            title: "Layer 4",
            body() { return "本层由 loader3229 制作。本层级的目标是打败该层级的作者：loader3229。当该层级的作者loader3229被打败1次后，解锁本层级第6行最后一个升级。" },
        },
    },
    symbol: 'A',
    name: "第四层 制作：loader3229",
    startData() {
        return {
            unlocked: false,
            points: new Decimal(0),
            total: new Decimal(0),
            dmg: new Decimal(0),
            level: new Decimal(1),
            y: new Decimal(1024),
            cooldown: new Decimal(5),
        };
    },
    row: 3,
    branches: ['l3'],
    hotkeys: [
        { key: "4", description: "4：进行第四层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    color: "#FF9911",
    requires: new Decimal(1e47),
    resource: "攻击力",
    baseResource: "致密点数",
    baseAmount() { return player.l3.points },
    type: "normal",
    exponent: 0.1,
    gainMult() {
        let mult = new Decimal(1)
        if(hasUpgrade('l2',81))mult = mult.mul(upgradeEffect('l2',81));
        if(hasUpgrade('l2',82))mult = mult.mul(upgradeEffect('l2',82));
        if(hasUpgrade('l4',12))mult = mult.mul(upgradeEffect('l4',12));
        if(hasMilestone('l4',16))mult = mult.mul(hasMilestone("l4",31)?layers.l4.total_bars().add(1):layers.l4.total_bars().div(100).add(1));
        if(hasMilestone('l4',28))mult = mult.mul(layers.l3.singEff2());
        if(hasMilestone('l4',32))mult = mult.mul(2);
        mult = mult.mul(buyableEffect('l4',11));
        mult = mult.mul(buyableEffect('l4',12));
        mult = mult.mul(buyableEffect('l4',13));
        mult = mult.mul(buyableEffect('l4',21));
        mult = mult.mul(buyableEffect('l4',22));
        mult = mult.mul(buyableEffect('l4',23));
        return mult
    },
    dmgMult() {
        let mult = new Decimal(1)
        if(hasMilestone('l4', 2))mult = mult.mul(layers.l1.replEff4());
        return mult
    },
    type: "normal",
    gainExp() {
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        return mult
    },
    doReset(a){
        if(a == "l4"){
            let keepSing=player.l3.sing;
            let keepSecondCore=player.l3.storedSecondCore;
            if(hasMilestone("l4",14)){
                layerDataReset("l1",["upgrades","milestones"]);
                layerDataReset("l2",["upgrades","milestones"]);
                layerDataReset("l3",["upgrades","milestones"]);
            }else{
                if(hasMilestone("l4",10) || player.l4.points.gte(10))layerDataReset("l1",["upgrades"]);else layerDataReset("l1");
                if(hasMilestone("l4",11) || player.l4.points.gte(100))layerDataReset("l2",["upgrades"]);else layerDataReset("l2");
                if(hasMilestone("l4",12) || player.l4.points.gte(1e4))layerDataReset("l3",["upgrades"]);else layerDataReset("l3");
            }
            if(hasUpgrade("l4",11))player.l3.sing=keepSing;
            if(hasMilestone("l4",15))setBuyableAmount('l2', 12, player.l3.storedSecondCore = keepSecondCore);
            player.points = new Decimal(0);
        }
    },
    layerShown(){return hasUpgrade('l3',75) || player.l4.unlocked},
    effectDescription(){
        return "基础伤害："+format(layers.l4.effect())+"×点数^"+formatSmall(Decimal.pow(0.1,player.l4.level.add(3).div(2)));
    },
    effect(){
        let dmg=player.l4.points;
        return dmg;
    },
    bars: {
        hp: {
            fillStyle() {
                let y = Math.ceil(player.l4.y.toNumber());

                if (y <= 0) return { 'background-color': "#000000" };
                return { 'background-color': "hsl(" + ((y - 1) * 150) + ",100%," + (40 + 20 * Math.pow(1 / 2, y)) + "%)" };
            },
            baseStyle() {
                let y = Math.ceil(player.l4.y.toNumber());

                if (y <= 1) return { 'background-color': "#000000", 'transition-duration': '0s' };
                return { 'background-color': "hsl(" + ((y - 2) * 150) + ",100%," + (40 + 20 * Math.pow(1 / 2, y - 1)) + "%)", 'transition-duration': '0s' };
            },
            textStyle: { 'color': '#ffffff' },
            borderStyle() { return {} },
            direction: RIGHT,
            width: 400,
            height: 30,
            progress() {
                let y = player.l4.y.toNumber();
                return y - Math.ceil(y) + 1;
            },
            unlocked: true, instant: true,
            display() {
                return `HP: ${format(Decimal.pow(2,1024).sub(Decimal.pow(2,Decimal.sub(1024,player.l4.y)).sub(1)))} / ${format(Decimal.pow(2,1024))}`
            },
        }
    },
    tabFormat: {
        "主页": {
            "content": [["infobox", "introBox"],
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
["column", [["raw-html", function () {
            let y = Math.ceil(player.l4.y.toNumber());
            return "<div style=width:400px;><div style=width:250px;text-align:left;display:inline-block;>loader3229 (Lv. " + formatWhole(player.l4.level) + ")</div><div style=width:150px;text-align:right;display:inline-block;>x" + y + "</span></div>";
        }], ["bar", "hp"]]],
                "blank",
        ["clickable",11],
        "blank",
        ["display-text",function(){if(player.l4.level.gte(2))return "loader3229受到的伤害变为原来的1/"+formatWhole(Decimal.pow(2,player.l4.level.sub(1)))+"次方后除以"+format(Decimal.pow(2,n(1).sub(Decimal.pow(0.7,player.l4.level.sub(1))).mul(1024)))+"！";return "";}],
        ["display-text",function(){return "已对loader3229造成的总伤害："+format(Decimal.pow(2,Decimal.sub(1024,player.l4.y)).sub(1))}],

                "blank",
        "upgrades"
            ]
        },
        "里程碑": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                "milestones"
            ]
        },
        "武器": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["buyables",[1,2]]
            ],"unlocked":function(){return hasUpgrade("l4",15);}
        },
        "防具": {
            "content": [
                "main-display",
                "prestige-button",
                "resource-display",
                "blank",
                ["buyables",[3,4]]
            ],"unlocked":function(){return hasUpgrade("l4",16);}
        },
    },
    clickables: {
        11: {
            title() {
                return "攻击"
            },
            display() {
                return "伤害乘数: "+format(layers.l4.dmgMult(),2,true)+"x<br>冷却时间："+formatTime(player.l4.cooldown.max(0));
            },
            canClick() {
                return player.l4.cooldown.lte(0);
            },
            onClick() {
                if (!layers[this.layer].clickables[this.id].canClick()) return;
                player.l4.cooldown = new Decimal(5);
                let singleDmg = layers.l4.effect().mul(layers.l4.dmgMult()).mul(player.points.pow(Decimal.pow(0.1,player.l4.level.add(3).div(2))));
                
                //升级后减少伤害（对1级的本层级作者无影响）
                if(player.l4.level.gte(2))singleDmg = singleDmg.root(Decimal.pow(2,player.l4.level.sub(1)));
                if(player.l4.level.gte(2))singleDmg = singleDmg.div(Decimal.pow(2,n(1).sub(Decimal.pow(0.7,player.l4.level.sub(1))).mul(1024)));
                
                if(singleDmg.gte(1e305))singleDmg = singleDmg.log10().sub(300).div(5).pow(4.5).mul(1e305).min(3e307);
                player.l4.dmg = player.l4.dmg.add(singleDmg);
            },
            unlocked: true,
        },
    },
    update(diff) {
        player.l4.cooldown = player.l4.cooldown.sub(diff);
        if(hasMilestone("l4",15))setBuyableAmount('l2', 12, player.l3.storedSecondCore = player.l3.storedSecondCore.max(getBuyableAmount('l2', 12)).max(getBuyableAmount('l2', 11).add(1).max(1).log2().sub(4.8999).mul(10).max(0).floor()));
        if(hasUpgrade("l4",66) && player.l4.y.lte(0)){
            player.l4.level = player.l4.level.add(1);
            player.l4.dmg = new Decimal(0);
            player.l4.y = new Decimal(1024);
            updateTemp();updateTemp();updateTemp();
        }
    },
    total_bars(){
        return Decimal.sub(1024,player.l4.y).add(player.l4.level.sub(1).mul(1024)).floor();
    },
    milestones: [
        {
            requirementDescription: "打掉loader3229的2段血条",
            done() { return layers.l4.total_bars().gte(2) }, // Used to determine when to give the milestone
            effectDescription(){ return "累计打掉的loader3229的血条数量增加点数获取。当前效果："+format(layers.l4.total_bars().add(1))+"x"},
        },
        {
            requirementDescription: "打掉loader3229的3段血条",
            done() { return layers.l4.total_bars().gte(3) }, // Used to determine when to give the milestone
            effectDescription(){ return "累计打掉的loader3229的血条数量增加数据获取。当前效果："+format(layers.l4.total_bars().add(1))+"x"},
        },
        {
            requirementDescription: "打掉loader3229的4段血条",
            done() { return layers.l4.total_bars().gte(4) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁复制器效果4。"},
        },
        {
            requirementDescription: "打掉loader3229的6段血条",
            done() { return layers.l4.total_bars().gte(6) }, // Used to determine when to give the milestone
            effectDescription(){ return "每秒获得1e5%重置时获得的数据。"},
        },
        {
            requirementDescription: "打掉loader3229的8段血条",
            done() { return layers.l4.total_bars().gte(8) }, // Used to determine when to give the milestone
            effectDescription(){ return "移除复制器一重溢出，复制器效果3的公式改变，并且对二重溢出生效。"},
        },
        {
            requirementDescription: "打掉loader3229的10段血条",
            done() { return layers.l4.total_bars().gte(10) }, // Used to determine when to give the milestone
            effectDescription(){ return "第2-3层重置时保留所有数据升级。"},
        },
        {
            requirementDescription: "打掉loader3229的12段血条",
            done() { return layers.l4.total_bars().gte(12) }, // Used to determine when to give the milestone
            effectDescription(){ return "第3层重置时保留所有转生点数升级。"},
        },
        {
            requirementDescription: "打掉loader3229的16段血条",
            done() { return layers.l4.total_bars().gte(16) }, // Used to determine when to give the milestone
            effectDescription(){ return "每秒获得1e5%重置时获得的转生点数。"},
        },
        {
            requirementDescription: "打掉loader3229的24段血条",
            done() { return layers.l4.total_bars().gte(24) }, // Used to determine when to give the milestone
            effectDescription(){ return "您可以同时购买所有第4行增幅器。"},
        },
        {
            requirementDescription: "打掉loader3229的50段血条",
            done() { return layers.l4.total_bars().gte(50) }, // Used to determine when to give the milestone
            effectDescription(){ return "每秒获得100%重置时获得的致密点数。"},
        },
        {
            requirementDescription: "10攻击力",
            done() { return player.l4.points.gte(10)}, // Used to determine when to give the milestone
            effectDescription(){ return "重置时保留数据升级。"},
        },
        {
            requirementDescription: "100攻击力",
            done() { return player.l4.points.gte(100)}, // Used to determine when to give the milestone
            effectDescription(){ return "重置时保留转生点数升级。"},
        },
        {
            requirementDescription: "10000攻击力",
            done() { return player.l4.points.gte(10000)}, // Used to determine when to give the milestone
            effectDescription(){ return "重置时保留致密点数升级。"},
        },
        {
            requirementDescription: "打掉loader3229的80段血条",
            done() { return layers.l4.total_bars().gte(80) }, // Used to determine when to give the milestone
            effectDescription(){ return "累计打掉的loader3229的血条数量增加奇点获取。当前效果："+format(hasMilestone('l4',27)?layers.l4.total_bars().add(1):hasMilestone('l4',17)?layers.l4.total_bars().div(50).add(1):layers.l4.total_bars().add(1).root(5))+"x"},
        },
        {
            requirementDescription: "打掉loader3229的120段血条",
            done() { return layers.l4.total_bars().gte(120) }, // Used to determine when to give the milestone
            effectDescription(){ return "攻击力重置不再重置里程碑和升级。"},
        },
        {
            requirementDescription: "打掉loader3229的150段血条",
            done() { return layers.l4.total_bars().gte(150) }, // Used to determine when to give the milestone
            effectDescription(){ return "自动购买并保留最大二阶核心。"},
        },
        {
            requirementDescription: "打掉loader3229的160段血条",
            done() { return layers.l4.total_bars().gte(160) }, // Used to determine when to give the milestone
            effectDescription(){ return "累计打掉的loader3229的血条数量增加攻击力获取。当前效果："+format(hasMilestone("l4",31)?layers.l4.total_bars().add(1):layers.l4.total_bars().div(100).add(1))+"x"},
        },
        {
            requirementDescription: "打掉loader3229的180段血条",
            done() { return layers.l4.total_bars().gte(180) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁第5行增幅器。80段血条里程碑效果更好。"},
        },
        {
            requirementDescription: "打掉loader3229的200段血条",
            done() { return layers.l4.total_bars().gte(200) }, // Used to determine when to give the milestone
            effectDescription(){ return "64以上的核心等级更便宜。"},
        },
        {
            requirementDescription: "打掉loader3229的230段血条",
            done() { return layers.l4.total_bars().gte(230) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁新的数据升级。"},
        },
        {
            requirementDescription: "打掉loader3229的250段血条",
            done() { return layers.l4.total_bars().gte(250) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁第4个核心增益。"},
        },
        {
            requirementDescription: "打掉loader3229的300段血条",
            done() { return layers.l4.total_bars().gte(300) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁新的转生点数升级。"},
        },
        {
            requirementDescription: "打掉loader3229的325段血条",
            done() { return layers.l4.total_bars().gte(325) }, // Used to determine when to give the milestone
            effectDescription(){ return "64以上的核心等级更便宜。"},
        },
        {
            requirementDescription: "打掉loader3229的375段血条",
            done() { return layers.l4.total_bars().gte(375) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁新的一列攻击力升级。"},
        },
        {
            requirementDescription: "打掉loader3229的400段血条",
            done() { return layers.l4.total_bars().gte(400) }, // Used to determine when to give the milestone
            effectDescription(){ return "64以上的核心等级基于打掉loader3229的血条数量（最高1024）更便宜。"},
        },
        {
            requirementDescription: "打掉loader3229的425段血条",
            done() { return layers.l4.total_bars().gte(425) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁复制器第5个效果。"},
        },
        {
            requirementDescription: "打掉loader3229的450段血条",
            done() { return layers.l4.total_bars().gte(450) }, // Used to determine when to give the milestone
            effectDescription(){ return "致密点数升级“回望往事”的第一硬上限变为软上限。"},
        },
        {
            requirementDescription: "打掉loader3229的500段血条",
            done() { return layers.l4.total_bars().gte(500) }, // Used to determine when to give the milestone
            effectDescription(){ return "80段血条里程碑效果更好。"},
        },
        {
            requirementDescription: "打掉loader3229的550段血条",
            done() { return layers.l4.total_bars().gte(550) }, // Used to determine when to give the milestone
            effectDescription(){ return "解锁奇点第2个效果。"},
        },
        {
            requirementDescription: "打掉loader3229的650段血条",
            done() { return layers.l4.total_bars().gte(650) }, // Used to determine when to give the milestone
            effectDescription(){ return "移除复制器二重溢出。"},
        },
        {
            requirementDescription: "打掉loader3229的750段血条",
            done() { return layers.l4.total_bars().gte(750) }, // Used to determine when to give the milestone
            effectDescription(){ return "奇点第2个效果更好。"},
        },
        {
            requirementDescription: "打掉loader3229的900段血条",
            done() { return layers.l4.total_bars().gte(900) }, // Used to determine when to give the milestone
            effectDescription(){ return "160段血条里程碑效果更好。"},
        },
        {
            requirementDescription: "打败1次loader3229",
            done() { return layers.l4.total_bars().gte(1024) }, // Used to determine when to give the milestone
            effectDescription(){ return "攻击力获取变为2倍，解锁本层级第6行最后一个升级。"},
        },
    ],
    upgrades: {
        11: {
            title: "QoL？",
            description: "攻击力重置时保留奇点，并且每个攻击力升级使奇点获取x1.1",
            cost: new Decimal(3e5),
            effect() {
                if (!hasUpgrade('l4', 11)) return n(1)
                let eff = Decimal.pow(1.1,player.l4.upgrades.length);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        12: {
            title: "升级加成",
            description: "每个攻击力升级使攻击力获取x2",
            cost: new Decimal(1e6),
            unlocked() { return hasUpgrade("l4",11) },
            effect() {
                if (!hasUpgrade('l4', 12)) return n(1)
                let eff = Decimal.pow(2,player.l4.upgrades.length);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        13: {
            title: "致密加成 I",
            description: "累计打掉的loader3229的血条数量增加致密点数获取。",
            cost: new Decimal(3e6),
            unlocked() { return hasUpgrade("l4",12) },
            effect() {
                if (!hasUpgrade('l4', 13)) return n(1)
                let eff = layers.l4.total_bars().add(1);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        14: {
            title: "致密加成 II",
            description: "每个攻击力升级使致密点数获取x2",
            cost: new Decimal(2e7),
            unlocked() { return hasUpgrade("l4",13) },
            effect() {
                if (!hasUpgrade('l4', 14)) return n(1)
                let eff = Decimal.pow(2,player.l4.upgrades.length);
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        15: {
            title: "这是什么？",
            description: "解锁武器。",
            cost: new Decimal(8e7),
            unlocked() { return hasUpgrade("l4",14) },
        },
        16: {
            title: "？么什是这",
            description: "解锁防具。",
            cost: new Decimal(1e35),
            unlocked() { return hasUpgrade("l4",15) && hasMilestone("l4",23) },
        },
        21: {
            title: "点数加成",
            description: "攻击力加成点数",
            cost: new Decimal(1e9),
            unlocked() { return hasUpgrade("l4",15) },
            effect() {
                if (!hasUpgrade('l4', 21)) return n(1)
                let eff = player.l4.points.add(1)
                if(hasUpgrade('l4',63))eff = eff.pow(5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        22: {
            title: "数据加成",
            description: "攻击力加成数据",
            cost: new Decimal(3e9),
            unlocked() { return hasUpgrade("l4",21) },
            effect() {
                if (!hasUpgrade('l4', 22)) return n(1)
                let eff = player.l4.points.add(1)
                if(hasUpgrade('l4',63))eff = eff.pow(5)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        23: {
            title: "转生加成",
            description: "攻击力加成转生点数",
            cost: new Decimal(1e10),
            unlocked() { return hasUpgrade("l4",22) },
            effect() {
                if (!hasUpgrade('l4', 23)) return n(1)
                let eff = player.l4.points.add(1)
                return eff
            },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        24: {
            title: "核心加成",
            description: "攻击力减少核心价格",
            cost: new Decimal(6e10),
            unlocked() { return hasUpgrade("l4",23) },
            effect() {
                if (!hasUpgrade('l4', 24)) return n(1)
                let eff = player.l4.points.add(1)
                return eff
            },
            effectDisplay() { let a = "/" + format(this.effect()); return a; },
        },
        25: {
            title: "这又是什么？",
            description: "解锁新武器。",
            cost: new Decimal(3e11),
            unlocked() { return hasUpgrade("l4",24) },
        },
        26: {
            title: "？么什是又这",
            description: "解锁新防具。",
            cost: new Decimal(1e40),
            unlocked() { return hasUpgrade("l4",25) && hasUpgrade("l4",16) },
        },
        31: {
            title: "递归改造",
            description: "数据升级“递归”的效果软上限更弱，但是致密点数升级“尘埃回荡”的效果变为1。",
            cost: new Decimal(1e13),
            unlocked() { return hasUpgrade("l4",25) },
        },
        32: {
            title: "数据改造",
            description: "数据的软上限推迟",
            cost: new Decimal(4e13),
            unlocked() { return hasUpgrade("l4",31) },
        },
        33: {
            title: "不再艰难的抉择",
            description: "转生升级“艰难的抉择”的效果更强，且到10秒后效果达到最大。",
            cost: new Decimal(1e15),
            unlocked() { return hasUpgrade("l4",32) },
        },
        34: {
            title: "复制器增强 I",
            description: "第1个复制器效果更好。",
            cost: new Decimal(1e16),
            unlocked() { return hasUpgrade("l4",33) },
        },
        35: {
            title: "这个又是什么？",
            description: "解锁新武器。",
            cost: new Decimal(2e17),
            unlocked() { return hasUpgrade("l4",34) },
        },
        36: {
            title: "？么什是又个这",
            description: "解锁新防具。",
            cost: new Decimal(1e45),
            unlocked() { return hasUpgrade("l4",35) && hasUpgrade("l4",26) },
        },
        41: {
            title: "核心增益加成 I",
        description: "第3个核心增益更好。",
            cost: new Decimal(1e22),
            unlocked() { return hasUpgrade("l4",35) },
        },
        42: {
            title: "点数改造 I",
        description: "去除数据升级“就这内容吗？”的效果第二软上限，但是致密点数升级“两面突击”的效果变为1。",
            cost: new Decimal(2e23),
            unlocked() { return hasUpgrade("l4",41) },
        },
        43: {
            title: "点数改造 II",
            description: "去除点数第一软上限",
            cost: new Decimal(5e23),
            unlocked() { return hasUpgrade("l4",42) },
        },
        44: {
            title: "改进压缩",
            description: "奇点压缩的指数从0.25变为0.3",
            cost: new Decimal(5e25),
            unlocked() { return hasUpgrade("l4",43) },
        },
        45: {
            title: "这又会是什么？",
            description: "解锁新武器。",
            cost: new Decimal(1e27),
            unlocked() { return hasUpgrade("l4",44) },
        },
        46: {
            title: "？么什是会又这",
            description: "解锁新防具。",
            cost: new Decimal(1e50),
            unlocked() { return hasUpgrade("l4",45) && hasUpgrade("l4",36) },
        },
        51: {
            title: "核心增益加成 II",
        description: "第4个核心增益更好。",
            cost: new Decimal(1e29),
            unlocked() { return hasUpgrade("l4",45) },
        },
        52: {
            title: "更加不再艰难的抉择",
            description: "转生升级“艰难的抉择”的效果更强，且到1秒后效果达到最大。",
            cost: new Decimal(2e32),
            unlocked() { return hasUpgrade("l4",51) },
        },
        53: {
            title: "奇点加成",
            description: "攻击力加成奇点",
            cost: new Decimal(3e34),
            effect() {
                if (!hasUpgrade('l4', 53)) return n(1)
                let eff = Decimal.pow(2,player.l4.points.add(10).log10().root(4));
                return eff
            },
            unlocked() { return hasUpgrade("l4",52) },
            effectDisplay() { let a = "x" + format(this.effect()); return a; },
        },
        54: {
            title: "核心压缩",
            description: "致密升级“让空间压缩能量”的效果更强。",
            cost: new Decimal(4e35),
            unlocked() { return hasUpgrade("l4",53) },
        },
        55: {
            title: "这个又会是什么？",
            description: "解锁新武器。",
            cost: new Decimal(1e36),
            unlocked() { return hasUpgrade("l4",54) },
        },
        56: {
            title: "？么什是会又个这",
            description: "解锁新防具。",
            cost: new Decimal(1e55),
            unlocked() { return hasUpgrade("l4",55) && hasUpgrade("l4",46) },
        },
        61: {
            title: "核心增益加成 III",
        description: "解锁第5个核心增益。",
            cost: new Decimal(2e57),
            unlocked() { return hasUpgrade("l4",55) },
        },
        62: {
            title: "奇点复制",
        description: "奇点增加复制器获取。",
            cost: new Decimal(2e66),
            unlocked() { return hasUpgrade("l4",61) },
            effect() {
                if (!hasUpgrade('l4', 62)) return n(1)
                let eff = player.l3.sing.add(1);
                return eff
            },
            effectDisplay() { let a = "^" + format(this.effect()); return a; },
        },
        63: {
            title: "超级加成",
        description: "本层级的“点数加成”和“数据加成”的效果^5",
            cost: new Decimal(5e74),
            unlocked() { return hasUpgrade("l4",62) },
        },
        64: {
            title: "最初的升级？",
            description: "数据升级1的软上限更弱。",
            cost: new Decimal(1e88),
            unlocked() { return hasUpgrade("l4",63) },
        },
        65: {
            title: "就差一步了",
            description: "解锁最后的武器。",
            cost: new Decimal(1e96),
            unlocked() { return hasUpgrade("l4",64) },
        },
        66: {
            title: "终于过了",
            description: "解锁下一层。同时，loader3229会复活并升级...",
            cost: new Decimal(1e100),
            unlocked() { return hasMilestone("l4",32) },
        },
    },
    buyables: {
        11: {
            title() {
                return "数据之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "数据";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5).mul(100)).mul("3.333e3333");
                return a;
            },
            canAfford() {
                return player.l1.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l1.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l1.color };
                }
            },
            unlocked(){return hasUpgrade("l4",15)}
        },
        12: {
            title() {
                return "转生之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "转生点数";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5).mul(30)).mul("1e920");
                return a;
            },
            canAfford() {
                return player.l2.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l2.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l2.color };
                }
            },
            unlocked(){return hasUpgrade("l4",25)}
        },
        13: {
            title() {
                return "本源之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "点数";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5).mul(100)).mul("1e3000");
                return a;
            },
            canAfford() {
                return player.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked(){return hasUpgrade("l4",35)}
        },
        21: {
            title() {
                return "复制之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(Decimal.pow(2,data.cost)) + "复制器";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(10, a.pow(1.5)).mul(1e50);
                return a;
            },
            canAfford() {
                return player.l1.repl.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l1.repl.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l1.color };
                }
            },
            unlocked(){return hasUpgrade("l4",45)}
        },
        22: {
            title() {
                return "奇点之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "奇点";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5));
                return a;
            },
            canAfford() {
                return player.l3.sing.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l3.sing.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l3.color };
                }
            },
            unlocked(){return hasUpgrade("l4",55)}
        },
        23: {
            title() {
                return "终极之剑";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "攻击力获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul(1e95);
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(2,player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked(){return hasUpgrade("l4",65)}
        },
        31: {
            title() {
                return "数据之盾";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "数据获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul("1e35");
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(1e10,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l4.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l1.color };
                }
            },
            unlocked(){return hasUpgrade("l4",16)}
        },
        32: {
            title() {
                return "转生之盾";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "转生点数获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul("1e40");
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(1e4,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l4.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l2.color };
                }
            },
            unlocked(){return hasUpgrade("l4",26)}
        },
        33: {
            title() {
                return "本源之盾";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "点数获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul("1e45");
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(1e20,player[this.layer].buyables[this.id]);
                return eff;
            },
            unlocked(){return hasUpgrade("l4",36)}
        },
        41: {
            title() {
                return "复制之盾";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "复制器获取^" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul("1e50");
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(1.5,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l4.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l1.color };
                }
            },
            unlocked(){return hasUpgrade("l4",46)}
        },
        42: {
            title() {
                return "奇点之盾";
            },
            display() {
                let data = tmp[this.layer].buyables[this.id];
                return "等级：" + format(player[this.layer].buyables[this.id]) + "<br>" +
                    "奇点获取x" + format(data.effect) + "<br>" +
                    "下一级需要" + format(data.cost) + "攻击力";
            },
            cost() {
                let a = player[this.layer].buyables[this.id];
                a = Decimal.pow(2, a.pow(1.5)).mul("1e55");
                return a;
            },
            canAfford() {
                return player.l4.points.gte(layers[this.layer].buyables[this.id].cost())
            },
            buy() {
                player.l4.points = player.l4.points.sub(layers[this.layer].buyables[this.id].cost())
                player[this.layer].buyables[this.id] = player[this.layer].buyables[this.id].add(1)
            },
            effect() {
                let eff = Decimal.pow(1.1,player[this.layer].buyables[this.id]);
                return eff;
            },
            style() {
                if (player.l4.points.gte(layers[this.layer].buyables[this.id].cost())) {
                    return { "background-color": layers.l3.color };
                }
            },
            unlocked(){return hasUpgrade("l4",56)}
        },
    },
});

setInterval(function () {
    if (player.l4 && player.l4.y && player.l4.dmg && layers.l4) player.l4.y = Decimal.sub(1024,player.l4.dmg.add(1).log2()).mul(0.01).add(player.l4.y.mul(0.99)).max(0), tmp.l4.bars.hp.fillStyle = layers.l4.bars.hp.fillStyle(), tmp.l4.bars.hp.baseStyle = layers.l4.bars.hp.baseStyle(), tmp.l4.bars.hp.progress = layers.l4.bars.hp.progress(), constructBarStyle("l4", "hp");
}, 10);
