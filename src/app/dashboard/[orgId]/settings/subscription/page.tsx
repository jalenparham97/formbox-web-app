import ManageSubscriptionButton from "@/components/subscription/manage-subscription-button";
import PricingSection from "@/components/subscription/pricing-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { api } from "@/trpc/server";
import { type Metadata } from "next";
import Link from "next/link";

interface Props {
  params: { orgId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const org = await api.org.getById({ id: params.orgId });
  return {
    title: `Subscription - ${org?.name}`,
  };
}

export default async function SettingsSubscriptionPage({
  params: { orgId },
}: Props) {
  const org = await api.org.getById({ id: orgId });
  const products = await api.payment.getProducts();

  const currentPlan = org?.stripePlan ?? "Free";

  return (
    <div>
      <div className="">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-gray-900">
            Subscription
          </h2>
          <p className="mt-1 leading-6 text-gray-600">
            View and edit your billing details, as well as cancel your
            subscription.
          </p>
        </div>

        <div className="mt-6">
          <Card>
            <div>
              <div className="p-6">
                <div>
                  <h2 className="text-lg font-semibold">Current plan</h2>
                  <p className="mt-2 text-gray-600">
                    Your current plan:{" "}
                    <span className="font-semibold capitalize text-gray-900">
                      {currentPlan}
                    </span>
                  </p>
                </div>
              </div>
              <Divider />
              <div className="p-6">
                <ManageSubscriptionButton orgId={orgId} />
              </div>
            </div>
          </Card>
        </div>

        {!org?.stripePlan && (
          <div className="mt-10 lg:max-w-7xl">
            <PricingSection products={products} org={org} />
          </div>
        )}

        <div className="mt-10">
          <Card>
            <div>
              <div className="p-6">
                <div>
                  <h2 className="text-lg font-semibold">Need anything else?</h2>
                  <p className="mt-2 text-gray-600">
                    If you need any further help with billing, our support team
                    are here to help.
                  </p>
                </div>
              </div>
              <Divider />
              <div className="p-6">
                <a href="mailto:"></a>
                <Link
                  href="mailto:support@formbox.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">Contact support</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
