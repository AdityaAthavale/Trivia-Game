let questions = []
let currentIndex = -1

$(document).ready(function() {
    $('.questionContainer').hide()
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple',
        method: 'GET'
    }).then(function(response) {
        questions = response.results
    })

    $('#startButton').click(function() {
        $('#startButtonContainer').hide()
        $('.questionContainer').show()
        $('#startModal').modal(options)
        loadNextQuestion()
    })
    
    $('.next').click(function() {
        currentIndex++;
        loadNextQuestion()
    })
    $('.previous').click(function() {
        currentIndex--;
        loadNextQuestion()
    })
})

function loadNextQuestion() {
    let q = questions[currentIndex]
    $('#question').text(q.question)
    let randomCorrectAnswerIndex = Math.floor(Math.random() * 4)
    let options = [$('#option1'), $('#option2'), $('#option3'), $('#option1')]
    options[randomCorrectAnswerIndex].text(q.correct_answer)
    for(let i=0;i<4;i++) {
        if (i != randomCorrectAnswerIndex) {
            options[i].text(q.incorrect_answers[i])
        }
    }
    if(currentIndex === 0) {
        $('.previous').attr('disabled','disabled')
    } else {
        $('.previous').removeAttr('disabled');
    }

    if(currentIndex === questions.length - 1) {
        $('.previous').attr('disabled','disabled')
    } else {
        $('.previous').removeAttr('disabled');
    }
}