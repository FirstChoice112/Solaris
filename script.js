// SOLARIS: Jag började med att skapa två stycken HTML sidor som jag strukturerade upp och stylade med css. När det var gjort slog jag ihop dom och sade ID'n för att styra dem med JavaScript. Därefter började jag att bygga upp olika functions. Jag hade från start stjärnorna gjorda i css med linear-gradient men uppdaterade den senare till en js-function. Har en @mediaQuery på 1547px (när neptunus försvinner) som minskar solen och avståndet mellan planeterna, detsamma gäller för den renderade sidan.
//När jag gjorde star wars uppgiften gjorde jag en jätte-function som gick över hela sidan, här har jag försökt separera alla functions och avsluta med en 'huvud'-function som kallar på det övriga. -Johan Skoog

//*******************PSEUDOKOD**********************************/
// 1. Skapa HTML och CSS struktur för båda sidorna.
// 2. Hover effekt för alla planeter med namnet.
// 3. API, Get/Post request, hitta nyckel och hämta.
// 4. Skapa functions för att få informationen renderad.
// 5. Skapa functions för att rendera API informationen ovanför på en ny sida.
// 6. Rendera stjärnsystem i sida 2 med API planet informationen.

/********************Deklaration för API************************/
const apiKeysUrl =
  "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys";
const apiBodiesUrl =
  "https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies";

/******************** Hämta API nyckeln ************************/
//Gör en HTTP POST request till en specifik URL, i detta fall att hämta data.key. POST används för att skicka data till en server och skapa en ny resurs.

async function myApi() {
  try {
    const response = await fetch(apiKeysUrl, {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`Error fetching the API. status: ${response.status}`);
    }
    const data = await response.json();
    return data.key;
  } catch (error) {
    console.error("Error during the API request:", error);
    throw error;
  }
}

/******************** Hämta information om planeterna *********/
//GET request till API med fetch. GET används för att hämta data från en specificerad 'resurs', lägger här in den funna API nyckel 'x-zocom' i requesten. Definiera API URL för att hämta information om planeterna.

async function getInfoFunction(planetId) {
  try {
    const apiKey = await myApi();
    const apiUrl = apiBodiesUrl;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "x-zocom": apiKey },
    });

    if (!response.ok) {
      throw new Error(`Error during the request. Status: ${response.status}`);
    }
    const data = await response.json();
    const planetInfo = data.bodies[planetId];
    return planetInfo;
  } catch (error) {
    console.error("General Error:", error);
    throw error;
  }
}

/******** Function för att gömma -planetInfo- ******************/
//Döljer planet__content när man öppnar sidan.

document.addEventListener("DOMContentLoaded", function () {
  var rendered__Content = document.getElementById("planet__content");
  if (rendered__Content) {
    rendered__Content.style.display = "none";
  }
});

/******************** Rendera informationen ************************/
//Renderar in informationen från GetInfoFunction på rätt ställe.

function renderPlanet__information(planetInfo) {
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

/********************Ändra planetfärg************************/
//Ändrar färgen på planeten som renderas och lägger till 2 ringar.

function changeRendered__planetColor(rendered__planet, planet) {
  const colorClass = planet.classList[0];
  const planetColor = getComputedStyle(
    document.querySelector(`.${colorClass}`)
  ).backgroundColor;
  rendered__planet.style.backgroundColor = planetColor;
  const rings = document.querySelectorAll(
    `.${colorClass}::before, .${colorClass}::after`
  );
  rings.forEach((ring) => {
    ring.style.background = planetColor;
  });
}

/********************Toogle page function************************/
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

/**************************Stjärnhimel**********************************/
//Genererar 100st random stjärnor på den renderade planet sidan.

const wrapper = document.querySelector(".planet__wrapper");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.classList.add("stars");
  star.style.left = `${Math.random() * 100}vw`;
  star.style.top = `${Math.random() * 100}vh`;
  wrapper.appendChild(star);
}

/******************Clickevent som invoverar våra functions******************/
// Click event för planeter, väntar tills DOMen är laddat innan function går in loopar igenom varje planet elementen i index ordning och lägger till en click/eventlistener. Denna function aktiverar de andra funktionerna.

document.addEventListener("DOMContentLoaded", function () {
  const rendered__planet = document.getElementById("rendered__planet");
  const planets = document.querySelectorAll(
    ".sun, .merkurius, .venus, .earth, .mars, .jupiter, .saturnus, .uranus, .neptunus"
  );

  planets.forEach((planet, index) => {
    planet.addEventListener("click", async function (event) {
      try {
        event.stopPropagation(); //Förhindrar eventet från att öka i DOM hierkin. Stoppar andra eventListeners från att gå in.
        const planetInfo = await getInfoFunction(index);
        renderPlanet__information(planetInfo);
        changeRendered__planetColor(rendered__planet, planet);
        togglePage();
      } catch (error) {
        console.error("Error fetching planet information:", error);
      }
    });
  });
  document.addEventListener("click", function () {
    togglePage();
  });
});
