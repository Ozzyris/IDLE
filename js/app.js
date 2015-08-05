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
	if (ajax_url.length < 1) { ajax_url = 'pages/dashboard.html'; }
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
