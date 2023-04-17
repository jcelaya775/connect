import type { NextApiRequest } from "next";
import formidable from "formidable";
import fs from "fs";
export const config = {
  api: {
    bodyParser: false,
  },
};
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
      console.log(file.filepath);
      if (!file) {
        reject(new Error("File not found"));
        return undefined;
      }
      console.log("pre file content failed");
      const fileContent = fs.readFileSync(file.filepath);
      if (!fileContent) {
        
        return undefined;
      }
      console.log(fileContent)
      resolve(fileContent);
      return fileContent
    });
  });
}
