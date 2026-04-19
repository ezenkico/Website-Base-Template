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

function MediaComponent({ block, endpoint }: Props) {
  const media = block.media;

  if (!media) return null;

  const mime = media.mime ?? "";
  const url = getFullImageUrl(media, endpoint);

  if (!url) return null;

  if (mime.startsWith("image/")) {
    return (
      // th-media-item th-media-image: image element
      <img
        src={url}
        alt={media.alternativeText || media.name || ""}
        className="th-media-item th-media-image h-auto w-full rounded-xl object-cover"
      />
    );
  }

  if (mime.startsWith("video/")) {
    return (
      // th-media-item th-media-video: video element
      <video controls className="th-media-item th-media-video w-full rounded-xl">
        <source src={url} type={mime} />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (mime.startsWith("audio/")) {
    return (
      // th-media-audio-wrap: audio container
      <div className="th-media-audio-wrap w-full">
        {/* th-media-item th-media-audio: audio element */}
        <audio controls className="th-media-item th-media-audio w-full">
          <source src={url} type={mime} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return (
    // th-media-file-wrap: generic file container
    <div className="th-media-file-wrap">
      {/* th-media-file-link: download link */}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="th-media-file-link inline-block rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        {media.name || "Download file"}
      </a>
    </div>
  );
}

export default function Media(props: Props) {
  return (
    // th-media: outer section for media block
    <section className="th-media w-full">
      <MediaComponent block={props.block} endpoint={props.endpoint} />
    </section>
  );
}