const form = document.querySelector('form');

form.addEventListener('submit',async(e)=>{
    e.preventDefault();

    const obj ={
        email:document.getElementById('email').value
    }
    axios.post('http://localhost:3000/password/resetPassword',obj)
})