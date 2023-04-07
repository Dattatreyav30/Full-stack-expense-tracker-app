const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const createObject = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    try {
        const response = await axios.post("http://localhost:3000/user/signup", createObject);
        form.reset();
        alert(`${response.data.success}`);
        location.href = '/views/login.html'
    } catch (err) {
        alert(`${err.response.data.success}`);
    }
})