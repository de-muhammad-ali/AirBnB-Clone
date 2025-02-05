mapboxgl.accessToken = MAP_TOKEN;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 12,
        center: coordinates
    });

    // Set marker options.
    const marker = new mapboxgl.Marker({
    color: "#FFFFFF",
    draggable: true
    }).setLngLat(coordinates)
    .addTo(map);
