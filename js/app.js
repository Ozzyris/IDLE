//
//  Function for load content from url and put in $('.ajax-content') block
//
function LoadAjaxContent(url){
	$.ajax({
		mimeType: 'text/html; charset=utf-8', // ! Need set mimeType only when run from local file
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
}




/*--------------------- Launch of the Script --------------------------*/
$(document).ready(function () {
	var ajax_url = location.hash.replace(/^#/, '');
	if (ajax_url.length < 1) { ajax_url = 'pages/connexion.html'; }
	LoadAjaxContent(ajax_url);

	$('body').on('click', 'li, a', function (e) {

		if ($(this).hasClass('active') == false) {
			$('#tab_container').find('li').removeClass('active');
			$(this).addClass('active')
		}

		if ($(this).data("ajax") == 'ajax_link') {
			e.preventDefault();
			var url = $(this).attr('href');
			window.location.hash = url;
			LoadAjaxContent(url);
		}

		if ($(this).attr('href') == '#') {
			e.preventDefault();
		}

	});
	
});


function load_page_content(user_id){
	LoadAjaxContent('pages/dashboard.html');

	account.startAt('nemokervi@yahoo.fr').endAt('nemokervi@yahoo.fr').once('value', (snapshot) => {
  		snapshot.forEach(function(childSnapshot) {
  		console.log('biatch');
    	console.log(childSnapshot.val());
  	});  	});
}



  var account = new Firebase("https://idledata.firebaseio.com/account");

  var user_id = null;


  function create_account(){
    $(document).ready(function(){
  
      if($('.input_bootstrap_name').val() != null || $('.input_bootstrap_email').val() != null || $('.input_bootstrap_emailbis').val() != null || $('.input_bootstrap_password').val() != null || $('.input_bootstrap_passwordbis').val() != null){
        if($('.input_bootstrap_email').val() == $('.input_bootstrap_emailbis').val()){
          if($('.input_bootstrap_password').val() == $('.input_bootstrap_passwordbis').val()){
  
            account.createUser({
              email    : $('.input_bootstrap_email').val(),
              password : $('.input_bootstrap_password').val()
            }, function(error, userData) {
              if (error) {
                alert("Error creating user:", error);
              } else {
                alert("Successfully created user account with uid:", userData.uid);
                var id = userData.uid; 
                var name = $('.input_bootstrap_name').val();
                var email = $('.input_bootstrap_email').val();
                var date_inscription = new Date().getTime();
                var actif = false;
              account.push({id: id, name: name, email: email, date_inscription: date_inscription, actif: actif});
              window.location.href = "connexion.html";
              }
            });  
  
          }else{alert('Email incorrect');}
        }else{alert('Mot de passe incorrect');}
      }else{alert('Voyons, il faut tous remplir !');}
    });
  }


/* GESTION DES COMPTES UTILISATEUR */ 

    function good_password(){
      $( document ).ready(function() {
        account.authWithPassword({
          email    : $('.input_bootstrap_email').val(),
          password : $('.input_bootstrap_password').val()
        }, function(error, authData) {
          if (error) {
            alert("Login Failed!", error);
          } else {
            user_id = authData.uid;
            load_page_content(user_id);
            
            /*console.log('Data : ');
            console.log(authData.uid);
            console.log(authData.token);
            console.log(authData.auth);
            console.log(authData.expires);*/
          }
        });
      });
    }

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

    function del_user(){
      account.removeUser({
        email    : $('.input_bootstrap_email').val(),
        password : $('.input_bootstrap_password').val()
      }, function(error) {
        if (error === null) {
        alert("User removed successfully");
        } else {
        alert("Error removing user:", error);
        }
      });
    }

    function logout(e) {
       e.preventDefault();
       ref.unauth();
    }



