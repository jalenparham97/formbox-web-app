"use client";

import { Button } from "./button";
import { IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface Props {
  buttonText?: string;
  buttonUrl?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
}

export function RouterButton({
  buttonText,
  buttonUrl,
  buttonBackgroundColor,
  buttonTextColor,
}: Props) {
  const router = useRouter();

  const buttonTextToDisplay = buttonText || "Return to form";

  function handleClick() {
    if (buttonUrl) {
      router.push(buttonUrl);
    } else {
      router.back();
    }
  }

  return (
    <Button
      variant="secondary"
      size={"lg"}
      leftIcon={<IconArrowLeft size={16} />}
      onClick={handleClick}
      style={{
        backgroundColor: buttonBackgroundColor || "#f3f4f6",
        color: buttonTextColor || "#030712",
      }}
    >
      {buttonTextToDisplay}
    </Button>
  );
}
