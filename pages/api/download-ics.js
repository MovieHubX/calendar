// pages/api/download-ics.js
export default function handler(req, res) {
  const { content } = req.query;
  const icsContent = decodeURIComponent(content);

  // Set response headers to force download
  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="modified_calendar.ics"');

  // Return the modified .ics content
  res.status(200).send(icsContent);
}
