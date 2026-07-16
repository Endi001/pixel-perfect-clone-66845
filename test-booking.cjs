async function test() {
  const apiKey = process.env.CAL_COM_API_KEY;
  const payload = {
    start: "2026-07-20T10:00:00Z",
    eventTypeSlug: "1h",
    username: "endi-b3omc8",
    attendee: {
      name: "Test User",
      email: "test@example.com",
      timeZone: "Europe/Budapest",
      language: "en",
      phoneNumber: "+355689032978"
    },
    bookingFieldsResponses: {
      "Reason-for-visit": ["Joint pain"],
      "How-long-have-you-had-this-issue": "1–4 weeks",
      "Have-you-seen-a-physiotherapist-for-this-before": "No",
      "Insurance-payment-method": "Private pay"
    }
  };

  const response = await fetch("https://api.cal.com/v2/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "cal-api-version": "2024-08-13",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log("STATUS:", response.status);
  console.log("RESPONSE:", text);
}
test();
