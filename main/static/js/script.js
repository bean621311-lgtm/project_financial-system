let currentAccount = "Individual";
function showLogin() {
    document.getElementById("aboutSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
}

function individualLogin() {

    let buttons = document.querySelectorAll(".tabs button");

    buttons[0].classList.add("active");
    buttons[1].classList.remove("active");

    alert("Individual Login Selected");
}

function businessLogin() {

    let buttons = document.querySelectorAll(".tabs button");

    buttons[1].classList.add("active");
    buttons[0].classList.remove("active");

    alert("Business Login Selected");
}


function checkPassword() {

    let password = document.getElementById("password").value;
    let strength = document.getElementById("strength");

    if (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    ) {

        strength.innerHTML = "✅ Strong Password";
        strength.style.color = "green";

    } else if (password.length >= 6) {

        strength.innerHTML = "⚠ Medium Password";
        strength.style.color = "orange";

    } else {

        strength.innerHTML = "❌ Weak Password";
        strength.style.color = "red";
    }
}
function showModule(name, element) {

    document.querySelectorAll(".module")
        .forEach(module => {
            module.classList.remove("active-module");
        });

    document.getElementById(
        name + "Module"
    ).classList.add("active-module");

    document.querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });

    if (element) {
        element.classList.add("active");
    }
}
function loadDashboard() {

    fetch("/dashboard_data")
        .then(response => response.json())
        .then(data => {

            document.getElementById(
                "totalIncome"
            ).innerHTML =
                "Rs " + data.total_income;

            document.getElementById(
                "totalExpense"
            ).innerHTML =
                "Rs " + data.total_expense;

            document.getElementById(
                "totalSavings"
            ).innerHTML =
                "Rs " + data.total_savings;

            document.getElementById(
                "totalGoals"
            ).innerHTML =
                data.total_goals;
            document.getElementById(
                "monthlyBudgetCard"
            ).innerHTML =
                "Rs " + data.monthly_budget;

            document.getElementById(
                "remainingBudgetCard"
            ).innerHTML =
                "Rs " + data.remaining_budget;
            });
}
document.addEventListener("DOMContentLoaded",function(){

    loadDashboard();

    loadSavingsDropdown();

    loadCurrentBudget();

});

document.getElementById("incomeForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    let formData = new FormData();

    formData.append(
        "source",
        document.getElementById("incomeSource").value
    );

    formData.append(
        "amount",
        document.getElementById("incomeAmount").value
    );
    formData.append(
        "remarks",
        document.getElementById("incomeRemarks").value
    );

    fetch("/add_income", {
        method: "POST",
        body: formData
    })
    .then(res=> res.json())
    .then(data => {
        alert(data.message);
        loadDashboard();
        this.reset();
    });
});
   
document.getElementById("expenseForm")
.addEventListener("submit", function(e){

    e.preventDefault();

    let formData = new FormData();

    formData.append(
        "category",
        document.getElementById("expenseCategory").value
    );

    formData.append(
        "amount",
        document.getElementById("expenseAmount").value
    );
    formData.append(
        "payment_method",
        document.getElementById("payment_method").value
    );
    fetch("/add_expense",{
        method:"POST",
        body:formData
    })
    .then(res=>res.json())
    .then(data=>{
        alert(data.message);
        loadDashboard();
        this.reset();
    });

});


const goalForm = document.getElementById("goalForm");

if (goalForm) {
    goalForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let formData = new FormData(this);

        fetch("/add_saving", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);

            this.reset();

            loadDashboard();
            loadSavingsDropdown();
        })
        .catch(err => console.log(err));
    });
}



const savingAmountForm =
    document.getElementById("savingAmountForm");

if (savingAmountForm) {
    savingAmountForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let formData = new FormData(this);

        fetch("/add_saving_amount", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);

            this.reset();

            loadDashboard();
            loadSavingsDropdown();
        })
        .catch(err => console.log(err));
    });
}



function loadSavingsDropdown() {

    let select =
        document.getElementById("savingSelect");

    if (!select) return;

    fetch("/get_savings")
    .then(res => res.json())
    .then(data => {

        select.innerHTML =
            '<option value="">Select Goal</option>';

        data.forEach(goal => {

            select.innerHTML += `
                <option value="${goal.savings_id}">
                    ${goal.goal_name}
                    (Rs ${goal.saved_amount}/${goal.target_amount})
                </option>
            `;
        });
    })
    .catch(err => console.log(err));
}


// =======================
// PAGE LOAD
// =======================


function showGoalCard() {

    document.getElementById(
        "savingCard"
    ).style.display = "none";

    document.getElementById(
        "goalCard"
    ).style.display = "block";
}

function showSavingCard() {

    document.getElementById(
        "goalCard"
    ).style.display = "none";

    document.getElementById(
        "savingCard"
    ).style.display = "block";

    loadSavingsDropdown();
}

