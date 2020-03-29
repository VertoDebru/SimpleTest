let id = decodeURI( $_GET( 'id' ) );
console.log("Test ID is : "+id);
if(id === "null") console.log("No Get URL");
// Initialize variable by default
var score = [];  // Score[0] = Score[0]++; for A reponse
// Test Variables 
var TestID = id;
var Question = [];
var Resultat = [];
var curQuestion = -1;   // -1 = Test not started, 0 = First question.
var QuestionLength = 0;
var totalResult = 0;
var path = "./data/datas.xml";

// Get Xml with all test
let getXMLAllTest = function()
{
    let request = new XMLHttpRequest();
    request.open("GET", path);
    request.setRequestHeader("Content-Type", "txt/xml");
    request.onreadystatechange = function () 
    {
        if(request.readyState === 4 && request.status === 200)
        {
            var xml = request.responseXML;
            var TestLength = xml.getElementsByTagName("test").length;
            console.log("Nombre de test : " + TestLength);
            // Display all test
            document.getElementById("Title").innerHTML = "List of Tests";
            for(let i = 0; i < TestLength; i++)
            {
                var curTest = xml.getElementsByTagName("test")[i];
                var title = curTest.childNodes[0].parentNode.attributes[0].value;
                var QuestionLength = curTest.getElementsByTagName("question").length;
                $(".box").append("<li class='listTest' onClick='javascript:SelectedTest("+i+")'>"+title+"</li><div class='info'>Total de questions : "+QuestionLength+"</div>"); 
            }
        }
    };
    request.send();
};

// Get Xml with selected test (idTest)
let getXMLTest = function(idTest)
{
    let request = new XMLHttpRequest();
    request.open("GET", path);
    request.setRequestHeader("Content-Type", "txt/xml");
    request.onreadystatechange = function () 
    {
        if(request.readyState === 4 && request.status === 200)
        {
            // Initialize variables
            var xml = request.responseXML;
            var test = xml.getElementsByTagName("test")[id];
            var title = test.childNodes[0].parentNode.attributes[0].value;
            var desc = test.getElementsByTagName("desc")[0].childNodes[0].nodeValue;
            // Initialize questions and answears
            QuestionLength = test.getElementsByTagName("question").length;
            for (let i = 0; i < QuestionLength; i++) 
            {
                Question.push([]);
                var currentQuestion = test.getElementsByTagName("question")[i];
                var AnswearLength = currentQuestion.childElementCount;                  
                for(let n = 0; n < AnswearLength; n++)
                {
                    Question[i][n] = [                                                                     // Bug IE
                    [currentQuestion.childNodes[0].nodeValue.toString()],                                  // Question
                    [currentQuestion.children[n].childNodes[0].nodeValue.toString()],                      // Answear
                    [currentQuestion.children[n].childNodes[0].parentNode.attributes[0].value.toString()]  // Score
                    ];
                }
            }
            // Initialize the results
            var ResultLength = test.getElementsByTagName("result").length; // Total result for this Test.
            for(let i = 0; i < ResultLength; i++)
            {
                Resultat.push([]);
                Resultat[i] = [
                    [test.getElementsByTagName("results")[0].children[i].childNodes[0].parentNode.attributes[1].value.toString()],  // IMG
                    [test.getElementsByTagName("result")[i].childNodes[0].nodeValue.toString()]                                     // Text
                ]
            }
            // Initialize score
            for(let i = 0; i < ResultLength; i++)
            {
                score.push([]);
                score[i] = 0;
            }

            // Test display
            document.getElementById("Title").innerHTML = title.toString();
            if(curQuestion < 0)
            {
                $(".box").append("<p id='Desc'>"+ desc.toString() +"</p>")
                $(".box").append("<span class='small'>Total de questions : <strong>" + QuestionLength.toString() + "</strong></span>");
                $(".box").append("<div class='center'><button>Commencer</button></div>");
                $("button").click(function()
                {
                    $("p").remove();
                    $(".small").remove();
                    $(".center").remove();
                    nextQuestion(null);
                })
            }
        }
    };
    request.send();
};

// Function to selected Test by ID
function SelectedTest(id)
{
    location.replace("index.html?id="+id);
}
// Function to restart test
function RestartTest()
{
    location.replace("index.html?id="+id);
}
// Function to main menu
function GoHome()
{
    location.replace("index.html");
}
function ShowResult()
{
    var res = "";
    var img = "";
    var maxValue = 0;
    for(var i = 0; i < score.length; i++) 
    {
        var currentValue = score[i];
        if(currentValue > maxValue) 
        {
            img = Resultat[i][0].toString();
            res = Resultat[i][1].toString();
            maxValue = currentValue;
        }
    }
    console.log(res);
    // Show Result with total score with majority.
    $(".box").append("<img class='resultIMG' src='"+ img +"'><p class='small'>"+ res +"</p>");
    $(".box").append("<div class='center'><button onClick='javascript:RestartTest()'>Recommencer</button></div>");
    curQuestion = QuestionLength-1;
}

function nextQuestion(answear)
{
    $(".center").remove();
    $("p").remove();
    $("li").remove();
    if(answear != null) 
    {
        score[answear] = score[answear]+1;
        curQuestion++;
    }
    else if(answear == null)
    {
        curQuestion = 0;
    }

    if(curQuestion >= QuestionLength)
    {
        ShowResult();
    }
    else 
    {
        // Show new question.
        var curQuestTXT = Question[curQuestion][0][0];
        $(".box").append("<p id='Question'>"+ curQuestTXT +"</p>");
        var countAnswear = Question[curQuestion].length;
        //console.log(countAnswear);
        for(let i = 0; i < countAnswear; i++)
        {
            $(".box").append("<li class='listAnswear' onClick='javascript:nextQuestion("+Question[curQuestion][i][2]+")'>"+Question[curQuestion][i][1]+"</li>");
        }
    }
    console.log(score);
}

/* JQuery Functions */
$(document).ready(function()
{
    if(id === "null")
    { 
        getXMLAllTest();
    }
    else
    {
        $(".box").append("<div class='home' onClick='javascript:GoHome()'></div>");
        getXMLTest(TestID);
    }
});