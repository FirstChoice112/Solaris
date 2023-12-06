// 1. Skapa HTML och CSS struktur för båda sidorna.
// 2. Hover effekt för alla planeter med namnet.
// 3. API, Get/Post request. Namn.namnGrekiskt.infoText.Omkrets.KMfrånSolen.MaxTemperatur.MinTemperatur.Månar.
// 4. Skapa functions för att få informationen
// 5. Skapa functions för DOM att rendera API informationen ovanför på en ny sida.
// 6. Rendera stjärnsystem i sida 2 med API informationen.

// Tisdag
// 1. Fixa en function som renderar och namger id'n HTML taggarna i renderade sidan.? GitHub först!
// 4. Gå igenom JavaScript
// 5. Ladda upp på Github
// 6. Öva fram en presentation
// 7. Plocka ur alla variabeldeklarationer och lägg dem längst upp på sidan

/********************Hämta API nyckeln************************/
async function myApi() {
  try {
    const response = await fetch(
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys",
      {
        //Gör en HTTP POST request till en specifik URL. POST används för att skicka data till en server och skapa en ny resurs.
        method: "POST",
      }
    ); //Om requesten inte är bra, ge mig ett error
    if (!response.ok) {
      throw new Error(
        `Error fetching the motherfucking API. status: ${response.status}`
      );
    } //Om requesten är bra, gör om svaret till en JSON fil
    const data = await response.json();
    return data.key; //Retunera API nyckeln från JSON datan
  } catch (error) {
    //Om det uppstår error när jag försöker hämta nyckeln kommer det ut här.
    console.error("Error during the API request:", error);
    throw error;
  }
}

/********************Med nyckeln, hämta info************************/
myApi() //Kalla på function för Nyckeln
  .then((result) => console.log(result)) //När promiset är löst, logga resultat eller error.
  .catch((error) => console.error(error));

//Function för att plocka ut information
async function getInfoFunction(planetId) {
  try {
    const apiKey = await myApi(); //Vänta på promise att hämta API nyckel
    const apiUrl = //Definiera API URL för att hämta information om planeterna
      "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";
    const response = await fetch(apiUrl, {
      //GET request till API med fetch. GET används för att hämta data från en specifik resurs.
      method: "GET",
      headers: { "x-zocom": apiKey }, //Lägger in vår funna API nyckel i requesten
    });

    if (!response.ok) {
      //Loggar fel i response status
      throw new Error(
        `Error during the motherfucking request. Status: ${response.status}`
      );
    }
    //Om responsen är ok, översätt till JSON
    const data = await response.json();
    console.log("Received data from API:", data);
    //Ta information om specifika planeter genom planetId
    const planetInfo = data.bodies[planetId];
    console.log("Selected planetInfo:", planetInfo);
    //Returnerar information om vald planet
    return planetInfo;
    // Loggar eventuella fel i try blocket.
  } catch (error) {
    console.error("General motherfucking Error:", error);
    throw error;
  }
}

// Click event för planeter, väntar tills DOMen är laddat innan function går in
document.addEventListener("DOMContentLoaded", function () {
  //Refererar till ID på planeten från sidan
  const rendered__planet = document.getElementById("rendered__planet");
  //Refererar till classer på planeterna
  const planets = document.querySelectorAll(
    ".sun, .merkurius, .venus, .earth, .mars, .jupiter, .saturnus, .uranus, .neptunus"
  );
  //Loopa igenom varje planet elementen i index ordning och lägger till en click/eventlistener
  planets.forEach((planet, index) => {
    planet.addEventListener("click", async function (event) {
      try {
        event.stopPropagation(); //Förhindrar eventet från att öka i DOM hierkin. Stoppar andra eventListeners från att gå in.

        //Kallar på function renderPlanetInformation
        const planetInfo = await getInfoFunction(index);
        renderplanet__information(planetInfo);
        //Kallar på functionen changeEnlargedPlanetColor för att byta färg
        changerendered__planetColor(rendered__planet, planet);
        //Kalla på function att byta sida
        togglePage();
      } catch (error) {
        console.error("Error fetching planet information:", error);
      }
    });
  });
  //Lägger till click/ eventListener för hela documentet
  document.addEventListener("click", function () {
    //Byt sidan när du klickar var som helst i documentet.
    togglePage();
  });
});

//Function för att planeten ska ändra färg när den renderas
function changerendered__planetColor(rendered__planet, planet) {
  const colorClass = planet.classList[0];
  //Hämta färgen från planet classen
  const planetColor = getComputedStyle(
    document.querySelector(`.${colorClass}`)
  ).backgroundColor;
  //Använd färgen på enlargedPlanet
  rendered__planet.style.backgroundColor = planetColor;

  //Uppdatera ringarna till planeten
  const rings = document.querySelectorAll(
    `.${colorClass}::before, .${colorClass}::after`
  );
  rings.forEach((ring) => {
    ring.style.background = planetColor;
  });
}

// Function to render planet information
function renderplanet__information(planetInfo) {
  if (planetInfo) {
    document.getElementById("planet__header").textContent =
      planetInfo.name || "n/a";
    document.getElementById("planet__latin").textContent =
      planetInfo.latinName || "n/a";
    document.getElementById("planet__information").textContent =
      planetInfo.desc || "n/a";
    document.getElementById("circumference").textContent =
      planetInfo.circumference || "n/a";
    document.getElementById("distance").textContent =
      planetInfo.distance || "n/a";
    document.getElementById("max__temperature").textContent =
      planetInfo.temp?.day || "n/a";
    document.getElementById("min__temperature").textContent =
      planetInfo.temp?.night || "n/a";
    document.getElementById("moons").textContent = planetInfo.moons
      ? planetInfo.moons.join(", ")
      : "n/a";
  } else {
    console.error("Invalid planet information:", planetInfo);
  }
}
// Toggle page function från Solaris till plaetInfo
function togglePage() {
  const wrapper = document.querySelector(".wrapper");
  const planet__wrapper = document.getElementById("planet__content");

  if (wrapper.style.display !== "none") {
    wrapper.style.display = "none";
    planet__wrapper.style.display = "flex";
  } else {
    wrapper.style.display = "flex";
    planet__wrapper.style.display = "none";
  }
}
getInfoFunction();

/********Stjärnhimel**********/
const wrapper = document.querySelector(".wrapper3");
//Rendera 100 stjärnor över hela sidan random.
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.classList.add("stars");
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `${Math.random() * 100}vh`;
  wrapper.appendChild(star);
}

/********Function för att gömma -planetInfo-**********/
document.addEventListener("DOMContentLoaded", function () {
  var html2Content = document.getElementById("planet__content");
  if (html2Content) {
    html2Content.style.display = "none";
  }
});
