
/* VARIABLE GLOBALES */
var account = new Firebase("https://idledata.firebaseio.com/account");
var target_private = new Firebase("https://idledata.firebaseio.com/target_private");
var userId;
var Companies_array = [],
	User_array = [],
	onglets = [];


/* 

GESTION DES VIEW

*/

//ROUTEUR DES VIEWS
function Hub_page(url){
	$( document ).ready(function() {
		window.location.hash = url;

		if(url === 'pages/connexion.html'){
			$('.menu_droite').hide();
			Load_onglet(url, 'Connexion');
		}else if(url === 'pages/dashboard.html'){
			$('.menu_droite').show();
			Load_onglet(url, 'Dashboard');
		}else if(url == 'pages/addtarget.html'){
			Load_page(url);
			return;
		}else if(url == 'pages/messages.html'){
			Load_page(url);
			var name = 'Frog Design';
			display_message_page(Companies_array, name);
		}
	
		Load_page(url);
	});
}


// CHARGEMENT DU CONTENU DES PAGES
function Load_page(url){
	$( document ).ready(function() {
		$.ajax({
			mimeType: 'text/html; charset=utf-8',
			url: url,
			type: 'GET',
			success: function(data) {
				$('#content_container').html(data);
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
function Load_onglet(url, name){
	$( document ).ready(function() {
		if(url === 'pages/connexion.html'){
			$('#dashboard_tab_index').remove('#dashboard_tab_index');
			$('#tab_container').append('<li id="dashboard_tab_index" href="#" class="active" >Connexion</li>');
		}else if(url === 'pages/dashboard.html'){
			if($('#dashboard_tab_index').text() === 'Dashboard'){
				$('#tab_container').find('li').removeClass('active');
				$('#dashboard_tab_index').addClass('active');
			}else{
				$('#dashboard_tab_index').remove('#dashboard_tab_index');
				$('#tab_container').append('<li id="dashboard_tab_index" onclick="Hub_page(\'pages/dashboard.html\'); Load_page_content(\'alexandre\');" class="active" >Dashboard</li>');
			}
		}else if(url === 'pages/messages.html' || url === 'pages/addtarget.html'){
			var namenospace = escapeRegExp(name);
			if(onglets.Appartient(name)){
				$("#tab_container").find('li').removeClass('active');
				if(url === 'pages/addtarget.html'){
					$('#tab_container').find('li').removeClass('active');
					$('#target_onglet').addClass('active');
				}else if(url === 'pages/messages.html'){
					$('#tab_container').find('li').removeClass('active');
					$('#message_onglet_FrogDesign').addClass('active');
				}

			}else{
				$("#tab_container").find('li').removeClass('active');
				if(url === 'pages/addtarget.html'){
					$("#tab_container").append('<li id="target_onglet" class="message_tab_index active" onclick="Hub_page(\'pages/addtarget.html\'); Load_onglet(\'pages/addtarget.html\', \'Add a offre\');" >' + name + '<i class="fa fa-times"></i></li>');
				}else if(url === 'pages/messages.html'){
					$("#tab_container").append('<li id="message_onglet_' + namenospace + '" class="message_tab_index active" onclick="Hub_page(\'pages/messages.html\'); Load_onglet(\'pages/messages.html\', \'' + name + '\');" >' + name + '<i class="fa fa-times"></i></li>');
				}
				onglets.push(name);
				del_tab();
			}
		}

	});
}

// SUPPRESSION DES ONGLETS
function del_tab(){
	$( document ).ready(function() {

		$('.fa-times').click(function() {
			$(this).parent().remove();
			onglets.splice(onglets.indexOf($(this).parent().data("name")),1);
			if(onglets.length === 0 ){
				Hub_page('pages/dashboard.html');
				Load_page_content(userId);
			}
		});

	});
}



/*

GESTION DES CONNEXION / DECONNEXION / CONTENUS

*/

//CONNEXION
function Log_in(){
	$( document ).ready(function() {
		$('#btn_connexion').css('background-color', '#BABABA');
		account.authWithPassword({
			email    : $('.input_bootstrap_email').val(),
    		password : $('.input_bootstrap_password').val()
  		}, function(error, authData) {
    		if (error) {
    			$('#btn_connexion').css('background-color', '#FFFFFF');
      			alert("Login Failed!", error);
    		} else {
      			/* jshint ignore:start */
      			remember: 'sessionOnly';
      			/* jshint ignore:end */
      
      			user_id = authData.uid;

      			Load_page_content(user_id);
      			Hub_page('pages/dashboard.html');
    		}
  		});
  	});
}


//DECONNEXION
function Log_out(){
   account.unauth();
   window.location.href = "index.html";
}

//ENVOIS D'UN NOUVEAU MDP
function lost_password(){
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


//CHARGEMENT DU CONTENU DU DASHBOARD 
function Load_page_content(id){
	if(Companies_array == '' && User_array == ''){

		target_private.orderByChild("id_author").startAt(id).endAt(id).on("child_added", function(snapshot) {
			var entree = [snapshot.val().id_author, snapshot.val().nb_mail, snapshot.val().nd_answer, snapshot.val().status, snapshot.val().target_add_date, snapshot.val().target_adresse, snapshot.val().target_description, snapshot.val().target_email, snapshot.val().target_name, snapshot.val().target_phone, snapshot.val().target_website, snapshot.val().timastamp_last_answer, snapshot.val().timestamp_last_mail]
  			Companies_array.push(entree);
  			display_dashboard_page(Companies_array);
  			console.log(Companies_array);
		});

		account.orderByChild("id").startAt(id).endAt(id).once("child_added", function(snapshot) {
  			User_array.push(snapshot.val().id, snapshot.val().name, snapshot.val().email, snapshot.val().actif, snapshot.val().date_inscription);
  			$('#name_menu').text(User_array[1]);
		});

		return;
	}else if(Companies_array == ''){
		target_private.orderByChild("id_author").startAt(User_array[0]).endAt(User_array[0]).on("child_added", function(snapshot) {

			var entree = [snapshot.val().id_author, snapshot.val().nb_mail, snapshot.val().nd_answer, snapshot.val().status, snapshot.val().target_add_date, snapshot.val().target_adresse, snapshot.val().target_description, snapshot.val().target_email, snapshot.val().target_name, snapshot.val().target_phone, snapshot.val().target_website, snapshot.val().timastamp_last_answer, snapshot.val().timestamp_last_mail]
  			Companies_array.push(entree);
  			display_dashboard_page(Companies_array);
		});
	}else if(User_array == ''){

		account.orderByChild("id").startAt(id).endAt(id).once("child_added", function(snapshot) {
  			User_array.push(snapshot.val().id, snapshot.val().name, snapshot.val().email, snapshot.val().actif, snapshot.val().date_inscription);
  			$('#name_menu').text(User_array[1]);
		});
	}else{
		display_dashboard_page(Companies_array);
	}

	
}

function display_dashboard_page(companies) {
	for (var i = 0; i < companies.length; i++) {
		$('#hiddenbeforetruk').after('<div class="tuile"><a id="frogdesign" onclick="Hub_page(\'pages/messages.html\'); Load_onglet(\'pages/messages.html\', \'' + companies[i][8] + '\');" ><img src="img/Frog_Design.svg"></a><i class="fa fa-comments-o"></i><h2>' + companies[i][8] + '</h2><h3>Design Agency</h3><div class="btn_dropdown_tuile" ><i class="fa fa-ellipsis-h"></i><ul class="dropdown_tuile"><li>Modifier la compagnie</li><li href="#partager_modal" data-toggle="modal" >Partager</li><li href="#archiver_modal" data-toggle="modal" >Archiver</li></ul></div></div>');
	}
}

function display_message_page(companies, name){
	console.log(companies);
	$(document).ready(function(){
		setTimeout(function(){
			$('#title_message').text(name);
			$('#descr_message').html(companies[0][6]);
			$('#date_message').html(calculedesjours(companies[0][4]) + ' Jours');
		 }, 100);
	});
}



/*

GESTION DES AJOUT / SUPPRESSION DES COMPANIES

*/

//Ajout d'une companie
function add_target(){
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


Hub_page('pages/connexion.html');


