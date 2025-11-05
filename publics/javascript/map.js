
maptilersdk.config.apiKey = mapToken;

  const map = new maptilersdk.Map({
      container: 'map',
      style: maptilersdk.MapStyle.STREETS,
      center: [77.2090, 28.6139],
      zoom: 10
  });
  console.log(coordinates)



