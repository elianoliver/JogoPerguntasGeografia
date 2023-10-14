var estados = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Espírito Santo",
    "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais",
    "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
    "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia", "Roraima",
    "Santa Catarina", "São Paulo", "Sergipe", "Tocantins", "Distrito Federal"
];

var capitais = [
    "Rio Branco", "Maceió", "Macapá", "Manaus", "Salvador", "Fortaleza", "Vitória",
    "Goiânia", "São Luís", "Cuiabá", "Campo Grande", "Belo Horizonte",
    "Belém", "João Pessoa", "Curitiba", "Recife", "Teresina", "Rio de Janeiro",
    "Natal", "Porto Alegre", "Porto Velho", "Boa Vista", "Florianópolis",
    "São Paulo", "Aracaju", "Palmas", "Brasília"
];

var jogadores = [];
var indiceJogadorAtual = 0;
var contador=0;
var tentativas = 0;
var estadoAleatorio = document.querySelector("#idEstadoAleatorio"); //h2
var capitaisDatalist = document.querySelector("#idCapitais"); //data list
var idJogador = document.querySelector("#idJogadorPergunta");

// ADICIONANDO AS CAPITAIS NO DATA LIST
if (capitaisDatalist.childElementCount === 0) {
    capitais.forEach(function (capital) {
        let option = document.createElement("option");
        option.value = capital;
        capitaisDatalist.appendChild(option);
    });
}

// GERANDO ESTADO ALEATÓRIO
function gerarEstadoAleatorio() {
    let indiceAleatorio = Math.floor(Math.random() * estados.length);
    estadoAleatorio.innerHTML = estados[indiceAleatorio];
}

// SELECIONANDO O NÚMERO DE JOGADORES
function quantJogadores(numeroJogadores) {
    let outJogadores = document.querySelector(".containerCadastro>output");

    jogadores = Array.from({ length: numeroJogadores }, function () {
        return { nome: "", pontuacao: 0 };
    });

    outJogadores.innerHTML = `Número de Jogadores: ${numeroJogadores}`;

    // MOSTRANDO A TELA DE CADASTRO
    let botoes = document.querySelector(".botoes");
    botoes.style.display = "none";
    let cadastro = document.querySelector(".cadastro");
    cadastro.style.display = "block";
}


// CADASTRANDO O NÚMERO DE JOGADORES SELECIONADOS
function cadastrarJogadores() {
    let outJogadores = document.querySelector(".containerCadastro output");
    let nomeJogador = document.querySelector("#idCadastroJogador");

    let jogadorSemNome = jogadores.find(jogador => jogador.nome === "");

    if (!jogadorSemNome) {
        outJogadores.innerHTML = "Todos os jogadores foram cadastrados.";
        return;
    } else if (nomeJogador.value == "") {
        outJogadores.innerHTML = "Digite um nome válido!";
        nomeJogador.focus();
        return;
    } else {
        jogadorSemNome.nome = nomeJogador.value; //adiciona o nome ao jogador
        nomeJogador.value = "";
        nomeJogador.focus();
        contador++;
    }

    // Verifique se todos os jogadores foram cadastrados.
    if (contador == jogadores.length) {
        let containerCadastro = document.querySelector(".containerCadastro");
        containerCadastro.style.display = "none";
        let containerPerguntas = document.querySelector(".containerPerguntas");
        containerPerguntas.style.display = "block";
    }

    // MOSTRANDO O NOME DO JOGADOR ATUAL NA TELA DE PERGUNTAS
    idJogador.innerHTML = jogadores[indiceJogadorAtual].nome;
}

function enviarResposta() {
    let inputCapitais = document.getElementById("inputCapitais");
    let outPerguntas = document.querySelector(".containerPerguntas output");

    let resposta = inputCapitais.value;
    let capital = capitais[estados.indexOf(estadoAleatorio.innerHTML)]; //pega a capital do estado aleatório

    inputCapitais.value = "";
    inputCapitais.focus();
    tentativas++;

    // se a resposta for vazia
    if (resposta == "") {
        outPerguntas.innerHTML = "Digite uma resposta válida!";
        inputCapitais.focus();
        return;
    }
    // se a resposta for igual a capital
    else if (resposta.toLowerCase() == capital.toLowerCase()) {
        inputCapitais.value = "";
        jogadores[indiceJogadorAtual].pontuacao++;
        proximoJogador();
    }
    // se a resposta for diferente da capital
    else {
        outPerguntas.innerHTML = "Resposta incorreta!";
        proximoJogador();
    }

    // Atualize a pontuação do jogador na tela.
    outPerguntas.innerHTML = jogadores.map(function (jogador) {
        return jogador.nome + " - " + jogador.pontuacao;
    }).join('<br>');
}

// AVANÇAR PARA O PRÓXIMO JOGADOR
function proximoJogador() {
    // Verifique se o índice excede o limite e, em caso afirmativo, reinicie para 0.
    if (indiceJogadorAtual >= jogadores.length - 1) {
        indiceJogadorAtual = 0;
    } else {
        indiceJogadorAtual++;
    }

    // Atualize o nome do jogador na tela.
    idJogador.innerHTML = jogadores[indiceJogadorAtual].nome;

    if (jogadores[indiceJogadorAtual].pontuacao == 5 || tentativas == 10) {
        let containerPerguntas = document.querySelector(".containerPerguntas");
        containerPerguntas.style.display = "none";
        let fimmmm = document.querySelector(".fimDeJogo");
        fimmmm.style.display = "block";
        fimDeJogo();
    }

    gerarEstadoAleatorio();
}

function fimDeJogo() {
    let titutlo = document.querySelector(".fimDeJogo > div > h2");
    let rankingContainer = document.querySelector(".fimDeJogo > .ranking");
    let listaRanking = document.createElement("ol"); // Crie uma lista ordenada.
    let houveEmpate = false;

    // Classifique os jogadores com base na pontuação (do maior para o menor).
    for (let i = 0; i < jogadores.length - 1; i++) {
        for (let j = 0; j < jogadores.length - i - 1; j++) {
            if (jogadores[j].pontuacao < jogadores[j + 1].pontuacao) {
                // Troque a posição de jogadores[j] e jogadores[j+1].
                let temp = jogadores[j];
                jogadores[j] = jogadores[j + 1];
                jogadores[j + 1] = temp;
            }
        }
    }

    // Verifique se há um empate nas pontuações.
    for (let i = 1; i < jogadores.length; i++) {
        if (jogadores[i].pontuacao === jogadores[i - 1].pontuacao) {
            houveEmpate = true;
            break; // Encerre o loop se houver um empate.
        }
    }

    rankingContainer.innerHTML = ""; // Limpe o conteúdo anterior.

    if (houveEmpate) {
        titutlo.innerHTML = "Fim de Jogo - Empate!";
    } else {
        titutlo.innerHTML = "Fim de Jogo - Vencedor!";
    }
    // Preencha a lista com os jogadores classificados.
    for (let i = 0; i < jogadores.length; i++) {
        let jogador = jogadores[i];
        let itemLista = document.createElement("li");
        itemLista.textContent = jogador.nome + " - " + jogador.pontuacao;
        listaRanking.appendChild(itemLista);
    }

    // Adicione a lista ao elemento de ranking.
    rankingContainer.appendChild(listaRanking);
}
// Chame a função `gerarEstadoAleatorio()` na inicialização
window.onload = gerarEstadoAleatorio;
