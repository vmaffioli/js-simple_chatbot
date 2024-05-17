export async function getResponse(input) {
    const inputList = input.split(" ")
    const wordsJSON = await fetchJSON('./chatbot/data/chatbot_words.json');
    const wordsDATA = JSON.parse(JSON.stringify(wordsJSON));
    const inputWordsId = [];

    for (let i = 0; i < inputList.length; i++) {


        Object.values(wordsDATA).forEach(obj => {
            const { id, words } = obj;
            Object.values(words).forEach(word => {

                if (inputList[i].includes(word)) {
                    inputWordsId.push(id)
                }
            });
        });

        if (inputWordsId[i] === undefined) {
            inputWordsId.push(inputList[i])
        }
    }

    const responsesJSON = await fetchJSON('./chatbot/data/chatbot_responses.json');
    const responsesDATA = JSON.parse(JSON.stringify(responsesJSON));
    let responses = new Map();
    let response = '';
    Object.values(responsesDATA).forEach(obj => {
        const { id, questions, answer } = obj;


        Object.values(questions).forEach(question => {
            const questionWords = question.split(" ")
            const questionLength = question.split(" ").length;
            let responseCount = 0;

            for (let i = 0; i < inputList.length; i++) {
                if (questionWords[i] === inputWordsId[i]) {
                    ++responseCount;
                }
                if (responseCount === questionLength) {
                    responses.set(id, answer);
                }
            }
        });
    });

    if (responses.size === 1) {
        response = responses.entries().next().value[1];
    } else if (responses.size > 1) {
        response = "estou em duvida, tenho varias respostas pra essa pergunta"
    } else {
        response = "não tenho resposta pra isso"

    }

    return response;
};

async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao buscar os dados');
        }
        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Erro:', error);
        return null;
    }
}