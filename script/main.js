/*Mascara para validação do campo Valor no formulário**/
$(document).ready(function () {
    $('#valor').mask('000.000.000.000.000,00', { reverse: true });
});

/*Variável que cria o objeto no localStorage*/
var transacao = [];
/*Função para validação dos campos, deixando o preenchimento obrigatório*/
function validarCampo(e) {
    e.preventDefault()
    var error = false;

    var tipo = document.getElementById("tipo").value;
    var validacaoTipo = document.getElementById("validacaoTipo");
    if (tipo == "") {
        var error = true;
        validacaoTipo.innerHTML = "Selecione 'Compra ou Venda'";
    }

    var mercadoria = document.getElementById("mercadoria").value;
    var validacaoMercadoria = document.getElementById("validacaoMercadoria");
    if (mercadoria == "") {
        var error = true;
        validacaoMercadoria.innerHTML = "Preencha o campo mercadoria";
    }

    var valor = document.getElementById("valor").value;
    var validacaoValor = document.getElementById("validacaoValor");
    if (valor == "") {
        var error = true;
        validacaoValor.innerHTML = "Preencha o campo valor";
    }

    if (!error) {
        if (transacao == null) {
            transacao = []
        }
        transacao.push({ tipo: tipo, mercadoria: mercadoria, valor: valor })
        /*Armazenando no localStorage*/
        localStorage.setItem('transacao', JSON.stringify(transacao))
        listarTransacoes()
        redirecionar()
    }
}

/*Função que lista as transações inseridas na tela*/
function listarTransacoes() {
    transacao = JSON.parse(localStorage.getItem('transacao'))
    if (transacao != null) {
        document.querySelector('#content-table').innerHTML = transacao.map((trsc) => {
            return (
                `<tr>
                <td class='calc_symbol'>+</td>
                <td class='left'>`+ trsc.mercadoria + `</td>
                <td class='right'>R$ `+ trsc.valor + `</td>
            </tr>
            <tr>
                <td colspan="3" class="border"></td>
            </tr>`
            )
        }).join('')
        alterarSimbolo()
        listarTotal()
    }
}

/*Função que altera o símbolo de cada transação, sendo + ou -*/
function alterarSimbolo() {
    transacao = JSON.parse(localStorage.getItem('transacao'))
    i = 0;
    for (; i < transacao.length; i++) {
        if (transacao[i].tipo != "Compra") {
            document.getElementsByClassName('calc_symbol')[i].innerHTML = "+"
        } else {
            document.getElementsByClassName('calc_symbol')[i].innerHTML = "-"
        }
    }
}

/*Função que deleta todas as transações do localStorage*/
function deletarTransacoes() {
    confirm = confirm("Tem certeza de que deseja excluir os registros armazenados?")
    if(confirm == true){
        localStorage.removeItem('transacao')
        deleteApi()
        alert("Registros excluídos")
    } else {
        alert("Registros mantidos")
    }
    listarTransacoes()
}

/*Função realiza o cálculo dos valores inseridos no formulário*/
var total = 0
function calculoValores() {
    let transacao = JSON.parse(localStorage.getItem('transacao'))
    let totalStrVenda = []
    let totalStrCompra = []
    let totalNbrVenda = []
    let totalNbrCompra = []
    let totalVenda = 0
    let totalCompra = 0
    let i = 0
    let j = 0
    if (transacao != null) {
        for (; i < transacao.length; i++) {
            if (transacao[i].tipo == "Compra") {
                totalStrCompra = [transacao[i].valor.replace(/\D/g, '')]
                totalNbrCompra = Number.parseFloat(totalStrCompra)
                totalCompra += totalNbrCompra
            }
        }
        for (; j < transacao.length; j++) {
            if (transacao[j].tipo == "Venda") {
                totalStrVenda = [transacao[j].valor.replace(/\D/g, '')]
                totalNbrVenda = Number.parseFloat(totalStrVenda)
                totalVenda += totalNbrVenda
            }
        }
        total = totalVenda - totalCompra
    }
}

/*Função que lista na tela se o valor apresentado é de lucro ou de prejuízo, baseado no valor da variável 'total'*/
function listarTotal() {
    calculoValores()
    formatarMoeda()
    var campoTotal = document.getElementById('campoTotal')
    campoTotal.innerHTML = "R$ " + totalFormatado;

    if (total > 0) {
        campoLucro.innerHTML = "[LUCRO]"
    }
    else if (total < 0) {
        campoLucro.innerHTML = "[PREJUIZO]"
    }
    else {
        campoLucro.innerHTML = ""
    }
}
/*Função que formata a variável 'total' para uma string com o formato de moeda R$*/
function formatarMoeda() {
    totalFormatado = total
    totalFormatado = totalFormatado + '';
    totalFormatado = parseInt(totalFormatado.replace(/[\D]+/g, ''));
    totalFormatado = totalFormatado + '';
    totalFormatado = totalFormatado.replace(/([0-9]{2})$/g, ",$1");

    if (totalFormatado.length > 6) {
        totalFormatado = totalFormatado.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }
}

/*Função utilizada para a página recarregar após o submit do form */
function redirecionar(){
    location.href="./index.html"
}

/* CREATE - Inserindo dados na API */
var transacaoJson = JSON.stringify(localStorage.getItem('transacao'))
function create(){
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            records: [
                {
                    fields: {
                        Aluno: '9940',
                        Json: transacaoJson
                    }
                }
            ]
        })
    })
    update()
}

/*UPDATE - Atualizando os dados da api */
function update(){
    getId()
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "PATCH",
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            records: [
                {
                    id: idAluno,
                    fields: {
                        Aluno: '9940',
                        Json: transacaoJson
                    }           
                }
            ]
        })
    })
}

/*DELETE - Função utilizada para realizar a deleção dos dados armazenados na API */
function deleteApi(){
    getId()
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer key2CwkHb0CKumjuM");

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico/"+idAluno, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

/*GET - Recuperando os dados da api em JSON e atribuindo a variável resultJson */
var resultJson = {}
function getJson(){
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico?maxRecords=&view=Grid%20view", {
        headers: {
            Authorization: 'Bearer key2CwkHb0CKumjuM'
        },
    }).then(response => response.json().then(result => {resultJson = result}))
}

/*Recuperando o ID da entrada na API baseado nos últimos digitos do cpf do aluno */
var idAluno = ''
function getId(){
    let i = 0;
    for(; i < resultJson.records.length; i++){
        if(resultJson.records[i].fields.Aluno == "9940"){
            idAluno = resultJson.records[i].id
        }
    }
}

/*Função para realizar a verificação se já existe entrada na API */
var verification = true;
function trueOrFalse(){
    let i = 0
    for(; i < resultJson.records.length; i++){
        if(resultJson.records[i].fields.Aluno == "9940"){
            verification = true;
        } else {
            verification = false;
        }
    }
}

/*Função que verifica se existe entrada na API, caso não exista cria uma nova, caso exista realiza o update */
function choiseFunction(){
    trueOrFalse()
    if(verification == false){
        create()
    } else {
        update()
    }
}