const budgetForm = document.getElementById("budgetForm");

if (budgetForm) {

    budgetForm.addEventListener("submit", function(e){

        e.preventDefault();

        let formData = new FormData(this);

        fetch("/create_budget",{

            method:"POST",

            body:formData

        })

        .then(res=>res.json())

        .then(data=>{

            alert(data.message);

            this.reset();

            loadCurrentBudget();

        });

    });

}
function showLoanCard(){

    document.getElementById(
        "loanCard"
    ).style.display = "block";

    document.getElementById(
        "emiCard"
    ).style.display = "none";

    document.getElementById(
        "historyCard"
    ).style.display = "none";
}
function showEMICard(){

    document.getElementById(
        "loanCard"
    ).style.display = "none";

    document.getElementById(
        "emiCard"
    ).style.display = "block";

    document.getElementById(
        "historyCard"
    ).style.display = "none";

    loadLoans();
}
function showHistoryCard(){

    document.getElementById(
        "loanCard"
    ).style.display = "none";

    document.getElementById(
        "emiCard"
    ).style.display = "none";

    document.getElementById(
        "historyCard"
    ).style.display = "block";
}
const loanForm =
    document.getElementById("loanForm");

if(loanForm){

    loanForm.addEventListener(
        "submit",
        function(e){

        e.preventDefault();

        let formData =
            new FormData(this);

        fetch("/create_loan",{

            method:"POST",

            body:formData

        })

        .then(res=>res.json())

        .then(data=>{

            alert(
                data.message +
                "\nEMI: Rs " +
                data.emi
            );

            this.reset();

            loadLoans();

        });

    });

}
function loadLoans(){

    let select =
        document.getElementById(
            "loanSelect"
        );

    if(!select) return;

    fetch("/get_loans")

    .then(res=>res.json())

    .then(data=>{

        select.innerHTML =
        '<option value="">Select Loan</option>';

        data.forEach(loan=>{

            select.innerHTML += `

            <option value="${loan.loan_id}">

                ${loan.loan_name}
                (EMI Rs ${loan.emi_amount})

            </option>

            `;

        });

    });

}
#buiness module


document.addEventListener("DOMContentLoaded", function () {

    animateCounters();

    initializeChart();

    notificationAnimation();

    buttonEffects();

});


/* ==========================================
        ANIMATED COUNTERS
========================================== */

function animateCounters() {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {

        const target = +counter.getAttribute("data-target");

        let count = 0;

        const speed = target / 100;

        function updateCounter() {

            if (count < target) {

                count += speed;

                counter.innerText = Math.ceil(count).toLocaleString();

                requestAnimationFrame(updateCounter);

            } else {

                counter.innerText = target.toLocaleString();

            }

        }

        updateCounter();

    });

}




function initializeChart() {

    const ctx = document.getElementById("salesExpenseChart");

    if (!ctx) return;

    new Chart(ctx, {

        type: "line",

        data: {

            labels: [

                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"

            ],

            datasets: [

                {

                    label: "Sales",

                    data: [

                        12000,
                        18000,
                        15000,
                        24000,
                        26000,
                        30000,
                        32000,
                        35000,
                        37000,
                        39000,
                        41000,
                        45000

                    ],

                    borderColor: "#10B981",

                    backgroundColor: "rgba(16,185,129,.15)",

                    fill: true,

                    tension: .4,

                    borderWidth: 3

                },

                {

                    label: "Expenses",

                    data: [

                        7000,
                        9000,
                        11000,
                        13000,
                        14000,
                        16000,
                        17000,
                        18000,
                        19000,
                        20000,
                        22000,
                        24000

                    ],

                    borderColor: "#EF4444",

                    backgroundColor: "rgba(239,68,68,.15)",

                    fill: true,

                    tension: .4,

                    borderWidth: 3

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    position: "top"

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                }

            }

        }

    });

}




function notificationAnimation() {

    const bell = document.querySelector(".notification-btn");

    if (!bell) return;

    setInterval(() => {

        bell.classList.add("bell-animation");

        setTimeout(() => {

            bell.classList.remove("bell-animation");

        }, 700);

    }, 5000);

}




function buttonEffects() {

    const buttons = document.querySelectorAll(".quick-actions .btn");

    buttons.forEach(btn => {

        btn.addEventListener("mouseenter", () => {

            btn.style.transform = "scale(1.05)";

        });

        btn.addEventListener("mouseleave", () => {

            btn.style.transform = "scale(1)";

        });

    });

}


const cards = document.querySelectorAll(".dashboard-card");

cards.forEach((card, index) => {

    card.style.opacity = "0";

    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = ".6s";

        card.style.opacity = "1";

        card.style.transform = "translateY(0px)";

    }, index * 150);

});
