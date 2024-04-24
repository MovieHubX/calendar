# main.py content (The Python script for processing the .ics file)
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import requests
from icalendar import Calendar

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        query = parse_qs(urlparse(self.path).query)
        url = query.get('url', [''])[0]

        if not url:
            self.send_response(HTTPStatus.BAD_REQUEST)
            self.end_headers()
            self.wfile.write(b'Missing "url" parameter')
            return

        # Fetch the .ics file
        response = requests.get(url)
        ics_content = response.text

        # Process the .ics file (example: remove everything except the title)
        calendar = Calendar.from_ical(ics_content)
        for component in calendar.walk():
            if component.name == "VEVENT":
                title = str(component.get("summary"))
                component.clear()  # Remove all other properties except the title

        # Send the modified .ics content in the response
        self.send_response(HTTPStatus.OK)
        self.send_header('Content-type', 'text/calendar')
        self.end_headers()
        self.wfile.write(calendar.to_ical())

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RequestHandler)
    print(f"Server running on port {port}")
    httpd.serve_forever()

# Entry point for local development
if __name__ == '__main__':
    run_server()
