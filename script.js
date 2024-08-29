// Joel Manley
// Pokémon search App

// JUST NEED TO ADD EVOLUTION CHECK AND LINK THEN PORTFOLIO READY

// get all necessary document elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

const resultsContainer = document.getElementById("results-container");
const pokemonNameElement = document.getElementById("pokemon-name");
const pokemonIdElement = document.getElementById("pokemon-id")
const weightElement = document.getElementById("weight");
const heightElement = document.getElementById("height");
const imgElement = document.getElementById("pokemon-image");
const typesElement = document.getElementById("types");
const linkContainer = document.getElementById("link-container");

const hpElement = document.getElementById("hp");
const attackElement = document.getElementById("attack");
const defenseElement = document.getElementById("defense");
const spAttackElement = document.getElementById("special-attack");
const spDefenseElement = document.getElementById("special-defense");
const speedElement = document.getElementById("speed");

const clearDisplay = () => {
    resultsContainer.style.visibility = "hidden";
    pokemonIdElement.textContent = "";
    pokemonNameElement.textContent = "";
    weightElement.innerText = "Weight: ";
    heightElement.innerText = "Height: ";
    hpElement.innerText = "";
    attackElement.innerText = "";
    defenseElement.innerText = "";
    spAttackElement.innerText = "";
    spDefenseElement.innerText = "";
    speedElement.innerText = "";
    linkContainer.removeChild(document.getElementById("bulbapedia-link"));
}

// add button with event listener to show shiny
const addShinyButton = (defaultUrl, shinyUrl) => {
    const shinyBtn = document.createElement("button");
    shinyBtn.style.display = "flex";
    shinyBtn.style.marginLeft = "auto";
    shinyBtn.style.backgroundColor = "#9370db";
    shinyBtn.style.padding = "10px";
    shinyBtn.textContent = "Show Shiny Form";

    let isShiny = false;
    shinyBtn.addEventListener("click", () => {
        isShiny = !isShiny;
        document.getElementById("sprite").src = isShiny ? shinyUrl : defaultUrl;
        shinyBtn.textContent = isShiny ? "Show default form" : "Show shiny form";
    })
    return shinyBtn;
}


// asynchronous function to retrieve data from the PokeAPI proxy
const fetchData = async () => {
    try {
        const nameOrId = searchInput.value.toLowerCase();
        const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${nameOrId}`);
        const data = await res.json();
        //console.log(data);
        // set pokemon info
        const spriteUrl = data.sprites.front_default;
        const shinySpriteUrl = data.sprites.front_shiny;
        const bulbUrl = `https://bulbapedia.bulbagarden.net/wiki/${data.name}_(Pok%C3%A9mon)`

        resultsContainer.style.visibility = "visible";
        pokemonIdElement.textContent = `${data.id}`;
        pokemonNameElement.textContent = `${data.name.toUpperCase()}`
        weightElement.innerText += ` ${data.weight}`;
        heightElement.innerText += ` ${data.height}`;

        typesElement.innerHTML = data.types.map(obj => `<span class="type ${obj.type.name}">${obj.type.name}</span>`).join(' ');
        hpElement.innerText = `${data.stats[0].base_stat}`;
        attackElement.innerText = `${data.stats[1].base_stat}`;
        defenseElement.innerText = `${data.stats[2].base_stat}`;
        spAttackElement.innerText = `${data.stats[3].base_stat}`;
        spDefenseElement.innerText = `${data.stats[4].base_stat}`;
        speedElement.innerText = `${data.stats[5].base_stat}`;
        imgElement.innerHTML = `<img id="sprite" src="${spriteUrl}" alt="${data.name} front default sprite">`
        imgElement.appendChild(addShinyButton(spriteUrl, shinySpriteUrl));

        // add link to bulbapedia entry
        const bulbLink = document.createElement("a");
        bulbLink.id = "bulbapedia-link";
        bulbLink.innerText = "Bulbapedia Entry";
        bulbLink.target = "_blank";
        bulbLink.href = bulbUrl;
        bulbLink.style.display = "block";
        bulbLink.style.textAlign = "center";
        bulbLink.style.padding = "10px";
        bulbLink.style.borderStyle = "none";
        linkContainer.appendChild(bulbLink);
    }

    catch(err){
        console.log(err);
        alert("Pokémon not found");
    }
}

// event listener for the search button and enter key
searchBtn.addEventListener("click", ()=>{
    if (resultsContainer.style.visibility === "visible"){
        clearDisplay();

    }
    fetchData();
    searchInput.value = "";
});

document.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
        e.preventDefault();
        searchBtn.click();
    }
})