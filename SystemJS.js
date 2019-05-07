var users=[];
var playingusername;
var timeOfGame;
var monstersInGame;
var ballsInGame;
var btnClicked;
window.addEventListener("load",function () {
    Welcome();
    user=new Object();
    user.username = "a";
    user.password="a";
    users.push(user);
});

function setBTN(btnID){
    if(btnClicked)
        return;
    btnClicked = true;
    var newKey = document.getElementById(btnID);
    newKey.value = "Choose";
    newKey.addEventListener("keydown", function (e) {
        chooseBTN(e,btnID);
    });
}

function chooseBTN(e,btnID){
    var key = document.getElementById(btnID);
    key.removeEventListener("keydown",function (ev) {  });
    key.disabled = true;
    key.disabled = false;
    key.value = e.code;
    if(key.value.indexOf("Digit")!=-1)
    {
        var index = key.value.indexOf("Digit");
        key.value = key.value.substring(index+5);
    }else
    {
        if(key.value.indexOf("Key")!=-1)
        {
            var index = key.value.indexOf("Key");
            key.value = key.value.substring(index+3);
        }
    }
    var index = btnID.indexOf("_");
    var type = btnID.substring(0,index);
    if(type==="up")
    {
        up_key = e.code;
    }
    else
    {
        if(type==="down")
        {
            down_key = e.code;
        }
        else
        {
            if(type==="left")
            {
                left_key = e.code;
            }
            else
            {
                right_key = e.code;
            }
        }
    }
    isButtonClicked = false;
}
function registerFormCheck(){
    var error="";
    var username = $("#usernamereg").val();
    var firstname = $("#fname").val();
    var lastname = $("#lname").val();
    var password = $("#passwordreg").val();
    var email = $("#email1").val();
    var birth = $("#birth").val();
    if(username==''){
        error+="fill user name\n"
    }
    if(firstname==''){
        error += "fill first name\n"
    }
    if(lastname==''){
        error += "fill last name\n"
    }
    if(password==''){
        error += "fill password\n"
    }
    if(email==''){
        error += "fill email\n"
    }
    if(birth==''){
        error += "fill birth date\n"
    }
    var flag=true;
    for(var i = 0; i<password.length;i++){
        if(!(password.charAt(i)>='a' && password.charAt(i)<='z') && !(password.charAt(i)>='A' && password.charAt(i)<='Z') && !(password.charAt(i)>='0' && password.charAt(i)<='9')){
            flag=false;
        }
    }
    if(flag==false){
        error+="password need to be only letters and numbers\n";
    }
    if(password.length<8){
        error+="password need to be a least 8 letters\n";
    }
    var flag2=true

    for(var i = 0; i< firstname.length; i++){
        if(firstname.charAt(i)>='0' && firstname.charAt(i)<='9'){
            flag2=false;
        }
    }
    for(var i = 0; i< lastname.length; i++){
        if(lastname.charAt(i)>='0' && lastname.charAt(i)<='9'){
            flag2=false;
        }
    }
    if(flag2==false){
        error+="first and last names can't contains numbers\n"
    }

    var flag3= validateForm(email);
    if(flag3==false){
        error+="not a valid email\n";
    }

    if(error.length != 0){
        alert(error);
        Register();
    }
    else{
        newuser=new Object();
        newuser.username=username;
        newuser.password = password;
        users.push(newuser);
        $("#content_firstPageID").show();
        $("#RegisterFormID").hide();
        $("#LoginFormID").hide();
        $("#SettingsFormID").hide();
        $("#setKeysForGame").hide();
        $("#game").hide();
    }
}

