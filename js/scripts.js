// ---------- GLOBAL VARIABLES -----------

const LINK_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"; // 3637

let quizzes = []; // pull from API
let userQuizzes = []; // filter quizzes (userQuizzesIDs)
let otherQuizzes = []; // filter quizzes (not userQuizzesIDs)

let playingQuizz = {}; // object to play quizz

let editingQuizz = null; // object to edit quizz
let isEditingANewQuizz = true; // controls flow
let editingQuizzIsValidated = false; // controls flow
function resetEditingQuizz() {
    console.log("resentando ... ok!")
    editingQuizz = null;
    isEditingANewQuizz = true;
    editingQuizzIsValidated = false;
}

const homeScreen = document.querySelector(".home");
const playScreen = document.querySelector(".play");
const editScreen = document.querySelector(".edit");

const editInfoPage = document.querySelector("#edit-info");
const editQuestionsPage = document.querySelector("#edit-questions");
const editLevelsPage = document.querySelector("#edit-levels");
const editSuccessPage = document.querySelector("#edit-success");

let modelOptions = [];


// --------- LOCAL STORAGE -------

// para guardar dados de id e key dos quizzes próprios
// [ {id, key}, {id, key}, {id, key} ... ]
let myQuizzesData = [];

function pullFromLocalStorage() {
    const obj = JSON.parse(window.localStorage.getItem("myQuizzesData"));
    if (obj) { myQuizzesData = obj; }
    else { myQuizzesData = [] }
}
function pushToLocalStorage() {
    window.localStorage.setItem("myQuizzesData", JSON.stringify(myQuizzesData));
}

// cuidado com essa função. apaga todo o histórico de ids/keys do computador do usuário
function clearLocalStorage() {
    window.localStorage.removeItem("myQuizzesData");
}

pullFromLocalStorage();



// --------- prebuilt models -------


const meuQuizz = {
    title: "Meu primeiro quizz teste? Vamos lá?",
    image: "https://imagens.brasil.elpais.com/resizer/A_AIZejFb4KXwd9h9fay-Ruft70=/414x0/cloudfront-eu-central-1.images.arcpublishing.com/prisa/WZF3MMB4ONHUTB5KBSMFZ7L2OI.JPG",
    questions: [
        {
            title: "Qual o meu nome? Vamos lá!!!",
            color: "#480372",
            answers: [
                {
                    text: "Texto da resposta 1",
                    image: "https://http.cat/411.jpg",
                    isCorrectAnswer: true
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                }
            ]
        },
        {
            title: "Título da pergunta 2",
            color: "#049824",
            answers: [
                {
                    text: "Texto da resposta 1",
                    image: "https://http.cat/411.jpg",
                    isCorrectAnswer: true
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                }
            ]
        },
        {
            title: "Título da pergunta 3",
            color: "#908432",
            answers: [
                {
                    text: "Texto da resposta 1",
                    image: "https://http.cat/411.jpg",
                    isCorrectAnswer: true
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                },
                {
                    text: "Texto da resposta 2",
                    image: "https://http.cat/412.jpg",
                    isCorrectAnswer: false
                }
            ]
        }
    ],
    levels: [
        {
            title: "HORRÍVEL HORRÍVEL",
            image: "https://http.cat/411.jpg",
            text: "Descrição do nível vamos lá tentar fazer bem mais",
            minValue: 0
        },
        {
            title: "TOP DO TOP DO TOP",
            image: "https://http.cat/412.jpg",
            text: "Descrição do nível vamos lá tentar fazer bem mais",
            minValue: 50
        }
    ]
}

