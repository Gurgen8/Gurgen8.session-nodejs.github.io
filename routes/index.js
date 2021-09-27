import express from "express";
import users from "./users";
import fileManager from "./file-manager";

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('index');
});

router.use('/users', users);
router.use('/file', fileManager);

export default router;
