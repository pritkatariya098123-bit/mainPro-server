import { Request, Response } from 'express';
import pool from '../database/db.js';

// ૧. સર્ચબાર માટેનું ફંક્શન
export const searchData = async (req: Request, res: Response) => {
    const { query } = req.query; // ફ્રન્ટએન્ડમાંથી ?query=... આવશે

    if (!query) {
        return res.status(400).json({ success: false, message: "Query is required" });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM search_data WHERE name ILIKE $1 OR description ILIKE $1 ORDER BY id DESC',
            [`%${query}%`]
        );
        
        res.status(200).json({
            success: true,
            results: result.rows
        });
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ૨. બધા ડેટા (All Items) બતાવવા માટેનું ફંક્શન
export const getAllData = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM search_data ORDER BY id DESC');
        res.status(200).json({
            success: true,
            results: result.rows
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// ૩. નવો ડેટા અપલોડ કરવા માટે
export const uploadData = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !file) {
        return res.status(400).json({ message: "Title and Image are required" });
    }

    try {
        // ઈમેજને Base64 માં કન્વર્ટ કરો
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        
        const result = await pool.query(
            'INSERT INTO search_data (name, description, img) VALUES ($1, $2, $3) RETURNING *',
            [title, description, base64Image]
        );

        res.status(201).json({ success: true, results: result.rows[0] });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};