// pages/api/process-ics.js
import axios from 'axios';
import { parseICS } from 'icalendar';

export default async function handler(req, res) {
  const { url } = req.query;
  try {
    const response = await axios.get(url);
    const icsContent = response.data;

    // Process the .ics file (example: remove everything except the title)
    const calendar = parseICS(icsContent);
    calendar.events.forEach((event) => {
      const title = event.summary;
      event.summary = title; // Keep only the title
      delete event.description;
      delete event.location;
      delete event.startDate;
      delete event.endDate;
    });

    // Return the modified URL
    res.status(200).json({ newUrl: `/api/download-ics?content=${encodeURIComponent(calendar.toString())}` });
  } catch (error) {
    console.error('Error processing .ics file:', error);
    res.status(500).json({ error: 'Error processing .ics file' });
  }
}
