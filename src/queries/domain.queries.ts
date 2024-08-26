import { api } from "@/trpc/react";
import { type DomainFindInput, type DomainsOutput } from "@/types/domain.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

type QueryOptions = {
  refetchOnWindowFocus?: boolean;
};

export const useDomains = (orgId: string) => {
  return api.domain.getAll.useQuery({ orgId, take: 500 });
};

export const useInfiniteDomains = (
  input: DomainFindInput,
  initialData?: DomainsOutput,
) => {
  return api.domain.getAll.useInfiniteQuery(
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

export const useDomainById = (
  id: string,
  options: QueryOptions = { refetchOnWindowFocus: true },
) => {
  return api.domain.getById.useQuery(
    { id },
    {
      enabled: !isEmpty(id),
      refetchOnWindowFocus: options.refetchOnWindowFocus,
    },
  );
};

export const useDomainAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();

  return api.domain.create.useMutation({
    onMutate: async (input) => {
      await apiUtils.domain.getAll.cancel();
      const previousQueryData = apiUtils.domain.getAll.getInfiniteData({
        orgId: input.orgId,
      });
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      router.push(`/dashboard/${data?.orgId}/domains/${data?.id}`);
    },
    onError: (error, input, ctx) => {
      console.log(error);
      toast.error("Error", { description: error.message });
      apiUtils.domain.getAll.setInfiniteData(
        { orgId: input.orgId },
        ctx?.previousQueryData,
      );
    },
    onSettled: async (_data, _error, input) => {
      await apiUtils.domain.getAll.invalidate({ orgId: input.orgId });
    },
  });
};

export const useDomainVerifyMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.domain.verify.useMutation({
    onMutate: async (input) => {
      await apiUtils.domain.getById.cancel({ id: input.id });
      const previousQueryData = apiUtils.domain.getById.getData({
        id: input.id,
      });
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.domain.getById.setData({ id: input.id }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async (_data, _error, input) => {
      await apiUtils.domain.getById.invalidate({ id: input.id });
      await apiUtils.domain.getAll.invalidate({ orgId });
    },
  });
};

export const useDomainDeleteMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.domain.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.domain.getAll.cancel();
      const previousQueryData = apiUtils.domain.getAll.getInfiniteData({
        orgId,
      });
      return { previousQueryData };
    },
    onError: (error, input, ctx) => {
      console.log(error);
      apiUtils.domain.getAll.setInfiniteData({ orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.domain.getAll.invalidate({ orgId });
    },
  });
};
