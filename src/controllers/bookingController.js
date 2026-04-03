const db = require('../config/db');
const crypto = require('crypto');

// --- EVENT LOGIC ---
const getAllEvents = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createEvent = async (req, res) => {
    const { title, description, date, total_tickets } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
            [title, description, date, total_tickets, total_tickets]
        );
        res.status(201).json({ message: "Event created successfully", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- BOOKING LOGIC ---
const createBooking = async (req, res) => {
    const { event_id, user_id, tickets_requested } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [eventRows] = await connection.query(
            'SELECT remaining_tickets FROM events WHERE id = ? FOR UPDATE',
            [event_id]
        );

        if (eventRows.length === 0 || eventRows[0].remaining_tickets < tickets_requested) {
            await connection.rollback();
            return res.status(400).json({ error: "Booking failed: Invalid event or insufficient tickets." });
        }

        await connection.query(
            'UPDATE events SET remaining_tickets = remaining_tickets - ? WHERE id = ?',
            [tickets_requested, event_id]
        );

        const bookingCode = 'BK-' + crypto.randomBytes(3).toString('hex').toUpperCase();
        await connection.query(
            'INSERT INTO bookings (user_id, event_id, tickets_booked, booking_code) VALUES (?, ?, ?, ?)',
            [user_id, event_id, tickets_requested, bookingCode]
        );

        await connection.commit();
        res.status(201).json({ message: "Booking successful!", bookingCode });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// --- NEW: GET USER BOOKINGS [Requirement 14] ---
const getUserBookings = async (req, res) => {
    const { id } = req.params; // user_id from URL
    try {
        const [rows] = await db.query(
            `SELECT b.booking_code, b.tickets_booked, b.booking_date, e.title, e.date as event_date 
             FROM bookings b 
             JOIN events e ON b.event_id = e.id 
             WHERE b.user_id = ?`, 
            [id]
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- NEW: ATTENDANCE CHECK [Requirement 14] ---
const markAttendance = async (req, res) => {
    const { code } = req.body; // Takes unique code as input
    try {
        const [rows] = await db.query(
            'SELECT tickets_booked, event_id FROM bookings WHERE booking_code = ?',
            [code]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Invalid booking code." });
        }

        // Logic to return how many tickets were booked
        res.status(200).json({ 
            message: "Attendance verified", 
            ticketsBooked: rows[0].tickets_booked 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllEvents, createEvent, createBooking, getUserBookings, markAttendance };