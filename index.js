const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

users = [];

fs.readFile("users.json", 'utf-8', (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    users = JSON.parse(data);
});

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the User Management System</h1><p>To view users, go to <a href="/users">/users</a>.</p>');
});

app.get('/users', (req, res) => {
    if (users.length === 0) {
        return res.status(404).send("No users found.");
    }
    res.json(users); 
});
app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    const user = users["users"].find(u => u.id == userId);
    if (users.length === 0) {
        return res.status(404).send("No users found.");
    }
    res.json(user); 
});

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (!newUser || !newUser.id || !newUser.name) {
        return res.status(400).json({ error: "Missing required fields: 'id' and 'name'" });
    }

    users["users"].push(newUser);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to save user.");
        }
        res.status(201).send("User added successfully!");
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id; 
    const userIndex = users["users"].findIndex(u => u.id == userId); 

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    users["users"].splice(userIndex, 1);

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to delete user.");
        }
        res.status(200).send("User deleted successfully!");
    });
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    const userIndex = users["users"].findIndex(u => u.id == userId); 

    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
    }

    if (!updatedUser || !updatedUser.name) {
        return res.status(400).json({ error: "Missing required field: 'name'" });
    }

    users["users"][userIndex].name = updatedUser.name; 

    fs.writeFile("users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to update user.");
        }
        res.status(200).send("User updated successfully!");
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});