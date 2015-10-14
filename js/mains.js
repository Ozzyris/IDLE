/*

VARIABLE GLOBALES 

*/

var account = new Firebase("https://idledata.firebaseio.com/account");
var target_private = new Firebase("https://idledata.firebaseio.com/target_private");
var Companies_array = [],
	User_array = [],
	onglets = [],
	nb_thumb = 0;




/* 

GESTION DES VIEW

*/

//ROUTEUR DES VIEWS
function Hub_page(url, id){
	$( document ).ready(function() {
		
		switch(url) {
    		case 'pages/connexion.html':
        		$('.menu_droite').hide();
        		Load_page(url);
        		Load_onglet(url);
        		break;
    		case 'pages/dashboard.html':
        		$('#name_menu').text(User_array[1]);
				$('.menu_droite').show();
				Load_onglet(url);
				Load_page(url);
        		break;
        	case 'pages/addtarget.html':
        		Load_page(url);
        		Load_onglet(url);
        		break;	
        	case 'pages/edit.html':
        		Load_page(url, id);
        		break;
        	case 'pages/profil.html':
        		Load_page(url);
        		Load_onglet(url);
        		break;
        	case 'pages/messages.html':
        		Load_page(url, id);
        		Load_onglet(url, id);
        		break;
    		default:
    			Load_page('404.html');
		} 
		
	});
}

// CHARGEMENT DU CONTENU DES PAGES
function Load_page(url, id){
	$( document ).ready(function() {
		$.ajax({
			mimeType: 'text/html; charset=utf-8',
			url: url,
			type: 'GET',
			success: function(data) {
				$('#content_container').html(data);

				//Chargement du contenu
				switch(url) {
    				case 'pages/connexion.html':
        				        				
        				break;
    				case 'pages/dashboard.html':
    					Load_page_content();
        				break;
        			case 'pages/addtarget.html':
        				
        				break;	
        			case 'pages/edit.html':
        				Diplay_edit_page(id);
        				break;
        			case 'pages/profil.html':
        				Display_profil_page();
        				break;
        			case 'pages/messages.html':
        				Display_message_page(id);
        				break;
    				default:
    					
				}

			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(errorThrown);
			},
			dataType: "html",
			async: false
		});
	});
}

// CHARGEMENT DES ONGLETS
function Load_onglet(url, id){
	$( document ).ready(function() {
		switch(url) {
    		case 'pages/connexion.html':
        		$('#dashboard_tab_index').remove('#dashboard_tab_index');
				$('#tab_container').append('<li id="dashboard_tab_index" href="#" class="active" >Connexion</li>');
        		break;
    		case 'pages/dashboard.html':
        		if($('#dashboard_tab_index').text() === 'Dashboard'){
					$('#tab_container').find('li').removeClass('active');
					$('#dashboard_tab_index').addClass('active');
				}else{
					$('#dashboard_tab_index').remove('#dashboard_tab_index');
					$('#tab_container').append('<li id="dashboard_tab_index" onclick="Hub_page(\'pages/dashboard.html\');" class="active" >Dashboard</li>');
				}
        		break;
        	case 'pages/addtarget.html':
				if(onglets.Appartient('addTarget')){
					$("#tab_container").find('li').removeClass('active');
					$('#page_onglet_addTarget').addClass('active');
				}else{
					$("#tab_container").find('li').removeClass('active');
					$("#tab_container").append('<li id="page_onglet_addTarget" class="message_tab_index active"><span onclick="Hub_page(\'' + url + '\');">Add Target</span><i onclick="Del_onglet(\'addTarget\');" class="fa fa-times"></i></li>');
					onglets.push('addTarget');
				}
        		break;	
        	case 'pages/edit.html':
        		var namenospace = escapeRegExp(name);
				if(onglets.Appartient(name)){
					$("#tab_container").find('li').removeClass('active');
					$('#page_onglet_' + namenospace).addClass('active');
				}else{
					$("#tab_container").find('li').removeClass('active');
					$("#tab_container").append('<li id="page_onglet_Edit" class="message_tab_index active"><span onclick="Hub_page(\'' + url + '\');">Edit</span><i onclick="Del_onglet(\'edit\');" class="fa fa-times"></i></li>');
					onglets.push(name);
				}
        		break;
        	case 'pages/profil.html':
				if(onglets.Appartient('profil')){
					$("#tab_container").find('li').removeClass('active');
					$('#page_onglet_profil').addClass('active');
				}else{
					$("#tab_container").find('li').removeClass('active');
					$("#tab_container").append('<li id="page_onglet_profil" class="message_tab_index active"><span onclick="Hub_page(\'' + url + '\');">Profil</span><i onclick="Del_onglet(\'profil\');" class="fa fa-times"></i></li>');
					onglets.push('profil');
				}
        		break;
        	case 'pages/messages.html':
        		var name = Companies_array[id][8];
        		var namenospace = escapeRegExp(name);
				if(onglets.Appartient(name)){
					$("#tab_container").find('li').removeClass('active');
					$('#page_onglet_' + namenospace).addClass('active');
				}else{
					$("#tab_container").find('li').removeClass('active');
					$("#tab_container").append('<li id="page_onglet_' + namenospace + '" class="message_tab_index active"><span onclick="Hub_page(\'pages/messages.html\', \'' + id + '\');" >' + name + '</span><i onclick="Del_onglet(\'' + namenospace + '\');" class="fa fa-times"></i></li>');
					onglets.push(name);
				}
        		break;
    		default:
		} 

	});
}

