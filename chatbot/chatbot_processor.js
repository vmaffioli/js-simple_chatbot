export async function getResponse(input) {
    const inputList = inputTreatment(input);
    const wordsJSON = await fetchJSON('./chatbot/data/chatbot_words.json');
    const wordsDATA = JSON.parse(JSON.stringify(wordsJSON));
    const inputWordsId = [];

    let responsesMap = new Map();
    let responses = [];

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

        // console.log(inputWordsId[i])

        if (inputWordsId[i] !== inputList[i]) {
            inputWordsId.push(inputList[i])
        }



    }

    //console.log(inputList)
    //console.log(inputWordsId)
    const responsesJSON = await fetchJSON('./chatbot/data/chatbot_responses.json');
    const responsesDATA = JSON.parse(JSON.stringify(responsesJSON));
    

    Object.values(responsesDATA).forEach(obj => {
        const { id, questions, answer } = obj;


        Object.values(questions).forEach(question => {
            const questionWords = question.toLowerCase().split(" ");
            let responseCount = 0;

            //for (let i = 0; i < inputList.length; i++) {

            inputWordsId.forEach(inputWord => {
                //const inputWordToCompare = " " + inputWord + " "

                questionWords.forEach(questionWord => {

                    if (questionWord === inputWord) {
                        ++responseCount;
                    }
                })
                // console.log(questionWords)
                //  console.log(inputWordsId)
                //   console.log(questionWords.includes(inputWord))
                //  console.log(questionLength + "   " + responseCount)

                const similarity = responseCount / questionWords.length * 100;


                // console.log(responseCount, similarity)

                if (responseCount != 0 && similarity >= 80) {
                    responsesMap.set(id, {answer, similarity});
                }
            });
        });
    });

    if(responsesMap.size === 1){
        //console.log(responsesMap.entries().next().value[1]);
        const response = responsesMap.entries().next().value[1].answer;
        responses = [];
        responses.push(response);

    } else if (responsesMap.size <= 1) {
        // response = "estou em duvida, tenho varias respostas pra essa pergunta"
        // console.log(responses)

        //  console.log(resMap)
        // console.log(maiorValor + "     " + response)


        let maxItem = [];
        let maxSimilarity = -Infinity;
        let similarityMessage = "Estou em dúvida, você quer saber sobre ";

        for (let i = 1; i <= responsesMap.size; i++) {
            if (responsesMap.entries().next().value[i] >= maxSimilarity) {
                maxItem.set(element.id, element.answer, element.similarity);
                maxSimilarity = responsesMap.entries().next().value[i].similarity
            }
        };

        for (let i = 0; i <= maxItem.size; i++) {
            maxItem.forEach(element => {

                if (i < maxItem.size) {
                    similarityMessage = similarityMessage + element[i].id + ", "
                } else if (i < maxItem.size - 1) {
                    similarityMessage = similarityMessage + element[i].id + " ou "
                } else {
                    similarityMessage = similarityMessage + element[i].id + "?"
                }
            });
        }

        responses = [];
        responses.push(similarityMessage);

    } else if(responsesMap.size === 0) {
        responses = [];
        responses.push("não tenho resposta pra isso");
    }

    return responses;
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

    input = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    input = input.replace("?","");
    input = input.toLowerCase();
    input = input.split(" ");
    console.log(input)

    return input;
}