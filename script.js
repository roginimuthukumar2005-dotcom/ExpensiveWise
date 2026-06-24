window.addEventListener(
"load",
()=>{

setTimeout(()=>{

document.getElementById(
"loader"
).style.display="none";

showLogin();

},2500);

});


/* ==========================
   EXPENSEWISE
========================== */

const calendar = document.getElementById("calendar");
const monthTitle = document.getElementById("monthTitle");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const expenseTrackerBtn =
document.getElementById("expenseTrackerBtn");

const calendarSection =
document.getElementById("calendarSection");

const closeCalendar =
document.getElementById("closeCalendar");

const expenseModal =
document.getElementById("expenseModal");

const closeModal =
document.getElementById("closeModal");

const selectedDateText =
document.getElementById("selectedDate");

const themeBtn =
document.getElementById("themeBtn");

let currentDate = new Date();
let selectedDate = "";

/* ==========================
   STORAGE
========================== */

let expenses =
JSON.parse(
localStorage.getItem(
"expensewise_data"
)
) || [];

/* ==========================
   DARK MODE
========================== */

if(
localStorage.getItem(
"expensewise_theme"
) === "light"
){
document.body.classList.add(
"light"
);
}

themeBtn.addEventListener(
"click",
()=>{

document.body.classList.toggle(
"light"
);

localStorage.setItem(
"expensewise_theme",

document.body.classList.contains(
"light"
)
? "light"
: "dark"
);

}
);

/* ==========================
   OPEN CALENDAR
========================== */

expenseTrackerBtn.addEventListener(
"click",
()=>{

calendarSection.style.display =
"flex";

renderCalendar();

}
);

/* ==========================
   CLOSE CALENDAR
========================== */

closeCalendar.addEventListener(
"click",
()=>{

calendarSection.style.display =
"none";

}
);

/* ==========================
   CALENDAR
========================== */

