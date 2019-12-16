let billedArray;
let galleri_taeller = -1;

window.addEventListener("DOMContentLoaded", start);

const urlParams = new URLSearchParams(window.location.search);
let smykker = [];
let filter = "alle";
let filterKnapper = document.querySelectorAll("#sidebar button");
const skabelon = document.querySelector("template").content;
const liste = document.querySelector("#liste");

function start() {
    console.log("start");

    hentHeader();
    hentFooter();

    if (document.querySelector("#shop")) {
        startShop();
    }

    if (document.querySelector("#forside")) {
        hentForsideJson();
    }

    if (document.querySelector("#product")) {
        hentProduktData();
        document.querySelector(".prev").addEventListener("click", klikPrev);
        document.querySelector(".next").addEventListener("click", klikNext);

    }

    if (document.querySelector("#about")) {
        hentAboutJson();
    }

    if (document.querySelector("#studio")) {
        hentStudioData();
    }
}

async function hentHeader() {
    const headerMenu = await fetch("inc/header.html");
    const headerIncluding = await headerMenu.text();
    document.querySelector("header").innerHTML = headerIncluding;
    console.log("header vises");

    document.querySelector("#menuknap").addEventListener("click", toggleMenu);
}
async function hentFooter() {
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

////////////////////////////////////////////////////////////////////////////////////////////////////////
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

async function hentStudioData() {
    console.log("henter studio tekst");

    const response = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/pages/102");
    console.log(response);
    side = await response.json();
    console.log(side);
    visStudioData();
}

function visStudioData() {
    document.querySelector("h3").textContent = side.title.rendered;
    document.querySelector("#studio_txt").innerHTML = side.content.rendered;
}