function validateForm(form) {
    var shtrudel = form.indexOf("@");
    var dot = form.lastIndexOf(".");
    if (shtrudel<1 || dot<shtrudel+2 || dot+2>=form.length) {
        return false;
    }
}
function pacmanGames() {
    var time = $("#timeID").val();
    var monster = $("#monstersID").val();
    var balls = $("#ballsID").val();
    var flag = true;
    var error = "";
    if(checkIfNumber(time)==false){
        flag = false;
        error += "time need to be number\n";
    }
    if(checkIfNumber(monster)==false){
        flag=false;
        error += "monster need to be number\n";
    }
    if(checkIfNumber(balls) == false){
        flag=false;
        error += "balls need to be number\n";
    }
    if(time<60){
        flag=false;
        error += "time need to be higher than 60 seconds\n";
    }
    if(!(monster>=1 && monster<=3)){
        flag = false;
        error += "monsters need to be between 1 and 3\n";
    }
    if(!(balls>=50 && balls<=90)){
        flag=false;
        error += "balls need to be between 50 and 90\n";
    }
    if(flag==false){
        alert(error);
    }
    else{
        $("#content_firstPageID").hide();
        $("#RegisterFormID").hide();
        $("#LoginFormID").hide();
        $("#SettingsFormID").hide();
        $("#userName").val(playingusername);
        $("#game").show();
        monstersInGame=monster;
        timeOfGame=time;
        ballsInGame=balls;
        Startt(monstersInGame,timeOfGame,ballsInGame);
    }
}
function SettingsForGame() {
    var username = $("#usernameID").val();
    var password = $("#paaswordID").val();
    var flag=false;
    for(var i = 0; i < users.length;i++){
        if(username == users[i].username && password == users[i].password){
            flag=true;
            playingusername = username;
        }
    }
    if(flag == true){
        $("#content_firstPageID").hide();
        $("#RegisterFormID").hide();
        $("#LoginFormID").hide();
        $("#SettingsFormID").show();
        $("#game").hide();
        Stop();
    }
    else{
        alert("error, fill correct details or register again");
        Login();
    }
}
function checkIfNumber(Checking) {
    for(var i = 0; i < Checking.length; i++){
        if(!(Checking.charAt(i)>='0' && Checking.charAt(i)<='9')){
            return false;
        }
    }
    return true;
}
function RandomSettings(){
    //monster 1-3 random
    monstersInGame = parseInt ((Math.random()*(3-1+1))+1);
    $("#monstersID").val(monstersInGame);

    //num of balls between 50 and 90
    ballsInGame = parseInt((Math.random()*(90-50+1))+50);
    $("#ballsID").val(ballsInGame);

    //time higer then 60 sec but less then 3 min to make sense
    timeOfGame = parseInt ((Math.random()*(180-60+1))+60);
    $("#timeID").val(timeOfGame);
}
function StarttActivate(){
    Startt(monstersInGame,timeOfGame,ballsInGame);
}
function closebtnSettings(){
    $("#content_firstPageID").hide();
    $("#RegisterFormID").hide();
    $("#LoginFormID").hide();
    $("#SettingsFormID").show();
    $("#game").hide();
    $("#setKeysForGame").hide();
    Stop();
}
function setKeys(){
    $("#content_firstPageID").hide();
    $("#RegisterFormID").hide();
    $("#LoginFormID").hide();
    $("#SettingsFormID").hide();
    $("#game").hide();
    $("#setKeysForGame").show();
    Stop();
}
function Welcome() {
    $("#content_firstPageID").show();
    $("#RegisterFormID").hide();
    $("#LoginFormID").hide();
    $("#SettingsFormID").hide();
    $("#game").hide();
    $("#setKeysForGame").hide();
    Stop();
}
function Register(){
    $("#content_firstPageID").hide();
    $("#RegisterFormID").show();
    $("#LoginFormID").hide();
    $("#SettingsFormID").hide();
    $("#game").hide();
    $("#setKeysForGame").hide();
    Stop();
}
function Login(){
    $("#content_firstPageID").hide();
    $("#RegisterFormID").hide();
    $("#LoginFormID").show();
    $("#SettingsFormID").hide();
    $("#game").hide();
    $("#setKeysForGame").hide();
    Stop();
}
$("#welcomemenuID").click(function () {
    Welcome();
});
$("#registermenuID").click(function () {
    Register();
});
$("#loginmenuID").click(function () {
    Login();
});
window.onclick = function(event) {
    if (event.target == document.getElementById("AboutID")) {
        closeabout();
    }
}
$(document).keyup(function(e) {
    if (e.key === "Escape") {
        document.getElementById("AboutID").style.display = "none";
    }
});
function About() {
    document.getElementById("AboutID").style.display="block";
}
function closeabout() {
    document.getElementById("AboutID").style.display = "none";
}
