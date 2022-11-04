//==== Accsessing DOM from JavaScript:
//1. Main Components 

const formsArray = document.getElementsByClassName("Form");

//2. First Panel Components:
const courseNameTextBox = document.getElementById("courseNameTextBox");
const list = document.getElementById("list");
const lecturesNumberTextBox = document.getElementById("lecsNoTextBox");
const TutorialsNumberTextBox = document.getElementById("tutsNoTextBox");
const clearButton = document.getElementById("clearButton");
const checkButton = document.getElementById("checkButton");

//3. Second Panel Components
const secondDiv =document.getElementById("secondDiv");
const outputDivArray = document.getElementsByClassName("outputDiv");
const warningLabel = document.getElementsByClassName("WarningLabel");

//4.Third Panel Components
const codeErrorTextBox = document.getElementById("codeErrorTextBox");
const crdsErrorTextBox = document.getElementById("crdsErrorTextBox");
const courseNameErrorTextBox = document.getElementById("courseNameErrorTextBox");
const reportButton = document.getElementById("ErrorButton");


//5.Footer Components
const pics= document.getElementsByClassName("hoverDiv");

//6. Terms and Conditions Panel Components
const forthDiv= document.getElementById("forthDiv");
const termsWindow = document.getElementById("TandCInner");
const agreeButton=document.getElementsByClassName("acceptButton");



//==== Global Variables
let coursesArray = [];
let divHeightArray = [12,13,16,19,22,25,28,31];
let divHeightArrayMobile = [37,40,47,55,64,71,80,87];
let OddGENsCourse = ["GEN341","GEN342","GEN004","GEN333"];
let securityKey=0;
let outputsNumber;
let firstWarning;
let SecondWarning;
let deprivedFlag;
let courseCode;
let course;
let credits;
let lecturesNumber;
let TutorialsNumber;
let isShiftPressed=0;
let shiftCounter=0;

let body= document.getElementById("body");
body.addEventListener("click",function(e){
  if (e.target.tagName=="LI" || e.target.tagName=="UL" ){
  }
  else{
    displayNames(courseNameTextBox.value);
  }
});

//===== Function to be triggered:
//1. openSite(), opens the site if the user accept the Terms and Conditons.
agreeButton[0].addEventListener("click",openSite);

//2. refreshPage(), Delete all textboxs' values when pages is refreshed.
window.addEventListener("load",refreshPage);

//3. loadDataList(), Get five courses from the API with every keyboard letter being typed.
courseNameTextBox.addEventListener('keyup' || 'touchend',loadDataList);

//4. liveChecking(), Make an instant check whether the choosen course is eligable for absense or not.
list.addEventListener("click",liveChecking);

//5. checking(), Runs the algorithm to ckeck absence and shows the result. 
checkButton.addEventListener("click",checking);

//6. clearing(), Clears all the textboxs and make the app ready for new request.
clearButton.addEventListener("click",clearing);

//7. linkedin(), opens our linkedIn profiles.
pics[0].addEventListener("click",linkedIn1);
pics[1].addEventListener("click",linkedIn2);




//==== Main Functions:
function openSite(){
  forthDiv.classList.remove("show");
  termsWindow.classList.remove("show");
  document.cookie = "securityKey=" + 1 + ";" +" expires=Thu, 25 Dec 2025 12:00:00 UTC; path=/";
}

function refreshPage(){
  if (document.cookie!="securityKey=1"){
       forthDiv.classList.add("show");
       termsWindow.classList.add("show");
  }
  formsArray[0].reset();
  formsArray[1].reset();
}

function loadDataList(){
     //if ( (e.which>48 && e.which <122) || e.which==8 )
      //TODO: Solve the problem of searching by two words (space).
      if ((courseNameTextBox.value.includes(':')))
      getAllData((courseNameTextBox.value).split(':')[0]);
      else
      getAllData((courseNameTextBox.value).split(' ')[0]);


}


function liveChecking(){
  let i =0;
  while((courseNameTextBox.value).slice(0,7)!=coursesArray[i].slice(0,7)){
       i++;
  }
  let liveCredits = (coursesArray[i].charAt(coursesArray[i].length-1));
  let liveCode = coursesArray[i].slice(0,3);
  let liveCourseNumber = coursesArray[i].slice(4,7);
  course =  liveCode +liveCourseNumber;

   if (liveCourseNumber == "480" || liveCourseNumber ==  "481" || liveCourseNumber == "281" || liveCourseNumber == "381" ){
        TutorialsNumberTextBox.setAttribute("disabled", true);
        lecturesNumberTextBox.setAttribute("disabled", true);
        checkButton.disabled=true;
        checkButton.classList.add("disabledButton");
        let style = document.createElement('style');
        style.innerHTML = `
        #checkButton:hover{
          background-color: grey;
        }
        #checkButton:active {
          box-shadow: 0vw 0vw #666;
          transform: translateY(0.0);
        }
        `;
        checkButton.appendChild(style);
  }

  else if ((liveCredits==1 || liveCode == "GEN") && !OddGENsCourse.includes(course) ) {
      TutorialsNumberTextBox.setAttribute("disabled", true);
      lecturesNumberTextBox.removeAttribute("disabled");
  }


  else {
         lecturesNumberTextBox.removeAttribute("disabled");
         TutorialsNumberTextBox.removeAttribute("disabled");
         checkButton.removeChild(checkButton.lastChild);
         checkButton.disabled=false;
         checkButton.classList.remove("disabledButton");
  }
}



