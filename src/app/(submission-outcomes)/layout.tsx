import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

interface Props {
  children: React.ReactNode;
}

export default function OutcomesLayout({ children }: Props) {
  return (
    <div className="h-full">
      {children}

      <>
        <Link href="https://formbox.app">
          <div className="fixed bottom-4 right-4 hidden md:block">
            <Button variant="outline" className="text-base">
              <div className="flex items-center space-x-2">
                <span>Powered by</span>{" "}
                <span>
                  <Logo className="w-24" noLink />
                </span>
              </div>
            </Button>
          </div>

          <div className="fixed bottom-0 block w-full md:hidden">
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-none text-base"
            >
              <div className="flex items-center space-x-2">
                <span>Powered by</span>{" "}
                <span>
                  <Logo className="w-24" noLink />
                </span>
              </div>
            </Button>
          </div>
        </Link>
      </>
    </div>
  );
}
