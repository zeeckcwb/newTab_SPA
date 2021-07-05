$(document).ready(function () {
    $('#valor').mask('000.000.000.000.000,00', { reverse: true });
});

var transacao = [];

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
        localStorage.setItem('transacao', JSON.stringify(transacao))
        listarTransacoes()
    }
}

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

function deletarTransacoes() {
    localStorage.removeItem('transacao')
    alert("registros excluidos")
    listarTransacoes()
}

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