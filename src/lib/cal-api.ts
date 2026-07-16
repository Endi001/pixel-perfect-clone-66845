import { createServerFn } from "@tanstack/react-start";

const CAL_API_URL = "https://api.cal.com/v2";

export const getCalEventDetails = createServerFn({ method: "GET" })
  .validator((d: { eventTypeSlug: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.CAL_COM_API_KEY;
    if (!apiKey) {
      throw new Error("CAL_COM_API_KEY is not defined");
    }

    // We will list all event types and find the one that matches our slug
    const response = await fetch(`${CAL_API_URL}/event-types`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-06-14",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch event types: ${errorText}`);
    }

    const json = await response.json();
    const eventTypes = json.data as any[];
    const match = eventTypes.find((e) => e.slug === data.eventTypeSlug);

    if (!match) {
      throw new Error(`Event type ${data.eventTypeSlug} not found`);
    }

    return {
      id: match.id,
      title: match.title,
      description: match.description,
      length: match.length || match.duration || 60,
      location: match.locations?.[0]?.address || "Video call",
      bookingFields: match.bookingFields || match.customInputs || [],
    };
  });

export const getCalSlots = createServerFn({ method: "GET" })
  .validator((d: { start: string; end: string; eventTypeId: number }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.CAL_COM_API_KEY;
    if (!apiKey) {
      throw new Error("CAL_COM_API_KEY is not defined");
    }

    const { start, end, eventTypeId } = data;
    const url = new URL(`${CAL_API_URL}/slots/available`);
    url.searchParams.append("eventTypeId", eventTypeId.toString());
    url.searchParams.append("startTime", start);
    url.searchParams.append("endTime", end);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch slots: ${errorText}`);
    }

    const json = await response.json();
    let slotsArray: any[] = [];
    
    // Robust extraction: Cal.com might return { data: [...] } or { data: { slots: { "2026-07-27": [...] } } }
    let target = json.data?.slots || json.data || json;
    
    if (Array.isArray(target)) {
      slotsArray = target;
    } else if (typeof target === "object" && target !== null) {
      // Flatten the object values, handling both direct arrays and nested arrays
      slotsArray = Object.values(target).flat(2);
    }

    return slotsArray
      .map(slot => {
        const timeVal = slot?.time || slot?.start || slot?.startTime || (typeof slot === "string" ? slot : null);
        return { time: timeVal };
      })
      .filter(slot => slot.time && !isNaN(new Date(slot.time).getTime())); // Filter out invalid dates
  });

export const createCalBooking = createServerFn({ method: "POST" })
  .validator(
    (d: {
      start: string;
      name: string;
      email: string;
      notes?: string;
      responses?: Record<string, any>;
    }) => d
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.CAL_COM_API_KEY;
    if (!apiKey) {
      throw new Error("CAL_COM_API_KEY is not defined");
    }

    const payload = {
      start: data.start,
      eventTypeSlug: "1h",
      username: "endi-b3omc8",
      attendee: {
        name: data.name,
        email: data.email,
        timeZone: "Europe/Budapest",
        language: "en",
      },
      bookingFieldsResponses: data.responses || {},
      metadata: {
        notes: data.notes,
      },
    };

    const response = await fetch(`${CAL_API_URL}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create booking: ${errorText}`);
    }

    const json = await response.json();
    return json.data;
  });
