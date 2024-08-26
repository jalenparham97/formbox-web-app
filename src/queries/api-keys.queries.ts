import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useApiKeys = (orgId: string) => {
  return api.apiKey.getAll.useQuery({ orgId });
};

export const useApikeyAddMutation = () => {
  const apiUtils = api.useUtils();

  return api.apiKey.create.useMutation({
    onMutate: async (input) => {
      await apiUtils.apiKey.getAll.cancel({ orgId: input.orgId });
      const previousQueryData = apiUtils.apiKey.getAll.getData({
        orgId: input.orgId,
      });
      return { previousQueryData };
    },
    onSuccess: async () => {
      return toast.success("API key created");
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.apiKey.getAll.setData(
        { orgId: input.orgId },
        ctx?.previousQueryData,
      );
    },
    onSettled: async (_data, _error, input) => {
      await apiUtils.apiKey.getAll.invalidate({ orgId: input.orgId });
    },
  });
};

export const useApiKeyUpdateMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.apiKey.updateById.useMutation({
    onMutate: async () => {
      await apiUtils.apiKey.getAll.cancel({ orgId });
      const previousQueryData = apiUtils.apiKey.getAll.getData({
        orgId,
      });
      return { previousQueryData };
    },
    onSuccess: () => {
      toast.success("API key updated");
    },
    onError: (error, _input, ctx) => {
      console.log(error);
      apiUtils.apiKey.getAll.setData({ orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async (_data, _error, _input) => {
      await apiUtils.apiKey.getAll.invalidate({ orgId });
    },
  });
};

export const useApiKeyDeleteMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.apiKey.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.apiKey.getAll.cancel();
      const previousQueryData = apiUtils.apiKey.getAll.getData({
        orgId,
      });
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.apiKey.getAll.setData({ orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.apiKey.getAll.invalidate({ orgId });
    },
  });
};
