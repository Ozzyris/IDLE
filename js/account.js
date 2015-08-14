 var account = new Firebase("https://idledata.firebaseio.com/account");
 var user_id = null;


/* Inscription */

function create_account(){
    $(document).ready(function(){
  
      if($('.input_bootstrap_name').val() !== null || $('.input_bootstrap_email').val() !== null || $('.input_bootstrap_emailbis').val() !== null || $('.input_bootstrap_password').val() !== null || $('.input_bootstrap_passwordbis').val() !== null){
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
              window.location.href = "index.html";
              }
            });  
  
          }else{alert('Email incorrect');}
        }else{alert('Mot de passe incorrect');}
      }else{alert('Voyons, il faut tous remplir !');}
    });
  }


/* Connexion */

function good_password(){
  $( document ).ready(function() {
    account.authWithPassword({
      email    : $('.input_bootstrap_email').val(),
      password : $('.input_bootstrap_password').val()
    }, function(error, authData) {
      if (error) {
        alert("Login Failed!", error);
      } else {
        remember: 'sessionOnly';
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


/*  Deconnexion */

function logout(e) {
   account.unauth();
   window.location.href = "index.html";
}


/* Mot de passe Perdu */

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


/* Supprimer un compte */

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









