"use strict";



const fetchCountries = async function () {
    try {
        const countriesJson = "data.json"
        const response = await fetch(countriesJson)
        if (!response.ok) {
            throw new Error("error fetching requests")
        }
        const data = await response.json();
        return data
    } catch {
        console.log('error fetching data')
        throw error;
    }

}

function htmlGenerator(data) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) {
        console.error('mainContent does not exist');
        return;
    }

    mainContent.innerHTML = '';

    if (typeof data === 'string') {
        mainContent.innerHTML +=
            `<div class="error-message">${data}</div>`
    } else {
        data.forEach((country) => {
            mainContent.innerHTML +=
                `<div class="flags">
                <img src="${country.flags.svg}" alt="${country.name + ' flag'}">
                <div class="flags-info">
                    <h2>${country.name}</h2>
                    <span>Population:<p> ${country.population} </p></span>
                    <span>Region: <p> ${country.region} </p></span>
                    <span>Capital:<p> ${country.capital} </p></span>
                </div>
                </div>`;
        });
    }

}



const selectedRegion = document.getElementById("region");


selectedRegion.addEventListener("change", function () {
    const selectedRegions = selectedRegion.value;
    main(selectedRegions);
});


const querySearch = document.getElementById("country-search");
querySearch.addEventListener("change", function () {
    const inputText = querySearch.value;
    main(undefined, inputText);
});


querySearch.addEventListener("input", function () {
    const inputText = querySearch.value;

    // main(undefined, inputText);

    clearTimeout(querySearch.timer);


    querySearch.timer = setTimeout(function () {
        recommendationMain(inputText);
    }, 100);
});

async function main(selectedRegions, inputText) {
    try {
        const data = await fetchCountries();
        let filteredData;

        if (!data) {
            filteredData = 'Data is not available';
            return;
        }


        if (selectedRegions === undefined || selectedRegions === "all") {
            filteredData = data;
        } else if (selectedRegions) {
            filteredData = data.filter(country => country.region === selectedRegions);
        }
        if (inputText && inputText !== "") {
            filteredData = data.filter(country => country.name.toLowerCase() === inputText.toLowerCase());
        }
        if (filteredData.length === 0) {
            filteredData = `${inputText} was not found try another country`
        }
        htmlGenerator(filteredData);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function recommendationMain(inputText) {
    try {
        const data = await fetchCountries();

        if (!data) {
            filteredData = 'Data is not available';
            return;
        }
        if (inputText) {
            const filteredData = data.filter(country =>
                country.name.toLowerCase().includes(inputText.toLowerCase())
            );
            populateRecommendations(filteredData);
        } else {
            populateRecommendations([])
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
}
function populateRecommendations(recommendations) {
    const recommendationFlags = document.getElementById("recommendation-flags");

    if (!recommendationFlags) {
        console.error('recommendationFlags does not exist');
        return;
    }

    recommendationFlags.innerHTML = '';
    if (recommendations.length === 0) {
        recommendationFlags.style.display = "none";
    } else {
        recommendations.forEach((recommendation) => {
            recommendationFlags.style.display = "block";
            recommendationFlags.innerHTML += `<li class="recommended-flag">${recommendation.name}</li>`;
        });
    }

    recommendationFlags.addEventListener("click", function (event) {
        if (event.target.classList.contains("recommended-flag")) {
            querySearch.value = event.target.textContent;
            querySearch.dispatchEvent(new Event("change"))
            recommendationFlags.style.display = "none";
        }
    });
}

main();