function checking(){
  if (document.cookie=="securityKey=1" && courseNameTextBox.value!= ""){
      showChosenCourseData((courseNameTextBox.value).slice(0,7));
      //Getting parameters ready for calculating
      courseCode = courseNameTextBox.value.slice(0, 7);
      credits = crdsErrorTextBox.value;
      lecturesNumber = lecturesNumberTextBox.value;
      TutorialsNumber = TutorialsNumberTextBox.value;

      let possiblites = CalculateAbsense(courseCode,credits,lecturesNumber,TutorialsNumber);

      ShowOutput(possiblites);
      setTimeout(function(){warningLabel[0].classList.remove('wipeText')}, 0);
      setTimeout(function(){warningLabel[0].classList.add('wipeText')}, 750);

      //Deleting all output's rectangles 
      for (let i=1; i<8; i++){
        setTimeout(function(){outputDivArray[i-1].classList.remove('wipe')}, 0);
        keyFrameManuiplater(0,0);
      }

      if ( (courseCode == "GEN" || credits==1) && !OddGENsCourse.includes(course) ){
          outputsNumber=1;
          if (deprivedFlag==1){
         keyFrameManuiplater(divHeightArray[0],divHeightArrayMobile[0]);
         outputsNumber=0;
          }
      }

      if (deprivedFlag==1){
        keyFrameManuiplater(divHeightArray[0],divHeightArrayMobile[0]);
      }

      
      //Drawing the new output's rectangle
      for (let i=1; i<outputsNumber+1; i++){
      
        keyFrameManuiplater(divHeightArray[outputsNumber],divHeightArrayMobile[outputsNumber]);

        setTimeout(function(){secondDiv.classList.add('divDownwards');}, 0);
        setTimeout(function(){outputDivArray[i-1].classList.add('wipe')}, i*50);
      }
  }

  else{
    //Do nothing if the course textbox is empty
  }
}


function clearing(){
  removeElements();
  formsArray[0].reset();
  formsArray[1].reset();
  lecturesNumberTextBox.value=0;
  TutorialsNumberTextBox.value=0;
  for (let i=1; i<8; i++){
    setTimeout(function(){outputDivArray[i-1].classList.remove('wipe')}, 0);
    keyFrameManuiplater(0,6);
  }
  setTimeout(function(){warningLabel[0].classList.remove('wipeText')}, 0);
}

function linkedIn1(){
     window.open("https://www.linkedin.com/in/marwan8/","_blank");
}

function linkedIn2(){
  let kh ="https://www.linkedin.com/in/khalidmamdou7/";
  window.open(kh,"_blank");
  
}


