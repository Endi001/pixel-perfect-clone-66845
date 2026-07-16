const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const apiKey = env.match(/CAL_COM_API_KEY=(.*)/)[1].trim();

fetch('https://api.cal.com/v2/event-types', {
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "cal-api-version": "2024-06-14"
  }
}).then(r => r.json()).then(data => {
  const match = data.data.find(e => e.slug === "1h");
  console.log(JSON.stringify(match.bookingFields || match.customInputs, null, 2));
}).catch(console.error);
