// Joel Manley
// Pokémon search App


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

const previousEvoContainer = document.getElementById("previous-evo-container");
const nextEvoContainer = document.getElementById("next-evo-container");

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
    previousEvoContainer.innerHTML = ``;
    previousEvoContainer.style.visibility = "hidden";
    nextEvoContainer.innerHTML = ``;
    nextEvoContainer.style.visibility = "hidden";
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

// api pull request to get the evolution chain data for correct pokemon
const getEvoChain = async (url) => {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.chain.evolves_to.species);
    return data.chain;
}

// find the current pokemon in its evolution chain
const findPokemonInChain = (chain, targetName) => {
    if (chain.species.name === targetName) {
        return chain;
    }
    for (let evo of chain.evolves_to) {
        const found = findPokemonInChain(evo, targetName);
        if (found) return found;
    }
    return null;
}

// recursive function to find previous evolution. necessary due to the hierarchical structure of the evolution chain
const getPreviousEvo = (chain, name) => {
    for (let evo of chain.evolves_to){
        // if searched pokemon matches the name in current evolution level then chain represents previous evolution
        if (evo.species.name === name){
            return chain
        }
        // if no match, recursive function call to go deeper into the chain
        const found = getPreviousEvo(evo, name);
        if (found) {
            return found;
        }
    }
    // base case, no further evolutions found and no match
    return null;
}

// return an array containing the names of the previous and next pokemon, or null of there aren't any
const checkEvo = async (pokemonId, pokemonName) => {
    let evoList = [null, null];
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const data = await res.json();
    // get evochain for pokemon
    const evoChain = await getEvoChain(data.evolution_chain.url);
    // get data for the searched pokemon in the evo chain
    const currentMon = findPokemonInChain(evoChain, pokemonName);
    // if found in evo chain
    if (currentMon) {
        const previousMon = getPreviousEvo(evoChain, pokemonName);
        // check for previous pokemon, if there, update array
        if (previousMon){
            evoList[0] = previousMon.species.name;
        }
        // check for next pokemon, if there, update array
        if (currentMon.evolves_to.length > 0) {
            evoList[1] = currentMon.evolves_to[0].species.name;
        }
        return evoList;
    }
    // if not found in evo chain
    return ["Error in this bitch yo"];
}

// Grab the url to the sprite of a pokemon
const fetchEvoImgLink = async (name) => {
    const res = await fetch(`https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${name}`);
    const data = await res.json();
    return data.sprites.front_default;
}

// asynchronous function to retrieve data from the PokeAPI proxy
const fetchData = async (nameOrId) => {
    try {
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

        // get evo data
        const evoList = await checkEvo(data.id, data.name);
        console.log(evoList);

        // add evolution sprites to page if existing, create event listeners to make them buttons
        if (evoList[0]){
            const previousEvoLink = await fetchEvoImgLink(evoList[0]);
            previousEvoContainer.style.visibility = "visible";
            previousEvoContainer.innerHTML = `<h3 id="previous-header">Evolves From</h3><img id="previous-evo-sprite" class="sprite" alt="${data.name} previous evo sprite" src="${previousEvoLink}">`;
            document.getElementById("previous-evo-sprite").addEventListener("click", ()=> {
                clearDisplay();
                fetchData(evoList[0])
            })
        }
        if (evoList[1]){
            const nextEvoLink = await fetchEvoImgLink(evoList[1]);
            nextEvoContainer.style.visibility = "visible";
            nextEvoContainer.innerHTML = `<h3 id="next-header">Evolves Into</h3></p><img id="next-evo-sprite" alt="${data.name} next evo sprite" src="${nextEvoLink}">`;
            document.getElementById("next-evo-sprite").addEventListener("click", () => {
                clearDisplay();
                fetchData(evoList[1])
            });
        }
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
    fetchData(searchInput.value.toLowerCase());
    searchInput.value = "";
});

// event listener for enter key to call search function
document.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
        e.preventDefault();
        searchBtn.click();
    }
})
