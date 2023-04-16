import type { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "fs";

export async function parseFormFile(req: NextApiRequest): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    console.log("after form file");
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error(err);
        reject(new Error("File upload failed"));
        return;
      }
      console.log("after parse");
      const file = files["file"] as formidable.File;
      if (!file) {
        reject(new Error("File not found"));
        return;
      }
      console.log(`file: ${file.filepath}`);
      fs.readFile(file.filepath, (err, data) => {
        if (err) {
          console.error(err);
          reject(new Error("Failed to read file data"));
          return;
        }

        resolve(data);
      });
    });
  });
}
