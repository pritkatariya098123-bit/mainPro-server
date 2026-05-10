import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import pool from './database/db'; // તમારી pg કનેક્શન ફાઈલ

const app = express();
const PORT = 3000;
const saltRounds = 10; // પાસવર્ડ હેશિંગ માટે

// મિડલવેર
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer સેટઅપ (ઈમેજ મેમરીમાં સ્ટોર થશે)
const upload = multer({ storage: multer.memoryStorage() });

// --- ૧. સાઈન-અપ રૂટ (સુરક્ષિત પાસવર્ડ સાથે) ---
app.post('/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // ઈમેલ પહેલેથી છે કે નહીં તે ચેક કરો
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // પાસવર્ડને હેશ (encrypt) કરો
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ડેટાબેઝમાં યુઝર ઉમેરો
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'user']
        );

        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: 'Signup error' });
    }
});

// --- ૨. લોગિન રૂટ (પાસવર્ડ વેરિફિકેશન સાથે) ---
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user) {
            // હેશ પાસવર્ડ મેચ કરો
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                return res.json({ 
                    message: 'Login successful', 
                    user: { id: user.id, username: user.username, email: user.email, role: user.role } 
                });
            }
        }
        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Login error' });
    }
});

// --- ૩. સર્ચ રૂટ (Case-insensitive) ---
app.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.json({ results: [], count: 0 });

    try {
        const result = await pool.query(
            'SELECT * FROM search_data WHERE name ILIKE $1 OR description ILIKE $1',
            [`%${query}%`]
        );
        res.status(200).json({
            success: true,
            count: result.rows.length,
            results: result.rows
        });
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: 'Search error' });
    }
});

// --- ૪. ડેટા અપલોડ રૂટ (Base64 ઈમેજ સાથે) ---
app.post('/search/upload', upload.single('image'), async (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!title || !file) {
        return res.status(400).json({ message: 'Title and image are required' });
    }

    try {
        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await pool.query(
            'INSERT INTO search_data (name, description, img) VALUES ($1, $2, $3) RETURNING *',
            [title, description, base64Image]
        );
        res.status(201).json({ message: 'Uploaded successfully', item: result.rows[0] });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: 'Upload error' });
    }
});

// --- ૫. ઈમેલ અસ્તિત્વ ચેક રૂટ ---
app.post('/auth/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const result = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        res.json({ exists: result.rows.length > 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// સર્વર લિસન
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});