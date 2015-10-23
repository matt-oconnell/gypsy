$(document).ready(function() {

	var gifs = [
		'https://media4.giphy.com/media/wse85b0SSfxwk/giphy.gif',
		'https://media.giphy.com/media/CD1tWaGFs5teM/giphy.gif',
		'https://media1.giphy.com/media/PWevF5pfnQqkg/giphy.gif'
	];

	// Home Page
	$('.home .gif').attr('src', gifs[Math.floor(Math.random() * gifs.length)]);

	$('.home button').click(function() {
	    window.location = window.location.href + 'generate';
		$(this).remove();
		$('.hidden').removeClass('hidden');
	});

	// List Page
	$('.post').each(function() {
		$(this).find('a').attr('target', '_blank');

		// Assign Data Types
		var caption = $(this).find('.caption').text().toLowerCase();
		if(~caption.indexOf('offering') || ~caption.indexOf('offered')) {
			$(this).attr('data-type', 'offering');
		} else if(~caption.indexOf('seeking')) {
			$(this).attr('data-type', 'seeking');
		} else {
			$(this).attr('data-type', 'misc');
		}

	});

	$('.submit').click(function() {
		var search = $('.search input').val().toLowerCase();
		var type = $('.type select').val();
		var posts = $('.post');
		posts.removeClass('hidden');
		posts.each(function() {
			var t = $(this);
			if(t.data('type') != type && type != 'all') {
				t.addClass('hidden');
			}
			if(!~t.find('.caption').text().toLowerCase().indexOf(search)) {
				t.addClass('hidden');
			}
		});
	});

	$('.post .toggle-comments').each(function() {
		var t = $(this);
		t.click(function() {
			t.text(t.hasClass('showing') ? 'Show Comments' : 'Hide Comments');
			t.toggleClass('showing').next().toggleClass('closed');
		});
	});



});