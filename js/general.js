jQuery(function(){
	$('.fa-times').click( function(){
		$(this).parent().remove();
		nb = 0;
	});
});