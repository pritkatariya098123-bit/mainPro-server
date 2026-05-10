import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import pool from './database/db';

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// Middleware
app.use(cors({
    origin: "*", // પ્રોડક્શનમાં તમારી વેરસેલ ફ્રન્ટએન્ડ લિંક અહીં નાખવી
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// --- ૧. સાઈન-અપ રૂટ ---
app.post('/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
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

// --- ૨. લોગિન રૂટ ---
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (user) {
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
        res.status(500).json({ message: 'Login error' });
    }
});

// --- ૩. સર્ચ રૂટ ---
app.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const result = await pool.query(
            'SELECT * FROM search_data WHERE name ILIKE $1 OR description ILIKE $1',
            [`%${query}%`]
        );
        res.status(200).json({ success: true, count: result.rows.length, results: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Search error' });
    }
});

// --- ૪. ડેટા અપલોડ રૂટ ---
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
        res.status(500).json({ message: 'Upload error' });
    }
});

// --- ૫. હેલ્થ ચેક (Vercel માં ચેક કરવા માટે) ---
app.get('/', (req, res) => {
    res.send('🚀 Backend is running successfully!');
});

// --- Vercel માટે લિસનિંગ કન્ડિશન ---
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running locally on http://localhost:${PORT}`);
    });
}

export default app;