"use client";

import { unsplash, type UnsplashPhoto } from "@/libs/unsplash";
import { useHover } from "@/hooks/use-hover";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Props {
  query: string;
  selectImage: (photo: UnsplashPhoto) => Promise<void>;
}

export function UnsplashPhotoViewer({ query, selectImage }: Props) {
  const { data: photos } = useQuery({
    queryKey: ["unsplash", query],
    queryFn: async () =>
      await unsplash.search.getPhotos({
        query: query || "random",
        orientation: "landscape",
        perPage: 30,
      }),
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-3">
        {photos?.response?.results?.map((photo) => (
          <UnsplashPhotoContainer
            photo={photo}
            onSelect={selectImage}
            key={photo.id}
          />
        ))}
      </div>
    </div>
  );
}

interface PhotoContainerProps {
  photo: UnsplashPhoto;
  onSelect: (photo: UnsplashPhoto) => Promise<void>;
}

function UnsplashPhotoContainer({ photo, onSelect }: PhotoContainerProps) {
  const { hovered, ref } = useHover();

  const onImageSelect = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    photo: UnsplashPhoto,
  ) => {
    e.preventDefault();
    onSelect(photo);
  };

  const stopPropation = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={ref}
      key={photo.id}
      className="relative cursor-pointer rounded-md hover:opacity-75"
      onClick={(e) => onImageSelect(e, photo)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.urls.regular}
        alt={photo.alt_description as string}
        className="h-full w-full rounded-md object-cover"
        // width={400}
        // height={400}
      />
      {hovered && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-md px-[8px] py-[5px]"
          style={{
            background:
              "linear-gradient(-180deg, transparent 0%, rgb(38, 38, 39) 100%)",
          }}
        >
          <Link
            href={`https://unsplash.com/@${photo.user.username}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={stopPropation}
            className="text-xs font-medium text-white no-underline hover:underline"
          >
            {photo.user.first_name} {photo.user.last_name}
          </Link>
        </div>
      )}
    </div>
  );
}
