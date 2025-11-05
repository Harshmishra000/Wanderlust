document.getElementById("listingForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const form = this;
  const location = document.getElementById("location").value;

  const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`);
  const data = await response.json();

  if (data.features.length > 0) {
    const [lng, lat] = data.features[0].geometry.coordinates;
    document.getElementById("lat").value = lat;
    document.getElementById("lng").value = lng;
    console.log("Filled", { lat, lng }); 
    form.submit();
  } else {
    alert("Location not found!");
  }
});
console.log("Map Token:", mapToken);

