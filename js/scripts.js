// ---------- GLOBAL VARIABLES -----------

const LINK_QUIZZES = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzes = []; // pull from API
let userQuizzes = []; // filter quizzes (userQuizzesIDs)
let otherQuizzes = []; // filter quizzes (not userQuizzesIDs)

let playingQuizz = {}; // object to play quizz

let editingQuizz = null; // object to edit quizz
let isEditingANewQuizz = true; // controls flow
let editingQuizzIsValidated = false; // controls flow
function resetEditingQuizz() {
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
const editSuccesPage = document.querySelector("#edit-success");





// --------- LOCAL STORAGE -------

// para guardar dados de id e key dos quizzes próprios
// [ {id, key}, {id, key}, {id, key} ... ]
let myQuizzesData = [];

function pullFromLocalStorage() {
    const obj = JSON.parse(window.localStorage.getItem("myQuizzesData"));
    if (obj) {myQuizzesData = obj;}
    else {myQuizzesData = []}
}
function pushToLocalStorage() {
    window.localStorage.setItem("myQuizzesData", JSON.stringify(myQuizzesData));
}

// cuidado com essa função. apaga todo o histórico de ids/keys do computador do usuário
function clearLocalStorage() {
    window.localStorage.removeItem("myQuizzesData");
}

pullFromLocalStorage();


// ------------------ FLUXO ------------------

window.onload = function() {
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
    editSuccesPage.classList.remove("hidden");

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
}



// ---------- HOME SCREEN SECTION -----------


// Get all quizzes
function refreshQuizzes() {
    axios.get(LINK_QUIZZES).then(ans => {
        console.log("quizzes recebidos");
        quizzes = ans.data;
        classifyQuizzes();
        loadHome();
    }).catch(error => {
        console.log("não foi possível receber os quizzes");
        console.log(error);
    })
}


function classifyQuizzes() {
    pullFromLocalStorage();
    userQuizzes = quizzes.filter(quizz => {
        let check = false;
        myQuizzesData.filter(data => {
            if (data.id === quizz.id) {check = true;}
        })
        return check;
    })
    otherQuizzes = quizzes.filter(quizz => {
        let check = false;
        myQuizzesData.filter(data => {
            if (data.id === quizz.id) {check = true;}
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

    if (userQuizzes.length === 0) {
        console.log("nao tem nada seu");
        yourQuizzesWrapperEl.classList.add("hidden");
        homeScreen.querySelector(".yourQuizzesEmpty").classList.remove("hidden");
    }
    else {
        console.log("opa tem coisa sua");
        userQuizzes.forEach(quizz => {
            yourQuizzesEl.appendChild(createQuizzThumbElement(quizz, true));
        })
        yourQuizzesWrapperEl.classList.remove("hidden");
        homeScreen.querySelector(".yourQuizzesEmpty").classList.add("hidden");
    }

    otherQuizzes.forEach(quizz => {
        allQuizzesEl.appendChild(createQuizzThumbElement(quizz, false));
    })

    showScreen("home");
}



function createQuizzThumbElement(quizz, isUserQuizz) {

    const element = document.createElement("div");
    element.classList.add("quizz");
    element.id = quizz.id;

    if (isUserQuizz) {
        element.innerHTML = `
        <div class="yourQuizzOptions">
            <div class="editQuizzButton" onclick="editQuizz(${quizz.id})">
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="deleteQuizzButton" onclick="deleteQuizz(${quizz.id})">
                <ion-icon name="trash-outline"></ion-icon>
                <p>Confirmar</p>
            </div>
        </div>
        `
    }

    element.innerHTML += `
        <div class="gradient"></div>
        <p>${quizz.title}</p>
        <img src="${quizz.image}" alt="${quizz.title}">`
    return element;
}



// ---------- PLAY SCREEN SECTION -----------



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
    if (removeQuestion(index)) {loadEditPage('questions');}
}
function deleteLevelButtonClicked(index) {
    if (removeLevel(index)) {loadEditPage('levels');}
}

// Navegar entre seções
function createNewQuizz() {

    editingQuizz = meuQuizz2; // newQuizz() meuQuizz meuQuizz2
    isEditingANewQuizz = true;
    editingQuizzIsValidated = false;

    showScreen('edit');
    nextPage('info');
}

function editQuizz(quizzId) {

    editingQuizz = getQuizzFromId(quizzId);
    if (editingQuizz) {
        isEditingANewQuizz = false;
        editingQuizzIsValidated = false;
        nextPage('info');
        showScreen('edit');
    }
}

function deleteQuizz(id) {
    const quizzEl = document.getElementById(id);
    const msgIsShown = (quizzEl.querySelector(".deleteQuizzButton").classList.contains("expanded"));
    if (msgIsShown) {
        const quizz = getQuizzFromId(id);
        const key = getKeyFromId(id);
        const link = LINK_QUIZZES+"/"+id;
        const config = {headers: {"Secret-Key": key}};

        console.log("vamos tentar apagar "+link);
        axios.delete(link, config).then(ans => {
            console.log("conseguiu apagar");
            goHomeFromSuccessPage();
        }).catch(error => {
            console.log("não conseguiu apagar");
            console.log(error)
        })
    } else {
        quizzEl.querySelector(".deleteQuizzButton").classList.add("expanded");
    }
}

function getQuizzFromId(id) {
    let quizzObj = null;
    quizzes.forEach(quizz => {
        if(quizz.id === id){
            quizzObj = quizz;
        }
    })
    return quizzObj;
}

function getKeyFromId(id){
    let key = null;
    myQuizzesData.forEach(quizz => {
        if (quizz.id === id) {key = quizz.key;}
    })
    //console.log(`id: ${id} key:${key}`);
    return key;
}

function nextPage(nextPageKey) {

    if (validatePageInputs(nextPageKey)) {
        saveInputs(nextPageKey);
        loadEditPage(nextPageKey);
        if (nextPageKey === "success"){
            sendQuizz();
        }
        else {
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
        if(text && url) {
            // checar se está preenchido corretamente
            validateInputs("answers", "title", elementId + "a" + 0 + "text");
            validateInputs("answers", "url", elementId + "a" + 0 + "url");

        } else {
            numOfInvalidTests ++;

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
        if (numOfWrongAnswers < 2) {numOfInvalidTests++;}

        for (let i = 1; i < 4; i++) {
            element = document.getElementById(elementId + "a" + i + "text");
            text = getInputValue(elementId + "a" + i + "text");
            url = getInputValue(elementId + "a" + i + "url");
            if(text && url) {
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
            if (getInputValue("l"+i+"minValue") === "0") {
                hasZeroValue = true;
            }
        }
        if(!hasZeroValue) {
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

            if (pageKey === "info" && (value.length < 20 || value.length > 65) ) {
                numOfInvalidTests++;
                errorMsg += "Deve ter entre 20 e 65 caracteres. ";
            }
            if (pageKey === "question" && (value.length < 20) ) {
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

function clearInvalidTests () {
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
            editSuccesPage.querySelector(".editPage-content").innerHTML = "";
            editSuccesPage.querySelector(".editPage-content").appendChild(createQuizzThumbElement(editingQuizz, true));

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
    editSuccesPage.classList.add("hidden");

    document.querySelector("#edit-"+pageKey).classList.remove("hidden");
}

// enviando quizz

function sendQuizz() {

    if (isEditingANewQuizz && editingQuizzIsValidated) {

        console.log("tentar enviar o quizz");
        console.log(editingQuizz);

        const postNewQuizz = axios.post(LINK_QUIZZES, editingQuizz);
        postNewQuizz.then(answer => {
            pullFromLocalStorage();
            myQuizzesData.push({
                id: answer.data.id, key: answer.data.key
            });
            console.log("quizz sent!")
            pushToLocalStorage();
            pullFromLocalStorage();
            showEditPage('success');
        }).catch(error => {
            console.log("nao conseguiu");
            console.log(error);
        })

    }

    // se for um quizz já existente
    // enviar para API com ID e com header com KEY
    // then
    // abrir página de sucesso
    // fechar página de sucesso
}

function goHomeFromSuccessPage(){
    console.log("go home button pressed")
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

    return {title: "", image: "", questions: questions, levels: levels };
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




const meuQuizz2 = {
    title: 'O quão carioca você é? Teste seus conhecimentos de cria!',
    image: 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2021/03/1-cristo-redentor.jpg',
    questions: [
        {
            title: 'Qualquer perguntinha marota pq o teste é real', color: '#000000',
            answers:[
                {text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg'},
                {text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
                {text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
                {text: 'Nerd loka bro pego a visao?', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'}
        ]},
        {
            title: 'Segunda perguntinha pra marolar...', color: '#000000',
            answers:[
                {text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg'},
                {text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
                {text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
        ]},
        {
            title: 'Essa terceira é braba tá?', color: '#000000',
            answers:[
                {text: 'Rexposta certa de cria', isCorrectAnswer: true, image: 'https://i.pinimg.com/736x/56/4e/62/564e62fef96c4ef0d67a59c94b1a6288.jpg'},
                {text: 'Resposta errada de nerd', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
                {text: 'Marola nao po ta maluco', isCorrectAnswer: false, image: 'https://psalm.escreveronline.com.br/wp-content/upl…014/12/bigstock-Shocked-Computer-Nerd-1520709.jpg'},
        ]}
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


// Apagar
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