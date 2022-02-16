// ---------- GLOBAL VARIABLES -----------

const quizzes = []; // pull from API
const userQuizzesIDs = []; // pull from LocalStorage
const userQuizzes = []; // filter quizzes (userQuizzesIDs)
const otherQuizzes = []; // filter quizzes (not userQuizzesIDs)

let playingQuizz = {}; // object to play quizz
let editingQuizz = {}; // object to edit quizz


const homeScreen = document.querySelector(".home");
const playScreen = document.querySelector(".play");
const editScreen = document.querySelector(".edit");

const editInfoPage = document.querySelector("#edit-info");
const editQuestionsPage = document.querySelector("#edit-questions");
const editLevelsPage = document.querySelector("#edit-levels");
const editSuccesPage = document.querySelector("#edit-success");


// ---------- HOME SCREEN SECTION -----------



// ---------- PLAY SCREEN SECTION -----------



// ---------- EDIT SCREEN SECTION -----------

function toggleEditSection(button) {
    button.parentElement.parentElement.parentElement.classList.toggle("closed");
}

function editQuizz(quizzElement) {

    editingQuizz = newQuizz();

    if (quizzElement) {
        // LATER: Implement the feature to edit already existing quizz 
    }

    loadNextEditPage();
    showNextEditPage();
}

function nextPage(button) {

    const editId = button.parentElement.id;
    const inputsAreValid = validateInputs(editId);

    if (inputsAreValid) {
        saveInputs(editId);
        loadNextEditPage(editId);
        showNextEditPage(editId);
    } else {
        showInvalidInputs(editId);
    }
}

function validateInputs(editId) {return true;}

function saveInputs(editId) {

    let sectionElement = null;

    switch (editId) {

        case 'edit-info':
            editingQuizz.title = editInfoPage.querySelector(".title").value;
            editingQuizz.image = editInfoPage.querySelector(".url").value;

            newQuestions = parseInt(editInfoPage.querySelector(".numOfQuestions").value) - editingQuizz.questions.length;
            newLevels = parseInt(editInfoPage.querySelector(".numOfLevels").value) - editingQuizz.levels.length;

            for (let i = 0; i < Math.abs(newQuestions); i++) {
                if (newQuestions > 0) {
                    editingQuizz.questions.push(newQuestion());
                } else {
                    editingQuizz.questions.pop();
                }
            }
            for (let i = 0; i < Math.abs(newLevels); i++) {
                if (newLevels > 0) {
                    editingQuizz.levels.push(newLevel());
                } else {
                    editingQuizz.levels.pop();
                }
            }
            break;

        case 'edit-questions':
            sectionElements = editQuestionsPage.querySelectorAll(".editSection"); 
            sectionElements.forEach((section, position) => {
                editingQuizz.questions[position].title = section.querySelector(".title").value;
                editingQuizz.questions[position].color = section.querySelector(".color").value;
                
                rightElements = section.querySelectorAll(".rightAnswers > .editSection-group-wrapper");
                wrongElements = section.querySelectorAll(".wrongAnswers > .editSection-group-wrapper");

                rightElements.forEach((rightAnswerEl, ansPos) => {
                    editingQuizz.questions[position].answers[ansPos].text = rightAnswerEl.querySelector(".text").value;
                    editingQuizz.questions[position].answers[ansPos].image = rightAnswerEl.querySelector(".url").value;
                    editingQuizz.questions[position].answers[ansPos].isCorrectAnswer = true;
                });
                wrongElements.forEach((wrongAnswerEl, ansPos) => {
                    editingQuizz.questions[position].answers[ansPos + rightElements.length].text = wrongAnswerEl.querySelector(".text").value;
                    editingQuizz.questions[position].answers[ansPos + rightElements.length].image = wrongAnswerEl.querySelector(".url").value;
                    editingQuizz.questions[position].answers[ansPos + rightElements.length].isCorrectAnswer = false;
                });
            })
            break;

        case 'edit-levels':

            console.log("salvar inputs do edit-levels");

            sectionElements = editLevelsPage.querySelectorAll(".editSection"); 
            sectionElements.forEach((section, position) => {
                editingQuizz.levels[position].title = section.querySelector(".title").value;
                editingQuizz.levels[position].text = section.querySelector(".text").value;
                editingQuizz.levels[position].minValue = section.querySelector(".minValue").value;
                editingQuizz.levels[position].image = section.querySelector(".url").value;
            })
            break;

        default:
            break;
    }
}

