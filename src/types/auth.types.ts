import { type z } from "zod";
import { type LoginSchema } from "@/utils/schemas";

export type LoginCreds = z.infer<typeof LoginSchema>;
