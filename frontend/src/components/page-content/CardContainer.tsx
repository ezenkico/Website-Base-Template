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
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm h-full">
      {imageUrl && mime.startsWith("image/") && (
        <img
          src={imageUrl}
          alt={card.Image?.alternativeText || card.Image?.name || ""}
          className="w-full h-48 object-cover"
        />
      )}

      {imageUrl && mime.startsWith("video/") && (
        <video controls className="w-full h-auto">
          <source src={imageUrl} type={mime} />
          Your browser does not support the video tag.
        </video>
      )}

      {imageUrl && mime.startsWith("audio/") && (
        <div className="p-4">
          <audio controls className="w-full">
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
          <div className="p-4">
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg border px-3 py-2 hover:bg-gray-50"
            >
              {card.Image?.name || "Download file"}
            </a>
          </div>
        )}

      {card.Text && (
        <div
          className="p-4 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: card.Text }}
        />
      )}
    </div>
  );

  if (card.Link) {
    return (
      <a
        href={card.Link}
        target={card.Link.startsWith("http") ? "_blank" : undefined}
        rel={card.Link.startsWith("http") ? "noreferrer" : undefined}
        className="block h-full"
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
    <section className="w-full">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Card
            key={card.id ?? index}
            card={card}
            endpoint={endpoint}
          />
        ))}
      </div>
    </section>
  );
}