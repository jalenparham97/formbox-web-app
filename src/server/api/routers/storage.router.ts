import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { deleteFile, getUploadUrl } from "@/libs/s3";

export const storageRouter = createTRPCRouter({
  getUploadUrl: protectedProcedure
    .input(z.object({ fileKey: z.string() }))
    .mutation(async ({ input }) => {
      const uploadUrl = await getUploadUrl(input.fileKey);
      return { uploadUrl };
    }),
  deleteFile: protectedProcedure
    .input(z.object({ fileKey: z.string() }))
    .mutation(async ({ input }) => {
      return await deleteFile(input.fileKey);
    }),
});
