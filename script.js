window.addEventListener("DOMContentLoaded", start);

function start() {
    console.log("start");
    hentHeader();
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
        document.querySelector("#menuknap").textContent = "✘";
        document.querySelector("#burgermenu").classList = "hidden";
    }
}
