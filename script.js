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
let savingsGoal =
Number(localStorage.getItem("goalAmount")) || 0;

let goalName =
localStorage.getItem("goalName") || "Budget Goal";

/* ==========================
   ALERT STATUS
========================== */

let budgetAlertShown =
localStorage.getItem(
"budgetAlertShown"
) === "true";

let alert50 =
localStorage.getItem("alert50") === "true";

let alert75 =
localStorage.getItem("alert75") === "true";

let alert90 =
localStorage.getItem("alert90") === "true";

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

let total=0;

exists.items.forEach(item=>{

total+=item.amount;

});

if(total<200){

dayBox.classList.add(
"low-spending"
);

}

else if(total<500){

dayBox.classList.add(
"medium-spending"
);

}

else{

dayBox.classList.add(
"high-spending"
);

}

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
updateWeeklyBudget();

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
document.getElementById("expenseChart");

if(!canvas) return;

const ctx =
canvas.getContext("2d");

ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);

/* Collect Category Data */

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

/* No Expense */

if(data.length===0){

ctx.font="22px Arial";

ctx.fillStyle="#888";

ctx.textAlign="center";

ctx.fillText(
"No Expense Data",
canvas.width/2,
canvas.height/2
);

const legend =
document.getElementById(
"chartLegend"
);

legend.innerHTML=
"<li>No expense recorded.</li>";

return;

}

/* Total */

const total =
data.reduce(
(sum,item)=>sum+item[1],
0
);

/* Colors */

const colors=[
"#22c55e",
"#3b82f6",
"#f59e0b",
"#ef4444",
"#8b5cf6",
"#14b8a6",
"#ec4899",
"#06b6d4",
"#f97316",
"#84cc16"
];

const centerX =
canvas.width/2;

const centerY =
canvas.height/2;

const radius =
140;

let startAngle=0;

/* Draw Pie */

data.forEach((item,index)=>{

const amount=item[1];

const sliceAngle=
(amount/total)
*
Math.PI
*
2;

ctx.beginPath();

ctx.moveTo(
centerX,
centerY
);

ctx.arc(
centerX,
centerY,
radius,
startAngle,
startAngle+sliceAngle
);

ctx.closePath();

ctx.fillStyle=
colors[index%colors.length];

ctx.fill();

/* Percentage */

const middleAngle=
startAngle+
sliceAngle/2;

const x=
centerX+
Math.cos(middleAngle)*90;

const y=
centerY+
Math.sin(middleAngle)*90;

ctx.fillStyle="white";

ctx.font="bold 14px Arial";

ctx.textAlign="center";

ctx.fillText(

Math.round(
(amount/total)*100
)+"%",

x,

y

);

startAngle+=sliceAngle;

});

/* ---------- Legend ---------- */

const legend=
document.getElementById(
"chartLegend"
);

legend.innerHTML="";

data
.sort((a,b)=>b[1]-a[1])
.forEach((item,index)=>{

const percent=
(
(item[1]/total)*100
).toFixed(1);

const medal=
index===0 ? "🥇" :
index===1 ? "🥈" :
index===2 ? "🥉" : "📌";

legend.innerHTML+=`

<li style="
display:flex;
justify-content:space-between;
align-items:center;
padding:12px;
margin-bottom:8px;
border-radius:10px;
background:rgba(255,255,255,.08);
">

<div>

<span style="
display:inline-block;
width:15px;
height:15px;
background:${colors[index%colors.length]};
border-radius:50%;
margin-right:10px;
"></span>

${medal}
<b>${item[0]}</b>

</div>

<div>

₹${item[1]}

<br>

<small>

${percent}%

</small>

</div>

</li>

`;

});

}

/* ==========================
   SHOW / HIDE CHART
========================== */

const showChartBtn =
document.getElementById(
"showChartBtn"
);

const analyticsModal =
document.getElementById("analyticsModal");

const closeAnalytics =
document.getElementById("closeAnalytics");

showChartBtn.addEventListener("click",()=>{

analyticsModal.style.display="flex";

drawChart();

});

closeAnalytics.addEventListener("click",()=>{

analyticsModal.style.display="none";

});

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
updateSavingsGoal();
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
updateSavingsGoal();
};

/* ==========================
   WEEKLY LIMIT
========================== */

let weeklyLimit =
Number(
localStorage.getItem(
"weekly_limit"
)
) || 0;

/* Load limit */

document.getElementById(
"weeklyLimit"
).textContent =
"₹" + weeklyLimit;

/* Open modal */

document.getElementById(
"setLimitBtn"
).addEventListener(
"click",
()=>{

document.getElementById(
"limitModal"
).style.display =
"flex";

document.getElementById(
"weeklyLimitInput"
).value =
weeklyLimit;

}
);

/* Close modal */

document.getElementById(
"closeLimitBtn"
).addEventListener(
"click",
()=>{

document.getElementById(
"limitModal"
).style.display =
"none";

}
);

/* Save limit */

