"use client";

import {
  SegmentedControls,
  SegmentedControlsList,
  SegmentedControlsTrigger,
} from "@/components/ui/segmented-controls";
import type { Products } from "@/types/payment.types";
import { type OrgOutput } from "@/types/org.types";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { api } from "@/trpc/react";
import { Divider } from "../ui/divider";
import Link from "next/link";

type PriceFrequency = "month" | "year";

interface Props {
  products: Products;
  org: OrgOutput;
}

export default function PricingSection({ products, org }: Props) {
  const [frequency, setFrequency] = useState<PriceFrequency>("month");

  const sessionMutation = api.payment.getCheckoutSession.useMutation();
  const portalMutation = api.payment.getBillingPortalSession.useMutation();

  const handleUpgrade = async (priceId: string = "") => {
    const returnUrl = `${window.location.origin}/dashboard/${org.id}/settings/subscription`;
    if (org?.stripeSubscriptionStatus === "active") {
      const { url } = await portalMutation.mutateAsync({
        stripeCustomerId: org?.stripeCustomerId || "",
        returnUrl,
      });
      window?.location.assign(url);
    } else {
      const { url } = await sessionMutation.mutateAsync({
        priceId,
        returnUrl,
        orgId: org.id,
      });
      url && window?.location.assign(url);
    }
  };

  return (
    <div>
      <Card>
        <div className="p-6">
          <div>
            <h2 className="text-lg font-semibold leading-7 text-gray-900">
              Plans
            </h2>
            <p className="mt-1 leading-6 text-gray-600">
              Choose the plan thats right for you.
            </p>
          </div>
          <div className="mt-3">
            <SegmentedControls
              defaultValue={frequency}
              onValueChange={(frequency) =>
                setFrequency(frequency as PriceFrequency)
              }
            >
              <SegmentedControlsList>
                <SegmentedControlsTrigger value="month">
                  Monthly
                </SegmentedControlsTrigger>
                <SegmentedControlsTrigger value="year">
                  Yearly
                </SegmentedControlsTrigger>
              </SegmentedControlsList>
            </SegmentedControls>

            <div className="mt-6 w-full space-y-6 lg:flex lg:space-x-10 lg:space-y-0">
              {products
                ?.sort(
                  (pA, pB) =>
                    Number(pA?.prices?.month?.price) -
                    Number(pB?.prices?.month?.price),
                )
                .map((product) => (
                  <div className="" key={product.id}>
                    <div>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="mt-2 leading-normal text-gray-600">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <p className="mt-6 flex items-baseline gap-x-1">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">
                          {formatCurrency(product.prices[frequency].price) ||
                            "$0"}
                        </span>
                        <span className="text-sm font-semibold leading-loose text-gray-600">
                          / {frequency}
                        </span>
                      </p>

                      {!org?.stripeSubscriptionId && (
                        <div className="mt-6">
                          <Button
                            onClick={() =>
                              handleUpgrade(
                                product.prices[frequency].id as string,
                              )
                            }
                            disabled={
                              !org?.stripeSubscriptionId &&
                              product.name.toLowerCase() === "free"
                            }
                          >
                            Get plan
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Divider />

        <div className="p-6">
          <Link
            href="https://formbox.app/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">View full pricing table</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
