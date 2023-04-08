import { IncomingForm, File } from "formidable";
import type { NextApiRequest } from "next";

export async function parseFormFile(
  req: NextApiRequest,
  fieldName: string
): Promise<File | undefined> {
  const form = new IncomingForm({ multiples: false });
  const files: { [key: string]: File } = {};

  form.on("file", (field, file) => {
    files[field] = file;
  });

  await new Promise<void>((resolve, reject) => {
    form.parse(req, (err, fields, _) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });

  return files[fieldName];
}
