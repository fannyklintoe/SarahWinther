let billedArray;
let galleri_taeller = -1;

window.addEventListener("DOMContentLoaded", start);

const urlParams = new URLSearchParams(window.location.search);

let smykker = [];
let filter = "alle";

let filterKnapper = document.querySelectorAll("#sidebar button");

let forhandlere = [];

function start() {
    console.log("start");

    hentHeader();
    hentFooter();

    if (document.querySelector("#forside")) {
        hentForsideJson();
    }

    if (document.querySelector("#shop")) {
        startShop();
    }

    if (document.querySelector("#product")) {
        hentProduktData();
        document.querySelector(".prev").addEventListener("click", klikPrev);
        document.querySelector(".next").addEventListener("click", klikNext);

    }

    if (document.querySelector("#about")) {
        hentAboutJson();
        hentStudioData();
    }

    if (document.querySelector("#studio")) {
        hentStudioData();
    }

    if (document.querySelector("#forhandler")) {
        hentForhandlerData();
    }
}

async function hentHeader() { //her hentes headeren fra header.html
    const headerMenu = await fetch("inc/header.html");
    const headerIncluding = await headerMenu.text();
    document.querySelector("header").innerHTML = headerIncluding;
    console.log("header vises");

    document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}
async function hentFooter() { //her hentes footeren fra footer.html
    const footer = await fetch("inc/footer.html");
    const footerIncluding = await footer.text();
    document.querySelector("footer").innerHTML = footerIncluding;
    console.log("footer vises");
}

function toggleMenu() { //denne funktionen får burgermenuen til at virke
    console.log("toggleMenu");
    document.querySelector("#menu").classList.toggle("hidden"); //menuen skjules hvis den er vist og vises hvis den er skujt ved klik

    let erSkjult = document.querySelector("#menu").classList.contains("hidden"); //kontantes erSkjult defineres som værende når menuen er skjult med klassen hidden

    if (erSkjult == true) { // hvis erSkjult er sandt skal menuknappen vise ikon med tre vandrette striber komme frem og alle klasser fjernes fra #burgermenu
        document.querySelector("#menuknap").textContent = "☰";
        document.querySelector("#burgermenu").classList = "";
    } else { // hvis erSkjult ikke er sandt skal menuknappen være et x og burgermenuen skjules med klassen hidden
        document.querySelector("#menuknap").textContent = "X";
        document.querySelector("#burgermenu").classList = "hidden";
    }
}

//// Her starter js til Forsiden

async function hentForsideJson() {
    console.log("starter forsiden")

    const response = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/pages/82");
    console.log(response);
    side = await response.json();
    console.log(side);
    visForsideJson();
}

function visForsideJson() {
    document.querySelector("#forside_txt").innerHTML = side.content.rendered;
}

/////// Her starter js til shoppen

function startShop() {
    console.log("start shop");
    document.querySelector("button[data-kategori='alle']").classList.add("valgt");
    console.log("ert ert w3r ", urlParams, filter, document.querySelector(`button[data-kategori="${filter}"]`));


    if (urlParams.get("kategori")) {
        filter = urlParams.get("kategori");
        //document.querySelector("button[data-kategori='"+filter+"']").classList.add("valgt");

        document.querySelector(".valgt").classList.remove("valgt");
        document.querySelector(`button[data-kategori="${filter}"]`).classList.add("valgt");

    }
    //let filter = kategori;

    //filtrer();
    hentShopData();

    filterKnapper.forEach(knap =>
        knap.addEventListener("click", filtrer));
}

function filtrer() {
    console.log("filtrer", this);

    document.querySelector(".valgt").classList.remove("valgt");


    this.classList.add("valgt");
    filter = this.dataset.kategori;



    console.log(filter, this.dataset.kategori, this.classList);

    visShopData();
}

async function hentShopData() {

    let shopData = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/smykke");

    smykker = await shopData.json();

    visShopData();
}

function visShopData() {

    console.log("viser data")

    const skabelon = document.querySelector("template").content;
    const liste = document.querySelector("#liste");

    liste.textContent = "";

    smykker.forEach(smykke => {
        if (smykke.kategori == filter || filter == "alle") {
            const klon = skabelon.cloneNode(true);

            klon.querySelector("#shop_img").src = smykke.billede_1.guid;

            klon.querySelector("#shop_h2").textContent = smykke.title.rendered;

            liste.appendChild(klon);

            liste.lastElementChild.addEventListener("click", () => {
                location.href = `product.html?id=${smykke.slug}`;
            })

        }

    })
}

/// Her starter js til produkt siden

async function hentProduktData() {
    const response = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/smykke");
    smykker = await response.json();
    visProduktData();
}

function visProduktData() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get("id");
    console.log(slug);

    smykker.forEach(smykke => {
        if (smykke.slug == slug) {

            document.querySelector("#produkt_titel").textContent = smykke.title.rendered;

            document.querySelector("#produkt_beskrivelse").textContent = smykke.beskrivelse;

            document.querySelector("#produkt_fragt").textContent = smykke.fragt;

            document.querySelector("#produkt_pris").textContent = "Pris: " + smykke.pris + " DKK";

            billedArray = smykke.billeder;
            klikNext();
        }
    })

    document.querySelector(".luk").addEventListener("click", () => {
        history.back();
    })
}

function klikNext() {
    console.log(klikPrev);
    galleri_taeller++;
    if (galleri_taeller == billedArray.length) {
        galleri_taeller = 0;
    }
    document.querySelector(".product_billede").src = billedArray[galleri_taeller].guid;

}

function klikPrev() {
    console.log(klikPrev);
    galleri_taeller--;

    if (galleri_taeller < 0) {
        galleri_taeller = billedArray.length - 1;
    }

    document.querySelector(".product_billede").src = billedArray[galleri_taeller].guid;

}

//// Her starter js til om siden

async function hentAboutJson() {
    console.log("starter about")

    const response = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/pages/66");
    console.log(response);
    side = await response.json();
    console.log(side);
    visAboutJson();
}

function visAboutJson() {
    document.querySelector("#about_txt").innerHTML = side.content.rendered;
}

/// Her starter js til Studio siden

async function hentStudioData() {
    console.log("henter studio tekst");

    const response = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/pages/102");
    console.log(response);
    side = await response.json();
    console.log(side);
    visStudioData();
}

function visStudioData() {
    document.querySelector("#studio_txt").innerHTML = side.content.rendered;
}

/// Her starter js til retailers siden

async function hentForhandlerData() {

    console.log("henter forhandlere");

    let forhandlerData = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/forhandler");

    forhandlere = await forhandlerData.json();

    console.log(forhandler);

    visForhandlerData();
}

function visForhandlerData() {

    const forhandlerListe = document.querySelector("#forhandler_liste");

    const skabelon = document.querySelector("#forhandler_skabelon").content;

    console.log("viser data")
    console.log(forhandler);
    console.log(skabelon);
    console.log(forhandlerListe);

    forhandlere.forEach(forhandler => {
        const forhandler_klon = skabelon.cloneNode(true);
        console.log(forhandler_klon);
        forhandler_klon.querySelector("#forhandler_titel").textContent = forhandler.navn;
        forhandler_klon.querySelector("#forhandler_adresse").textContent = forhandler.adresse;

        forhandler_klon.querySelector("#forhandler_land").textContent = forhandler.land;
        forhandler_klon.querySelector("#forhandler_link").href = forhandler.link;

        forhandler_klon.querySelector("#forhandler_link").textContent = "Forhandlers hjemmeside";

        forhandlerListe.appendChild(forhandler_klon);
    })

}
