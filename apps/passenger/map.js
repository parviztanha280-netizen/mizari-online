const MIZARI_MAP = {
  map: null,
  origin: null,
  destination: null,
  originMarker: null,
  destinationMarker: null,
  routeLayer: null,

  init() {
    if (typeof L === "undefined") {
      console.error("Leaflet بارگذاری نشده است.");
      return;
    }

    const mapElement = document.getElementById("map");

    if (!mapElement) {
      console.error("عنصر نقشه پیدا نشد.");
      return;
    }

    if (this.map) return;

    this.map = L.map("map").setView([34.5553, 69.2075], 12);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
      }
    ).addTo(this.map);

    this.map.on("click", e => {
      if (!this.origin) {
        this.setOrigin(e.latlng);
      } else if (!this.destination) {
        this.setDestination(e.latlng);
      } else {
        this.setOrigin(e.latlng);
        this.destination = null;

        if (this.destinationMarker) {
          this.destinationMarker.remove();
          this.destinationMarker = null;
        }

        if (this.routeLayer) {
          this.routeLayer.remove();
          this.routeLayer = null;
        }
      }
    });
  },

  setOrigin(point) {
    this.origin = point;

    this.marker(
      "origin",
      point,
      "مبدا"
    );

    const originInput = document.getElementById("origin");

    if (originInput) {
      originInput.value =
        `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
    }
  },

  setDestination(point) {
    this.destination = point;

    this.marker(
      "destination",
      point,
      "مقصد"
    );

    const destinationInput =
      document.getElementById("destination");

    if (destinationInput) {
      destinationInput.value =
        `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
    }

    this.route();
  },

  marker(kind, point, text) {
    const markerName = kind + "Marker";

    if (this[markerName]) {
      this[markerName].remove();
    }

    this[markerName] = L.marker(point)
      .addTo(this.map)
      .bindPopup(text)
      .openPopup();
  },

  async route() {
    if (!this.origin || !this.destination) {
      return;
    }

    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${this.origin.lng},${this.origin.lat};` +
        `${this.destination.lng},${this.destination.lat}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("خطا در دریافت مسیر");
      }

      const data = await response.json();

      if (!data.routes || !data.routes[0]) {
        throw new Error("مسیر پیدا نشد");
      }

      const route = data.routes[0];

      if (this.routeLayer) {
        this.routeLayer.remove();
      }

      this.routeLayer =
        L.geoJSON(route.geometry).addTo(this.map);

      this.map.fitBounds(
        this.routeLayer.getBounds(),
        {
          padding: [20, 20]
        }
      );

      const distance =
        document.getElementById("distance");

      const duration =
        document.getElementById("duration");

      if (distance) {
        distance.value =
          (route.distance / 1000).toFixed(1);
      }

      if (duration) {
        duration.value =
          Math.ceil(route.duration / 60);
      }

    } catch (error) {
      console.error("Map route error:", error);
    }
  }
};
