import express from "express";
import basic from "./controllers/BasicController.js"
const router = express.Router();

router.get('/', basic.home);
router.get('/second', basic.second);

export default router;