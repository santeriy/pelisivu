// Kysymykset alustetaan globaaliin scopeen
var kysymykset = [
    "Santerivisa/kysymys1.html",
    "Santerivisa/kysymys2.html",
    "Santerivisa/kysymys3.html",
    "Santerivisa/kysymys4.html",
    "Santerivisa/kysymys5.html",
    "Santerivisa/kysymys6.html",
    "Santerivisa/kysymys7.html",
    "Santerivisa/kysymys8.html",
    "Santerivisa/kysymys9.html",
    "Santerivisa/kysymys10.html"
];

// Muuttujat alustetaan globaaliin scopeen.
var kysymysnumero = 0;
var progress = 1;
var showprogress = false;
var loppu = "Santerivisa/info.html";
var kysymysnumero = 0;
var tiedosto = null;
var oikeita = 0;

// Täällä kutsutaan kaikki SIVUN LATAUKSEN AIKAISET ASIAT
$(document).ready(function() {
// Itse tehty sovelluksen alustus-funktio --> init();
    aloitaVisanappi();
});

function aloitaVisanappi() {
    $("#painike").click(function() {
        init();
    });
}

function init() {
    // Kutsutaan täällä kaikkea mitä oletetaan tarvittavan lähtökohtaisesti ohjelmassa
    alustaPeli(); // alustetaan peli funktio.
    seuraavaKysymys(); // seuraava kysymys funktio.
    bindcontrols(); // jos kysymyksiä jäljellä niin aktivoidaan kontrolli.

}

function naytaMitalli() {

var palkintoteksti = "";

    if (oikeita <= 4) {
        $(".palkinto").attr("src", "img/pronssi1.png"); // tulostetaan palkinto classille pokaali
        palkintoteksti = "Sait palkinnoksi pronssipokaalin! Et taida seurata hirveästi urheilua?";
    }

    else if (oikeita > 4 && oikeita < 8) {
        $(".palkinto").attr("src", "img/hopea1.png"); // tulostetaan palkinto classille pokaali
        palkintoteksti = "Sait palkinnoksi hopeapokaalin! Taidat seurata urheilua jonkun verran.";
    }
    
    else {
        $(".palkinto").attr("src", "img/kulta1.png"); // tulostetaan palkinto classille pokaali
        palkintoteksti = "Onnittelut sait palkinnoksi kultapokaalin! Urheilu on selvästi sinulle tärkeä asia ja seuraat sitä paljon!";
    }

$("#terve").append(palkintoteksti); // tulostetaan palkintoteksti ID:lle #terve.

    
}

function getRndInteger(min, max) {
    //luvun arvonta funktio.
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function aloitaAlusta() {
    $("#painike").off("click"); // poistetaan ID:ltä #painike click.

    $("#painike").click(function() {
    
        if (kysymykset.length === 0) { // jos kysymykset taulukossa ei ole kysymyksiä.
            ajaxGetData(loppu); // haetaan muuttuja loppu

            $("#painike").html("Aloita alusta"); // Muutetaan painikkeen teksti.
            $(".progress").attr("hidden", true); // progressbarin pidetään hiddeninä.
            $('#painike').click(function() {
                window.location.reload("Urheiluvisa.html"); // ladataan sivu uudestaan.
            });
        }
    });
}

function tyhjaaMuuttujat() {
    kysymysnumero = 0;
    progress = 1;
    showprogress = false;
    kysymysnumero = 0;
    oikeita = 0;
    $("#painike").off();

}

function haeLista(requestUrl) {
    // tällä funktiolla tehdään ajaxpyyntö.
    $.ajax({
        url: requestUrl,
        type: 'GET',
        success: function(res) {
            $("#visa").html(res);
            console.log("Hain listan visaan!");
            bindcontrols();
        }
    });
}

function alustaPeli() {
  // tällä funktionilla alustetaan peli.
    tyhjaaMuuttujat();
// luodaan käsky milloin progressbar tuodaan esille.
    if (!showprogress) {
        $(".progress").removeAttr("hidden"); 
        console.log("näytä progress: " + showprogress);
        showprogress = true;
    }
    // arvotaan kysymys.
    kysymysnumero = getRndInteger(0, kysymykset.length - 1); 
    tiedosto = kysymykset[kysymysnumero]; 
    haeLista(tiedosto); // haetaan lista

    kysymykset.splice(kysymysnumero, 1); // poistetaan käytetty kysymys taulukosta.

}

function seuraavaKysymys() {

    $("#painike").html("Seuraava"); // vaihdetaan buttonin teksti.

    $("#painike").click(function() {

        if (kysymykset.length > 0) {
            // jos kysymyksiä jäljellä niin aktivoidaan kontrolli.
            // bindcontrols();

            kysymysnumero = getRndInteger(0, kysymykset.length - 1);
            tiedosto = kysymykset[kysymysnumero];

            kysymykset.splice(kysymysnumero, 1);
            haeLista(tiedosto);

            progress++;
            $(".progress-bar").css("width", (progress * 10) + "%"); // lisätään progressbarin widthiä kun kaikki oikein.
        }
        // jos ei kysymyksiä niin aloitetaan alusta
        if (kysymykset.length === 0) {
            //$(".progress").attr("hidden", true);
            aloitaAlusta();
        }
    });
}

// Luodaan clickkitapahtuma ja estetään jos vastaus on annettu.
function bindcontrols() {
    $('.klikkaa').on('click', function() {

        console.log("CLICKED!");

        var vastaus = $(this).attr("data-vastaus");
        if (vastaus === "1") {
            oikeita++;
            $(this).addClass("oikein");
        }
        else {
            $(this).addClass("vaarin");
        }
// estetään klikkaukset, kun on vastattu.
        var esta = $(".klikkaa");
        estaVastaus(esta);
    });

}

// Klikkitapahtuman poistava funktio.
function estaVastaus(elementti) {
    
    $(".klikkaa").off();
}


//jQueryn ajaxfunktio käärittynä omaksi funktioksi.
function ajaxGetData(requestUrl) {
    $.ajax({
        url: requestUrl,
        type: 'GET',
        success: function(res) {
            $("#visa").html(res);
            $("#oikeita").html(oikeita);
            console.log(oikeita);
            naytaMitalli();
        }
    });
}