const meuQuizz2 = {
    title: 'O quão carioca você é? Teste seus conhecimentos de cria!',
    image: 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-cristo-redentor.jpg',
    questions: [
        {
            title: 'Qualquer perguntinha marota pq o teste é real', color: '#000000',
            answers: [
                { text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg' },
                { text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
                { text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
                { text: 'Nerd loka bro pego a visao?', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' }
            ]
        },
        {
            title: 'Segunda perguntinha pra marolar...', color: '#000000',
            answers: [
                { text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg' },
                { text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
                { text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
            ]
        },
        {
            title: 'Essa terceira é braba tá?', color: '#000000',
            answers: [
                { text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg' },
                { text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
                { text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg' },
            ]
        }
    ],
    levels: [
        {
            title: "100% CRIA das casinha",
            text: "ta maluco po. vc é 100% cria irmaozinho. local dos local. norkreina doidao. fechamento patudo pego a visaozinha?",
            image: "https://i.ytimg.com/vi/lM3d9f2AGoY/maxresdefault.jpg",
            minValue: "100",
        },
        {
            title: "nerd loka mao furada",
            text: "ooooo pode saindo já. vc eh uma negacao tlg?? so seria pior se fose paulista. vacilao mete o pe",
            image: "https://img.ibxk.com.br/2020/05/13/13105244489120.jpg",
            minValue: "0",
        }
    ]
}

const prebuiltModels = [meuQuizz, meuQuizz2];



// ------------------ FLUXO ------------------

window.onload = function () {
    refreshQuizzes();
};



// --------- NAVEGAÇÃO -------------

function showAllSreensAndPages() {
    homeScreen.classList.remove("hidden");
    playScreen.classList.remove("hidden");
    editScreen.classList.remove("hidden");

    editInfoPage.classList.remove("hidden");
    editQuestionsPage.classList.remove("hidden");
    editLevelsPage.classList.remove("hidden");
    editSuccessPage.classList.remove("hidden");

}

function showScreen(screen) {
    if (screen === "home") {
        homeScreen.classList.remove("hidden");
        playScreen.classList.add("hidden");
        editScreen.classList.add("hidden");
    } else if (screen === "play") {
        homeScreen.classList.add("hidden");
        playScreen.classList.remove("hidden");
        editScreen.classList.add("hidden");
    } else if (screen === "edit") {
        homeScreen.classList.add("hidden");
        playScreen.classList.add("hidden");
        editScreen.classList.remove("hidden");
    }
    window.scrollTo(0, 0);
}



// ---------- HOME SCREEN SECTION -----------


// Get all quizzes
function refreshQuizzes() {
    axios.get(LINK_QUIZZES).then(ans => {
        // console.log("quizzes recebidos");
        quizzes = ans.data;
        classifyQuizzes();
        loadHome();
    }).catch(error => {
        // console.log("não foi possível receber os quizzes");
        // console.log(error);
    })
}


function classifyQuizzes() {
    pullFromLocalStorage();
    userQuizzes = quizzes.filter(quizz => {
        let check = false;
        myQuizzesData.filter(data => {
            if (data.id === quizz.id) { check = true; }
        })
        return check;
    })
    otherQuizzes = quizzes.filter(quizz => {
        let check = false;
        myQuizzesData.filter(data => {
            if (data.id === quizz.id) { check = true; }
        })
        return !check;
    })
}

function loadHome() {

    const yourQuizzesWrapperEl = homeScreen.querySelector(".yourQuizzes ");
    const yourQuizzesEl = yourQuizzesWrapperEl.querySelector(".quizzes");
    const allQuizzesEl = homeScreen.querySelector(".allQuizzes").querySelector(".quizzes");

    yourQuizzesEl.innerHTML = "";
    allQuizzesEl.innerHTML = "";

    // cria home na parte do usuario (yourQuizzesEmpty, popular Quizzes do usuario)
    if (userQuizzes.length === 0) {
        // console.log("nao tem nada seu");
        yourQuizzesWrapperEl.classList.add("hidden");
        homeScreen.querySelector(".yourQuizzesEmpty").classList.remove("hidden");
    }
    else {
        // console.log("opa tem coisa sua");
        userQuizzes.forEach(quizz => {
            yourQuizzesEl.appendChild(createQuizzThumbElement(quizz, true, "h"));
        })
        yourQuizzesWrapperEl.classList.remove("hidden");
        homeScreen.querySelector(".yourQuizzesEmpty").classList.add("hidden");
    }

    // popular Quizzes que não são do usuario
    otherQuizzes.forEach(quizz => {
        allQuizzesEl.appendChild(createQuizzThumbElement(quizz, false, "h"));
    })

    populateOptions();

    showScreen("home");
}



function populateOptions() {

    optionEls = document.querySelectorAll(".selectModel");
    optionEls.forEach(el => {
        el.innerHTML = "";
    })

    modelOptions = [
        { id: null, text: "Novo", quizz: newQuizz() }
    ];

    prebuiltModels.forEach(model => {
        modelOptions.push({ id: null, text: model.title, quizz: model })
    })

    userQuizzes.forEach(quizz => {
        modelOptions.push({ id: quizz.id, text: quizz.title, quizz: quizz })
    })

    optionEls.forEach(el => {
        modelOptions.forEach((model, i) => {
            // console.log(model.text);
            el.appendChild(new Option(model.text, i));
        })
    })
}



function createQuizzThumbElement(quizz, isUserQuizz, prefix) {

    const element = document.createElement("div");
    element.classList.add("quizz");
    element.id = prefix + quizz.id;
    //element.addEventListener("click", quizzThumbClicked);

    if (isUserQuizz) {
        element.innerHTML = `
        <div class="yourQuizzOptions">
            <div class="editQuizzButton" onclick="editQuizz(${quizz.id})">
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="deleteQuizzButton" onclick="deleteQuizz(${quizz.id}, this)">
                <ion-icon name="trash-outline"></ion-icon>
                <p>Confirmar</p>
            </div>
        </div>
        `
    }

    element.innerHTML += `
        <a onclick="showQuiz(${quizz.id})">
        <div class="gradient"></div>
        <p>${quizz.title}</p>
        <img src="${quizz.image}" alt="${quizz.title}">
        </a>
    `

    return element;
}



// ---------- PLAY SCREEN SECTION -----------

let quiz = "";
let answers = "";
let answersArray = "";
let answersParent = "";
let allAnswers = "";

let result = [];
let finalResult = "";
let finalResultLevel = "";

function showQuiz(idQuiz) {
    //const promise = axios.get(`https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuiz}`);
    //promise.then(loadQuiz);
    loadQuiz(idQuiz);
    showScreen("play");
}

function loadQuiz(id) { //answer

    quiz = getQuizzFromId(id);

    result = []; // Zerar a pontuação

    playScreen.innerHTML = `
        <div class="headerPlay">
            <p>${quiz.title}</p>
            <img src="${quiz.image}" alt="Imagem do Quiz">
            <div class="dark"></div>
        </div>
    `;

    questionBox = "";

    for (let k = 0; k < quiz.questions.length; k++) {
        answersArray = quiz.questions[k].answers;
        answersArray.sort(comparator);

        answers = "";

        for (let i = 0; i < answersArray.length; i++) {
            answers += `
                    <div class="answer ${answersArray[i].isCorrectAnswer}" onclick="selectAnswer(this)">
                        <img src="${answersArray[i].image}" alt="">
                        <p>${answersArray[i].text}</p>
                        <div class="bright"></div>
                    </div>
            `;
        }

        playScreen.innerHTML += `
            <div class="questionBox">
                <div class="question">
                    <p>${quiz.questions[k].title}</p>
                </div>
                <div class="answers">${answers}</div>
            </div>
        `;

        playScreen.lastElementChild.firstElementChild.style.backgroundColor = quiz.questions[k].color; // Definindo a cor de fundo da pergunta
    }

    window.scrollTo(0,0);
}

function comparator() {
    return Math.random() - 0.5;
}

function selectAnswer(divAnswer) {
    if (!(divAnswer.classList.contains("selected") || divAnswer.classList.contains("notSelected"))) { // Só irá executar a função se não estiver selecionado e não estiver como "não selecionado"

        if (divAnswer.classList.contains("true")) { // Acertou ou errou?
            result.push(1);
        } else {
            result.push(0);
        }

        divAnswer.classList.add("selected"); // Seleciona a que foi clicada

        answersParent = divAnswer.parentNode;
        allAnswers = answersParent.querySelectorAll(".answer"); // Lista todas as respostas

        for (let i = 0; i < allAnswers.length; i++) { // Coloca "notSelected" nas outras respostas
            if (!(allAnswers[i].classList.contains("selected"))) {
                allAnswers[i].classList.add("notSelected");
            }
        }

        for (let i = 0; i < allAnswers.length; i++) { // Marca as respostas como certa ou errada
            if (allAnswers[i].classList.contains("true")) {
                allAnswers[i].classList.add("right");

            } else if (allAnswers[i].classList.contains("false")) {
                allAnswers[i].classList.add("wrong");
            }
        }

        let questions = playScreen.querySelectorAll(".questionBox"); // Verifica se terminou
        if (result.length == questions.length) {
            finished();
        }

        setTimeout(() => {
            let nextQuestion = answersParent.parentNode.nextElementSibling;
            if (nextQuestion != null) {
                nextQuestion.scrollIntoView();
            } else {
                playScreen.querySelector(".resultBox").scrollIntoView();
            }
        }, 2000);
    }
}

function finished() {
    let sum = 0;

    for (let i = 0; i < result.length; i++) {   // Somando o resultado
        sum += result[i];
    }

    finalResult = parseInt((sum / result.length) * 100); // Calculando o resultado final em %

    for (let i = 0; i < quiz.levels.length; i++) {
        if (finalResult >= quiz.levels[i].minValue) {
            finalResultLevel = i;
        }
    }

    printResultBox();
}

function printResultBox() {
    playScreen.innerHTML += `
        <div class="resultBox">
            <div class="resultTitle">
                <p>${finalResult}% de acerto: ${quiz.levels[finalResultLevel].title}</p>
            </div>
            <div class="result">
                <img src="${quiz.levels[finalResultLevel].image}" alt="Imagem do resultado">
                <p>${quiz.levels[finalResultLevel].text}</p>
            </div>
        </div>
        <button class="restartQuiz" onclick="restartQuiz()">Reiniciar Quizz</button>
        <button class="comeBackHome" onclick="refreshQuizzes()">Voltar pra home</button>
    `;
}

function restartQuiz() {
    showQuiz(quiz.id);
}

// ---------- EDIT SCREEN SECTION -----------

// Abrir e fechar uma seção

function toggleEditSection(button) {
    button.parentElement.parentElement.parentElement.classList.toggle("closed");
}

// Botões de adicionar

function addQuestionButtonClicked() {
    addNewQuestion();
    loadEditPage('questions');
}
function addLevelButtonClicked() {
    addNewLevel();
    loadEditPage('levels');
}
function deleteQuestionButtonClicked(index) {
    if (removeQuestion(index)) { loadEditPage('questions'); }
}
function deleteLevelButtonClicked(index) {
    if (removeLevel(index)) { loadEditPage('levels'); }
}



function editQuizz(id) {

    console.log(`Tentando editar id:${id}`);

    if (id) {
        editingQuizz = getQuizzFromId(id);
        if (editingQuizz.id === id && editingQuizz) {

            console.log("quizz existente");
            console.log(editingQuizz)

            isEditingANewQuizz = false;
            editingQuizzIsValidated = false;

            nextPage('info');
            showScreen('edit');
        }
        else {
            console.log("não achou quizz com esse id.");
        }
    }
    else {
        const model = modelOptions[getSelectedModelIndex()].quizz; // newQuizz() meuQuizz meuQuizz2

        console.log("criando quizz do modelo a seguir...");
        console.log(model);

        editingQuizz = {}
        editingQuizz.title = model.title;
        editingQuizz.image = model.image;
        editingQuizz.questions = model.questions;
        editingQuizz.levels = model.levels;

        console.log("o editingQuizz está assim: ");
        console.log(editingQuizz);

        isEditingANewQuizz = true;
        editingQuizzIsValidated = false;

        showScreen('edit');
        nextPage('info');
    }
}

function getSelectedModelIndex() {
    const isFirstQuizz = !document.querySelector(".yourQuizzesEmpty").classList.contains("hidden");
    let modelIndex = 0;
    if (isFirstQuizz) {
        modelIndex = document.querySelectorAll(".selectModel")[0].value;
    } else {
        modelIndex = document.querySelectorAll(".selectModel")[1].value;
    }
    return modelIndex;
    //console.log(modelIndex);
}

// Navegar entre seções

function createNewQuizz() {
    editQuizz();
}

function deleteQuizz(id, element) {

    //console.log(`deleter ${element.classList}`)
    const msgIsShown = (element.classList.contains("expanded"));
    // console.log("apertou");

    if (msgIsShown) {
        const quizz = getQuizzFromId(id);
        const key = getKeyFromId(id);
        const link = LINK_QUIZZES + "/" + id;
        const config = { headers: { "Secret-Key": key } };

        // console.log("vamos tentar apagar "+link);
        axios.delete(link, config).then(ans => {
            // console.log("conseguiu apagar");
            goHomeFromSuccessPage();
        }).catch(error => {
            // console.log("não conseguiu apagar");
            // console.log(error)
        })
    } else {
        element.classList.add("expanded");
    }
}

function getQuizzFromId(id) {
    let quizzObj = null;
    quizzes.forEach(quizz => {
        if (quizz.id == id) {
            quizzObj = quizz;
        }
    })
    return quizzObj;
}

function getKeyFromId(id) {
    let key = null;
    myQuizzesData.forEach(quizz => {
        if (quizz.id === id) { key = quizz.key; }
    })
    //console.log(`id: ${id} key:${key}`);
    return key;
}

function nextPage(nextPageKey) {

    if (validatePageInputs(nextPageKey)) {
        saveInputs(nextPageKey);
        if (nextPageKey === "success") {
            sendQuizz();
        }
        else {
            loadEditPage(nextPageKey);
            showEditPage(nextPageKey);
        }
    }
}

// Funções de validação

function validatePageInputs(nextPageKey) {

    clearInvalidTests();
    let numOfInvalidInputs = 0;

    switch (nextPageKey) {
        case "questions":

            numOfInvalidInputs += validateInputs("info", "title", "infotitle");
            numOfInvalidInputs += validateInputs("info", "url", "infourl");
            numOfInvalidInputs += validateInputs("info", "numQue", "infonumQue");
            numOfInvalidInputs += validateInputs("info", "numLev", "infonumLev");
            break;

        case "levels":
            editingQuizz.questions.forEach((question, que_pos) => {
                numOfInvalidInputs += validateInputs("question", "title", `q${que_pos}title`);
                numOfInvalidInputs += validateInputs("question", "color", `q${que_pos}color`);
                numOfInvalidInputs += validateInputs("answer", "mandatory_numOfAns", `q${que_pos}`);
            })
            break;

        case "success":
            numOfInvalidInputs += validateInputs("level", "mandatory_zeroValue", ``);
            editingQuizz.levels.forEach((question, que_lev) => {
                numOfInvalidInputs += validateInputs("level", "title", `l${que_lev}title`);
                numOfInvalidInputs += validateInputs("level", "minValue", `l${que_lev}minValue`);
                numOfInvalidInputs += validateInputs("level", "url", `l${que_lev}url`);
                numOfInvalidInputs += validateInputs("level", "text", `l${que_lev}text`);
            })

            editingQuizzIsValidated = true;

            break;

        default:
            break;
    }

    return (numOfInvalidInputs === 0);
}

function validateInputs(pageKey, type, elementId) {

    //console.log(`${pageKey} ${type} ${elementId}`);

    let numOfInvalidTests = 0;
    let switcher = pageKey + type;
    let errorMsg = "";

    let element = null;
    let value = null;

    if (type === "mandatory_numOfAns") {

        // Right
        let text = getInputValue(elementId + "a" + 0 + "text");
        let url = getInputValue(elementId + "a" + 0 + "url");

        // se estiver preenchidos
        if (text && url) {
            // checar se está preenchido corretamente
            validateInputs("answers", "title", elementId + "a" + 0 + "text");
            validateInputs("answers", "url", elementId + "a" + 0 + "url");

        } else {
            numOfInvalidTests++;

            element = document.getElementById(elementId + "a" + 0 + "text");
            element.children[1].innerHTML += "Defina a resposta correta. "
            element.classList.add("showError");

            element = document.getElementById(elementId + "a" + 0 + "url");
            element.children[1].innerHTML += "Defina a resposta correta. "
            element.classList.add("showError");
        }

        // Wrongs
        let numOfWrongAnswers = 0;
        for (let i = 1; i < 4; i++) {
            text = getInputValue(elementId + "a" + i + "text");
            url = getInputValue(elementId + "a" + i + "url");
            if (!(!text && !url)) {
                numOfWrongAnswers++;
            }
        }
        if (numOfWrongAnswers < 2) { numOfInvalidTests++; }

        for (let i = 1; i < 4; i++) {
            element = document.getElementById(elementId + "a" + i + "text");
            text = getInputValue(elementId + "a" + i + "text");
            url = getInputValue(elementId + "a" + i + "url");
            if (text && url) {
                // checar se está preenchido corretamente
                validateInputs("answers", "title", elementId + "a" + i + "text");
                validateInputs("answers", "url", elementId + "a" + i + "url");
            }
            else {
                if (numOfWrongAnswers < 2) {
                    element = document.getElementById(elementId + "a" + i + "text");
                    element.children[1].innerHTML += `Complete pelo menos +${2 - numOfWrongAnswers}. `;
                    element.classList.add("showError");

                    element = document.getElementById(elementId + "a" + i + "url");
                    element.children[1].innerHTML += `Complete pelo menos +${2 - numOfWrongAnswers}. `;
                    element.classList.add("showError");
                }
                else {

                }
            }
        }

    }
    else if (type === "mandatory_zeroValue") {

        let hasZeroValue = false;
        for (let i = 0; i < editingQuizz.levels.length; i++) {
            if (getInputValue("l" + i + "minValue") === "0") {
                hasZeroValue = true;
            }
        }
        if (!hasZeroValue) {
            numOfInvalidTests++;
        }
        for (let i = 0; i < editingQuizz.levels.length; i++) {
            if (!hasZeroValue) {
                errorMsg += "Não tem nível zero! ";
                element = document.getElementById("l" + i + "minValue");
                element.children[1].innerHTML += errorMsg;
                element.classList.add("showError");
            } else {
            }
        }
    }
    else {

        element = document.getElementById(elementId);
        value = element.children[0].value;

        // check value = null
        if (!value || value === "") {
            numOfInvalidTests++;
            errorMsg += "Valor está vazio. ";
        }
        // check URL
        else if (type === "url" && !isValidHttpUrl(value)) {
            numOfInvalidTests++;
            errorMsg += "Precisa ser URL. ";
        }
        // check color
        else if (type === "color" && !isValidColor(value)) {
            numOfInvalidTests++;
            errorMsg += "Cor inválida. ";
        }
        else if (type === "numQue" && (parseInt(value) < 3 || !parseInt(value))) {
            numOfInvalidTests++;
            errorMsg += "No mínimo 3 perguntas. ";
        }
        else if (type === "numLev" && (parseInt(value) < 2 || !parseInt(value))) {
            numOfInvalidTests++;
            errorMsg += "No mínimo 2 níveis. ";
        }
        else if (type === "minValue" && !(parseInt(value) >= 0 && parseInt(value) <= 100)) {
            numOfInvalidTests++;
            errorMsg += "Entre 0 e 100. ";
        }
        else if (type === "text" && value.length < 30) {
            numOfInvalidTests++;
            errorMsg += "Deve ter pelo menos 30 caracteres. ";
        }
        else if (type === "title") {

            if (pageKey === "info" && (value.length < 20 || value.length > 65)) {
                numOfInvalidTests++;
                errorMsg += "Deve ter entre 20 e 65 caracteres. ";
            }
            if (pageKey === "question" && (value.length < 20)) {
                numOfInvalidTests++;
                errorMsg += "Deve ter no mínimo 20 caracteres. ";
            }
            else if (pageKey === "level" && (value.length < 10)) {
                numOfInvalidTests++;
                errorMsg += "Deve ter pelo menos 10 caracteres. ";
            }
        }

        element.children[1].innerHTML += errorMsg;
        if (numOfInvalidTests > 0) {
            element.classList.add("showError");
        }

        return numOfInvalidTests;
    }


    return numOfInvalidTests;
}

function clearInvalidTests() {
    const inputs = document.querySelectorAll(".edit input, .edit textarea");
    inputs.forEach(child => {
        let father = child.parentElement;
        father.classList.remove("showError");
        father.children[1].innerHTML = "";
    })
}

function isValidHttpUrl(string) {
    let url;
    try { url = new URL(string); }
    catch (_) { return false; }
    return url.protocol === "http:" || url.protocol === "https:";
}

function isValidColor(string) {
    var reg = /^#([0-9a-f]{6}){1}$/i;
    return (reg.test(string));
}

// Salvando dados

function getInputValue(elementId) {
    return document.getElementById(elementId).children[0].value;
}

function addNewQuestion() {
    editingQuizz.questions.push(newQuestion("", "", ""));
}

function removeQuestion(position) {
    let len = editingQuizz.questions.length;
    if (len - 1 >= 3) {
        if (position < len && position >= 0) {
            editingQuizz.questions.splice(position, 1);
            return true;
        }
        else if (!position) {
            editingQuizz.questions.pop();
            return true;
        }
        return false;
    }
}

function addNewLevel() {
    editingQuizz.levels.push(newLevel("", "", "", ""));
}

function removeLevel(position) {
    let len = editingQuizz.levels.length;
    if (len - 1 >= 2) {
        if (position && position < len && position >= 0) {
            editingQuizz.levels.splice(position, 1);
            return true;
        }
        else if (!position) {
            editingQuizz.levels.pop();
            return true;
        }
        return false;
    }
}

function saveInputs(nextPageKey) {

    switch (nextPageKey) {
        case "questions":

            editingQuizz.title = getInputValue("infotitle");
            editingQuizz.image = getInputValue("infourl");
            const numAddQuestions = parseInt(getInputValue("infonumQue")) - editingQuizz.questions.length;
            const numAddLevels = parseInt(getInputValue("infonumLev")) - editingQuizz.levels.length;

            if (numAddQuestions > 0) {
                for (i = 0; i < numAddQuestions; i++) { addNewQuestion(); }
            } else if (numAddQuestions < 0) {
                for (i = 0; i < -1 * numAddQuestions; i++) { removeQuestion(); }
            }

            if (numAddLevels > 0) {
                for (i = 0; i < numAddLevels; i++) { addNewLevel(); }
            } else if (numAddLevels < 0) {
                for (i = 0; i < -1 * numAddLevels; i++) { removeLevel(); }
            }


            break;

        case "levels":
            editingQuizz.questions.forEach((question, que_pos) => {
                question.title = getInputValue(`q${que_pos}title`);
                question.color = getInputValue(`q${que_pos}color`);
                question.answers = []

                let text = getInputValue(`q${que_pos}a${0}text`);
                let url = getInputValue(`q${que_pos}a${0}url`);
                question.answers.push(newAnswer(text, true, url));

                for (let i = 1; i < 4; i++) {
                    text = getInputValue(`q${que_pos}a${i}text`);
                    url = getInputValue(`q${que_pos}a${i}url`);
                    if (text && text !== "" && url && url !== "") {
                        question.answers.push(newAnswer(text, false, url));
                    }
                    text = null;
                    url = null;
                }
            })
            break;

        case "success":
            editingQuizz.levels.forEach((level, que_lev) => {
                level.title = getInputValue(`l${que_lev}title`);
                level.minValue = getInputValue(`l${que_lev}minValue`);
                level.image = getInputValue(`l${que_lev}url`);
                level.text = getInputValue(`l${que_lev}text`);
            })
            break;

        default:
            break;
    }
}

// Carregando na página

function loadEditPage(pageKey) {
    let editPageContent = null;
    switch (pageKey) {
        case 'info':
            const wrapper = editInfoPage.querySelector(".editSection-group-wrapper");
            wrapper.innerHTML = "";
            wrapper.appendChild(newInputElement("info", "title", "input", "Título do seu quizz", editingQuizz.title));
            wrapper.appendChild(newInputElement("info", "url", "input", "URL da imagem do seu quizz", editingQuizz.image));
            wrapper.appendChild(newInputElement("info", "numQue", "input", "Quantidade de perguntas do quizz", editingQuizz.questions.length));
            wrapper.appendChild(newInputElement("info", "numLev", "input", "Quantidade de níveis do quizz", editingQuizz.levels.length));
            break;

        case 'questions':
            editPageContent = editQuestionsPage.querySelector(".editPage-content");
            editPageContent.innerHTML = "";
            const questionElements = editingQuizz.questions.map((question, position) => newEditQuestionElement(question, position));
            questionElements.forEach(questionElement => editPageContent.appendChild(questionElement));
            editPageContent.innerHTML += `<button class="add-button" onclick="addQuestionButtonClicked()">Adicionar pergunta</button>`;
            break;

        case 'levels':
            editPageContent = editLevelsPage.querySelector(".editPage-content");
            editPageContent.innerHTML = "";
            const levelElements = editingQuizz.levels.map((level, position) => newEditLevelElement(level, position));
            levelElements.forEach(levelElement => editPageContent.appendChild(levelElement));
            editPageContent.innerHTML += `<button class="add-button" onclick="addLevelButtonClicked()">Adicionar nível</button>`;
            break;

        case 'success':
            editSuccessPage.querySelector(".editPage-content").innerHTML = "";
            const buttons = editSuccessPage.querySelectorAll("button");
            buttons.forEach(button => button.remove());
            editSuccessPage.querySelector(".editPage-content").appendChild(createQuizzThumbElement(editingQuizz, true, "s"));
            editSuccessPage.innerHTML += `<button class="nextStep-button" onclick="showQuiz(${editingQuizz.id})">Acessar Quizz</button>`;
            editSuccessPage.innerHTML += `<button class="goHome-button" onclick="goHomeFromSuccessPage()">Voltar para home</button>`;

            break;
        default:
            break;
    }
}

// Trocar de página

function showEditPage(pageKey) {
    editInfoPage.classList.add("hidden");
    editQuestionsPage.classList.add("hidden");
    editLevelsPage.classList.add("hidden");
    editSuccessPage.classList.add("hidden");

    document.querySelector("#edit-" + pageKey).classList.remove("hidden");
}

// enviando quizz

function sendQuizz() {

    console.log("tentando finalizar");

    if (editingQuizzIsValidated) {

        console.log("tudo validado");

        if (isEditingANewQuizz) {

            console.log("é um novo. tentando salvar pela 1 vez.'");

            if (editingQuizz.id) { delete editingQuizz.id }
            if (editingQuizz.key) { delete editingQuizz.key }

            console.log("enviando assim:");
            console.log(editingQuizz);

            const postNewQuizz = axios.post(LINK_QUIZZES, editingQuizz);
            postNewQuizz.then(answer => {

                console.log("show! conseguiu publicar! resposta:");
                console.log(answer.data);

                pullFromLocalStorage();
                myQuizzesData.push({ id: answer.data.id, key: answer.data.key });
                pushToLocalStorage();
                pullFromLocalStorage();

                editingQuizz.id = answer.data.id;
                editingQuizz.title = answer.data.title;
                editingQuizz.image = answer.data.image;
                editingQuizz.questions = answer.data.questions;
                editingQuizz.levels = answer.data.levels;

                console.log("salvando em quizzes assim: ");
                console.log(editingQuizz);
                quizzes.push(editingQuizz);

                loadEditPage('success');
                showEditPage('success');

                resetEditingQuizz();
            }).catch(error => {
                //console.log(error);
            })
        }
        else {

            const id = editingQuizz.id;
            delete editingQuizz.id;

            if (editingQuizz.key) { delete editingQuizz.key }

            const key = getKeyFromId(id);
            const link = LINK_QUIZZES + "/" + id;
            const config = { headers: { "Secret-Key": key } };

            console.log("vamos tentar substituir. enviando assim:");
            console.log(editingQuizz);

            axios.put(link, editingQuizz, config).then(answer => {
                //conseguiu substituir
                console.log("substituido! segue a resposta: ");
                console.log(answer.data);

                editingQuizz = {};
                editingQuizz.title = answer.data.title;
                editingQuizz.image = answer.data.image;
                editingQuizz.questions = answer.data.questions;
                editingQuizz.levels = answer.data.levels;
                editingQuizz.id = answer.data.id;

                console.log("vamos substituir localmente por essa versao");
                console.log(editingQuizz);
                quizzes.filter(quizz => !(quizz.id === editingQuizz.id))
                quizzes.push(editingQuizz);
                console.log("segue todos os quizzes");
                console.log(quizzes);

                loadEditPage('success');
                showEditPage('success');

                resetEditingQuizz();
            }).catch(error => {
                console.log("deu erro:");
                console.log(error)
            })
        }
    }
}

function goHomeFromSuccessPage() {
    resetEditingQuizz();
    refreshQuizzes();
}



// Create new objects

function newQuizz(title, image, questions, levels) {

    if (!questions) {
        questions = [
            newQuestion("", "", null),
            newQuestion("", "", null),
            newQuestion("", "", null)
        ]
    }
    if (!levels) {
        levels = [
            newLevel("", "", 50, ""),
            newLevel("", "", 0, "")
        ]
    }

    return { title: "", image: "", questions: questions, levels: levels };
}

function newQuestion(title, color, answers) {
    if (!answers) {
        answers = [
            newAnswer("", true, ""),
            newAnswer("", false, ""),
            newAnswer("", false, ""),
            newAnswer("", false, "")
        ]
    }
    return { title: title, color: color, answers: answers };
}

function newAnswer(text, isCorrectAnswer, image) {
    return { text: text, isCorrectAnswer: isCorrectAnswer, image: image };
}

function newLevel(title, text, minValue, image) {
    return { title: title, text: text, minValue: minValue, image: image };
}

// Create new DOM elements

function newEditQuestionElement(question, que_pos) {

    const id = "q" + que_pos;

    const element = document.createElement("div");
    element.classList.add("editSection");
    element.classList.add("closed");
    element.id = id;

    element.innerHTML = `
        <div class="editSection-header">
            <h3>Pergunta ${que_pos + 1}</h3>
            <div>
                <ion-icon name="trash-outline" onclick="deleteQuestionButtonClicked(${que_pos})"></ion-icon>
                <ion-icon name="create-outline" onclick="toggleEditSection(this)"></ion-icon>
            </div>
        </div>

        <div class="editSection-group">
            <div class="editSection-group-wrapper">
                <!-- inputs geral aqui -->
            </div>
        </div>

        <div class="editSection-group rightAnswers">
            <h3>Respostas corretas</h3>
            <!-- respostas corretas aqui -->
        </div>
        
        <div class="editSection-group wrongAnswers">
            <h3>Respostas incorretas</h3>
            <!-- respostas incorretas aqui -->
        </div>
    `

    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "title", "input", `Texto da pergunta`, question.title))
    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "color", "input", `Cor de fundo da pergunta`, question.color))

    const rightAnswers = question.answers.filter(answer => answer.isCorrectAnswer);
    const wrongAnswers = question.answers.filter(answer => !answer.isCorrectAnswer);

    rightAnswersEl = element.querySelector(".rightAnswers");
    rightAnswersEl.appendChild(newEditAnswerElement(rightAnswers[0], que_pos, 0));

    wrongAnswersEl = element.querySelector(".wrongAnswers");
    for (let i = 0; i < 3; i++) {
        let answer = newAnswer("", false, "");
        if (i < wrongAnswers.length) {
            answer = wrongAnswers[i];
        }
        wrongAnswersEl.appendChild(newEditAnswerElement(answer, que_pos, i + 1));
    }

    return element;
}

function newEditAnswerElement(answer, que_pos, ans_pos) {

    let id = "q" + que_pos + "a" + ans_pos;

    let count = "";
    let word = "correta";
    if (!answer.isCorrectAnswer) {
        count = ans_pos + 1;
        word = "incorreta";
    }

    const element = document.createElement("div");
    element.id = id;
    element.classList.add("editSection-group-wrapper");
    element.appendChild(newInputElement(id, "text", "input", `Resposta ${word} ${count}`, answer.text));
    element.appendChild(newInputElement(id, "url", "input", `URL da imagem ${count}`, answer.image));

    return element;
}

function newEditLevelElement(level, lev_pos) {

    id = "l" + lev_pos;

    const element = document.createElement("div");
    element.classList.add("editSection");
    element.classList.add("closed");
    element.id = id;

    element.innerHTML = `
        <div class="editSection-header" id="${id}">
            <h3>Nível ${lev_pos + 1}</h3>
            <div>
                <ion-icon name="trash-outline" onclick="deleteLevelButtonClicked(${lev_pos})"></ion-icon>
                <ion-icon name="create-outline" onclick="toggleEditSection(this)"></ion-icon>
            </div>
        </div>

        <div class="editSection-group">
            <div class="editSection-group-wrapper">
                <!-- INPUTS AQUI -->
            </div>
        </div>
    `

    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "title", "input", `Texto da pergunta`, level.title))
    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "minValue", "input", `% de acerto mínima`, level.minValue))
    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "url", "input", `URL da imagem do nível`, level.image))
    element.querySelector(".editSection-group-wrapper").appendChild(newInputElement(id, "text", "textArea", "Descrição do nível", level.text))

    return element;
}

function newInputElement(fatherId, inp_name, tag, placeHolder, value) {
    const element = document.createElement("div");
    const id = fatherId + inp_name;
    element.id = id;
    //element.classList.add("showError")
    if (tag === "input") {
        element.innerHTML += `<input type="text" placeholder="${placeHolder}" value="${value}">`;
    } else {
        element.innerHTML += `<textarea type="text" class="text" placeholder="${placeHolder}">${value}</textarea>`;
    }
    element.innerHTML += `<p>Error</p>`;

    return element;
}


