let save = JSON.parse(localStorage.getItem("marketRogues")) || {
    prestige: 0,
    upgrades: {
        cash: 0,
        luck: 0,
        scan: 0
    }
};

let day = 1.00;

let cash = 1000 * (1 + (save.upgrades.cash * 0.10));
let prestigeCurrency = save.prestige;
let hedgeDays = 0;

let stocks = [];
let portfolio = {};

const stockColors = [
    "#00ff88",
    "#00aaff",
    "#ffaa00",
    "#ff44aa",
    "#ff4444",
    "#ffffff"
];

const names = [
    "NovaTech",
    "BioForge",
    "Quantum Mining",
    "Orbital Energy",
    "SynthAI",
    "DragonCoin",
    "Titan Systems",
    "Void Industries"
];

const sectors = [
    "AI",
    "Energy",
    "Crypto",
    "Mining",
    "Defense",
    "Biotech"
];

function rng(a,b){
    return Math.random() * (b-a) + a;
}

function createStocks(){

    stocks=[];

    for(let i=0;i<6;i++){

        let base = rng(20,100);

        stocks.push({

            name:
            names[Math.floor(Math.random()*names.length)]
            +" "
            +Math.floor(rng(1,99)),

            sector:
            sectors[Math.floor(Math.random()*sectors.length)],

            price:base,

            growth:rng(-0.0003,0.0008),

            volatility:rng(0.01,0.08),

            momentum:rng(-5,5),

            fundamentals:
            Math.floor(rng(20,100)),

            hype:
            Math.floor(rng(1,100)),

            stability:
            Math.floor(rng(20,100)),

            risk:0,

            dailyChange:0,

            signal:"➖ Sideways",

            history:[base]
        });

    }

}

createStocks();

function log(text){

    const div =
    document.getElementById("log");

    div.innerHTML =
    "<div>"+text+"</div>"
    +
    div.innerHTML;

}

function marketScan(){

    const best =
    [...stocks].sort(
        (a,b)=>
        (b.growth+b.fundamentals/1000)
        -
        (a.growth+a.fundamentals/1000)
    )[0];

    log(
        "🔍 Scan predicts " +
        best.name +
        " is trending upward."
    );

}

function hedge(){

    if(hedgeDays>0)
        return;

    hedgeDays=5;

    log(
        "🛡 Hedge activated."
    );

}

function randomEvent(){

    const roll =
    Math.random();

    if(roll<0.15){

        stocks.forEach(s=>{
            s.price*=1.05;
        });

        log("🚀 AI BOOM");

    }
    else if(roll<0.25){

        stocks.forEach(s=>{

            if(hedgeDays<=0){

                s.price*=0.95;

            }

        });

        log("💥 MARKET CRASH");

    }
    else if(roll<0.35){

        const target =
        stocks[
        Math.floor(
            Math.random()*stocks.length
        )
        ];

        target.price*=1.12;

        log(
            "🔥 MEME STOCK: "
            + target.name
        );

    }

}

function drawChart(){

    const canvas =
    document.getElementById(
        "marketChart"
    );

    if(!canvas) return;

    const ctx =
    canvas.getContext("2d");

    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle="#151515";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    let all=[];

    stocks.forEach(stock=>{

        all.push(
            ...stock.history
        );

    });

    const globalMin =
    Math.min(...all);

    let globalMax =
    Math.max(...all);

    if(globalMax===globalMin)
        globalMax++;

    stocks.forEach(
    (stock,index)=>{

        const color=
        stockColors[
        index%
        stockColors.length
        ];

        ctx.beginPath();
        ctx.strokeStyle=color;
        ctx.lineWidth=2;

        stock.history.forEach(
        (value,i)=>{

            const x=
            (
            i/
            (stock.history.length-1)
            )
            *
            canvas.width;

            const y=
            canvas.height
            -
            (
            (value-globalMin)
            /
            (globalMax-globalMin)
            )
            *
            canvas.height;

            if(i===0){

                ctx.moveTo(x,y);

            }else{

                ctx.lineTo(x,y);

            }

        });

        ctx.stroke();

    });

}

function tick(){

    day += 0.05;

    if(hedgeDays>0)
        hedgeDays--;

    stocks.forEach(stock=>{

        const oldPrice=
        stock.price;

        let move = 0;

        move += stock.growth;

        move +=
        stock.momentum
        *0.00001;

        move +=
        (
        stock.fundamentals
        -50
        )
        *0.000002;

        move +=
        (
        stock.hype
        -50
        )
        *0.000001;

        move +=
        (
        Math.random()-0.5
        )
        *
        stock.volatility
        *
        0.01;

        stock.price *=
        (1+move);

        if(stock.price<1)
            stock.price=1;

        stock.dailyChange =
        (
        (stock.price-oldPrice)
        /
        oldPrice
        )*100;

        stock.momentum =
        (
        stock.momentum
        *0.98
        )
        +
        (
        stock.dailyChange
        *0.02
        );

        stock.history.push(
            stock.price
        );

        if(
        stock.history.length>120
        ){
            stock.history.shift();
        }

        const avg5 =
        stock.history
        .slice(-5)
        .reduce((a,b)=>a+b,0)
        /
        Math.min(
        5,
        stock.history.length
        );

        const avg20 =
        stock.history
        .slice(-20)
        .reduce((a,b)=>a+b,0)
        /
        Math.min(
        20,
        stock.history.length
        );

        if(avg5>avg20*1.02){

            stock.signal =
            "🔥 Uptrend";

        }
        else if(
            avg5<avg20*0.98
        ){

            stock.signal =
            "💀 Downtrend";

        }
        else{

            stock.signal =
            "➖ Sideways";

        }

        stock.risk =
        stock.volatility*200
        +
        stock.hype*0.2
        +
        (
        100-stock.stability
        );

    });

    if(Math.random()<0.005)
        randomEvent();

    render();

}

function buy(i){

    const stock = stocks[i];

    if(!stock) return;

    if(cash >= stock.price){

        cash -= stock.price;

        portfolio[stock.name] =
        (portfolio[stock.name] || 0)
        + 1;

        log(
            "🟢 Bought 1 share of "
            + stock.name
            + " for $"
            + stock.price.toFixed(2)
        );

        render();

    }

}

function sell(i){

    const stock = stocks[i];

    if(!stock) return;

    if(
        (portfolio[stock.name] || 0)
        > 0
    ){

        portfolio[stock.name]--;

        cash += stock.price;

        log(
            "🔴 Sold 1 share of "
            + stock.name
            + " for $"
            + stock.price.toFixed(2)
        );

        render();

    }

}

function netWorth(){

    let worth = cash;

    stocks.forEach(stock=>{

        worth +=

        (
            portfolio[stock.name]
            || 0
        )

        *

        stock.price;

    });

    return worth;

}

function prestigeRun(){

    const wealth =
    netWorth();

    if(wealth < 10000){

        alert(
            "Need $10,000 net worth."
        );

        return;

    }

    const gain =
    Math.max(
        1,
        Math.floor(
            Math.sqrt(
                wealth / 10000
            )
        )
    );

    prestigeCurrency += gain;

    save.prestige =
    prestigeCurrency;

    localStorage.setItem(
        "marketRogues",
        JSON.stringify(save)
    );

    alert(
        "Gained "
        + gain
        + " prestige!"
    );

    location.reload();

}

function buyUpgrade(type){

    if(prestigeCurrency <= 0)
        return;

    prestigeCurrency--;

    save.prestige =
    prestigeCurrency;

    save.upgrades[type]++;

    localStorage.setItem(
        "marketRogues",
        JSON.stringify(save)
    );

    render();

}