// SUPPRESSION DES ONGLETS
function Del_onglet(name){
	$( document ).ready(function() {
		
		onglets.splice(onglets.indexOf(name),1);
		$('#page_onglet_' + name).remove();
		if(onglets.length === 0 ){
			Hub_page('pages/dashboard.html');
		}
		
	});
}



/* 

GESTION DES CONTENT

*/

//CONTENT DASHBOARD 
function Load_page_content(){

	if(Companies_array == ''){
		target_private.orderByChild("id_author").startAt(User_array[0]).endAt(User_array[0]).on("child_added", function(snapshot) {

			var entree = [snapshot.val().id_author, snapshot.val().nb_mail, snapshot.val().nd_answer, snapshot.val().status, snapshot.val().target_add_date, snapshot.val().target_adresse, snapshot.val().target_description, snapshot.val().target_email, snapshot.val().target_name, snapshot.val().target_phone, snapshot.val().target_website, snapshot.val().timastamp_last_answer, snapshot.val().timestamp_last_mail]
  			Companies_array.push(entree);

  			Display_dashboard_content(entree);
		});
	}else{
		Display_dashboard_content();
	}
	
}



/*

	DISPLAY CONTENT

*/

// DISPLAY DASHBOARD PAGE
function Display_dashboard_content(entree) {
	if(entree){
		$('#hiddenbeforetruk').after('<div class="tuile"><a id="frogdesign" onclick="Hub_page(\'pages/messages.html\', \'' + nb_thumb + '\'); " ><img src="img/' + escapeRegExp(entree[8]) + '.svg"></a><i class="fa fa-comments-o"></i><h2>' + entree[8] + '</h2><h3>Design Agency</h3><div class="btn_dropdown_tuile" ><i class="fa fa-ellipsis-h"></i><ul class="dropdown_tuile"><li>Modifier la compagnie</li><li href="#partager_modal" data-toggle="modal" >Partager</li><li href="#archiver_modal" data-toggle="modal" >Archiver</li></ul></div></div>');
		nb_thumb ++;
	}else{
		for (var i = 0; i < Companies_array.length; i++) {
			$('#hiddenbeforetruk').after('<div class="tuile"><a id="frogdesign" onclick="Hub_page(\'pages/messages.html\', \'' + i + '\');" ><img src="img/' + escapeRegExp(Companies_array[i][8]) + '.svg"></a><i class="fa fa-comments-o"></i><h2>' + Companies_array[i][8] + '</h2><h3>Design Agency</h3><div class="btn_dropdown_tuile" ><i class="fa fa-ellipsis-h"></i><ul class="dropdown_tuile"><li>Modifier la compagnie</li><li href="#partager_modal" data-toggle="modal" >Partager</li><li href="#archiver_modal" data-toggle="modal" >Archiver</li></ul></div></div>');
		}
	}
}

// DISPLAY EDIT PAGE
function Diplay_edit_page(id){
	$( document ).ready(function() {
		 setTimeout(function(){
		 	$('#title_target').text('Modifier ' + Companies_array[id][8]);

			$('#target_email_input').val(Companies_array[id][7]);
			$('#target_phone_input').val(Companies_array[id][9]);
			$('#target_adresse_input').val(Companies_array[id][5]);

			$('#target_name_input').val(Companies_array[id][8]);
			$('#target_website_input').val(Companies_array[id][10]);
			$('#target_description_input').val(Companies_array[id][6]);
		}, 10);
	});
}

//DISPLAY PROFIL PAGE
function Display_profil_page(){
	$('.input_bootstrap_name').val(User_array[1]);
	$('.input_bootstrap_email').val(User_array[2]);
}

