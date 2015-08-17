var onglets = [];

function LoadAjaxContent(url){

	Load_onglet(url);

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




	var ajax_url = location.hash.replace(/^#/, '');
	if (ajax_url.length < 2) { ajax_url = 'pages/connexion.html'; }
	LoadAjaxContent(ajax_url);




jQuery(function(){
	$('body').on('click', 'li, a', function (e) {

		if ($(this).data("ajax") == 'ajax_link') {
			e.preventDefault();
			var url = $(this).attr('href');
			window.location.hash = url;

			LoadAjaxContent(url);

			if(url === 'pages/messages.html'){
				if ($(this).hasClass('active') === false) {
					$('#tab_container').find('li').removeClass('active');
					$(this).addClass('active');
				}
				Load_onglet(url, $(this).data("name"));
			}
		}

		if ($(this).attr('href') == '#') {
			e.preventDefault();
		}
	});
});


function Load_onglet(url, name){
	jQuery(function(){
		if(url === '#'){
		}else if(url === 'pages/inscription.html'){
			$('#dashboard_tab_index').remove();
			$('#tab_container').append('<li id="dashboard_tab_index" href="#" class="active" >Inscription</li>');
		}else if(url === 'pages/connexion.html'){
			$('#dashboard_tab_index').remove('#dashboard_tab_index');
			$('#tab_container').append('<li id="dashboard_tab_index" href="#" class="active" >Connexion</li>');
		}else if(url === 'pages/dashboard.html'){
			if($('#dashboard_tab_index').text() === 'Dashboard'){
				$('#tab_container').find('li').removeClass('active');
				$('#dashboard_tab_index').addClass('active');
			}else{
				$('#dashboard_tab_index').remove('#dashboard_tab_index');
				$('#tab_container').append('<li id="dashboard_tab_index" href="pages/dashboard.html" data-ajax="ajax_link" class="active" >Dashboard</li>');
			}
		}else if(url === 'pages/messages.html'){
			if(onglets.Appartient(name)){
			}else{
				if(name === undefined){

				}else{
					$("#tab_container").find('li').removeClass('active');
					$("#tab_container").append('<li class="message_tab_index active" href="pages/messages.html" data-name="' + name + '" data-ajax="ajax_link">' + name + '<i class="fa fa-times"></i></li>');
					onglets.push(name);
					del_tab();
				}
			}
		}
	});
}


//IL seblerait que ça me tchèque si mon nom appartient au tableau
Array.prototype.Appartient=function(elt){
  	return ('|' + this.join('|') + '|').indexOf('|' + elt + '|')>-1;
};

/* Page Lancement après Connexion */
function load_page_content(user_id){
	account.orderByChild("id").startAt(user_id).endAt(user_id).once("child_added", function(snapshot) {
  		$('#name_menu').text(snapshot.val().name);
	});

  	LoadAjaxContent('pages/dashboard.html');
}

function del_tab(){
	jQuery(function(){
		$('.fa-times').click(function() {
			$(this).parent().remove();
			onglets.splice(onglets.indexOf($(this).parent().data("name")),1);
		});
	});
}


