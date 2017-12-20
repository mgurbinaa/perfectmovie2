  window.fbAsyncInit = function() {
    FB.init({
      appId      : '527488130923668',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.10'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    if(response.status == 'connected'){
      dataRequest();
    }
    else{
      FB.login(function(response){
        if(response.status === 'connected'){
          dataRequest();
        }
      });
    }
  });
}

function dataRequest(){
FB.api('/me', 
        {fields: "id,about,age_range,picture,bio,birthday,context,email,first_name,gender,hometown,link,location,middle_name,name,timezone,website,work"}, 
        function(response) {
          localStorage.setItem('user', response.mail);
          localStorage.setItem('name', response.name);
        }
    );
}




function onButtonClick() {
  // Add this to a button's onclick handler
  FB.AppEvents.logEvent("sentFriendRequest");
}
  