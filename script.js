const question_title=document.getElementById("question")
const answers=document.getElementById("options")
const nextBtn=document.getElementById("btn")
loadingScreen=document.getElementById("loading")
const api_url="https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
let questions=[]

async function fetch_data()
{
    try
    {
        loadingScreen.style.display = 'block';
        const response=await fetch(api_url)
        res=await response.json()
        loadingScreen.style.display = 'none';
        res.results.forEach(question => {
            const format_question={
                question: question.question,
                correct_answer: question.correct_answer,
                tot_options: question.incorrect_answers
            };
            format_question.tot_options.push(question.correct_answer);
            shuffleArray(format_question.tot_options); //shuffling the options 
            questions.push(format_question);
        });
        start_Quiz();
    }
    catch(error)
    {
        console.log("Error fetching data:",error)
    }
}

fetch_data()

let current_question_idx=0;
let score=0;
let prev=-1;

function start_Quiz()
{
    current_question_idx=0;
    score=0;
    prev=-1;
    nextBtn.innerHTML="Next";
    showQuestion();
}

function showQuestion()
{
    console.log(current_question_idx);
    nextBtn.style.display="None"
    answers.innerHTML="";
    let curr_ques=questions[current_question_idx].question;
    let ques_no=current_question_idx+1;
    question_title.innerHTML=ques_no+". "+curr_ques;
    // console.log()
    for(let i=0;i<4;i++)
    {
        let val=questions[current_question_idx].tot_options[i];
        let li=document.createElement("li");
        li.innerHTML=val;
        li.addEventListener("click",checkAnswer);
        answers.appendChild(li);
    }
}

function checkAnswer(event)
{
    if(prev==current_question_idx) return;
    prev=current_question_idx;
    const selectedAns=event.target.textContent;
    const correctAnswer=questions[current_question_idx].correct_answer;
    if(selectedAns==correctAnswer)
    {
        event.target.style.backgroundColor="#9ee0bb";
        score++;
    }
    else 
    {
        event.target.style.backgroundColor="#ff9b91";
        let lis=answers.getElementsByTagName("li");
        for(let i=0;i<4;i++)
        {
            if(lis[i].innerHTML===correctAnswer) 
            {
                lis[i].style.backgroundColor="#9ee0bb";
            }
        }
        // console.log(correctAnswer)
    }
    nextBtn.style.display="Block"
}

nextBtn.addEventListener("click",function(){
    if(nextBtn.innerHTML==="Play Again")
    {
        start_Quiz();
        return;
    }
    if(current_question_idx<9)
    {
        current_question_idx++;
        showQuestion();
    }
    else
    {
        question_title.innerHTML=`You scored ${score} out of 10!`;
        answers.innerHTML="";
        nextBtn.innerHTML="Play Again";
    }
});

function shuffleArray(array)
{
    for(let i=array.length-1;i>0;i--)
    {
        const j=Math.floor(Math.random()*(i+1));
        [array[i],array[j]]=[array[j],array[i]];
    }
}