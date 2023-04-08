const form = document.querySelector('form');

form.addEventListener('submit',async(e)=>{
    try{
        e.preventDefault();

        const obj ={
            email:document.getElementById('email').value
        }
       const response =  await axios.post('http://localhost:3000/password/forgotPassword',obj)
       alert(response.data.message);
       location.href = 'http://127.0.0.1:5500/views/login.html'
    }catch(err){
        alert(err.response.data.message);
    }
})

    