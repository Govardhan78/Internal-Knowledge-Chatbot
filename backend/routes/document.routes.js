import express from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadDocument,
  getDocuments,
} from "../controllers/document.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorize("admin"),
  upload.single("document"),
  uploadDocument,
);
// router.post("/upload", upload.single("document"), uploadDocument);
router.get("/", getDocuments);
export default router;
