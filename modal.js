/*
This is designed to be a self contained widget loaded via GTM. 
When the user scrolls to the bottom of our website on pages where this widget is loaded, a div will appear with a small email sign up form.
This form will submit a request which will create a lead in SF and create a cookie preventing the window from appearing again.
A cookie will also be created if the user manually closes the popup, but this lasts for 3 days instead of 30.
*/

(function() {

	function createCookie(name, value, days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	}

	function readCookie(name) {
		var nameEQ = encodeURIComponent(name) + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
		}
		return null;
	}
	
	function eraseCookie(name) {
		createCookie(name, "", -1);
	}
	
	function isValidEmailAddress(emailAddress) {
		var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return pattern.test(emailAddress);
	};
	
	// Localize jQuery variable
	var jQuery;

	/******** Load jQuery if not present *********/
	if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
		var script_tag = document.createElement('script');
		script_tag.setAttribute("type","text/javascript");
		script_tag.setAttribute("src",
			"https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js");
		if (script_tag.readyState) {
		  script_tag.onreadystatechange = function () { // For old versions of IE
			  if (this.readyState == 'complete' || this.readyState == 'loaded') {
				  scriptLoadHandler();
			  }
		  };
		} else { // Other browsers
		  script_tag.onload = scriptLoadHandler;
		}
		// Try to find the head, otherwise default to the documentElement
		(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
	} else {
		// The jQuery version on the window is the one we want to use
		jQuery = window.jQuery;
		main();
	}

	/******** Called once jQuery has loaded ******/
	function scriptLoadHandler() {
		// Restore $ and window.jQuery to their previous values and store the
		// new jQuery in our local jQuery variable
		jQuery = window.jQuery.noConflict(true);
		// Call our main function
		main(); 
	}

	// create dynamic form html with question and answers
	function createInterruption(args) {

		// all arguments
		question = args.question;
		answerType = args.answerType;
		answerOptions = args.answerOptions;
		sendResponseTo = args.sendResponseTo;

		// popup div
		var formDiv = document.createElement('div');
		document.body.appendChild(formDiv);
		formDiv.id = 'exitpopup';

		// close button
		var closeButton = document.createElement('a');
		closeButton.href = '#';
		closeButton.className = 'cookieButtons';
		closeButton.id = 'closeFormDiv';
		formDiv.appendChild(closeButton);

		// heading
		var heading = document.createElement('h1');
		heading.appendChild(document.createTextNode('Wait!!! Before you go...'));
    	formDiv.appendChild(heading);

		// paragraph
		var paragraph = document.createElement('p');
		paragraph.appendChild(document.createTextNode('Could we ask you a quick question ?'));
    	formDiv.appendChild(paragraph);

		// question
    	var questionLabel = document.createElement('label');
		questionLabel.appendChild(document.createTextNode(question));
		formDiv.appendChild(questionLabel);

		// answer form
		var createForm = document.createElement('form');
		createForm.id = 'infoForm';
		formDiv.appendChild(createForm);

		// hidden input
		var passEmailAddr = document.createElement('input');
		passEmailAddr.id = 'whereToSend';
		passEmailAddr.type = 'hidden';
		passEmailAddr.value = sendResponseTo;
		createForm.appendChild(passEmailAddr);

		// create input field based on answerType
		if (answerType == 'textBox') {
			var emailInput = document.createElement('input');
			emailInput.type = 'email';
			emailInput.id = 'formDivEmailAddr';
			emailInput.placeholder = 'Enter Email Address';
			createForm.appendChild(emailInput);
		}
		else if (answerType == 'selectBox') {
			var selectInput = document.createElement('select');
			selectInput.id = 'selectReferer';
			for (i = 0; i < answerOptions.length; i++) {
				var options = document.createElement('option');
				options.value = answerOptions[i];
				options.innerHTML = answerOptions[i];
				selectInput.appendChild(options);
			}
			createForm.appendChild(selectInput);
		}
		else if (answerType == 'rating') {
			for (i = 5; i >= 1; i--) {
				var starInput = document.createElement('input');
				starInput.className = 'star star-' + i;
				starInput.id = 'star-' + i;
				starInput.type = 'radio';
				starInput.name = 'star';
				starInput.value = i;
				createForm.appendChild(starInput);

				var starLabel = document.createElement('label');
				starLabel.className = 'star star-' + i;
				starLabel.htmlFor = 'star-' + i;
				createForm.appendChild(starLabel);
			}
		}

		// submit button
		var submitButton = document.createElement('input');
		submitButton.type = 'submit';
		submitButton.name = 'submit';
		submitButton.value = 'Submit';
		createForm.appendChild(submitButton);

	}

	//add a link to the stylesheet for the widget
	var css_link = $("<link>", { 
		rel: "stylesheet", 
		type: "text/css", 
		href: "styles.css"
	});
	css_link.appendTo('head');

	// add fontawesome icons css for rating stars
	var css_link = $("<link>", { 
		rel: "stylesheet", 
		type: "text/css", 
		href: "http://netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css"
	});
	css_link.appendTo('head');

	/******** Our main function ********/
	function main() {

		jQuery(document).ready(function($) {

			// create multiple views based on current page
			var url = window.location.href;
			var index = url.lastIndexOf("/") + 1;
			var pageNameWithExtension = url.substr(index);
			var pageName = pageNameWithExtension.split(/[?#]/)[0];
			if (pageName == "page3.html") {
				createInterruption({
					question : 'How would you rate this page ?',
					answerType : 'rating',
					sendResponseTo : 'email@address.com'
				});
			}
			else if (pageName == "page2.html") {
				createInterruption({
					question : 'From where did you hear about us ?',
					answerType : 'selectBox',
					answerOptions : ["Google Search", "Yahoo Search", "Facebook Page", "Twitter Page"],
					sendResponseTo : 'email@address.com'
				});
			}
			else {
				createInterruption({
					question : 'What is your email address ?',
					answerType : 'textBox',
					sendResponseTo : 'email@address.com'
				});
			}

			// resize overlay based on browser window resize
			$(window).resize(function() {
				var screenHeight = $(window).height();  
				var screenWidth = $(window).width();
				var overlayTop =  (screenHeight  - $('#exitpopup').height())/2;  
				var overlayLeft = (screenWidth - $('#exitpopup').width())/2; 
        		$('#exitpopup').css({ top: overlayTop, left: overlayLeft})
			}).resize();

			// create overlay background div
			var backgroundDiv = document.createElement('div');
			backgroundDiv.id = 'cover';
			document.body.appendChild(backgroundDiv);

			// show popup when mouse exit the current document
			$(document).mouseleave(function() {	
				if (readCookie('overlayFormCookie') != 'true') {
					$('#exitpopup').fadeIn();
					$('#cover').css('display', 'block');
				}
				else {
					$('#exitpopup').hide();
					$('#cover').css('display', 'none');
				}
			});
		
			// hide popup and create cookie when clicking in the document
			$('body').click(function(e) {
				if (!$(e.target).closest('#exitpopup').length) {
					createCookie('overlayFormCookie', 'true', 1);
        			$("#exitpopup").hide();
					$('#cover').css('display', 'none');
    			}
			});

			// validate the input fields during form submission
			$(document).on('submit', '#infoForm', function(e) {

				var errors = false;
				var allFormInputs = $(":input[type!='hidden']");
				var type = allFormInputs.prop('type');

				if (type == "email") {
					if ($('#formDivEmailAddr').val() == '') {
						$('#formDivEmailAddr').css('background-color','#FF5555').css('color','#FFFFFF');
						errors = true;
					} else {
						$('#formDivEmailAddr').css('border','1px solid #999999');
					}
					if (!isValidEmailAddress( $('#formDivEmailAddr').val() )) {
						$('#formDivEmailAddr').css('background-color','#FF5555').css('color','#FFFFFF');
						errors = true;
					} else {
						$('#formDivEmailAddr').css('border','1px solid #999999');
					}
					var dataString = $("#formDivEmailAddr").val();
					var sendEmailTo = $('#whereToSend').val();
				}
				else if (type == "select-one") {
					var dataString = $("#selectReferer").val();
					var sendEmailTo = $('#whereToSend').val();
				}
				else if (type == "radio") {
					if ( !$("input[name='star']:checked").val() ) {
						errors = true;
					}
					else {
	        			var dataString = $("input[name='star']:checked").val();
						var sendEmailTo = $('#whereToSend').val();
					}
				}
				
				// send form data to a particular email address
				if (errors == false) {

					$.ajax({
						type: "POST",
						url: "emailsubmit.php",
						data: {data: dataString, emailTo: sendEmailTo},
						dataType: "text",
						success: function(response) {
							console.log('ajax success!');
							console.log($.trim(response));
							if ($.trim(response) == 'Mail Sent') {
								//create cookie to stop popup showing again for a year
								createCookie('overlayFormCookie', 'true', 365);
								$('#exitpopup').html('Thank you for taking the time to respond. Your feedback is invaluable to help us improve our service.');
								window.setTimeout( function(){
									$('#exitpopup').hide();
									$('#cover').css('display', 'none');
								}, 10000);
							} else {
								$('#exitpopup').html('Sorry! There was a problem with your submission. Please try again later.');
								window.setTimeout( function() {
									$('#cover').css('display', 'none');
								}, 10000);
							}
						},
						error:function(){
							console.log('Ajax error');
						}
					});
					
					console.log('submit end');

				} else {
					console.log('There some validation errors.');
				}
				e.preventDefault();
			});
			
			// close popup and create cookie when clicking on close button
			$(document).on ('click', '#closeFormDiv', function(e) {
				createCookie('overlayFormCookie', 'true', 1);
				$('#exitpopup').hide();
				$('#cover').css('display', 'none');
			});

			// check and remove cookie buttons
			$(document).on ('click', '.cookieButtons', function(e) {
				e.preventDefault();
			});
			$(document).on ('click', '#formDivCheckCookie', function(e) {
				console.log(readCookie('overlayFormCookie'));
			});			
			$(document).on ('click', '#formDivRemoveCookie', function(e) {
				eraseCookie('overlayFormCookie');
			});

		});
	}

})();
