let save = JSON.parse(localStorage.getItem("marketRogues")) || {

    prestige: 0,

    upgrades: {
        cash: 0,
        luck: 0,
        scan: 0
    }

};

let day = 1.0;

let cash =
    1000 *
    (1 + (save.upgrades.cash * 0.10));

let prestigeCurrency = save.prestige;

let hedgeDays = 0;

let stocks = [];

let portfolio = {};

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

function rng(a, b) {
    return Math.random() * (b - a) + a;
}

function createStocks() {

    stocks = [];

    for (let i = 0; i < 6; i++) {

        let base = rng(20, 100);

        stocks.push({

            name:
                names[Math.floor(
                    Math.random() * names.length
                )] +
                " " +
                Math.floor(rng(1, 99)),

            sector: [
                "AI",
                "Energy",
                "Crypto",
                "Mining",
                "Defense",
                "Biotech"
            ][Math.floor(Math.random() * 6)],

            price: base,

            growth: rng(-0.02, 0.05),

            volatility: rng(0.03, 0.18),

            momentum: rng(-25, 25),

            fundamentals:
                Math.floor(rng(1, 100)),

            hype:
                Math.floor(rng(1, 100)),

            stability:
                Math.floor(rng(1, 100)),

            risk: 0,

            dailyChange: 0,

            signal: "➖ Sideways",

            history: [base]

        });

    }

}

createStocks();

function log(text) {

    let div = document.getElementById("log");

    div.innerHTML =
        "<div>" + text + "</div>" +
        div.innerHTML;

}

function marketScan() {

    let best = [...stocks]
        .sort(
            (a, b) =>
                (b.growth + b.momentum / 100)
                -
                (a.growth + a.momentum / 100)
        )[0];

    log(
        "🔍 Scan predicts " +
        best.name +
        " is trending upward."
    );

}

function hedge() {

    if (hedgeDays > 0) {
        return;
    }

    hedgeDays = 5;

    log("🛡 Hedge activated.");

}

function randomEvent() {

    let roll = Math.random();

    if (roll < 0.15) {

        stocks.forEach(s => {

            s.price *= 1.4;

        });

        log("🚀 AI BOOM");

    }

    else if (roll < 0.25) {

        stocks.forEach(s => {

            if (hedgeDays <= 0)
                s.price *= 0.70;

        });

        log("💥 MARKET CRASH");

    }

    else if (roll < 0.35) {

        let target =
            stocks[
            Math.floor(
                Math.random() * stocks.length
            )
            ];

        target.price *= 2;

        log(
            "🔥 MEME STOCK: "
            + target.name
        );

    }

}

function tick() {

    day+= 0.2;

    if (hedgeDays > 0)
        hedgeDays--;

    stocks.forEach(stock => {

        let oldPrice = stock.price;

        let move =

            stock.growth +

            (stock.momentum / 2000) +

            ((stock.fundamentals - 50) / 5000) +

            ((stock.hype - 50) / 8000) +

            ((Math.random() - 0.5)
                * stock.volatility);

        stock.price *= 1 + move;

        if (stock.price < 1)
            stock.price = 1;

        stock.dailyChange =
            (
                (stock.price - oldPrice)
                /
                oldPrice
            ) * 100;

        stock.momentum =
            (stock.momentum * 0.8)
            +
            (stock.dailyChange * 0.6);

        stock.history.push(stock.price);

        if (stock.history.length > 20)
            stock.history.shift();

        let avg5 =
            stock.history
                .slice(-5)
                .reduce((a, b) => a + b, 0)
            /
            Math.min(
                5,
                stock.history.length
            );

        let avg10 =
            stock.history
                .slice(-10)
                .reduce((a, b) => a + b, 0)
            /
            Math.min(
                10,
                stock.history.length
            );

        if (avg5 > avg10 * 1.05) {

            stock.signal =
                "🔥 Uptrend";

        }
        else if (avg5 < avg10 * 0.95) {

            stock.signal =
                "💀 Downtrend";

        }
        else {

            stock.signal =
                "➖ Sideways";

        }

        stock.risk =

            (stock.volatility * 300)

            +

            (stock.hype * 0.4)

            +

            (100 - stock.stability);

    });

    if (Math.random() < 0.35)
        randomEvent();

    render();

}