//==== Utilities Functions (Being called by main functions):
//1-
const getAllData = async (liveTextboxValue) => {
      const response = await fetch('https://absence-tracking-api.herokuapp.com/api/courses?searchCourse=' + liveTextboxValue , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const myJson = await response.json(); 
      const jsonObj = JSON.parse(JSON.stringify(myJson));

      while (list.hasChildNodes())
        list.removeChild(list.lastChild);
    
      for (let i=0; i<myJson.length; i++){
          coursesArray[i] = (jsonObj[i]["Course code"]+ ": " + jsonObj[i]["Course name"] + jsonObj[i]["Credit Hours"]);
          let listItem = document.createElement("li");
          listItem.classList.add("list-items");
          listItem.setAttribute("onclick", "displayNames('" + coursesArray[i].slice(0, -1) + "')");
          listItem.innerHTML = coursesArray[i].slice(0, -1);
          document.querySelector(".list").appendChild(listItem);
      }
  
}

//2-
function showChosenCourseData(chosenCourse) {
    let i=0
    while(chosenCourse!=coursesArray[i].slice(0,7)){
        i++;
    }
    crdsErrorTextBox.value = (coursesArray[i].charAt(coursesArray[i].length-1));    
    courseNameErrorTextBox.value = (coursesArray[i].slice(9, -1)); 
    codeErrorTextBox.value = (chosenCourse); 
}

//3-
function CalculateAbsense(courseID,credits,missedLecs,missedTuts){
  firstWarning=0;
  SecondWarning=0;
  deprivedFlag=0;

  courseCode = courseID.slice(0,3);
  courseNumber = courseID.slice(4,7);
  course = courseCode + courseNumber;
  let CurrentPoints, LecsPoints, TutsPoints, j=0;

  //====Case 1====:
  if ((credits==1 || (credits==2 && courseCode == "GEN")) && !OddGENsCourse.includes(course)){
    let possibleLecs = [-1];

    //Core Algorithm
    possibleLecs[0]=3-missedLecs;

    //Return
    if (possibleLecs[0]>=0){
        if (possibleLecs[0]==1){
           firstWarning=1;
           SecondWarning=0;
        }
        else if (possibleLecs[0]==0){
          firstWarning=0;
          SecondWarning=1;
        }
        return possibleLecs;
    }
    else {
        possibleLecs[0]=-1;
        deprivedFlag=1;
        return possibleLecs;
    }
  }

  //====Case 2====:
  if ((credits==2 && courseCode!= "GEN") || OddGENsCourse.includes(course)){

    let possibleCombinations = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
    let depreived = [-1];
      //Core Algorithm
    CurrentPoints = 6 - (1 * missedLecs + 1 * missedTuts);
    for (let i = 0; i <= CurrentPoints; i++) {
      LecsPoints = CurrentPoints - i;
      TutsPoints = i;
      possibleCombinations[j]   = LecsPoints / 1;
      possibleCombinations[j+1] = TutsPoints / 1;
      j=j+2;
    }

    if (CurrentPoints>=0){

      if (CurrentPoints <= 2 && CurrentPoints > 1){
        firstWarning=1;
        SecondWarning=0;
      }
      else if (CurrentPoints <= 1 && CurrentPoints >= 0){
        firstWarning=0;
        SecondWarning=1;
      }

      return possibleCombinations;
    }

    else {
      deprivedFlag=1;
      return depreived;
    }

  }

  //====Case 3====:
  if (credits==3){
    let possibleCombinations = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
    let depreived = [-1];

      //Core Algorithm
      CurrentPoints = 10 - (2 * missedLecs + 1 * missedTuts);

    for (let i = 0; i <= CurrentPoints; i++) {
      LecsPoints = CurrentPoints - i;
      TutsPoints = i;
      if (LecsPoints % 2 == 0) {
        possibleCombinations[j] = LecsPoints / 2;
        possibleCombinations[j+1] = TutsPoints / 1;
        j=j+2;
      }
    }
    //Return Results
    if (CurrentPoints>=0){

      if (CurrentPoints <= 4 && CurrentPoints > 2){
        firstWarning=1;
        SecondWarning=0;
      }
      else if (CurrentPoints <= 2 && CurrentPoints >= 0){
        firstWarning=0;
        SecondWarning=1;
      }

      return possibleCombinations;
    }
    else {
      deprivedFlag=1;
      return depreived;
    }
  }
} 

//4-
function ShowOutput (possiblites){
  let i=0;
  let outputArray=[];
  while (possiblites[i]!=-1 && i != possiblites.length){
    outputArray[i]=possiblites[i];
    i++;
  }

  course = courseCode + courseNumber;
  outputsNumber = outputArray.length/2;

  let j=0;
  for (let i=0; i< outputArray.length ; i=i+2 ){

    if ((credits==1 || (credits==2 && courseCode.slice(0,3)=="GEN")) && !OddGENsCourse.includes(course) )
      outputDivArray[j].innerHTML =  outputArray[i] + " Lectures";
    else
      outputDivArray[j].innerHTML =  outputArray[i] + " Lectures and " + outputArray[i+1] + " Tutorials";
    j++;
  }

  if (possiblites[0]==-1)
    warningLabel[0].innerHTML = "Condtion: Deprived <br> Contact the administration ASAP";
  
  else if (firstWarning)
    warningLabel[0].innerHTML = "Condtion: Fisrt Warning";
  
  else if (SecondWarning) 
    warningLabel[0].innerHTML = "Condtion: Second Warning";
  
  else if (!firstWarning && !SecondWarning)
    warningLabel[0].innerHTML = "Condtion: No Warnings";
}

//5-
function displayNames(value) {
  courseNameTextBox.value = value;
  removeElements();
}

//6-
function removeElements() {
  //clear all the item
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}

//==== Styling Functions:
//1- 
function keyFrameManuiplater(height,heightMobile){
const keyFrames = document.createElement("style");
keyFrames.innerHTML = `
@keyframes verticalwipe{ 
  from { height: 0;} to {height:` + height + `rem;}
}  

@media only screen and (max-width: 1024px) {
  @keyframes verticalwipe{ 
    from { height: 0;} to {height:` + heightMobile + `vw;}
  }  
}
`;
secondDiv.appendChild(keyFrames);
}
