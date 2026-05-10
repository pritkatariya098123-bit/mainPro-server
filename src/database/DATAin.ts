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
    if (email === "admin@user.com") {
        newId = 123098;
    } else {
        const normalUsers = users.filter((u: any) => Number(u.id) !== 123098);
        newId = normalUsers.length === 0 ? 1 : Math.max(...normalUsers.map((u: any) => Number(u.id))) + 1;
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
            return users.find((u: any) => u.email === email);
        }
    }
    return null;
};

export const searchData = async (query: string) => {
    const searchFilePath = path.join(dirPath, 'searchData.json');
    if (fs.existsSync(searchFilePath)) {
        const data = fs.readFileSync(searchFilePath, 'utf-8').trim();
        if (data) {
            const searchData = JSON.parse(data);
            return searchData.filter((item: any) => item.name.toLowerCase().includes(query.toLowerCase()));
        }
    }
    return [];
};

export const addSearchData = async (name: string, description: string, img: string) => {
    const searchFilePath = path.join(dirPath, 'searchData.json');
    let searchData = [];
    ensureDirectory();
    
    if (fs.existsSync(searchFilePath)) {
        const data = fs.readFileSync(searchFilePath, 'utf-8').trim();
        searchData = data ? JSON.parse(data) : [];
    }
    
    const newItem = { id: Date.now(), name, description, img };
    searchData.push(newItem);
    fs.writeFileSync(searchFilePath, JSON.stringify(searchData, null, 2));
    return newItem;
};