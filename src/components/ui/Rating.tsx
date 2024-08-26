"use client";

import { cn } from "@/utils/tailwind-helpers";
import { IconStar } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
  className?: string;
  ratingCount?: number;
  size?: number;
  onChange?: (rating: string) => void;
}

export function Rating({ ratingCount = 5, size = 30, onChange }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRating(Number(e.target.value));
    onChange?.(e.target.value);
  };

  return (
    <div className="flex">
      {[...Array(ratingCount)].map((_, i) => {
        const ratingValue = i + 1;
        return (
          <label key={i}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
              onChange={handleChange}
            />
            <IconStar
              size={size}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              className={cn(
                "cursor-pointer",
                ratingValue <= (hover || rating)
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-gray-200 stroke-gray-200",
              )}
            ></IconStar>
          </label>
        );
      })}
    </div>
  );
}
