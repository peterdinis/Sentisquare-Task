import z from "zod";

const fileListSchema = z
  .custom<FileList>((value): value is FileList => value instanceof FileList, {
    message: 'File is required',
  })
  .refine((files) => files.length > 0, 'File is required')
  .refine((files) => files[0]?.type === 'text/plain', 'Only .txt files are allowed');

export const schema = z.object({
  file: fileListSchema,
});

export type FormValues = z.infer<typeof schema>;