const express = require('express');
const router = express.Router();
const logs = require('../controllers/HrLogsController');

module.exports = (app) => {

    router.get("/users", logs.getUsers);
    router.get("/download-logs", logs.getLogs);
    router.post("/add-user", logs.addUser);
    router.delete("/:id", logs.deleteUser);

    app.use("/api/hrlogs",router);    
}