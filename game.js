let save = JSON.parse(localStorage.getItem("marketRogues")) || {

prestige:0,

upgrades:{
cash:0,
luck:0,
scan:0
}

};

let day = 1;

let cash =
1000 *
(1+(save.upgrades.cash*0.10));

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

function rng(a,b){
return Math.random()*(b-a)+a;
}

function createStocks(){

stocks=[];

for(let i=0;i<6;i++){

let base=rng(20,100);

stocks.push({

name:names[Math.floor(
Math.random()*names.length
)]+" "+Math.floor(rng(1,99)),

price:base,

volatility:rng(.03,.18),

growth:rng(-.02,.05)

});

}

}

createStocks();

function log(text){

let div=document.getElementById("log");

div.innerHTML =
"<div>"+text+"</div>" +
div.innerHTML;

}

function marketScan(){

let best = [...stocks]
.sort((a,b)=>b.growth-a.growth)[0];

log(
"🔍 Scan predicts " +
best.name +
" is trending upward."
);

}

function hedge(){

if(hedgeDays>0){
return;
}

hedgeDays = 5;

log("🛡 Hedge activated.");

}

function randomEvent(){

let roll=Math.random();

if(roll<0.15){

stocks.forEach(s=>{

s.price*=1.4;

});

log("🚀 AI BOOM");

}

else if(roll<0.25){

stocks.forEach(s=>{

if(hedgeDays<=0)
s.price*=0.70;

});

log("💥 MARKET CRASH");

}

else if(roll<0.35){

let target=
stocks[
Math.floor(
Math.random()*stocks.length
)
];

target.price*=2;

log(
"🔥 MEME STOCK: "
+target.name
);

}

}

function tick(){

day++;

if(hedgeDays>0)
hedgeDays--;

stocks.forEach(stock=>{

let move=

(stock.growth) +

((Math.random()-0.5)
*stock.volatility);

stock.price *= (1+move);

if(stock.price<1)
stock.price=1;

});

if(Math.random()<0.35)
randomEvent();

render();

}

function buy(i){

let stock=stocks[i];

if(cash>=stock.price){

cash-=stock.price;

portfolio[stock.name] =
(portfolio[stock.name]||0)+1;

render();

}

}

function sell(i){

let stock=stocks[i];

if((portfolio[stock.name]||0)>0){

portfolio[stock.name]--;

cash += stock.price;

render();

}

}

function netWorth(){

let worth=cash;

stocks.forEach(s=>{

worth +=
(portfolio[s.name]||0)
*s.price;

});

return worth;

}

function prestigeRun(){

let wealth=netWorth();

if(wealth<10000){

alert(
"Need $10,000 net worth."
);

return;

}

let gain=
Math.floor(
Math.sqrt(wealth/10000)
);

prestigeCurrency+=gain;

save.prestige=
prestigeCurrency;

localStorage.setItem(
"marketRogues",
JSON.stringify(save)
);

alert(
"Prestiged for "+
gain+
" Prestige!"
);

location.reload();

}

function buyUpgrade(type){

if(prestigeCurrency<=0)
return;

prestigeCurrency--;

save.prestige=
prestigeCurrency;

save.upgrades[type]++;

localStorage.setItem(
"marketRogues",
JSON.stringify(save)
);

render();

}

function render(){

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
).textContent=day;

document.getElementById(
"prestige"
).textContent=
prestigeCurrency;

let stockHTML="";

stocks.forEach((s,i)=>{

stockHTML+=`
<div class="stock">

<b>${s.name}</b><br>

Price:
$${s.price.toFixed(2)}<br>

Growth:
${(s.growth*100).toFixed(1)}%<br>

Owned:
${portfolio[s.name]||0}<br>

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
).innerHTML=
stockHTML;

let phtml="";

for(let key in portfolio){

if(portfolio[key]>0){

phtml +=
key+
" x"+
portfolio[key]+
"<br>";

}

}

document.getElementById(
"portfolio"
).innerHTML=
phtml ||
"None";

document.getElementById(
"upgradeInfo"
).innerHTML=

`
Cash Lv ${save.upgrades.cash}<br>
Luck Lv ${save.upgrades.luck}<br>
Scan Lv ${save.upgrades.scan}
`;

}

render();

setInterval(tick,1000);

log("📈 Market Open");
