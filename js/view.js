var nb = 0;


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


	var ajax_url = location.hash.replace(/^#/, '');
	if (ajax_url.length < 1) { ajax_url = 'pages/connexion.html'; }
	LoadAjaxContent(ajax_url);

jQuery(function(){
	$('body').on('click', 'li, a', function (e) {

		if ($(this).hasClass('active') === false) {
			$('#tab_container').find('li').removeClass('active');
			$(this).addClass('active');
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


/* Page Lancement après Connexion */

function load_page_content(user_id){
	account.orderByChild("id").startAt(user_id).endAt(user_id).once("child_added", function(snapshot) {
  		$('#name_menu').text(snapshot.val().name);
	});

  	LoadAjaxContent('pages/dashboard.html');
}
