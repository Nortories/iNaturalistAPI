document.getElementById("searchButton").addEventListener("click", async () => {
  const placeName = document.getElementById("placeInput").value;
  if (!placeName) {
    alert("Please enter a place name.");
    return;
  }

  /* TODO get autocomplete working*/

  //   const placesResponse = await fetch(
  //     `https://api.inaturalist.org/v1/places/autocomplete?q=${placeName}`
  //   );
  //   const placesData = await placesResponse.json();
  //   if (placesData.results.length === 0) {
  //     alert("No places found. Please try a different search.");
  //     return;
  //   }
  //   const placeId = placesData.results[0].id;

  // Request identifications for the selected place
  const placeData = await fetch(
    `https://api.inaturalist.org/v1/places/autocomplete?q=${placeName}`
  );
  const placeDataResponse = await placeData.json();
  const placeId = placeDataResponse.results[0].id;
  console.log(placeId);

  const searchResponse = await fetch(
    `https://api.inaturalist.org/v1/identifications?current=true&place_id=${placeId}&per_page=10&order=desc&order_by=created_at`
  );

  const searchData = await searchResponse.json();

  if (searchData.results.length === 0) {
    alert("No results found. Please try a different search.");
    return;
  } else {
    const resultsContainer = document.getElementById("resultsContainer");
    resultsContainer.innerHTML = ""; // Clear previous results
    searchData.results.forEach((result) => {
      // Skip results without photos
      if (!result.observation.photos[0]) {
        return;
      }
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
                    <h3>${result.observation.species_guess}</h3>
                    ${`<img src="${result.observation.photos[0].url}" alt="${result.observation.species_guess}">`}
                    ${
                      result.observation.description
                        ? `<p>Observer description: ${result.observation.description}</p>`
                        : "<p>No Description</p>"
                    }
            `;
      resultsContainer.appendChild(div);
    });
  }
});
