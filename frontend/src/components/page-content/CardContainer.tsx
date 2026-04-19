import { StrapiMedia, StrapiEndpoints } from "@/types/strapi";
import { getFullImageUrl } from "@/utils/strapi-helper";

export type CardItem = {
  id?: number | string;
  Image?: StrapiMedia;
  Link?: string;
  Text?: string;
};

export type CardContainerBlock = {
  __component: "content.card-container";
  id?: number | string;
  Cards?: CardItem[];
};

type Props = {
  block: CardContainerBlock;
  endpoint: StrapiEndpoints;
};

function Card({
  card,
  endpoint,
}: {
  card: CardItem;
  endpoint: StrapiEndpoints;
}) {
  const imageUrl = card.Image ? getFullImageUrl(card.Image, endpoint) : undefined;
  const mime = card.Image?.mime ?? "";

  const content = (
    // th-card: individual card shell
    <div className="th-card h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {imageUrl && mime.startsWith("image/") && (
        <>
          {/* th-card-media th-card-image: image media area */}
          <img
            src={imageUrl}
            alt={card.Image?.alternativeText || card.Image?.name || ""}
            className="th-card-media th-card-image h-48 w-full object-cover"
          />
        </>
      )}

      {imageUrl && mime.startsWith("video/") && (
        <>
          {/* th-card-media th-card-video: video media area */}
          <video controls className="th-card-media th-card-video h-auto w-full">
            <source src={imageUrl} type={mime} />
            Your browser does not support the video tag.
          </video>
        </>
      )}

      {imageUrl && mime.startsWith("audio/") && (
        // th-card-audio-wrap: audio player container
        <div className="th-card-audio-wrap p-4">
          {/* th-card-media th-card-audio: audio player */}
          <audio controls className="th-card-media th-card-audio w-full">
            <source src={imageUrl} type={mime} />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {imageUrl &&
        mime &&
        !mime.startsWith("image/") &&
        !mime.startsWith("video/") &&
        !mime.startsWith("audio/") && (
          // th-card-file-wrap: generic file download area
          <div className="th-card-file-wrap p-4">
            {/* th-card-file-link: generic file link */}
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="th-card-file-link inline-block rounded-lg border px-3 py-2 hover:bg-gray-50"
            >
              {card.Image?.name || "Download file"}
            </a>
          </div>
        )}

      {card.Text && (
        // th-card-content th-card-text: card body text area
        <div
          className="th-card-content th-card-text prose max-w-none p-4"
          dangerouslySetInnerHTML={{ __html: card.Text }}
        />
      )}
    </div>
  );

  if (card.Link) {
    const isExternal = card.Link.startsWith("http");

    return (
      // th-card-link-wrap: clickable wrapper around the full card
      <a
        href={card.Link}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer" : undefined}
        className="th-card-link-wrap block h-full"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function CardContainer({ block, endpoint }: Props) {
  const cards = block.Cards ?? [];

  if (!cards.length) return null;

  return (
    // th-card-container: outer section for the card container block
    <section className="th-card-container w-full">
      {/* th-card-container-grid: grid layout for cards */}
      <div className="th-card-container-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card key={card.id ?? index} card={card} endpoint={endpoint} />
        ))}
      </div>
    </section>
  );
}