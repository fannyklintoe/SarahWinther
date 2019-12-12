window.addEventListener("DOMContentLoaded", start);

let smykker = [];
let filter = "alle";
let filterKnapper = document.querySelectorAll("#sidebar button");
const skabelon = document.querySelector("template").content;
const liste = document.querySelector("#liste");

function start() {
    console.log("start");

    hentHeader();

    if (document.querySelector("#shop")) {
        startShop();
    }

    if (document.querySelector("#forside")) {
        hentForsideJson();
    }
}

async function hentHeader() {
    const headerMenu = await fetch("inc/header.html");
    const headerIncluding = await headerMenu.text();
    document.querySelector("header").innerHTML = headerIncluding;
    console.log("header vises");

    document.querySelector("#menuknap").addEventListener("click", toggleMenu);
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

function startShop() {
    console.log("start shop");

    hentShopData();

    filterKnapper.forEach(knap =>
        knap.addEventListener("click", filtrer));
}

function filtrer() {
    console.log("filtrer");

    document.querySelector(".valgt").classList.remove("valgt");
    this.classList.add("valgt");
    filter = this.dataset.kategori;

    visShopData();
}

async function hentShopData() {

    let shopData = await fetch("http://jenniferjaque.dk/kea/2-semester/eksamen/sarahwinther_wp/wordpress/wp-json/wp/v2/smykke");

    smykker = await shopData.json();

    visShopData();
}

function visShopData() {

    console.log("viser data")

    smykker.forEach(smykke => {
        if (smykke.categories == filter || filter == "alle") {
            const klon = skabelon.cloneNode(true);

            klon.querySelector("#shop_img").src = smykke.billede_1;

            klon.querySelector("#shop_h2").textContent = smykke.beskrivelse;
        }

    })
}
