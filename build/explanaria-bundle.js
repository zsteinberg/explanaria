window.addEventListener("load", function(){
    document.body.innerHTML = "<h1 style='font-size: 3em;'>Redirecting...</h1>"

    let oldLocation = window.location.href;
    let redirectedLocation = window.location.href.replace("zsteinberg.github.io/explanaria", 
     "explanaria.github.io");
    if(oldLocation == redirectedLocation){
        window.location.replace("https://explanaria.github.io");
    }else{
        window.location.replace(redirectedLocation);
    }

});
