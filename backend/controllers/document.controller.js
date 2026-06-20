import { indexDocument } from "../services/document.service.js";
import Document from "../models/Document.js";

export const uploadDocument = async (req, res, next) => {
  try {
    const result = await indexDocument(req.file.path);

    res.status(200).json({
      success: true,
      message: "Document indexed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res) => {
  const documents = await Document.find().sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    documents,
  });
};
