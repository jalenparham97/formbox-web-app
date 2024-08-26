import { OnboardingOrgCreateForm } from "@/components/onboarding/onboarding-org-create-form";
import { Logo } from "@/components/ui/logo";

export default function OnboardingCreateOrgPage() {
  return (
    <div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <Logo className="w-40" noLink />
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-[450px]">
        <div className="rounded-xl border border-gray-300 bg-white px-10 py-8 shadow-sm">
          <h2 className="text-xl font-bold leading-9 text-gray-900">
            Create an organization
          </h2>
          <p className="mt-1 leading-6 text-gray-600">
            We just need some basic info to get your profile setup. You will be
            able to edit this later.
          </p>

          <div className="mt-6">
            <OnboardingOrgCreateForm />
          </div>
        </div>
      </div>
    </div>
  );
}
