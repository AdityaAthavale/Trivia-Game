let questions = []
let currentIndex = -1
let didSelectOption = false
let perSecondTimer
let remainingTimeSeconds = 30
let numberOfCorrectAnswers = 0

var colors = ['darkGreen', 'purple'];
var marqueeColorIndex = 0;

$(document).ready(function() {
    $('.questionContainer').hide()
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple',
        method: 'GET'
    }).then(function(response) {
        questions = response.results
        $('#startButton').attr("disabled", false);
        
    })

    $('#startButton').click(function() {
        currentIndex = 0
        loadNextQuestion()
        $('#startButtonContainer').hide()
        $('.questionContainer').show()
    })
    
    $('.next').click(function() {
        currentIndex++
        loadNextQuestion()
    })

    $('.option').click(function(sender) {
        if(!didSelectOption) {
            didSelectOption = true
            if(questions[currentIndex].correct_answer === sender.target.innerText) {
                sender.target.parentElement.classList.add('correctAnswer')
                numberOfCorrectAnswers++
                if (numberOfCorrectAnswers == 20) {
                    finishGame()
                }
            } else {
                sender.target.parentElement.classList.add('wrongAnswer')
                let options = [$('#option1'), $('#option2'), $('#option3'), $('#option4')]
                for(let i=0; i<options.length; i++) {
                    if(questions[currentIndex].correct_answer === options[i].text()) {
                        options[i].parent().addClass('correctAnswer')
                    }
                }
            }
        }
    })

    setInterval(function () {
        $('#hint').css({
          backgroundColor: colors[marqueeColorIndex],
        });
        if (!colors[marqueeColorIndex]) {
             marqueeColorIndex = 0;
        } else {
             marqueeColorIndex++;
        }
     }, 5000);
})

function loadNextQuestion() {
    if(currentIndex >= questions.length) {
        finishGame()
    }
    let q = questions[currentIndex]
    $('#question').text(q.question)
    let randomCorrectAnswerIndex = Math.floor(Math.random() * 4)
    let options = [$('#option1'), $('#option2'), $('#option3'), $('#option4')]
    let answers = q.incorrect_answers
    answers.splice(randomCorrectAnswerIndex, 0, q.correct_answer)
    for(let i=0;i<4;i++) {
        options[i].text(answers[i])
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

    //Set game progress
    $('#gameProgress').attr('aria-valuenow', (currentIndex/questions.length) * 100)
    $('#gameProgress').attr('style','width:' + (currentIndex/questions.length) * 100 + '%')

    //Clear last selected option choice
    $('.optionContainer').removeClass('correctAnswer')
    $('.optionContainer').removeClass('wrongAnswer')

    //This will prevent user from selecting multiple options for same question.
    didSelectOption = false

    //Create timers
    if(perSecondTimer != null) {
        window.clearInterval(perSecondTimer)
        remainingTimeSeconds = 30
    }
    perSecondTimer = window.setInterval(updateRemainingTime, 1000)

}

function updateRemainingTime() {
    remainingTimeSeconds--;
    if(remainingTimeSeconds <= 0) {
        currentIndex++
        loadNextQuestion()
    }
    if (remainingTimeSeconds <= 5) {
        $(this).animate({color:'black'},1000);
        $('#remaining-time').css('color', 'red');
    } else {
        $('#remaining-time').css('color', 'green');
    }
    $('#remaining-time').text(remainingTimeSeconds)
}

function questionTimedOut() {
    currentIndex++
    loadNextQuestion()
}

function finishGame() {
    if(numberOfCorrectAnswers == 20) {
        alert('Congrats! You have won.')
    } else {
        alert('Better Luck next time!')
    }
    $('#startButtonContainer').show()
    $('.questionContainer').hide()
    numberOfCorrectAnswers = 0
    currentIndex = 0
    questions = []
    $('#startButton').attr("disabled", true);
    //For now we are fetching same list again.
    //Ideally we will have different list every Time.
    $.ajax({
        url: 'https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple',
        method: 'GET'
    }).then(function(response) {
        questions = response.results
        $('#startButton').attr("disabled", false);
    })
}