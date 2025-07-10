const multer = require("multer");
const path = require("path");
import crypto from "crypto";
import { MulterAzureStorage, MASNameResolver } from 'multer-azure-blob-storage';

const MAX_SIZE_FIVE_MEGABYTES = 5 * 1024 * 1024;

const resolveBlobName: MASNameResolver = (req: any, file: Express.Multer.File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
      crypto.randomBytes(16, (err, hash) => {

        const blobName = `${hash.toString("hex")}-${file.originalname}`;

        resolve(blobName);
      });      
  });
};

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "public", "productsImages"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    },
  }),
  fileStorage: new MulterAzureStorage({
    connectionString: process.env.STORAGE_CONN_STRING,
    accessKey: process.env.ACCESS_KEY,
    accountName: process.env.ACCOUNT_NAME,
    containerName: process.env.CONTAINER_NAME,
    metadata: (): any  => '',
    containerAccessLevel: 'blob',
    blobName: (req: any, file: Express.Multer.File): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
          crypto.randomBytes(16, (err, hash) => {
    
            const blobName = `${hash.toString("hex")}-${file.originalname}`;
    
            resolve(blobName);
          });      
      });
    }
  })
  
};

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "public", "productsImages"),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: MAX_SIZE_FIVE_MEGABYTES,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  },
};