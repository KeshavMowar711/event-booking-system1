# Mini Event Management System - Selection Test

A Node.js & MySQL backend for browsing events and booking tickets with concurrency control.

## 🚀 Features
- [cite_start]**Race Condition Protection**: Uses SQL Transactions and `FOR UPDATE` locks[cite: 14, 23].
- [cite_start]**Unique Booking Codes**: Generates unique identifiers for every successful booking.
- [cite_start]**Attendance Verification**: Validates attendance via unique codes.

## 🛠️ Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <your-repo-link>
  2. Install Dependencies:

Bash
npm install

3.Database Configuration:

Run the schema.sql script in your MySQL terminal.

Create a .env file in the root directory:

Code snippet
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking_db
PORT=3000
4.Run the Server:

Bash
npm run dev

📖 API Documentation
The API follows the OpenAPI/Swagger specification provided in swagger.yaml.


GET /api/events: List all events.


POST /api/bookings: Book tickets (atomic transaction).


GET /api/users/:id/bookings: Retrieve user booking history.