function loadNextEditPage(previousPageId) {
    let editPageContent = null;
    switch (previousPageId) {
        case 'edit-info':
            editPageContent = editQuestionsPage.querySelector(".editPage-content");
            editPageContent.innerHTML = "";
            const questionElements = editingQuizz.questions.map((question, position) => newEditQuestionElement(question, position));
            questionElements.forEach(questionElement => editPageContent.appendChild(questionElement));
            editPageContent.innerHTML += `<button class="add-button">Adicionar pergunta</button>`;
            break;
        case 'edit-questions':
            editPageContent = editLevelsPage.querySelector(".editPage-content");
            editPageContent.innerHTML = "";
            const levelElements = editingQuizz.levels.map((level, position) => newEditLevelElement(level, position));
            levelElements.forEach(levelElement => editPageContent.appendChild(levelElement));
            editPageContent.innerHTML += `<button class="add-button">Adicionar nível</button>`;
            break;
        case 'edit-levels':
            break;
        default:
            editInfoPage.querySelector(".title").value = editingQuizz.title;
            editInfoPage.querySelector(".url").value = editingQuizz.image;
            editInfoPage.querySelector(".numOfQuestions").value = editingQuizz.questions.length;
            editInfoPage.querySelector(".numOfLevels").value = editingQuizz.levels.length;
            break;
    }
}

function showNextEditPage(previousPageId) {}

function showInvalidInputs(previousPageId) {alert("Inputs inválidos!");}


// New objects

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
            newLevel("", "", 0.5, ""),
            newLevel("", "", 0.0, "")
        ]
    }

    return { id: null, title: "", image: "", questions: questions, levels: levels };
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

// New elements

function newEditQuestionElement(question, position) {
    const element = document.createElement("div");
    element.classList.add("editSection");
    element.classList.add("closed");
    element.id = "p"+position;

    element.innerHTML = `
        <div class="editSection-header">
            <h3>Pergunta ${position + 1}</h3>
            <div>
                <ion-icon name="trash-outline" onclick="deleteEditSection(this)"></ion-icon>
                <ion-icon name="create-outline" onclick="toggleEditSection(this)"></ion-icon>
            </div>
        </div>

        <div class="editSection-group">
            <div class="editSection-group-wrapper">
                <input type="text" placeholder="Texto da pergunta" class="title" value="${question.title}">
                <input type="text" placeholder="Cor de fundo da pergunta" class="color" value="${question.color}">
            </div>
        </div>

        <div class="editSection-group rightAnswers">
            <h3>Respostas corretas</h3>
        </div>
        
        <div class="editSection-group wrongAnswers">
            <h3>Respostas incorretas</h3>
        </div>
    `

    const rightAnswers = question.answers.filter(answer => answer.isCorrectAnswer);
    const wrongAnswers = question.answers.filter(answer => !answer.isCorrectAnswer);

    rightAnswersEl = element.querySelector(".rightAnswers");
    wrongAnswersEl = element.querySelector(".wrongAnswers");

    rightAnswers.forEach(answer => rightAnswersEl.appendChild( newEditAnswerElement(answer) ))
    wrongAnswers.forEach((answer, position) => wrongAnswersEl.appendChild( newEditAnswerElement(answer, position) ))

    return element;
}

function newEditAnswerElement(answer, position) {
    
    let count = "";
    let word = "correta";
    if (!answer.isCorrectAnswer) {
        count = position + 1;
        word = "incorreta";
    }
    
    const element = document.createElement("div");
    element.classList.add("editSection-group-wrapper");
    element.innerHTML = `
    <input type="text" class="text" placeholder="Resposta ${word} ${count}" value="${answer.text}">
    <input type="text" class="url" placeholder="URL da imagem ${count}" value="${answer.image}">
    `

    return element;
}

function newEditLevelElement(level, position) {
    const element = document.createElement("div");
    element.classList.add("editSection");
    element.classList.add("closed");
    element.id = "l"+position;

    element.innerHTML = `
        <div class="editSection-header">
            <h3>Nível ${position + 1}</h3>
            <div>
                <ion-icon name="trash-outline" onclick="deleteEditSection(this)"></ion-icon>
                <ion-icon name="create-outline" onclick="toggleEditSection(this)"></ion-icon>
            </div>
        </div>

        <div class="editSection-group">
            <div class="editSection-group-wrapper">
                <input type="text" class="title" placeholder="Texto da pergunta" value="${level.title}">
                <input type="text" class="minValue" placeholder="% de acerto mínima" value="${level.minValue}">
                <input type="text" class="url" placeholder="URL da imagem do nível" value="${level.image}">
                <textarea type="text" class="text" placeholder="Descrição do nível">${level.text}</textarea>
            </div>
        </div>
    `
    return element;
}



// APAGAAAR

editQuizz();