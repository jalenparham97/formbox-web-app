import { useLocalStorage } from "@/hooks/use-local-storage";
import { api } from "@/trpc/react";
import type { OrgFindInput, OrgsOutput } from "@/types/org.types";
import { useRouter } from "next/navigation";
import { isEmpty } from "radash";
import { toast } from "sonner";

export const useOrgs = () => {
  return api.org.getAll.useQuery({ take: 500 });
};

export const useOrgMembers = (orgId: string) => {
  return api.org.getMembers.useQuery({ id: orgId });
};

export const useOrgMemberRole = (memberId: string, orgId: string) => {
  const id = memberId;
  return api.org.getMemberRole.useQuery(
    { id, orgId },
    {
      enabled: !isEmpty(memberId),
    },
  );
};

export const useOrgInvites = (orgId: string) => {
  return api.org.getInvites.useQuery({ id: orgId });
};

export const useInfiniteOrgs = (
  input?: OrgFindInput,
  initialData?: OrgsOutput,
) => {
  return api.org.getAll.useInfiniteQuery(
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

export const useOrgById = (id: string) => {
  return api.org.getById.useQuery({ id }, { enabled: !isEmpty(id) });
};

export const useOrgAddMutation = () => {
  const router = useRouter();
  const apiUtils = api.useUtils();
  const localStorage = useLocalStorage();

  return api.org.create.useMutation({
    onMutate: async () => {
      await apiUtils.org.getAll.cancel();
      const previousQueryData = apiUtils.org.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onSuccess: async (data) => {
      localStorage?.setItem("recent-org-id", data.id || "");
      router.push(`/dashboard/${data.id}/forms`);
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getAll.setInfiniteData({}, ctx?.previousQueryData);
    },
    onSettled: async () => {
      await apiUtils.org.getAll.invalidate();
    },
  });
};

export const useOrgUpdateMutation = (id: string) => {
  const apiUtils = api.useUtils();

  return api.org.updateById.useMutation({
    onMutate: async () => {
      await apiUtils.org.getById.cancel({ id });
      const previousQueryData = apiUtils.org.getById.getData({
        id,
      });
      return { previousQueryData };
    },
    onSuccess: () => {
      toast.success("Organization settings updated");
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getById.setData({ id }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.org.getById.invalidate({ id });
      await apiUtils.org.getAll.invalidate();
    },
  });
};

export const useOrgDeleteMutation = () => {
  const apiUtils = api.useUtils();

  return api.org.deleteById.useMutation({
    onMutate: async () => {
      await apiUtils.org.getAll.cancel();
      const previousQueryData = apiUtils.org.getAll.getInfiniteData();
      return { previousQueryData };
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getAll.setInfiniteData({}, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.org.getAll.invalidate();
    },
  });
};

export const useCreateOrgInviteMutation = () => {
  const apiUtils = api.useUtils();
  const router = useRouter();

  return api.org.createInvite.useMutation({
    onSuccess: async (data, input) => {
      router.push(`/dashboard/${input.orgId}/settings/members?tab=invites`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error", { description: error.message });
    },
    onSettled: async (data, _, input) => {
      apiUtils.org.getInvites.invalidate({ id: input.orgId });
    },
  });
};

export const useOrgUpdateMemberRoleMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.org.updateMemberRole.useMutation({
    onMutate: async () => {
      await apiUtils.org.getMembers.cancel({ id: orgId });
      const previousQueryData = apiUtils.org.getMembers.getData({
        id: orgId,
      });
      return { previousQueryData };
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getMembers.setData({ id: orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.org.getMembers.invalidate({ id: orgId });
    },
  });
};

export const useOrgMemberDeleteMutation = (orgId: string) => {
  const apiUtils = api.useUtils();

  return api.org.deleteMember.useMutation({
    onMutate: async () => {
      await apiUtils.org.getMembers.cancel({ id: orgId });
      const previousQueryData = apiUtils.org.getMembers.getData({
        id: orgId,
      });
      return { previousQueryData };
    },
    onError: (error, _, ctx) => {
      console.log(error);
      apiUtils.org.getMembers.setData({ id: orgId }, ctx?.previousQueryData);
      toast.error("Error", { description: error.message });
    },
    onSettled: async () => {
      await apiUtils.org.getMembers.invalidate({ id: orgId });
    },
  });
};