document.getElementById(
"saveLimitBtn"
).addEventListener(
"click",
()=>{

weeklyLimit =
Number(
document.getElementById(
"weeklyLimitInput"
).value
);

localStorage.setItem(
"weekly_limit",
weeklyLimit
);

document.getElementById(
"weeklyLimit"
).textContent =
"₹" + weeklyLimit;

document.getElementById(
"limitModal"
).style.display =
"none";

updateWeeklyBudget();

});function updateWeeklyBudget(){

    const today = new Date();

    const firstDay = new Date(today);

    firstDay.setHours(0,0,0,0);

    firstDay.setDate(
        today.getDate() - today.getDay()
    );

    const currentWeek =
    firstDay.toISOString().split("T")[0];

    const savedWeek =
    localStorage.getItem("budgetWeek");

    if(savedWeek !== currentWeek){

        localStorage.setItem(
            "budgetWeek",
            currentWeek
        );

        budgetAlertShown = false;
        alert50 = false;
        alert75 = false;
        alert90 = false;

        localStorage.removeItem("budgetAlertShown");
        localStorage.removeItem("alert50");
        localStorage.removeItem("alert75");
        localStorage.removeItem("alert90");

    }

    let weekExpense = 0;

    expenses.forEach(day=>{

        const d = new Date(day.date);

        if(d >= firstDay && d <= today){

            day.items.forEach(item=>{

                weekExpense += item.amount;

            });

        }

    });

    document.getElementById("weekSpent").textContent =
    weekExpense;

    document.getElementById("weeklyLimit").textContent =
    weeklyLimit;

    const remaining =
    weeklyLimit - weekExpense;

    document.getElementById("remainingBudget").textContent =
    "₹" + remaining;

    let percent = 0;

    if(weeklyLimit > 0){

        percent =
        Math.min(
            (weekExpense/weeklyLimit)*100,
            100
        );

    }

    /* Progress */

    document.getElementById("budgetProgress").style.width =
    percent + "%";

    document.getElementById("budgetPercent").textContent =
    Math.round(percent) + "%";

    const progress =
    document.getElementById("budgetProgress");

    if(percent>=100){

        progress.style.background="#ef4444";

    }

    else if(percent>=90){

        progress.style.background="#f97316";

    }

    else if(percent>=75){

        progress.style.background="#eab308";

    }

    else{

        progress.style.background="#22c55e";

    }

    /* Remaining */

    const remainBox =
    document.getElementById("remainingBudget");

    if(remaining<=0){

        remainBox.style.color="#ef4444";

    }

    else if(remaining<=weeklyLimit*0.25){

        remainBox.style.color="#f97316";

    }

    else if(remaining<=weeklyLimit*0.5){

        remainBox.style.color="#eab308";

    }

    else{

        remainBox.style.color="#22c55e";

    }

    /* Notifications */

    if(percent>=50 && !alert50){

        alert50=true;

        localStorage.setItem(
            "alert50",
            "true"
        );

        alert("🟡 You have used 50% of your weekly budget.");

    }

    if(percent>=75 && !alert75){

        alert75=true;

        localStorage.setItem(
            "alert75",
            "true"
        );

        alert("🟠 You have used 75% of your weekly budget.");

    }

    if(percent>=90 && !alert90){

        alert90=true;

        localStorage.setItem(
            "alert90",
            "true"
        );

        alert("🔴 Warning! 90% of your weekly budget is used.");

    }

    if(percent>=100){

        showBudgetAlert(weekExpense);

    }

}function showBudgetAlert(spent){

    if(budgetAlertShown)
    return;

    budgetAlertShown=true;

    localStorage.setItem(
        "budgetAlertShown",
        "true"
    );

    document.getElementById(
        "budgetAlert"
    ).style.display="flex";

    document.getElementById(
        "alertMessage"
    ).innerHTML=`

    <b>Weekly Limit :</b>

    ₹${weeklyLimit}

    <br><br>

    <b>Total Spent :</b>

    ₹${spent}

    <br><br>

    <b style="color:red;">

    Budget Limit Exceeded!

    </b>

    <br>

    You exceeded by

    ₹${spent-weeklyLimit}

    `;

}
updateWeeklyBudget();

//open goal modal
document.getElementById("setGoalBtn")
.addEventListener("click",()=>{

document.getElementById("goalModal").style.display="flex";

document.getElementById("goalNameInput").value=
goalName;

document.getElementById("goalAmountInput").value=
savingsGoal;

});
//close goal modal
document.getElementById("closeGoalBtn")
.addEventListener("click",()=>{

document.getElementById("goalModal").style.display="none";

});
//save goal
document.getElementById("saveGoalBtn")
.addEventListener("click",()=>{

goalName=
document.getElementById("goalNameInput").value;

savingsGoal=
Number(
document.getElementById("goalAmountInput").value
);

localStorage.setItem(
"goalName",
goalName
);

localStorage.setItem(
"goalAmount",
savingsGoal
);

document.getElementById("goalModal").style.display="none";

updateSavingsGoal();

});
//update saving function
function updateSavingsGoal(){

let totalSaved=0;

expenses.forEach(day=>{

totalSaved+=Number(day.savings||0);

});

document.getElementById("goalName").textContent=
goalName;

document.getElementById("goalTarget").textContent=
"₹"+savingsGoal;

document.getElementById("goalSaved").textContent=
"₹"+totalSaved;

let percent=0;

if(savingsGoal>0){

percent=
(totalSaved/savingsGoal)*100;

}

if(percent>100)
percent=100;

document.getElementById("goalPercent").textContent=
Math.round(percent)+"%";

document.getElementById("goalProgress").style.width=
percent+"%";

}