function renderCalendar(){

calendar.innerHTML = "";

const year =
currentDate.getFullYear();

const month =
currentDate.getMonth();

monthTitle.textContent =
currentDate.toLocaleString(
"default",
{
month:"long"
}
)
+
" "
+
year;

const firstDay =
new Date(
year,
month,
1
).getDay();

const daysInMonth =
new Date(
year,
month + 1,
0
).getDate();

const weekDays = [
"Sun",
"Mon",
"Tue",
"Wed",
"Thu",
"Fri",
"Sat"
];

weekDays.forEach(day=>{

const head =
document.createElement("div");

head.className =
"calendar-day";

head.innerHTML =
`<strong>${day}</strong>`;

calendar.appendChild(head);

});

for(
let i=0;
i<firstDay;
i++
){

calendar.appendChild(
document.createElement("div")
);

}

for(
let day=1;
day<=daysInMonth;
day++
){

const fullDate =
`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

const dayBox =
document.createElement("div");

dayBox.className =
"calendar-day";

dayBox.innerHTML =
`<span>${day}</span>`;

const exists =
expenses.find(
e=>e.date===fullDate
);

if(exists){

dayBox.classList.add(
"saved-day"
);

}

dayBox.addEventListener(
"click",
()=>openExpenseModal(
fullDate
)
);

calendar.appendChild(
dayBox
);

}

}

/* ==========================
   MONTH NAVIGATION
========================== */

prevMonth.addEventListener(
"click",
()=>{

currentDate.setMonth(
currentDate.getMonth()-1
);

renderCalendar();

}
);

nextMonth.addEventListener(
"click",
()=>{

currentDate.setMonth(
currentDate.getMonth()+1
);

renderCalendar();

}
);

/* ==========================
   OPEN MODAL
========================== */

function openExpenseModal(
date
){

selectedDate = date;

selectedDateText.textContent =
date;

expenseModal.style.display =
"flex";

loadDateData();

}

/* ==========================
   CLOSE MODAL
========================== */

closeModal.addEventListener(
"click",
()=>{

expenseModal.style.display =
"none";

}
);


/* ==========================
   EXPENSE ITEMS
========================== */

const expenseItemsContainer =
document.getElementById(
"expenseItemsContainer"
);

const addItemBtn =
document.getElementById(
"addItemBtn"
);

const saveBtn =
document.getElementById(
"saveBtn"
);

const deleteBtn =
document.getElementById(
"deleteBtn"
);

/* ==========================
   CREATE EXPENSE ROW
========================== */

function createExpenseRow(
name="",
amount=""
){

const row =
document.createElement("div");

row.classList.add(
"expense-item"
);

row.innerHTML = `

<input
type="text"
class="item-name"
placeholder="Expense Item"
value="${name}">

<input
type="number"
class="item-amount"
placeholder="Amount"
value="${amount}">

`;

expenseItemsContainer.appendChild(
row
);

}

/* ==========================
   ADD ITEM
========================== */

addItemBtn.addEventListener(
"click",
()=>{

createExpenseRow();

}
);

/* ==========================
   LOAD DATE DATA
========================== */

function loadDateData(){

expenseItemsContainer.innerHTML =
"";

const record =
expenses.find(
e=>e.date===selectedDate
);

if(record){

record.items.forEach(item=>{

createExpenseRow(
item.name,
item.amount
);

});

document.getElementById(
"savingsInput"
).value =
record.savings || "";

document.getElementById(
"balanceInput"
).value =
record.balance || "";

}else{

createExpenseRow();

document.getElementById(
"savingsInput"
).value = "";

document.getElementById(
"balanceInput"
).value = "";

}

}

/* ==========================
   SAVE DATA
========================== */

saveBtn.addEventListener(
"click",
()=>{

const itemNames =
document.querySelectorAll(
".item-name"
);

const itemAmounts =
document.querySelectorAll(
".item-amount"
);

let items = [];

for(
let i=0;
i<itemNames.length;
i++
){

const name =
itemNames[i].value.trim();

const amount =
Number(
itemAmounts[i].value
);

if(
name &&
amount > 0
){

items.push({
name,
amount
});

}

}

const savings =
Number(
document.getElementById(
"savingsInput"
).value
) || 0;

const balance =
Number(
document.getElementById(
"balanceInput"
).value
) || 0;

/* remove old record */

expenses =
expenses.filter(
e =>
e.date !== selectedDate
);

/* save new */

expenses.push({

date:selectedDate,

items,

savings,

balance

});

localStorage.setItem(
"expensewise_data",
JSON.stringify(expenses)
);

expenseModal.style.display =
"none";

renderCalendar();

updateDashboard();

drawChart();

alert(
"Saved Successfully ✅"
);

}
);

/* ==========================
   DELETE RECORD
========================== */

deleteBtn.addEventListener(
"click",
()=>{

const confirmed =
confirm(
"Delete this record?"
);

if(!confirmed)
return;

expenses =
expenses.filter(
e =>
e.date !== selectedDate
);

localStorage.setItem(
"expensewise_data",
JSON.stringify(expenses)
);

expenseModal.style.display =
"none";

renderCalendar();

updateDashboard();

drawChart();

}
);
/* ==========================
   DASHBOARD ANALYTICS
========================== */

function updateDashboard(){

let totalExpense = 0;
let totalSavings = 0;
let totalBalance = 0;

let categories = {};

let highestAmount = 0;
let highestDate = "-";

let lowestAmount = Infinity;
let lowestDate = "-";

expenses.forEach(day=>{

let dayExpense = 0;

day.items.forEach(item=>{

dayExpense += item.amount;

totalExpense += item.amount;

categories[item.name] =
(categories[item.name] || 0)
+ item.amount;

});

totalSavings +=
day.savings || 0;

totalBalance +=
day.balance || 0;

if(dayExpense > highestAmount){

highestAmount =
dayExpense;

highestDate =
day.date;

}

if(
dayExpense < lowestAmount &&
dayExpense > 0
){

lowestAmount =
dayExpense;

lowestDate =
day.date;

}

});

/* TOTALS */

document.getElementById(
"totalExpense"
).textContent =
"₹" + totalExpense;

document.getElementById(
"totalSavings"
).textContent =
"₹" + totalSavings;

document.getElementById(
"totalBalance"
).textContent =
"₹" + totalBalance;

document.getElementById(
"recordedDays"
).textContent =
expenses.length;

/* MOST SPENT CATEGORY */

const sortedCategories =
Object.entries(categories)
.sort(
(a,b)=>b[1]-a[1]
);

if(
sortedCategories.length > 0
){

document.getElementById(
"topCategory"
).textContent =

`${sortedCategories[0][0]}
 (₹${sortedCategories[0][1]})`;

}else{

document.getElementById(
"topCategory"
).textContent = "-";

}

/* TOP 3 CATEGORIES */

const topList =
document.getElementById(
"topCategories"
);

topList.innerHTML = "";

sortedCategories
.slice(0,3)
.forEach(
(item,index)=>{

const li =
document.createElement("li");

let medal = "";

if(index===0)
medal="🥇";

if(index===1)
medal="🥈";

if(index===2)
medal="🥉";

li.textContent =
`${medal} ${item[0]}
 - ₹${item[1]}`;

topList.appendChild(li);

}
);

/* HIGHEST DAY */

document.getElementById(
"highestDay"
).textContent =

highestDate +
" (₹" +
highestAmount +
")";

/* LOWEST DAY */

document.getElementById(
"lowestDay"
).textContent =

lowestDate +
" (₹" +
(
lowestAmount === Infinity
? 0
: lowestAmount
)
+ ")";

}
/* ==========================
   PIE CHART
========================== */

function drawChart(){

const canvas =
document.getElementById(
"expenseChart"
);

if(!canvas) return;

const ctx =
canvas.getContext("2d");

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

let categories = {};

expenses.forEach(day=>{

day.items.forEach(item=>{

categories[item.name] =
(categories[item.name] || 0)
+ item.amount;

});

});

const data =
Object.entries(categories);

if(data.length === 0){

ctx.font =
"20px Arial";

ctx.fillText(
"No Expense Data",
120,
200
);

return;

}

const total =
data.reduce(
(sum,item)=>
sum + item[1],
0
);

const colors = [
"#22c55e",
"#3b82f6",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#14b8a6",
"#ec4899",
"#f97316"
];

let startAngle = 0;

data.forEach(
(item,index)=>{

const sliceAngle =
(item[1]/total)
*
Math.PI
*
2;

ctx.beginPath();

ctx.moveTo(
200,
200
);

ctx.arc(
200,
200,
140,
startAngle,
startAngle +
sliceAngle
);

ctx.closePath();

ctx.fillStyle =
colors[
index %
colors.length
];

ctx.fill();

startAngle +=
sliceAngle;

}
);

/* LEGEND */

let y = 20;

data.forEach(
(item,index)=>{

ctx.fillStyle =
colors[
index %
colors.length
];

ctx.fillRect(
10,
y,
15,
15
);

ctx.fillStyle =
"#000";

ctx.fillText(
`${item[0]} ₹${item[1]}`,
35,
y + 12
);

y += 25;

}
);

}

/* ==========================
   SHOW / HIDE CHART
========================== */

const showChartBtn =
document.getElementById(
"showChartBtn"
);

const chartContainer =
document.getElementById(
"chartContainer"
);

showChartBtn.addEventListener(
"click",
()=>{

if(
chartContainer.style.display ===
"none"
){

chartContainer.style.display =
"block";

showChartBtn.innerText =
"❌ Hide Expense Distribution";

drawChart();

}else{

chartContainer.style.display =
"none";

showChartBtn.innerText =
"📊 Show Expense Distribution";

}

}
);

/* ==========================
   AVERAGE DAILY EXPENSE
========================== */

function calculateAverage(){

let total = 0;

expenses.forEach(day=>{

day.items.forEach(item=>{

total += item.amount;

});

});

if(expenses.length===0)
return 0;

return Math.round(
total /
expenses.length
);

}

/* ==========================
   ADD AVERAGE CARD
========================== */

const dashboard =
document.querySelector(
".dashboard"
);

const avgCard =
document.createElement("div");

avgCard.classList.add(
"card"
);

avgCard.innerHTML = `

<h3>
Average Daily Expense
</h3>

<p id="averageExpense">
₹0
</p>

`;

dashboard.appendChild(
avgCard
);

function updateAverage(){

document.getElementById(
"averageExpense"
).textContent =
"₹" +
calculateAverage();

}

/* ==========================
   EXPORT CSV
========================== */

const exportBtn =
document.getElementById(
"exportBtn"
);

exportBtn.addEventListener(
"click",
()=>{

let csv =
"Date,Item,Amount,Savings,Balance\n";

expenses.forEach(day=>{

day.items.forEach(item=>{

csv +=
`${day.date},
${item.name},
${item.amount},
${day.savings},
${day.balance}\n`;

});

});

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const url =
URL.createObjectURL(
blob
);

const a =
document.createElement("a");

a.href = url;

a.download =
"ExpenseWise_Report.csv";

a.click();

URL.revokeObjectURL(
url
);

}
);

/* ==========================
   INITIAL LOAD
========================== */

renderCalendar();

updateDashboard();

updateAverage();

drawChart();

/* ==========================
   AUTO REFRESH
========================== */

const oldUpdate =
updateDashboard;

updateDashboard =
function(){

oldUpdate();

updateAverage();

drawChart();

};