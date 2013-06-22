
$(document).ready(function() {

  // smooth menu transition
  $('.top-menu, .footer-menu').onePageNav();
  
  // Subscription form
  $('form#newsletter').submit(function(){
    $.post('newsletter.php', $(this).serialize(), function(data){
      
      $('form#newsletter').fadeIn();
      $('section#newsletter').html(data);
    });				
    return false;
  });
  
});
