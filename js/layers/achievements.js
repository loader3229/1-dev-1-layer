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
        15: {
            name: '开始攻击',
            done() { return player.l4.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次攻击力重置。',
            textStyle: { 'color': '#FFDD33' },
        },
        16: {
            name: '攻击提升',
            done() { return hasUpgrade("l4", 15) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁武器。',
            textStyle: { 'color': '#FFDD33' },
        },
        21: {
            name: '攻防结合',
            done() { return hasUpgrade("l4", 16) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁防具。',
            textStyle: { 'color': '#FFDD33' },
        },
        22: {
            name: '飞升天堂',
            done() { return player.l5.points.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '进行一次飞升重置。',
            textStyle: { 'color': '#FFDD33' },
        },
        23: {
            name: '提纯飞升',
            done() { return player.l5.essence.gt(0) },
            onComplete() { player.AC.points = player.AC.points.add(1) },
            tooltip: '解锁飞升精华。',
            textStyle: { 'color': '#FFDD33' },
        },
    },
},
)