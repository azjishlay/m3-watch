$(document).ready(function(){

	$(document).keyup(function(event) {
		if(event.keyCode == 13){
			var term = $('#search').val().trim();
			fixed();
			search(term);
		}
	});
  // Change placeholder text on resize

//   $('#search').each(function() {
//     $(this).data('placeholder', $(this).attr('placeholder'));
//   });

//   function changePlaceholder() {
//       if( $(window).width() <= 640){
//           $('#search').attr('placeholder','Search');
//       } else {
//           $('#search').each(function() {
//               $(this).attr('placeholder', $(this).data('placeholder'));
//           });
//       }   
//   }

//   $(window).resize( changePlaceholder ).trigger('resize');

//   // Clear input

//   document.getElementById("clearinput").onclick = function() {
//     $('#search').val("");
//   };

//   // Run initial api calls

	// document.getElementById("searchbar").onsubmit = function() {

 //    var searchterm = $('#search').val().trim();

	// 	fixed();
	// 	search(searchterm);
	// };

	function fixed() {
		// console.log("Move search bar to top");
		$('.header').hide();
		$('.land_content').removeClass('land_content').addClass('navbar-fixed');
	}

});