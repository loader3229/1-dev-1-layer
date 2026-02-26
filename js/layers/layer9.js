(() => {
const t = {
	direction: RIGHT,
	width: 300,
	height: 40,
	index: 0,
	name: '点数',
	op: '^',
	progress(){
		return player.l9.tuning[this.index].div(30).toNumber();
	},
	style()
	{
		if(player.l9.tuning[this.index].gte(30)) return {'color': 'orange'};
		if(player.l9.tuning[this.index].gte(20)) return {'color': 'green'};
		if(player.l9.tuning[this.index].gte(10)) return {'color': 'grey'};
		return {'color': 'red'};
	},
	display(){
		return '调律' + this.index + '[' + player.l9.tuning[this.index] + '](使' + this.name + '获取' + this.op + format(player.l9.tuning[this.index].div(10)) + ')';
	},
	unlocked(){
		return true;
	},
};
const tUp = {
	index: 0,
	display(){
		return '等级+1';
	},
	onClick(){
		player.l9.tuning[this.index] = player.l9.tuning[this.index].add(1).min(30);
	},
	style(){
		return {"min-height":"0px","height":"35px","width":"70px"};
	},
	canClick(){
		return player.l9.tuning[this.index].lt(30) && tmp.l9.availTunLevel.gte(1);
	},
	unlocked(){
		return true;
	}
};
const tDown = {
	index: 0,
	display(){
		return '等级-1';
	},
	onClick(){
		doReset('l9', true);
		player.l9.tuning[this.index] = player.l9.tuning[this.index].sub(1).max(0);
	},
	style(){
		return {"min-height":"0px","height":"35px","width":"70px"};
	},
	canClick(){
		return player.l9.tuning[this.index].gt(0);
	},
	unlocked(){
		return true;
	}
};
const unityBox = {
	title: '统一盒子',
	ed: '',
	op: '+',
	cost(x) {
		let base = n(1), mul = n(3);
		let ans = base.mul(mul.pow(x.pow(2)));
		return ans;
	},
	display() {
		return this.ed + '<br/>效果: ' + this.op + format(this.effect(getBuyableAmount(this.layer, this.id))) + '<br/>价格: ' + format(this.cost()) + ' 统一点数';
	},
	canAfford() {
		return player.l9.unityPoints.gte(this.cost());
	},
	buy() {
		player.l9.unityPoints = player.l9.unityPoints.sub(this.cost());
		setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
	},
	effect(x) {
		let base = n(0);
		return base;
	},
	unlocked() {
		return true;
	},
	style() { return {'border-radius': "10px",height: "120px", width: "120px", 'background-color': this.canAfford() ? 'orange' : ''}},
	tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
};

addLayer("l9", {
    infoboxes: {
        introBox: {
            title: "Layer 9",
            body() { return "本层由 Seanxlx 制作。" },
        },
        introBoxUnity: {
            title: "Layer 9.1",
            body() { return "本子层由 Seanxlx 制作。<br/>它的目的是提升玩家在前八层的Qol。" },
			style() { return {'border-color': 'orange'}; },
        },
    },
    name: "第九层 制作：Seanxlx",
    symbol: "E",
    position: 1,
    row: 9,
    branches: [],
    hotkeys: [
        { key: "9", description: "9：进行第九层重置", onPress() { if (canReset(this.layer)) doReset(this.layer) } },
    ],
    startData() {
        return {
            unlocked: true,
			points: n(0),
			total: n(0),
			intrinsic: n(0),
			intDim: [n(0), n(0), n(0), n(0), n(0), n(0)],
			tuning: [n(10), n(10), n(10), n(10), n(10), n(10), n(10), n(10), n(10)],
			unityPoints: n(0),
			unitied: false,
        }
    },
    color: "red",
    requires: new Decimal(1e300),
    resource: "本质",
    baseResource: "本质基础值",
    baseAmount() { return tmp.l9.basicAmount },
    type: "normal",
    exponent: 1 / 10,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    passiveGeneration() {
        let mult = 0
        return mult
    },
	basicAmount() {
		let base = n(1);
		for(let i = 1;i <= 4;i++) base = base.mul(tmp.l9['baFactor' + i]);
		//别的乘数在factor4里面加
		return base;
	},
	baFactor1() {
		let base = n(1);
		base = base.mul(player.points.add(1).log10().add(1).root(5));
		return base;
	},
	baFactor2() {
		let base = n(1);
		base = base.mul(layers.l4.total_bars().div(1024).add(1));
		return base;
	},
	baFactor3() {
		let base = n(1);
		return base;
	},
	baFactor4() { //这里给乘数
		let base = n(1);
		base = base.mul(buyableEffect('l9', 11));
		base = base.mul(buyableEffect('l9', 12));
		base = base.mul(buyableEffect('l9', 13));
		base = base.mul(tmp.l9.intEff1);
		base = base.pow(buyableEffect('l9', 14));
		base = base.pow(buyableEffect('l9', 15));
		base = base.pow(buyableEffect('l9', 16));
		return base;
	},
	intDimMult(id) {
		if(id === undefined) return n(0);
		let base = player.l9.intDim[id];
		if(id >= 0 && id <= 5) base = base.mul(buyableEffect('l9', 21 + id));
		base = base.mul(tmp.l9.intTickspeed); //不吃指数，放在pow后面
		return base;
	},
	intDimDesc(id) {
		let n = ['一', '二', '三', '四', '五', '六'];
		return '第' + n[id] + '本征维度[' + format(player.l9.intDim[id]) + ']<br />产量: ' + format(layers.l9.intDimMult(id)) + '/s';
	},
	intEff1() {
		let base = player.l9.intrinsic.add(1);
		return base;
	},
	intTickspeed() {
		let base = n(1);
		base = base.mul(buyableEffect('l9', 31));
		return base;
	},
	tunLevelMax() {
		let base = n(90);
		base = base.add(buyableEffect('l9', 41));
		base = base.add(buyableEffect('l9', 42));
		base = base.add(buyableEffect('l9', 43));
		return base;
	},
	availTunLevel() {
		let max = tmp.l9.tunLevelMax;
		for(let i = 0;i < 9;i++) max = max.sub(player.l9.tuning[i]);
		return max;
	},
	uPGain() {
		let base = n(0);
		if(!player.l9.unitied) base = base.add(2);
		base = base.add(player.l9.points.root(2).mul(2));
		return base.floor();
	},
    update(diff) {
		if(layers.l9.intDimMult(0).gt(0)) player.l9.intrinsic = player.l9.intrinsic.add(layers.l9.intDimMult(0).mul(diff));
		for(let i = 1;i <= 5;i++)
		{
			if(layers.l9.intDimMult(i).gt(0)) player.l9.intDim[i - 1] = player.l9.intDim[i - 1].add(layers.l9.intDimMult(i).mul(diff));
		}
    },
    milestones: {
    },
    upgrades: {
		11: {
            title: '本源利用 I',
            description: '解锁调律流形。',
            cost: n(1),
            unlocked() { return true; },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
					'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
					'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
					'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
				}; 
			},
        },
		12: {
            title: '本源利用 II',
            description: '解锁频率跃迁。',
            cost: n(1),
            unlocked() { return true; },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
					'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
					'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
					'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
				}; 
			},
        },
		13: {
            title: '本源利用 III',
            description: '解锁统一盒子。',
            cost: n(1),
            unlocked() { return true; },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
					'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
					'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
					'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
				}; 
			},
        },
		14: {
            title: '本源利用 IV',
            description: '解锁原始黑洞。',
            cost: n(1),
            unlocked() { return true; },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
					'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
					'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
					'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
				}; 
			},
        },
		15: {
            title: '本源利用 V',
            description: '解锁生物炼金。',
            cost: n(1),
            unlocked() { return true; },
			style() {
				return {
					'border-radius': '0px',
					'border': hasUpgrade(this.layer, this.id) ? '2px solid red' : '',
					'box-shadow': hasUpgrade(this.layer, this.id) ? '0px 0px 16px 6px red' : '',
					'background-color': hasUpgrade(this.layer, this.id) ? 'black' : '',
					'background-image': hasUpgrade(this.layer, this.id) ? 'repeating-linear-gradient(to bottom,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px),repeating-linear-gradient(to right,transparent 1px,transparent 26px,rgba(238, 72, 72, 0.2) 28px,rgba(238, 72, 72, 0.2) 30px)' : '',
					'background-size': hasUpgrade(this.layer, this.id) ? '200% 200%' : '',
					'animation': hasUpgrade(this.layer, this.id) ? 'bgScroll 2s linear infinite' : '',
					'color': hasUpgrade(this.layer, this.id) ? 'white' : 'black',
				}; 
			},
        },
    },
	buyables: {
		11: {
			title: '本质基础增幅器',
			cost(x) {
				let base = n(1), mul = n(2);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		12: {
			title: '点数基础增幅器',
			cost(x) {
				let base = n(1e10), mul = n(10);
				let ans = base.mul(mul.pow(x)).pow_base(10);
				return ans;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 点数<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		13: {
			title: '本征基础增幅器',
			cost(x) {
				let base = n(1e10), mul = n(1e5);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '增幅本质基础值。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l9.intrinsic.gte(this.cost());
			},
			buy() {
				player.l9.intrinsic = player.l9.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		14: {
			title: '本质基础强化器',
			cost(x) {
				let base = n(100), mul = n(100);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		15: {
			title: '点数基础强化器',
			cost(x) {
				let base = n(1e100), mul = n(1e10);
				let ans = base.mul(mul.pow(x)).pow_base(10);
				return ans;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 点数<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.points.gte(this.cost());
			},
			buy() {
				player.points = player.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		16: {
			title: '本征基础强化器',
			cost(x) {
				let base = n(1e100), mul = n(1e50);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '增幅本质基础值乘数。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: ^' + format(this.effect());
			},
			canAfford() {
				return player.l9.intrinsic.gte(this.cost());
			},
			buy() {
				player.l9.intrinsic = player.l9.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.add(1).log10().add(1);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		21: {
			title: '第一维度增益x2',
			cost(x) {
				let base = n(1), mul = n(2);
				let ans = base.mul(mul.pow(x));
				return ans.sub(1);
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost()) && player.l9.total.gt(0);
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[0] = player.l9.intDim[0].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		22: {
			title: '第二维度增益x2',
			cost(x) {
				let base = n(1), mul = n(3);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[1] = player.l9.intDim[1].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		23: {
			title: '第三维度增益x2',
			cost(x) {
				let base = n(5), mul = n(5);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[2] = player.l9.intDim[2].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		24: {
			title: '第四维度增益x2',
			cost(x) {
				let base = n(100), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[3] = player.l9.intDim[3].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		25: {
			title: '第五维度增益x2',
			cost(x) {
				let base = n(1e9), mul = n(1000);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[4] = player.l9.intDim[4].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		26: {
			title: '第六维度增益x2',
			cost(x) {
				let base = n(1e20), mul = n(1e5);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '价格: ' + format(this.cost()) + ' 本质';
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				player.l9.intDim[5] = player.l9.intDim[5].add(1);
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(2);
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "50px", width: "200px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		31: {
			title: '本质频率',
			cost(x) {
				let base = n(1), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			base() {
				let base = n(2);
				base = base.add(buyableEffect('l9', 32));
				return base;
			},
			display() {
				return '增幅本征频率x' + format(this.base(), 1) + '。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(this.base());
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		32: {
			title: '本质频率强化',
			cost(x) {
				let base = n(1), mul = n(1e10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '增幅本质频率底数+0.2。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x.mul(0.2);
				base = base.mul(buyableEffect('l9', 33));
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		33: {
			title: '频率跃迁',
			cost(x) {
				let base = n(1e10), mul = n(1e5);
				let ans = base.mul(mul.pow(x.pow(2)));
				return ans;
			},
			display() {
				return '增幅本质频率强化x1.1。<br>价格: ' + format(this.cost()) + ' 本征能量<br>效果: x' + format(this.effect());
			},
			canAfford() {
				return player.l9.intrinsic.gte(this.cost());
			},
			buy() {
				player.l9.intrinsic = player.l9.intrinsic.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(1);
				let base = x.pow_base(1.1);
				return base;
			},
			unlocked() {
				return hasUpgrade('l9', 12);
			},
            style() { return {'border-radius': "10px",height: "133px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		41: {
			title: '流形扩容 I',
			cost(x) {
				let base = n(1), mul = n(4);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		42: {
			title: '流形扩容 II',
			cost(x) {
				let base = n(1), mul = n(10);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		43: {
			title: '流形扩容 III',
			cost(x) {
				let base = n(5), mul = n(50);
				let ans = base.mul(mul.pow(x));
				return ans;
			},
			display() {
				return '调律能级上限+1。<br>价格: ' + format(this.cost()) + ' 本质<br>效果: +' + format(this.effect());
			},
			canAfford() {
				return player.l9.points.gte(this.cost());
			},
			buy() {
				player.l9.points = player.l9.points.sub(this.cost());
				setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
			},
			effect(x) {
				if(x.lt(1)) return n(0);
				let base = x;
				return base;
			},
			unlocked() {
				return true;
			},
            style() { return {'border-radius': "10px",height: "80px", width: "175px"}},
            tooltip(){return "数量: <h2 style='color:red;text-shadow:0px 0px 10px;'>"+ format(getBuyableAmount(this.layer,this.id),0) + "</h2>"},
		},
		//Line 100 WIP
		1001: {
			...unityBox,
			title: '点数增益',
			ed: '倍数增幅点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1002: {
			...unityBox,
			title: '点数之力',
			ed: '指数增幅点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1003: {
			...unityBox,
			title: '点数增强',
			ed: '点数增幅点数',
			op: 'x',
			effect(x) {
				return player.points.add(1).ln().add(1).pow(x);
			},
		},
		1004: {
			...unityBox,
			title: '点数继承',
			ed: '数据增幅点数',
			op: 'x',
			effect(x) {
				return player.l1.points.add(1).ln().add(1).pow(x);
			},
		},
		1005: {
			...unityBox,
			title: '点数本质',
			ed: '累计本质增幅点数',
			op: '^',
			effect(x) {
				return player.l9.total.add(1).ln().mul(0.001).mul(x).add(1).root(10);
			},
		},
		//Line 101 WIP
		1011: {
			...unityBox,
			title: '点数赋能',
			ed: '增强"重复了无数遍的开始"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1012: {
			...unityBox,
			title: '点数增殖',
			ed: '增强复制器第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1013: {
			...unityBox,
			title: '点数之心',
			ed: '增强核心增益V',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1014: {
			...unityBox,
			title: '点数密度',
			ed: '增强致密点数第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1015: {
			...unityBox,
			title: '点数起源',
			ed: '增强"你曾从这里开始"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 102 WIP
		1021: {
			...unityBox,
			title: '点数扩散',
			ed: '增强"回望往事"',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		1022: {
			...unityBox,
			title: '点数充能',
			ed: '在硬上限之后增强"收入囊中"',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		1023: {
			...unityBox,
			title: '点数回荡',
			ed: '增加"尘埃回荡"效果',
			op: '+',
			effect(x) {
				return x.mul(0.01);
			},
		},
		1024: {
			...unityBox,
			title: '点数突击',
			ed: '增加"两面突击"效果',
			op: '+',
			effect(x) {
				return x.mul(0.01);
			},
		},
		1025: {
			...unityBox,
			title: '点数末日',
			ed: '增强奇点第一效果',
			op: '^',
			effect(x) {
				return x.add(1).log10().mul(0.05).add(1);
			},
		},
		//Line 103 WIP
		1031: {
			...unityBox,
			title: '数据增益',
			ed: '倍数增幅数据',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1032: {
			...unityBox,
			title: '数据之力',
			ed: '指数增幅数据',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1033: {
			...unityBox,
			title: '数据神力',
			ed: '根据点数指数增幅数据',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.points.pow(x).add(10).log10().log10().div(100).add(1);
			},
		},
		1034: {
			...unityBox,
			title: '数据开辟',
			ed: '增强"又来了"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1035: {
			...unityBox,
			title: '数据递归',
			ed: '增强"递归"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 104 WIP
		1041: {
			...unityBox,
			title: '数据归并',
			ed: '增强"递归递归"',
			op: 'x',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1042: {
			...unityBox,
			title: '数据合流',
			ed: '增强复制器第二效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1043: {
			...unityBox,
			title: '数据抉择',
			ed: '硬上限之后增强"艰难的抉择"效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1044: {
			...unityBox,
			title: '数据强化',
			ed: '增强"内存升级"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1045: {
			...unityBox,
			title: '数据学习',
			ed: '增强"转生复制器"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 105 WIP
		1051: {
			...unityBox,
			title: '复制能量',
			ed: '增幅复制器获取',
			op: '^',
			effect(x) {
				return x.pow_base(2);
			},
		},
		1052: {
			...unityBox,
			title: '复制韧性',
			ed: '增强复制器第三效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1053: {
			...unityBox,
			title: '复制命格',
			ed: '增强"让生命蓬勃生长"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1054: {
			...unityBox,
			title: '复制时光',
			ed: '增强"驻足现在"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1055: {
			...unityBox,
			title: '复制防御',
			ed: '增强复制之盾',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 106 WIP
		1061: {
			...unityBox,
			title: '转生增益',
			ed: '倍数增幅转生点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e10);
			},
		},
		1062: {
			...unityBox,
			title: '转生之力',
			ed: '指数增幅转生点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1063: {
			...unityBox,
			title: '转生核心',
			ed: '增强核心增益II',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1064: {
			...unityBox,
			title: '转生之路',
			ed: '增强"又来这一套"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1065: {
			...unityBox,
			title: '转生增幅',
			ed: '增强"增幅器II-B"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 107 WIP
		1071: {
			...unityBox,
			title: '核心力量',
			ed: '增强核心增益I~V',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1072: {
			...unityBox,
			title: '核心优惠',
			ed: '增强"增幅器III-C"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1073: {
			...unityBox,
			title: '核心复制',
			ed: '增强"增幅器IV-C"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1074: {
			...unityBox,
			title: '核心压缩',
			ed: '增强"让空间压缩能量"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1075: {
			...unityBox,
			title: '核心振幅',
			ed: '增强"核心共振"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 108 WIP
		1081: {
			...unityBox,
			title: '转生攻击',
			ed: '增强"转生加成"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1082: {
			...unityBox,
			title: '转生防御',
			ed: '增强转生之盾',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1083: {
			...unityBox,
			title: '转生武器',
			ed: '增强转生之剑',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1084: {
			...unityBox,
			title: '转生连携',
			ed: '数据增强转生点数',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.points.pow(x).add(10).log10().log10().mul(0.05).add(1);
			},
		},
		1085: {
			...unityBox,
			title: '转生反制',
			ed: '转生点数增强数据',
			op: '^',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.l2.points.pow(x).add(10).log10().log10().mul(0.05).add(1);
			},
		},
		//Line 109 WIP
		1091: {
			...unityBox,
			title: '致密增益',
			ed: '倍数增幅致密点数',
			op: 'x',
			effect(x) {
				return x.pow_base(1e5);
			},
		},
		1092: {
			...unityBox,
			title: '致密之力',
			ed: '指数增幅致密点数',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1093: {
			...unityBox,
			title: '致密回归',
			ed: '增强"你再次回到这里"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1094: {
			...unityBox,
			title: '致密增幅',
			ed: '增强"增幅器IV-D"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1095: {
			...unityBox,
			title: '致密锋锐',
			ed: '增强"致密加成I/II"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 110 WIP
		1101: {
			...unityBox,
			title: '奇点增益',
			ed: '倍数增幅奇点',
			op: 'x',
			effect(x) {
				return x.pow_base(3);
			},
		},
		1102: {
			...unityBox,
			title: '奇点之力',
			ed: '指数增幅奇点',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1103: {
			...unityBox,
			title: '奇点过载',
			ed: '增强"QoL?"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1104: {
			...unityBox,
			title: '奇点增重',
			ed: '增强"奇点加成"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1105: {
			...unityBox,
			title: '奇点武器',
			ed: '增强奇点之剑',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 111 WIP
		1111: {
			...unityBox,
			title: '攻击增益',
			ed: '倍数增幅攻击力',
			op: 'x',
			effect(x) {
				return x.pow_base(1e5);
			},
		},
		1112: {
			...unityBox,
			title: '攻击之力',
			ed: '指数增幅攻击力',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1113: {
			...unityBox,
			title: '火力压制',
			ed: '增强所有武器',
			op: '^',
			effect(x) {
				return x.mul(0.03).add(1);
			},
		},
		1114: {
			...unityBox,
			title: '坚不可摧',
			ed: '增强所有防具',
			op: '^',
			effect(x) {
				return x.mul(0.03).add(1);
			},
		},
		1115: {
			...unityBox,
			title: '十项全能',
			ed: '增强所有武器和防具',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		//Line 112 WIP
		1121: {
			...unityBox,
			title: '超能武器',
			ed: '获得额外的终极之剑',
			op: '+',
			effect(x) {
				return x.mul(5);
			},
		},
		1122: {
			...unityBox,
			title: '超能防具',
			ed: '获得额外的终极之盾',
			op: '+',
			effect(x) {
				return x.mul(5);
			},
		},
		1123: {
			...unityBox,
			title: '全能配组',
			ed: '获得额外的终极之剑和终极之盾',
			op: '+',
			effect(x) {
				return x.mul(2);
			},
		},
		1124: {
			...unityBox,
			title: '全副武装',
			ed: '获得额外的所有武器和防具（除了终极系列）',
			op: '^',
			effect(x) {
				return x;
			},
		},
		1125: {
			...unityBox,
			title: '攻击飞升',
			ed: '增强攻击精华',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 113 WIP
		1131: {
			...unityBox,
			title: '飞升增益',
			ed: '倍数增幅飞升点数',
			op: 'x',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1132: {
			...unityBox,
			title: '不是挑战',
			ed: '增强"反-复制器"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1133: {
			...unityBox,
			title: '迎难而上',
			ed: '增强"数据溢出"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1134: {
			...unityBox,
			title: '有志竟成',
			ed: '增强"核心崩坏"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1135: {
			...unityBox,
			title: '勇攀高峰',
			ed: '增强"压缩失效"的奖励',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		//Line 114 WIP
		1141: {
			...unityBox,
			title: '精华增益',
			ed: '倍数增幅飞升精华',
			op: 'x',
			effect(x) {
				return x.pow_base(100);
			},
		},
		1142: {
			...unityBox,
			title: '飞升飞升',
			ed: '增强飞升点数第一效果',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1143: {
			...unityBox,
			title: '奇点飞升',
			ed: '增强"奇点精华"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1144: {
			...unityBox,
			title: '点数飞升',
			ed: '增强"点数精华"',
			op: '^',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1145: {
			...unityBox,
			title: '飞升之魂',
			ed: '飞升点数增强点数获取',
			op: 'x',
			effect(x) {
				if(x.lt(1)) return n(1);
				return player.l5.points.pow(x.add(1).log(2)).pow_base(2);
			},
		},
		//Line 115 WIP
		1151: {
			...unityBox,
			title: '遗迹增益',
			ed: '倍数增幅遗迹点数',
			op: 'x',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1152: {
			...unityBox,
			title: '能量增益',
			ed: '倍数增幅能量',
			op: 'x',
			effect(x) {
				return x.pow_base(1e4);
			},
		},
		1153: {
			...unityBox,
			title: '能量之力',
			ed: '指数增幅能量',
			op: '^',
			effect(x) {
				return x.mul(0.01).add(1);
			},
		},
		1154: {
			...unityBox,
			title: '维度增益',
			ed: '倍数增益维度数量',
			op: 'x',
			effect(x) {
				return x.mul(0.05).add(1);
			},
		},
		1155: {
			...unityBox,
			title: '碎片增益',
			ed: '增加额外遗迹碎片',
			op: '+',
			effect(x) {
				return x;
			},
		},
	},
    challenges: {
    },
	clickables: {
		tu0: {...tUp,index: 0},
		tu1: {...tUp,index: 1},
		tu2: {...tUp,index: 2},
		tu3: {...tUp,index: 3},
		tu4: {...tUp,index: 4},
		tu5: {...tUp,index: 5},
		tu6: {...tUp,index: 6},
		tu7: {...tUp,index: 7},
		tu8: {...tUp,index: 8},
		td0: {...tDown,index: 0},
		td1: {...tDown,index: 1},
		td2: {...tDown,index: 2},
		td3: {...tDown,index: 3},
		td4: {...tDown,index: 4},
		td5: {...tDown,index: 5},
		td6: {...tDown,index: 6},
		td7: {...tDown,index: 7},
		td8: {...tDown,index: 8},
		uR: {
			display(){
				return '<h3>+' + format(tmp.l9.uPGain) + ' 统一点数</h3>';
			},
			onClick(){
				player.l9.unityPoints = player.l9.unityPoints.add(tmp.l9.uPGain);
				player.l9.points = n(0);
				player.l9.unitied = true;
			},
			style(){
				return {"min-height":"0px","height":"120px","width":"180px","background-color":this.canClick() ? "orange" : ""};
			},
			canClick(){
				return tmp.l9.uPGain.gte(1);
			},
			unlocked(){
				return true;
			}
		},
	},
	bars: {
		t0: {
			...t,
			index: 0,
			name: '点数',
			op: '^',
		},
		t1: {
			...t,
			index: 1,
			name: '数据',
			op: '^',
		},
		t2: {
			...t,
			index: 2,
			name: '转生点数',
			op: '^',
		},
		t3: {
			...t,
			index: 3,
			name: '致密点数',
			op: '^',
		},
		t4: {
			...t,
			index: 4,
			name: '攻击力',
			op: '^',
		},
		t5: {
			...t,
			index: 5,
			name: '飞升点数',
			op: 'x',
		},
		t6: {
			...t,
			index: 6,
			name: '遗迹',
			op: 'x',
		},
		t7: {
			...t,
			index: 7,
			name: '???',
			op: '^',
		},
		t8: {
			...t,
			index: 8,
			name: '???',
			op: '^',
		},
	},
	microtabs: {
		main: {
			'本质基础值': {
				content: [
                    ['display-text', function() {return '当前本质基础值：<h2 style="color: red">' + format(tmp.l9.basicAmount) + '</h2><br />';}],
					['blank'],
					['display-text', function() {return '由点数提供了<h3 style="color: red">x' + format(tmp.l9.baFactor1) + '</h3><br />';}],
					['display-text', function() {return '由打破的loader3229血条提供了<h3 style="color: red">x' + format(tmp.l9.baFactor2) + '</h3><br />';}],
					['display-text', function() {return '由？？？资源提供了<h3 style="color: red">x' + format(tmp.l9.baFactor3) + '</h3><br />';}],
					['display-text', function() {return '由其它乘数提供了<h3 style="color: #900">x' + format(tmp.l9.baFactor4) + '</h3><br />';}],
					['row', [['buyable', 11], ['buyable', 12], ['buyable', 13]]],
					['row', [['buyable', 14], ['buyable', 15], ['buyable', 16]]],
				],
                unlocked() {
                    return true;
                },
			},
			'本征维度': {
				content: [
                    ['display-text', function() {return '本征能量：<h2 style="color: #f60">' + format(player.l9.intrinsic) + '</h2><br />';}],
					['display-text', function() {return '本征能量让本质基础值x' + format(tmp.l9.intEff1) + '<br />';}],
					['display-text', '需要累计本质超过0才能购买第一本征维度。'],
					['blank'],
					['row', [['display-text', function() {return layers.l9.intDimDesc(0);}], ['buyable', 21]]],
					['row', [['display-text', function() {return layers.l9.intDimDesc(1);}], ['buyable', 22]]],
					['row', [['display-text', function() {return layers.l9.intDimDesc(2);}], ['buyable', 23]]],
					['row', [['display-text', function() {return layers.l9.intDimDesc(3);}], ['buyable', 24]]],
					['row', [['display-text', function() {return layers.l9.intDimDesc(4);}], ['buyable', 25]]],
					['row', [['display-text', function() {return layers.l9.intDimDesc(5);}], ['buyable', 26]]],
				],
                unlocked() {
                    return true;
                },
			},
			'本征频率': {
				content: [
                    ['display-text', function() {return '当前本征计数频率：<h2 style="color: #f60">' + format(tmp.l9.intTickspeed) + '</h2><br />';}],
					['display-text', function() {return '计数频率会直接倍增本征能量产量，不受到乘数指数的影响。';}],
					['blank'],
					['row', [['buyable', 31], ['buyable', 32]]],
					['display-text', function() {if(hasUpgrade('l9', 12)) return '频率跃迁将消耗本征能量并提升本质频率强化的效果。';}],
					['row', [['buyable', 33]]],
				],
                unlocked() {
                    return true;
                },
			},
			'调律流形': {
				content: [
					['display-text', function() {return '调律流形中，可以调整资源获取的调律能级。初始调律能级均为10级，最低0级，最高30级。';}],
					['display-text', function() {return '调律能级低于10时，资源获取速度会被削弱。高于10时，资源获取速度会被增强。';}],
					['display-text', function() {return '当前调律能级：' + format(tmp.l9.availTunLevel) + '/' + format(tmp.l9.tunLevelMax);}],
					['display-text', function() {return '<h2>全部效果均未实装</h2>';}],
					['row', [['buyable', 41], ['buyable', 42], ['buyable', 43]]],
					['row', [['bar', 't0'], ['clickable', 'tu0'], ['clickable', 'td0']]],
					['row', [['bar', 't1'], ['clickable', 'tu1'], ['clickable', 'td1']]],
					['row', [['bar', 't2'], ['clickable', 'tu2'], ['clickable', 'td2']]],
					['row', [['bar', 't3'], ['clickable', 'tu3'], ['clickable', 'td3']]],
					['row', [['bar', 't4'], ['clickable', 'tu4'], ['clickable', 'td4']]],
					['row', [['bar', 't5'], ['clickable', 'tu5'], ['clickable', 'td5']]],
					['row', [['bar', 't6'], ['clickable', 'tu6'], ['clickable', 'td6']]],
					['row', [['bar', 't7'], ['clickable', 'tu7'], ['clickable', 'td7']]],
					['row', [['bar', 't8'], ['clickable', 'tu8'], ['clickable', 'td8']]],
				],
				unlocked() {
					return hasUpgrade('l9', 11);
				},
			},
		},
		unity: {
			'统一盒子': {
				content: [
					['display-text', function() {return '使用统一点数来购买统一盒子。它们对之前的层级产生提升！';}],
					['microtabs', 'unityBox'],
					['display-text', function() {return '<br /><br /><br />';}],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
		},
		unityBox: {
			'点数': {
				content: [
					['buyables', [100, 101, 102]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
			'数据': {
				content: [
					['buyables', [103, 104, 105]],
				],
				buttonStyle() {return {'border-color': 'white'};},
			},
			'转生点数': {
				content: [
					['buyables', [106, 107, 108]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 0, 195)'};},
			},
			'致密点数': {
				content: [
					['buyables', [109, 110]],
				],
				buttonStyle() {return {'border-color': 'rgb(0, 210, 224)'};},
			},
			'攻击力': {
				content: [
					['buyables', [111, 112]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 153, 17)'};},
			},
			'飞升点数': {
				content: [
					['buyables', [113, 114]],
				],
				buttonStyle() {return {'border-color': 'rgb(255, 255, 0)'};},
			},
			'遗迹': {
				content: [
					['buyables', [115]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
			'？': {
				content: [
					['buyables', [116]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
			'？？': {
				content: [
					['buyables', [117]],
				],
				buttonStyle() {return {'border-color': 'orange'};},
			},
		},
	},
    tabFormat: {
        '主页': {
            content: [['infobox', 'introBox'],
                'main-display',
                'prestige-button',
                'resource-display',
                'blank',
				['upgrades', [1]],
				['microtabs', 'main'],
            ],
        },
		'统一': {
			content: [['infobox', 'introBoxUnity'],
				['display-text', function() {return '你有 <h2 style="color: orange; text-shadow: 0px 0px 2px orange">' + format(player.l9.unityPoints) + '</h2> 统一点数';}],
				['display-text', function() {return '统一重置会消耗全部本质并附加一次本质重置。首次统一重置额外+2统一点数。<br /><br />'}],
				['clickable', 'uR'],
				['microtabs', 'unity'],
			],
			unlocked() {
				return hasUpgrade('l9', 13);
			},
			buttonStyle() {return {'border-color': 'orange'};},
		},
    },
    layerShown() { return true },
    autoUpgrade() { return false },
    doReset(resettingLayer) {
        let keep = [];
        if (layers[resettingLayer].row > this.row) layerDataReset("l9", keep);
    },
})
})();