// DISPLAY MESSAGE PAGE
function Display_message_page(id){
	$(document).ready(function(){

		$('#company_information').append('<i class="fa fa-cog" onclick="Hub_page(\'pages/edit.html\', ' + id + ');" ></i><img id="img_message" src="img/Square_' + escapeRegExp(Companies_array[id][8]) + '.svg" alt="' + Companies_array[id][8] + ' Logo"><h1 id="title_message" >' + Companies_array[id][8] + '</h1><p id="descr_message" >' + Companies_array[id][6] + '</p><p>Vous avez pris en Chasse cette entreprise il y à <span id="date_message" class="company_information_bold">' + calculedesjours(Companies_array[id][4]) + ' jours</span></p>');
	
	});
}



/*

	ACTION PAGE SPECIALE

*/

//CONNEXION - CONNEXION
function Log_in(){
	$( document ).ready(function() {

		$('#btn_connexion').css('background-color', '#BABABA');
		account.authWithPassword({
			email    : $('.input_bootstrap_email').val(),
    		password : $('.input_bootstrap_password').val()
  		}, function(error, authData) {
    		if (error) {
    			$('#btn_connexion').css('background-color', '#FFFFFF');
      			alert("Login Failed!");
    		} else {
      			/* jshint ignore:start */
      			remember: 'sessionOnly';
      			/* jshint ignore:end */

      			account.orderByChild("id").startAt(authData.uid).endAt(authData.uid).once("child_added", function(snapshot) {
  					User_array.push(snapshot.val().id, snapshot.val().name, snapshot.val().email, snapshot.val().actif, snapshot.val().date_inscription);
  					Create_cookie('session', snapshot.val().id, 0.042);
  					Hub_page('pages/dashboard.html');

				});
    		}
  		});

  	});
}

//CONNEXION - DECONNEXION
function Log_out(){
	Create_cookie('session',"",-1);
	account.unauth();
	window.location.href = "index.html";
}

//CONNEXION - ENVOIS D'UN NOUVEAU MDP
function Lost_password(){
  account.resetPassword({
    email : $('.input_bootstrap_email_lost').val()
  }, function(error) {
    if (error === null) {
      alert("Password reset email sent successfully");
    } else {
      alert("Error sending password reset email:", error);
    }
  });
}
// ADD TARGET = AJOUT D'UNE COMPANY
function Add_target(){
    $(document).ready(function(){
    	var id_author = user_id;
    	var target_name = $('#target_name_input').val();
    	var status = 'actif';
    	var target_add_date = new Date().getTime();
    	var target_email = $('#target_email_input').val();
    	var target_website = $('#target_website_input').val();
    	var target_phone = $('#target_phone_input').val();
    	var target_description = $('#target_description_input').val();
    	var target_adresse = $('#target_adresse_input').val();
    	var nb_mail = 0;
    	var nd_answer = 0;
    	var timestamp_last_mail = 0;
    	var timastamp_last_answer = 0;

    	//target_private.push({ 'id_author': id_author, 'target_name': target_name, 'status': status, 'target_add_date': target_add_date, 'target_email': target_email, 'target_website': target_website, 'target_phone': target_phone, 'target_description': target_description, 'target_adresse': target_adresse, 'nb_mail': nb_mail, 'nd_answer': nd_answer, 'timestamp_last_mail': timestamp_last_mail, 'timastamp_last_answer': timastamp_last_answer });
    	$('#target_name_input, #target_email_input, #target_website_input, #target_phone_input, #target_description_input, #target_adresse_input').val('');
    	Companies_array = [];
    	Hub_page('pages/dashboard.html');
    	Load_page_content(userId);
  });
}

// EDIT PROFIL - CLEAR GENERAL DATA
function Clear_dataPerso(){
	$('.input_bootstrap_name').val(User_array[1]);
	$('.input_bootstrap_email').val(User_array[2]);
}

