//login check validation:
function loginCheck(){
	var u = $('#loginUsername').val()
	var p = $('#loginPassword').val()
	var found = false;
	for (i in users){
		if(users[i].username==u){
			if(users[i].password==p){
				found = true;
				loggedIn();//GO TOGAME
			}
			if (!found){
				alert("Wrong password. Please try again.");
				return;
			}
		}
	}
	if (!found){
		alert("Username not found. Please try again.");
	}
}

//login check validation:
function loggedIn(){
	userLogged = true;
	showGame();
}