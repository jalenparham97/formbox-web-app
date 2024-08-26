import { Loader } from "@/components/ui/loader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Loader size={50} />
    </div>
  );
}
