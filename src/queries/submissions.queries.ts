import { api } from "@/trpc/react";
import {
  type SubmissionsOutput,
  type SubmissionsFindInput,
} from "@/types/submission.types";
import { toast } from "sonner";

export const useInfiniteSubmissions = (
  input: SubmissionsFindInput,
  initialData?: SubmissionsOutput,
) => {
  return api.submission.getAll.useInfiniteQuery(
    { ...input },
    {
      initialData: () => {
        if (initialData) {
          return {
            pageParams: [undefined],
            pages: [initialData],
          };
        }
      },
      getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    },
  );
};

export const useSubmissionDeleteMutation = (formId: string) => {
  const apiUtils = api.useUtils();

  return api.submission.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.submission.getAll.cancel();
      const previousQueryData = apiUtils.submission.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.submission.getAll.setInfiniteData(
        { formId },
        ctx?.previousQueryData,
      );
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.submission.getAll.invalidate();
    },
  });
};
