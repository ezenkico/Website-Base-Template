import { StrapiMedia, StrapiEndpoints } from "@/types/strapi";
import { getFullImageUrl } from "@/utils/strapi-helper";

export type MediaBlock = {
  __component: "image.media";
  id?: number | string;
  media?: StrapiMedia;
};

type Props = {
  block: MediaBlock;
  endpoint: StrapiEndpoints;
};

export default function Media({ block, endpoint }: Props) {
  const media = block.media;

  if (!media) return null;

  const mime = media.mime ?? "";
  const url = getFullImageUrl(media, endpoint);

  if (!url) return null;

  if (mime.startsWith("image/")) {
    return (
      <section className="w-full">
        <img
          src={url}
          alt={media.alternativeText || media.name || ""}
          className="w-full h-auto rounded-xl object-cover"
        />
      </section>
    );
  }

  if (mime.startsWith("video/")) {
    return (
      <section className="w-full">
        <video controls className="w-full rounded-xl">
          <source src={url} type={mime} />
          Your browser does not support the video tag.
        </video>
      </section>
    );
  }

  if (mime.startsWith("audio/")) {
    return (
      <section className="w-full">
        <audio controls className="w-full">
          <source src={url} type={mime} />
          Your browser does not support the audio element.
        </audio>
      </section>
    );
  }

  return (
    <section className="w-full">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        {media.name || "Download file"}
      </a>
    </section>
  );
}