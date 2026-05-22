var simplemaps_worldmap_mapdata = {
  main_settings: {
    // General settings
    width: "responsive",
    background_color: "#FFFFFF",
    background_transparent: "yes",
    border_color: "#ffffff",
    popups: "detect",
    
    // State defaults (Base Continent Styling)
    state_description: "",
    state_color: "#f1f5f9", // Muted premium grey for the continent
    state_hover_color: "#e2e8f0",
    state_url: "",
    border_size: 1.5,
    all_states_inactive: "no",
    all_states_zoomable: "no",
    
    // Zoom settings - This automatically focuses the map on Africa
    zoom: "yes",
    initial_zoom: "3", // Focuses on Region 3 (Africa and Middle East)
    initial_zoom_solo: "yes", // Hides the rest of the world
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,
    
    // Popup settings
    popup_color: "white",
    popup_opacity: 0.9,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: "14px/1.5 Verdana, Arial, Helvetica, sans-serif",
    popup_nocss: "no",
    
    // Advanced settings
    div: "map",
    auto_load: "yes",
    url_new_tab: "no",
    images_directory: "default",
    fade_time: 0.1,
    link_text: ""
  },
  
  // Highlight SelNexa Markets
  state_specific: {
    ZW: {
      name: "Zimbabwe",
      color: "#0d9488", // SelNexa Teal
      hover_color: "#0f766e",
      description: "Pilot active with Manicaland District Hospital context informing workflows."
    },
    NG: {
      name: "Nigeria",
      color: "#1e3a8a", // SelNexa Navy
      hover_color: "#2a4365",
      description: "In active talks for facility and network pilots."
    },
    KE: {
      name: "Kenya",
      color: "#1e3a8a", 
      hover_color: "#2a4365",
      description: "In active talks for facility and network pilots."
    },
    ZA: {
      name: "South Africa",
      color: "#1e3a8a", 
      hover_color: "#2a4365",
      description: "In active talks for facility and network pilots."
    }
  },
  
  // Add pulsing dots to the capitals
  locations: {
    "0": {
      name: "Harare",
      lat: "-17.824858",
      lng: "31.053028",
      color: "#0d9488",
      size: 35,
      type: "circle",
      description: "HQ & Pilot Base"
    },
    "1": {
      name: "Abuja",
      lat: "9.05785",
      lng: "7.49508",
      color: "#1e3a8a",
      size: 20
    },
    "2": {
      name: "Nairobi",
      lat: "-1.292066",
      lng: "36.821945",
      color: "#1e3a8a",
      size: 20
    },
    "3": {
      name: "Pretoria",
      lat: "-25.747868",
      lng: "28.229271",
      color: "#1e3a8a",
      size: 20
    }
  },
  
  labels: {},
  legend: { entries: [] },
  
  // This defines the region we zoom into on load
  regions: {
    "3": {
      name: "Africa",
      states: [
        "AO", "EG", "TN", "GA", "DZ", "LY", "CG", "GQ", "BJ", "BW", "BF", "BI", "CM", "CF", "TD", "CI", "CD", "DJ", "ET", "GM", "GH", "GN", "GW", "KE", "LS", "LR", "MG", "MW", "ML", "MA", "MR", "MZ", "NA", "NG", "ER", "RW", "SN", "SL", "SO", "ZA", "SD", "SS", "SZ", "TZ", "TG", "UG", "EH", "ZM", "ZW", "RE", "KM", "SC", "MU", "CV", "ST", "YT"
      ]
    }
  }
};
