import { OrgInviteAcceptButton } from "@/components/orgs/org-invite-accept-button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { auth } from "@/libs/auth";
import { api } from "@/trpc/server";
import { TRPCClientError } from "@trpc/client";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function InvitePage({ searchParams }: Props) {
  const session = await auth();
  const orgId = searchParams?.orgId as string;
  const email = searchParams?.email as string;

  let invite = null;
  let error = null;

  try {
    invite = await api.org.getInvite({ orgId, email });
  } catch (err) {
    if (err instanceof TRPCClientError) {
      console.log(err);
      error = err;
    }
  }

  return (
    <MaxWidthWrapper className="flex min-h-[70vh] flex-row items-center justify-center">
      {invite && !error && (
        <Card className="max-w-md p-10 text-center">
          <div className="flex justify-center">
            <Logo noLink />
          </div>
          <h3 className="mt-7 text-xl font-semibold">
            Organization Invitation
          </h3>
          <p className="text-dark-400 mt-3 leading-normal">
            You&apos;ve been invited to join and collaborate on the{" "}
            <span className="font-semibold">{invite?.org.name}</span>{" "}
            organization on Formbox
          </p>

          <div className="mt-7">
            <OrgInviteAcceptButton
              orgId={orgId}
              email={session?.user.email as string}
            />
          </div>
        </Card>
      )}

      {error && (
        <Card className="max-w-md p-10 text-center">
          <div className="flex justify-center">
            <Logo noLink />
          </div>
          <h3 className="mt-7 text-xl font-semibold">
            {error.message === "Invalid invitation" && "Invalid invitation"}
            {error.message === "Invitation expired" && "Invitation expired"}
          </h3>
          <p className="text-dark-400 mt-3 leading-normal">
            {error.message === "Invalid invitation" &&
              "The invitation does not exist or is invalid. Please contact the organization owner to get a new invitation."}
            {error.message === "Invitation expired" &&
              "The invitation is expired. Please contact the organization owner to get a new invitation."}
          </p>
        </Card>
      )}
    </MaxWidthWrapper>
  );
}