function buy(i) {

    let stock = stocks[i];

    if (cash >= stock.price) {

        cash -= stock.price;

        portfolio[stock.name] =
            (portfolio[stock.name] || 0) + 1;

        render();

    }

}

function sell(i) {

    let stock = stocks[i];

    if ((portfolio[stock.name] || 0) > 0) {

        portfolio[stock.name]--;

        cash += stock.price;

        render();

    }

}

function netWorth() {

    let worth = cash;

    stocks.forEach(s => {

        worth +=
            (portfolio[s.name] || 0)
            * s.price;

    });

    return worth;

}

function prestigeRun() {

    let wealth = netWorth();

    if (wealth < 10000) {

        alert(
            "Need $10,000 net worth."
        );

        return;

    }

    let gain =
        Math.floor(
            Math.sqrt(
                wealth / 10000
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
        "Prestiged for "
        +
        gain
        +
        " Prestige!"
    );

    location.reload();

}

function buyUpgrade(type) {

    if (prestigeCurrency <= 0)
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

function render() {

    document.getElementById(
        "cash"
    ).textContent =
        Math.floor(cash);

    document.getElementById(
        "worth"
    ).textContent =
        Math.floor(netWorth());

    document.getElementById(
    "day"
).textContent=
day.toFixed(1);

    document.getElementById(
        "prestige"
    ).textContent =
        prestigeCurrency;

    let stockHTML = "";

    stocks.forEach((s, i) => {

        let dailyColor =
            s.dailyChange >= 0
                ? "#44ff66"
                : "#ff4444";

        let riskColor =
            s.risk > 70
                ? "#ff4444"
                :
                s.risk > 40
                    ? "#ffaa00"
                    : "#44ff66";

        stockHTML += `

<div class="stock">

<h3>${s.name}</h3>

<b>
$${s.price.toFixed(2)}
</b>

<br>

<span style="
color:${dailyColor};
font-weight:bold;
">

${s.dailyChange >= 0 ? "+" : ""}
${s.dailyChange.toFixed(2)}%

</span>

<hr>

Sector:
${s.sector}

<br>

Signal:
${s.signal}

<br>

Growth:

<span style="
color:
${s.growth >= 0
                ? '#44ff66'
                : '#ff4444'};
">

${s.growth >= 0 ? "+" : ""}
${(s.growth * 100).toFixed(2)}%

</span>

<br>

Momentum:
${s.momentum.toFixed(1)}

<br>

Volatility:
${(s.volatility * 100).toFixed(1)}%

<br>

Fundamentals:
${s.fundamentals}

<br>

Hype:
${s.hype}

<br>

Stability:
${s.stability}

<br>

Risk:

<span style="
color:${riskColor};
">

${s.risk.toFixed(0)}

</span>

<hr>

Owned:
${portfolio[s.name] || 0}

<br>

Recent:

<div style="
font-size:11px;
color:#999;
">

${s.history
                .slice(-5)
                .map(v => "$" + v.toFixed(0))
                .join(" → ")}

</div>

<br>

<button onclick="buy(${i})">
Buy
</button>

<button onclick="sell(${i})">
Sell
</button>

</div>

`;

    });

    document.getElementById(
        "stocks"
    ).innerHTML =
        stockHTML;

    let phtml = "";

    for (let key in portfolio) {

        if (portfolio[key] > 0) {

            phtml +=
                key +
                " x" +
                portfolio[key] +
                "<br>";

        }

    }

    document.getElementById(
        "portfolio"
    ).innerHTML =
        phtml ||
        "None";

    document.getElementById(
        "upgradeInfo"
    ).innerHTML =

        `
Cash Lv ${save.upgrades.cash}<br>
Luck Lv ${save.upgrades.luck}<br>
Scan Lv ${save.upgrades.scan}
`;

}

render();

setInterval(tick, 1000);

log("📈 Market Open");
