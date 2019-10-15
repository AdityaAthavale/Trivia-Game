class Question {
    questionText = ""
    options = ["", "", "", ""]
    
}
let questions

$(document).ready(function() {
}

function getQuestions() {
    $.getJSON("./../JSONData/questions.json", function(json) {
        console.log(json); // this will show the info it in firebug console
    });
}