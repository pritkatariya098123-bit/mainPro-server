import express from 'express';
import cors from 'cors';
import { userAuth, findUser } from './database/DATAin.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await findUser(email);
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const newUser = await userAuth(username, email, password);
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Signup error' });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await findUser(email);

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error' });
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:3000`);
});