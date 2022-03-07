var fname = document.getElementById("fname");
var lname = document.getElementById("lname");
var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var birthday = document.getElementById("birthday");
var mobilenumber = document.getElementById("mobilenumber");
var nationalid = document.getElementById("nationalid");
var update = document.getElementById("update");
var edit = document.getElementById("edit");
var male = document.getElementById("male");
var female = document.getElementById("female");



var inputs = document.getElementsByClassName("input-gp")
var informations = [];


edit.onclick = function () {

  informations = JSON.parse(localStorage.getItem("informationslist"));

  for (var i = 0; i < informations.length; i++) {
    fname.value = informations[i].firstname;
    lname.value = informations[i].lastname;
    username.value = informations[i].username;
    email.value = informations[i].email;
    password.value = informations[i].password;
    birthday.value = informations[i].birthday;
	mobilenumber.value=informations[i].mobilenumber;
	nationalid.value=informations[i].nationalid;
	male.value=informations[i].male;
	female.value=informations[i].female;

  }
}


update.onclick=function () {

	updateinfo();
	clearform();
	
}

function updateinfo() {
	var info=
	{
		firstname:fname.value,
		lastname:lname.value,
		username:username.value,
		email:email.value,
		password:password.value,
		birthday:birthday.value,
		mobilenumber:mobilenumber.value,
		nationalid:nationalid.value,
		male:male.value,
		female:female.value

	}
	informations.push(info)
	localStorage.setItem("informationslist",JSON.stringify(informations))
}


function clearform() {
	for (var i = 0; i < inputs.length; i++) {
		inputs[i].value="";	
	}	
}


















/********** upload image profile *************/
var loadFile = function (event) {
  var imageprofilecard = document.getElementById('imageprofilecard');
  imageprofilecard.src = URL.createObjectURL(event.target.files[0]);
  imageprofilecard.onload = function () {
    imageprofilecard.style.display = "block";
    URL.revokeObjectURL(imageprofilecard.src)
  }
};





