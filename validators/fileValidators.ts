import z from "zod";

/**
 * Zod schema to validate a FileList input for uploading text files.
 *
 * Validations:
 * - Ensures the value is a FileList instance
 * - Ensures at least one file is selected
 * - Ensures the first file has MIME type 'text/plain' (.txt)
 *
 * @example
 * const validFiles = fileListSchema.parse(fileInput.files);
 */
const fileListSchema = z
  .custom<FileList>((value): value is FileList => value instanceof FileList, {
    message: 'File is required',
  })
  .refine((files) => files.length > 0, 'File is required')
  .refine((files) => files[0]?.type === 'text/plain', 'Only .txt files are allowed');

/**
 * Zod schema for validating the file upload form.
 *
 * The form object has a single field:
 * - `file`: a FileList validated by `fileListSchema`
 *
 * @example
 * const formData = { file: fileInput.files };
 * schema.parse(formData); // validates the form
 */
export const schema = z.object({
  file: fileListSchema,
});

/**
 * TypeScript type inferred from the file upload form schema.
 *
 * Represents the shape of the form values expected by the file uploader.
 *
 * @typedef {Object} FormValues
 * @property {FileList} file - FileList containing the uploaded file(s)
 *
 * @example
 * const formValues: FormValues = { file: fileInput.files };
 */
export type FormValues = z.infer<typeof schema>;