// EDIT PROFIL - EDIT GENERAL DATA 
function Edit_dataPerso(){
	var inputEmail = $('.input_bootstrap_email').val();
	var inputName = $('.input_bootstrap_name').val();

	if(inputName !== User_array[1] && inputEmail !== User_array[2]){
		var password_check = prompt("Please enter your password (WIP)", "");
		account.orderByChild('id').startAt(User_array[0]).endAt(User_array[0]).once('child_added', function(snapshot) {
			var Updateaccount = new Firebase("https://idledata.firebaseio.com/account/" + snapshot.key());
			Updateaccount.update({email: inputEmail, name: inputName});
			$('#name_menu').text(inputName);
			User_array[1] = inputName;
		});
		account.changeEmail({
  			oldEmail : User_array[2],
  			newEmail : $('.input_bootstrap_email').val(),
  			password : password_check
		}, function(error) {
  			if (error === null) {
    			alert("L'email et le nom ont été changé avec succès");
  			} else {
    			alert("Il y à eu un problème lors du changement de l'email ou du Nom");
  			}
  		});
	}else if(inputName !== User_array[1]){
		account.orderByChild('id').startAt(User_array[0]).endAt(User_array[0]).once('child_added', function(snapshot) {
			var Updateaccount = new Firebase("https://idledata.firebaseio.com/account/" + snapshot.key());
			Updateaccount.update({name: inputName});
			$('#name_menu').text(inputName);
			console.log(User_array);
			User_array[1] = inputName;
			alert("Le Nom à bien été changé");
		});
	}else if(inputEmail !== User_array[2]){
		var password_check = prompt("Please enter your password (WIP)", "");
		account.orderByChild('id').startAt(User_array[0]).endAt(User_array[0]).once('child_added', function(snapshot) {
			var Updateaccount = new Firebase("https://idledata.firebaseio.com/account/" + snapshot.key());
			Updateaccount.update({email: inputEmail});
		});
		account.changeEmail({
  			oldEmail : User_array[2],
  			newEmail : $('.input_bootstrap_email').val(),
  			password : password_check
		}, function(error) {
  			if (error === null) {
    			alert("L'email à été changé avec succès");
  			} else {
    			alert("Il y à eu un problème lors du changement de l'email");
  			}
  		});
	}else{
		alert('Mais vous n\'avez rien changé ?');
	}
}

// EDIT PROFIL - EDIT PASSWORD
function Edit_dataMDP(){
	if($('.input_bootstrap_password').val() == '' || $('.input_bootstrap_passwordbis').val() == '' || $('.input_bootstrap_oldpassword').val() == ''){
		alert('Tous les champs ne sont pas remplis !');
	}else{
		if($('.input_bootstrap_password').val() === $('.input_bootstrap_passwordbis').val()){
    		account.changePassword({
      			email       : User_array[2],
      			oldPassword : $('.input_bootstrap_oldpassword').val(),
      			newPassword : $('.input_bootstrap_password').val()
    		}, function(error) {
      			if (error === null) {
        			alert("Le mot de passe à été changé avec succès");
        			$('.input_bootstrap_oldpassword').val('');
        			$('.input_bootstrap_password').val('');
        			$('.input_bootstrap_passwordbis').val('');

      			} else {
        			alert("L'ancien Mot de passe n'est pas correct");
      			}
    		});
		}else{
			alert('Les deux mots de passe ne correspondent pas !');
		}
	}
}

//EDIT PROFIL - CLEAR PASSWORD FIELD
function Clear_dataMDP(){
	$('.input_bootstrap_password').val('');
	$('.input_bootstrap_passwordbis').val('');
}

//EDIT PROFIL - DELETING USER
function Del_user(){
	var password_check = prompt("Please enter your password (WIP)", "");
	account.orderByChild('id').startAt(User_array[0]).endAt(User_array[0]).once('child_added', function(snapshot) {
		var Updateaccount = new Firebase("https://idledata.firebaseio.com/account/" + snapshot.key());
		Updateaccount.set(null);
	});

    account.removeUser({
    	email    : User_array[2],
    	password : password_check
    }, function(error) {
      	if (error === null) {
        	alert("L'utilisateur à été supprimé avec succès");
    		Log_out();
      	} else {
        	alert("Un problème est survenu lors de la suppression de l'utilisateur");
      	}
    });
}



/*

FONCTION GLOBALE

*/

//FONCTION POUR SUPPRIMER LES ESPACES D'UN STRING 
function escapeRegExp(string) {
    return string.replace(" ", "");
}

//PROTOTYPE POUR VERIFIER SI UN ELEMENT EST DANS UN TABLEAU OU NON 
Array.prototype.Appartient=function(elt){
  	return ('|' + this.join('|') + '|').indexOf('|' + elt + '|')>-1;
};

//CALCULE DES JOURS
function calculedesjours(datededebut){
	var dateactuel = new Date().getTime();
	return Math.round(((dateactuel - datededebut)/86400000));
}

//CREATION D'UN COOKIE
function Create_cookie(name, value, days) {
    if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

//LECTURE D'UN COOKIE
function Read_cookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// VERIFICATION DE L'EXISTANCE D'UN COOKIE
function Check_cookie(name) {
    var session=Read_cookie(name);
    if (session != "") {
        return session;
    }else{
    	return null;
    }
}

//FONCTION INITIALE
function init(){
	var cookie = Check_cookie('session');
	if(cookie === null){
		Hub_page('pages/connexion.html');
	}else{
		account.orderByChild("id").startAt(cookie).endAt(cookie).once("child_added", function(snapshot) {
  			User_array.push(snapshot.val().id, snapshot.val().name, snapshot.val().email, snapshot.val().actif, snapshot.val().date_inscription);
  			Hub_page('pages/dashboard.html');
		});
	}
}

//LAUNCH
init();