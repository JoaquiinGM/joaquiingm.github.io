/* Service Worker */
if('serviceWorker' in navigator){
    console.log("Puedes usar los ServiceWorker");
}else{
    console.log("NO  SE  PUEDE");
}
navigator.serviceWorker.register('./sw.js')
.then(res => console.log('service Worker cargado correctamente', res))
.catch(err=> console.log('service Worker no se pudo registar', err));

/* Scroll Suavizado */

$(document).ready(function(){

    $("#menu a").click(function(e){
        e.preventDefault();

        $("html, body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
}); 