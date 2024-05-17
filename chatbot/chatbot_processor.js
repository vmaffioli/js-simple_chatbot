export async function getResponse(input) {
    const inputList = inputTreatment(input);
    const wordsJSON = await fetchJSON('./chatbot/data/chatbot_words.json');
    const wordsDATA = JSON.parse(JSON.stringify(wordsJSON));
    const inputWordsId = [];

    for (let i = 0; i < inputList.length; i++) {
        Object.values(wordsDATA).forEach(obj => {
            const { id, words } = obj;
            Object.values(words).forEach(word => {
               // word = " " + word + " "

                if (inputList[i] === word) {
                    inputWordsId.push(id)
                }
            });
        });

        console.log(inputWordsId[i])

        if (inputWordsId[i] !== inputList[i]) {
            inputWordsId.push(inputList[i])
        }



    }
    
    //console.log(inputList)
    //console.log(inputWordsId)
    const responsesJSON = await fetchJSON('./chatbot/data/chatbot_responses.json');
    const responsesDATA = JSON.parse(JSON.stringify(responsesJSON));
    let responses = new Map();
    let response = '';
    Object.values(responsesDATA).forEach(obj => {
        const { id, questions, answer } = obj;


        Object.values(questions).forEach(question => {
            const questionWords = question.toLowerCase().split(" ");
            const questionLength = questionWords.length;
            let responseCount = 0;

            //for (let i = 0; i < inputList.length; i++) {

            inputWordsId.forEach(inputWord => {
                //const inputWordToCompare = " " + inputWord + " "

                questionWords.forEach(questionWord => {

                if (questionWord === inputWord) {
                    ++responseCount;
                }
            })
               console.log(questionWords)
               console.log(inputWordsId)
                console.log(questionWords.includes(inputWord))
              console.log(questionLength + "   " + responseCount)
                if (responseCount >= questionLength - questionLength * 0.20) {
                    responses.set(id, answer);
                }
            });
        });
    });

    if (responses.size === 1) {
        response = responses.entries().next().value[1];
    } else if (responses.size > 1) {
        // response = "estou em duvida, tenho varias respostas pra essa pergunta"
        // console.log(responses)

        let resMap = new Map();

        responses.forEach(res => {
            let resCount = 0;

            inputWordsId.forEach(inputWord => {
                if (res.includes(inputWord)) {
                    resMap.set(res, resCount)
                    ++resCount;
                }
            });
            
        });

        let maiorValor = 0;

        // Itera sobre os elementos do mapa
        resMap.forEach(function ( key, value) {
            console.log(value)
            console.log(key)

            // Verifica se o valor atual é maior que o maior valor encontrado até agora
            if (value > maiorValor) {
                maiorValor = value;
                response = key;
               

            }
        });

        console.log(resMap)
        console.log(maiorValor + "     " + response)
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

function inputTreatment(input) {
    input = input.replace(/[^\w\s]/g, '');
    input = input.toLowerCase();
    input = input.split(" ");
    return input;
}