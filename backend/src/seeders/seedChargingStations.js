import dotenv from "dotenv";
import mongoose from "mongoose";
import { ChargingStation } from "../model/ChargingStation.js";

dotenv.config();

const stations = [

  // Madhya Pradesh
  { name:"VoltPath Bhopal", address:"Bhopal", location:{ type:"Point", coordinates:[77.4126,23.2599] }, powerKw:60 },
  { name:"VoltPath Indore", address:"Indore", location:{ type:"Point", coordinates:[75.8577,22.7196] }, powerKw:80 },
  { name:"VoltPath Jabalpur", address:"Jabalpur", location:{ type:"Point", coordinates:[79.9864,23.1815] }, powerKw:60 },
  { name:"VoltPath Gwalior", address:"Gwalior", location:{ type:"Point", coordinates:[78.1828,26.2183] }, powerKw:60 },

  // Maharashtra
  { name:"VoltPath Mumbai", address:"Mumbai", location:{ type:"Point", coordinates:[72.8777,19.0760] }, powerKw:120 },
  { name:"VoltPath Pune", address:"Pune", location:{ type:"Point", coordinates:[73.8567,18.5204] }, powerKw:80 },
  { name:"VoltPath Nagpur", address:"Nagpur", location:{ type:"Point", coordinates:[79.0882,21.1458] }, powerKw:80 },
  { name:"VoltPath Nashik", address:"Nashik", location:{ type:"Point", coordinates:[73.7898,19.9975] }, powerKw:60 },

  // Gujarat
  { name:"VoltPath Ahmedabad", address:"Ahmedabad", location:{ type:"Point", coordinates:[72.5714,23.0225] }, powerKw:100 },
  { name:"VoltPath Surat", address:"Surat", location:{ type:"Point", coordinates:[72.8311,21.1702] }, powerKw:80 },
  { name:"VoltPath Vadodara", address:"Vadodara", location:{ type:"Point", coordinates:[73.1812,22.3072] }, powerKw:80 },

  // Rajasthan
  { name:"VoltPath Jaipur", address:"Jaipur", location:{ type:"Point", coordinates:[75.7873,26.9124] }, powerKw:80 },
  { name:"VoltPath Udaipur", address:"Udaipur", location:{ type:"Point", coordinates:[73.7125,24.5854] }, powerKw:60 },
  { name:"VoltPath Kota", address:"Kota", location:{ type:"Point", coordinates:[75.8648,25.2138] }, powerKw:60 },

  // Delhi NCR
  { name:"VoltPath Delhi", address:"Delhi", location:{ type:"Point", coordinates:[77.1025,28.7041] }, powerKw:120 },
  { name:"VoltPath Noida", address:"Noida", location:{ type:"Point", coordinates:[77.3910,28.5355] }, powerKw:80 },
  { name:"VoltPath Gurugram", address:"Gurugram", location:{ type:"Point", coordinates:[77.0266,28.4595] }, powerKw:100 },

  // Uttar Pradesh
  { name:"VoltPath Lucknow", address:"Lucknow", location:{ type:"Point", coordinates:[80.9462,26.8467] }, powerKw:80 },
  { name:"VoltPath Kanpur", address:"Kanpur", location:{ type:"Point", coordinates:[80.3319,26.4499] }, powerKw:60 },
  { name:"VoltPath Varanasi", address:"Varanasi", location:{ type:"Point", coordinates:[82.9739,25.3176] }, powerKw:60 },

  // Karnataka
  { name:"VoltPath Bengaluru", address:"Bangalore", location:{ type:"Point", coordinates:[77.5946,12.9716] }, powerKw:120 },
  { name:"VoltPath Mysuru", address:"Mysuru", location:{ type:"Point", coordinates:[76.6394,12.2958] }, powerKw:60 },
  { name:"VoltPath Hubli", address:"Hubli", location:{ type:"Point", coordinates:[75.1240,15.3647] }, powerKw:60 },

  // Tamil Nadu
  { name:"VoltPath Chennai", address:"Chennai", location:{ type:"Point", coordinates:[80.2707,13.0827] }, powerKw:120 },
  { name:"VoltPath Coimbatore", address:"Coimbatore", location:{ type:"Point", coordinates:[76.9558,11.0168] }, powerKw:80 },
  { name:"VoltPath Madurai", address:"Madurai", location:{ type:"Point", coordinates:[78.1198,9.9252] }, powerKw:60 },

  // Telangana
  { name:"VoltPath Hyderabad", address:"Hyderabad", location:{ type:"Point", coordinates:[78.4867,17.3850] }, powerKw:120 },

  // Andhra Pradesh
  { name:"VoltPath Vijayawada", address:"Vijayawada", location:{ type:"Point", coordinates:[80.6480,16.5062] }, powerKw:80 },
  { name:"VoltPath Visakhapatnam", address:"Vizag", location:{ type:"Point", coordinates:[83.2185,17.6868] }, powerKw:80 },

  // Kerala
  { name:"VoltPath Kochi", address:"Kochi", location:{ type:"Point", coordinates:[76.2673,9.9312] }, powerKw:80 },
  { name:"VoltPath Trivandrum", address:"Trivandrum", location:{ type:"Point", coordinates:[76.9366,8.5241] }, powerKw:60 },

  // West Bengal
  { name:"VoltPath Kolkata", address:"Kolkata", location:{ type:"Point", coordinates:[88.3639,22.5726] }, powerKw:120 },

  // Odisha
  { name:"VoltPath Bhubaneswar", address:"Bhubaneswar", location:{ type:"Point", coordinates:[85.8245,20.2961] }, powerKw:80 },

  // Punjab
  { name:"VoltPath Chandigarh", address:"Chandigarh", location:{ type:"Point", coordinates:[76.7794,30.7333] }, powerKw:80 },
  { name:"VoltPath Ludhiana", address:"Ludhiana", location:{ type:"Point", coordinates:[75.8573,30.9009] }, powerKw:60 },

  // Haryana
  { name:"VoltPath Panipat", address:"Panipat", location:{ type:"Point", coordinates:[76.9635,29.3909] }, powerKw:60 },

  // Uttarakhand
  { name:"VoltPath Dehradun", address:"Dehradun", location:{ type:"Point", coordinates:[78.0322,30.3165] }, powerKw:60 },

  // Bihar
  { name:"VoltPath Patna", address:"Patna", location:{ type:"Point", coordinates:[85.1376,25.5941] }, powerKw:80 },

  // Jharkhand
  { name:"VoltPath Ranchi", address:"Ranchi", location:{ type:"Point", coordinates:[85.3096,23.3441] }, powerKw:60 }
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await ChargingStation.deleteMany({});
  await ChargingStation.insertMany(stations);
  console.log("✅ Seeded charging stations:", stations.length);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});