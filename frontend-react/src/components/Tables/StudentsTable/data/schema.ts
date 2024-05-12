import { z } from 'zod';

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.number(),
  uuid: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  mobilePhone: z.string().nullish(),
  projectName: z.string().nullish(),
  designation: z.string().nullish(),
  createdBy: z.string().nullish(),
});

export type Task = z.infer<typeof taskSchema>;
