require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const Temple = require('./src/models/Temple');

async function seed() {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");

    const text = fs.readFileSync('/Users/pramodwijenayake/Desktop/Project-Shradha/temples_extracted.txt', 'utf8');
    const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
    
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === 'Email') {
            startIndex = i + 1;
            break;
        }
    }
    
    let i = startIndex;
    const temples = [];
    
    const defaultImage = "https://images.unsplash.com/photo-1601142859862-9780f3f4b534?auto=format&fit=crop&w=900&q=80";
    const defaultGallery = [
        "https://images.unsplash.com/photo-1601142859862-9780f3f4b534?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1526724038726-3007ffb8025f?auto=format&fit=crop&w=900&q=80"
    ];
    
    // Default US state coordinates roughly
    const stateCoords = {
        "Arizona": {lat: 34.0489, lng: -111.0937},
        "California": {lat: 36.7783, lng: -119.4179},
        "Florida": {lat: 27.9944, lng: -81.7603},
        "Georgia": {lat: 32.1656, lng: -82.9001},
        "Hawaii": {lat: 19.8968, lng: -155.5828},
        "Illinois": {lat: 40.6331, lng: -89.3985},
        "Indiana": {lat: 40.2672, lng: -86.1349},
        "Maryland": {lat: 39.0458, lng: -76.6413},
        "Massachusetts": {lat: 42.4072, lng: -71.3824},
        "Michigan": {lat: 44.3148, lng: -85.6024},
        "Minnesota": {lat: 46.7296, lng: -94.6859},
        "Missouri": {lat: 37.9643, lng: -91.8318},
        "Nevada": {lat: 38.8026, lng: -116.4194},
        "New Jersey": {lat: 40.0583, lng: -74.4057},
        "New York": {lat: 40.7128, lng: -74.0060},
        "North Carolina": {lat: 35.7596, lng: -79.0193},
        "Ohio": {lat: 40.4173, lng: -82.9071},
        "Pennsylvania": {lat: 41.2033, lng: -77.1945},
        "Texas": {lat: 31.9686, lng: -99.9018},
        "Virginia": {lat: 37.4316, lng: -78.6569},
        "Washington": {lat: 47.7511, lng: -120.7401},
        "Washington D.C.": {lat: 38.9072, lng: -77.0369},
        "Wisconsin": {lat: 43.7844, lng: -88.7879}
    };

    while (i < lines.length) {
        const noMatch = lines[i].match(/^\d+$/);
        if (noMatch) {
            try {
                let stateRaw = lines[i+1];
                let stateMatch = stateRaw.match(/^([A-Za-z\.\s]+)(\s*\([A-Z]+\))?/);
                let state = stateMatch ? stateMatch[1].trim() : stateRaw;
                // clean up
                if(state.includes('Washington D.C')) state = 'Washington D.C.';
                
                let city = lines[i+2];
                let nameAddress = lines[i+3];
                let name = nameAddress;
                let address = nameAddress;
                if (nameAddress.includes(',')) {
                    name = nameAddress.substring(0, nameAddress.indexOf(',')).trim();
                }
                
                let chiefMonk = lines[i+4];
                let contact = lines[i+5];
                let email = lines[i+6] || "";
                
                i += 7;
                
                let lat = stateCoords[state] ? stateCoords[state].lat : 38.0;
                let lng = stateCoords[state] ? stateCoords[state].lng : -97.0;
                
                // Jitter to avoid overlapping exactly
                lat += (Math.random() - 0.5) * 1.5;
                lng += (Math.random() - 0.5) * 1.5;
                
                temples.push({
                    name,
                    state,
                    address,
                    chiefMonk,
                    contact,
                    email: email.includes('@') ? email : null,
                    imageUrl: defaultImage,
                    gallery: defaultGallery,
                    monkImage: defaultImage,
                    description: "A Buddhist center serving the community.",
                    lat,
                    lng
                });
            } catch (e) {
                console.log("Error parsing around line " + i, e);
                i++;
            }
        } else {
            i++;
        }
    }
    
    console.log(`Parsed ${temples.length} temples`);
    
    await Temple.deleteMany({});
    
    for (const t of temples) {
        await Temple.create(t);
    }
    
    console.log("Database seeded successfully!");
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
