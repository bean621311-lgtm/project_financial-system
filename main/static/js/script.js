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

// =======================
// CREATE GOAL
// =======================
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


// =======================
// ADD MONEY TO SAVINGS
// =======================
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


// =======================
// LOAD GOALS IN DROPDOWN
// =======================
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