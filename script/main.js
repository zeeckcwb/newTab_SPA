function validarCampo(){
    var mercadoria = document.getElementById("mercadoria").value;
    if(mercadoria == ""){
        validacaoMercadoria.innerHTML = "Preencha o campo mercadoria";
    }

    var valor = document.getElementById("valor").value;
    if(valor == ""){
        validacaoValor.innerHTML = "Preencha o campo valor";
    }
}