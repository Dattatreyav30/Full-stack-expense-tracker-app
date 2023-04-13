const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const createObject = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try {
        const response = await axios.post('http://localhost:3000/user/login', createObject)
        if (response.data.result) {
            localStorage.setItem("token", response.data.token)
            window.location.href = '/views/expenses.html'
        }
        else {
            alert('something went wrong')
        }

    } catch (err) {
        const div = document.getElementById('div')
        div.innerHTML = `<p>${err.response.data.result}</p>`;
        form.reset();
    }
})