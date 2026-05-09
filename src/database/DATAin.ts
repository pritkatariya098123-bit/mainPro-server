import fs from 'fs';
import path from 'path';

const dirPath = path.join('D:/MP/DEV-backend/src/database/DATA');
const filePath = path.join(dirPath, 'users.json');

const ensureDirectory = () => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export const userAuth = async (username: string, email: string, password: string) => {
    ensureDirectory();
    let users = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8').trim();
        users = data ? JSON.parse(data) : [];
    }

    let newId;
    // Admin ચેક: જો ઈમેલ એડમિનનો હોય
    if (email === "admin@user.com") {
        newId = 123098;
    } else {
        // નોર્મલ યુઝર્સ માટે: 1, 2, 3 ક્રમમાં
        const normalUsers = users.filter((u: { id: number | string }) => Number(u.id) !== 123098);
        if (normalUsers.length === 0) {
            newId = 1;
        } else {
            const lastId = Math.max(...normalUsers.map((u: { id: number | string }) => Number(u.id)));
            newId = lastId + 1;
        }
    }

    const newUser = { id: newId, username, email, password };
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
    return newUser;
};

export const findUser = async (email: string) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8').trim();
        if (data) {
            const users = JSON.parse(data);
            return users.find((u: { email: string }) => u.email === email);
        }
    }
    return null;
};
