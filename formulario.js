// Formulário código

const form = document.getElementById('form');
const nome = document.getElementById('nome');
const email = document.getElementById('email');
const telefone = document.getElementById('telefone');
const plataforma = document.getElementById('plataforma');
const quantidadeCoins = document.getElementById('quantidadeCoins');

form.addEventListener("submit", (event) => {
    event.preventDefault();

    checkFormulario();
})

nome.addEventListener("blur", () =>{
    checkInputNome();
})

email.addEventListener("blur", () =>{
    checkInputEmail();
})

telefone.addEventListener("blur", () =>{
    checkInputTelefone();
})

plataforma.addEventListener("blur", () =>{
    checkInputEmail();
})

quantidadeCoins.addEventListener("blur", () =>{
    checkInputQuantidadeCoins();
})

function checkInputNome(){
    const nomeValor = nome.value;

    if (nomeValor === ""){
        errorInput(nome, "Não deixe o campo vazio");
    }
    else{
        const formItem = nome.parentElement;
        formItem.className = 'conteudo__formulario'
    }
}

function checkInputEmail(){
    const emailValor = email.value;

    if (emailValor === ""){
        errorInput(email, "Email é obrigatório");
    }
    else{
        const formItem = email.parentElement;
        formItem.className = 'conteudo__formulario'
    }
}

function checkInputTelefone(){
    const telefoneValor = telefone.value;

    if (telefoneValor === ""){
        errorInput(telefone, "Telefone é obrigatório");
    }
    else{
        const formItem = telefone.parentElement;
        formItem.className = "conteudo__formulario"
    }
}

function checkInputPlataforma(){
    const plataformaValor = plataforma.value;

    if (plataformaValor === ""){
        errorInput(plataforma, "Plataforma é essencial")
    }
    else if (plataformaValor.toLowerCase() === "PS4" | plataformaValor.toLowerCase() === "XBOX" | plataformaValor.toLowerCase() === "PS5"){
        const formItem = plataforma.parentElement;
        formItem.className = "conteudo__formulario"
    }
    else {
        errorInput(plataforma, "Plataforma escrita incorretamente")
    }
}

function checkInputQuantidadeCoins(){
    const quantidadeCoinsValor = quantidadeCoins.value;

    if (quantidadeCoinsValor === ""){
        errorInput(quantidadeCoins, "Quantidade é obrigatório");
    }
    else {
        const formItem = quantidadeCoins.parentElement;
        formItem.className = "conteudo__formulario"
    }
}

function checkFormulario(){
    checkInputNome();
    checkInputEmail();
    checkInputTelefone();
    checkInputPlataforma();
    checkInputQuantidadeCoins();

    const formItems = form.querySelectorAll('.conteudo__formulario');

    const eValido = [...formItems].every((item) => {
        return item.className === 'conteudo__formulario'
    });

    if (eValido) {
        alert("Formulário enviado com sucesso", nome);
    }
}

function errorInput(input, mensagem){
    const formItem = input.parentElement;
    const textoMensagem = formItem.querySelector("a")

    textoMensagem.innerText = mensagem;

    formItem.className = "conteudo__formulario error"
}
