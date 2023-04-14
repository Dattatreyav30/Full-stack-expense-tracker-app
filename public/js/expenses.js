document.getElementById('rzrpayBtn').onclick = async (e) => {
    e.preventDefault()
    console
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/premiumMembership', { headers: { 'authorization': token } })
    const orderId = response.data.order.id;
    const key_id = response.data.key_id;
    const options = {
        key: key_id,
        order_id: orderId,
        handler: function async(response) {
            axios.post('http://localhost:3000/purchase/updateTransactionstatus', { order_id: options.order_id, payment_id: response.razorpay_payment_id }, { headers: { 'authorization': token } })
            alert('you are a premium user now');
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', (response) => {
        axios.post('http://localhost:3000/purchase/transactionfailed', { order_id: options.order_id, payment_id: response.razorpay_payment_id }, { headers: { 'authorization': token } })
        alert('something went wrong')
    })
}


window.addEventListener('DOMContentLoaded', async e => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token')
        const premiumResponse = await axios.get('http://localhost:3000/purchase/check-premium', { headers: { 'authorization': token } })
        if (premiumResponse.data.isPremiumUser) {
            document.getElementById('rzrpayBtn').style.display = 'none';
            document.getElementById('leaderboard').style.display = 'block';
            document.getElementById('downloadExpenses').style.display = 'block';
            document.getElementById('h3').innerHTML = 'premium user';
        }
        else {
            document.getElementById('rzrpayBtn').style.display = 'block';
        }
        await getExpenses();
    } catch (err) {
        console.log(err);
    }
})

function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    lastPage
}) {
    const pagination = document.getElementById('paginationBtns')
    pagination.innerHTML = "";
    if (hasPreviousPage) {
        const btn2 = document.createElement('button');
        btn2.className = 'me-3';
        btn2.innerHTML = previousPage
        btn2.addEventListener('click', () => getExpenses(previousPage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button');
    btn1.innerHTML = `<h3>${currentPage}</h3>`
    btn1.className = 'me-3';
    btn1.addEventListener('click', () => getExpenses(currentPage))
    pagination.appendChild(btn1)
    if (hasNextPage) {
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextPage
        btn3.addEventListener('click', () => getExpenses(nextPage))
        pagination.appendChild(btn3)
    }
    if (lastPage > 1) {
        const btn4 = document.createElement('button');
        btn4.className = 'ms-3';
        btn4.innerHTML = 'Final';
        btn4.addEventListener('click', () => getExpenses(lastPage));
        pagination.appendChild(btn4);
    }
}


const getExpenses = async (page) => {
    const token = localStorage.getItem('token');
    const dynPagesSelect = document.getElementById('dyn_pages');
    dynPagesSelect.addEventListener('change', async () => {
        localStorage.setItem('limit1', dynPagesSelect.value);
        location.reload();
    })
    const limit1 = localStorage.getItem('limit1')
    const response = await axios.get(`http://localhost:3000/expenses/get-all-expenses?page=${page}&limit=${limit1}`, { headers: { 'authorization': token } })
    response.data.allExpenses.forEach(expense => {
        showData(expense)
        showPagination(response.data.pagination)
    });

}
const form = document.querySelector('form');
form.addEventListener('submit', async e => {
    e.preventDefault();
    let createObject = {
        expenseCategory: document.getElementById('expenseName').value,
        expenseDescription: document.getElementById('expenseDescription').value,
        expenseAmount: document.getElementById('expenseAmount').value,
    }
    // sending data to mysql
    try {
        const token = localStorage.getItem('token')
        await axios.post("http://localhost:3000/expenses/add-expense", createObject, { headers: { 'authorization': token } });
        location.reload();

    } catch (err) {
        console.error(err);
    }
})

const showData = async (data) => {
    const tbody = document.getElementById('tbody');
    const row = document.createElement('tr');
    const td = document.createElement('td');
    const td2 = document.createElement('td')
    row.innerHTML = (`<td>${data.expenseCategory}</td> <td>${data.expenseDescription}</td>  <td>${data.expenseAmount}</td>`)
    td.appendChild(deleteData(tbody, row, data.id))
    row.appendChild(td);
    tbody.appendChild(row);
    form.reset();

    //updating the total amount
    const totalAmount = document.getElementById('totalAmount');
    const currentTotal = parseFloat(totalAmount.innerText);
    const newTotal = currentTotal + parseFloat(data.expenseAmount);
    totalAmount.innerText = newTotal.toFixed(2);
}

const showLeaderBoard = async (data) => {
    const tbody = document.getElementById('tbody1');
    const row = document.createElement('tr');
    const td = document.createElement('td');
    const td2 = document.createElement('td');
    row.innerHTML = '<h3>Laderboard</h3>'
    row.innerHTML = (`<td>${data.username}</td> <td>${data.totalexpenses}</td>`)
    document.getElementById('h4').textContent = 'Leaderboard'
    row.appendChild(td);
    tbody.appendChild(row);
    form.reset();


    //updating the total amount
    const totalAmount = document.getElementById('totalAmount1');
    const currentTotal = parseFloat(totalAmount.innerText);
    const newTotal = currentTotal + parseFloat(data.expenseAmount);
    totalAmount.innerText = newTotal.toFixed(2);
}
deleteData = (tbody, row, id) => {
    let deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.id = 'delete'
    deleteBtn.value = 'Delete Expense';
    deleteBtn.className = 'btn btn-danger me-5'
    deleteBtn.onclick = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:3000/expenses/delete-expense/${id}`, { headers: { 'authorization': token } });
            tbody.removeChild(row);
            location.reload();

        } catch (err) {
            console.error(err);
        }
    }
    return deleteBtn;
}

document.getElementById('leaderboard').onclick = async (e) => {
    const token = localStorage.getItem('token')
    document.getElementById('table2').style.display = 'table'
    const response = await axios.get("http://localhost:3000/purchase/leaderboard", { headers: { 'authorization': token } });
    console.log(response)
    response.data.forEach((data) => {
        showLeaderBoard(data)
    })

}


const downloadExpenses = document.getElementById('downloadExpenses');
downloadExpenses.onclick = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/purchase/download', { headers: { 'authorization': token } })
        const url = response.data
        console.log(response)
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'myexpenses.csv'
        downloadLink.click();
    } catch (err) {
        console.log(err)
    }
}

document.getElementById('logoutBtn').onclick = () => {
    window.location.href = '/views/login.html'
}
