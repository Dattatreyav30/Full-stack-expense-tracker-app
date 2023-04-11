document.getElementById('rzrpayBtn').onclick = async (e) => {
    e.preventDefault()
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
        console.log(premiumResponse);
        if (premiumResponse.data.isPremiumUser) {
            document.getElementById('rzrpayBtn').style.display = 'none';
            document.getElementById('leaderboard').style.display = 'block';
            document.getElementById('downloadExpenses').style.display = 'block';
            document.getElementById('h3').innerHTML = 'premium user';
        }
        else {
            document.getElementById('rzrpayBtn').style.display = 'block';
        }

        const response = await axios.get("http://localhost:3000/expenses/get-all-expenses", { headers: { 'authorization': token } });
        response.data.forEach(data => {
            showData(data);
        });
        document.getElementById('leaderboard').onclick = async (e) => {
            document.getElementById('table2').style.display = 'table'
            const response = await axios.get("http://localhost:3000/purchase/leaderboard", { headers: { 'authorization': token } });
            console.log(response)
            response.data.forEach((data) => {
                showLeaderBoard(data)
            })

        }
    } catch (err) {
        console.log(err);
    }
})



const form = document.querySelector('form');
form.addEventListener('submit', async e => {
    e.preventDefault();
    let createObject = {
        expenseCategory: document.getElementById('expenseName').value,
        expenseDescription: document.getElementById('expenseDescription').value,
        expenseAmount: document.getElementById('expenseAmount').value,
    }
    console.log(createObject);
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
    // td2.appendChild(editData(data, tbody, row, data.id))
    row.appendChild(td);
    //row.appendChild(td2);
    tbody.appendChild(row);
    form.reset();
    console.log(data);

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
    //td.appendChild(deleteData(tbody, row, data.id))
    // td2.appendChild(editData(data, tbody, row, data.id))
    row.appendChild(td);
    //row.appendChild(td2);
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
// editData = (data, tbody, row, id) => {
//     let editBtn = document.createElement('input');
//     editBtn.type = 'button';
//     editBtn.id = 'edit'
//     editBtn.value = 'Edit Expense';
//     editBtn.className = 'btn btn-warning'
//     editBtn.onclick = async () => {
//         try {
//             await axios.delete(`http://localhost:3000/delete-user/${id}`);
//             let createObject = {
//                 expenseName: document.getElementById('expenseName').value = data.expenseName,
//                 expenseDesc: document.getElementById('expenseDescription').value = data.expenseDesc,
//                 expenseAmount: document.getElementById('expenseAmount').value = data.expenseAmount
//             }
//             tbody.removeChild(row);


//         } catch (err) {
//             console.error(err);
//         }
//     }
//     return editBtn;
// }