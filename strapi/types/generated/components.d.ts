import type { Schema, Struct } from '@strapi/strapi';

export interface ContentCard extends Struct.ComponentSchema {
  collectionName: 'components_content_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    Link: Schema.Attribute.String;
    Text: Schema.Attribute.RichText;
  };
}

export interface ContentCardContainer extends Struct.ComponentSchema {
  collectionName: 'components_content_card_containers';
  info: {
    displayName: 'Card Container';
  };
  attributes: {
    Cards: Schema.Attribute.Component<'content.card', true>;
  };
}

export interface ImageCarousel extends Struct.ComponentSchema {
  collectionName: 'components_image_carousels';
  info: {
    displayName: 'Carousel';
  };
  attributes: {
    Images: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface ImageMedia extends Struct.ComponentSchema {
  collectionName: 'components_image_media';
  info: {
    displayName: 'Media';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface PageSeo extends Struct.ComponentSchema {
  collectionName: 'components_page_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface TextRichText extends Struct.ComponentSchema {
  collectionName: 'components_text_rich_texts';
  info: {
    displayName: 'Rich Text';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    Orientation: Schema.Attribute.Enumeration<['Left', 'Center', 'Right']> &
      Schema.Attribute.DefaultTo<'Left'>;
  };
}

export interface TextTextAndImage extends Struct.ComponentSchema {
  collectionName: 'components_text_text_and_images';
  info: {
    displayName: 'Text and Image';
  };
  attributes: {
    Image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imagePosition: Schema.Attribute.Enumeration<['Left', 'Right']> &
      Schema.Attribute.DefaultTo<'Right'>;
    Text: Schema.Attribute.Component<'text.rich-text', false>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.card': ContentCard;
      'content.card-container': ContentCardContainer;
      'image.carousel': ImageCarousel;
      'image.media': ImageMedia;
      'page.seo': PageSeo;
      'text.rich-text': TextRichText;
      'text.text-and-image': TextTextAndImage;
    }
  }
}
