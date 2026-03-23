import { StrapiEndpoints } from "@/types/strapi";
import { GetData, getStrapiData, getStrapiDataById } from "./strapi-helper";

const populateFuctions: {[key: string]: (data: any, strapiEndpoint: StrapiEndpoints) => Promise<any>} = {
}

type ComponentPopulateRegistry = {
  [componentUID: string]: GetData;
};

const PAGE_CONTENT_COMPONENTS: Record<string, GetData> = {
    "text.rich-text": {},
    "text.text-and-image": {
        populate: [
            {
                field: "Image",
            },
        ],
    },
    "image.carousel": {
        populate: [
            {
                field: "Images",
            },
        ],
    },
    "image.media": {
        populate: [
            {
                field: "media",
            },
        ],
    },
    "content.card-container": {
        populate: [
            {
                field: "Cards",
                data: {
                    populate: [
                        {
                            field: "Image",
                        },
                    ],
                },
            },
        ],
    },
}

export function populatePageContentBase(): GetData {
  return {
    populate: [
      {
        field: "content",
        data: {
          // NOTE: this assumes you'll extend GetData to support `on`
          on: PAGE_CONTENT_COMPONENTS,
        } as any, // temporary until builder supports `on`
      },
    ],
  };
}

interface PageContentData{
    Page: string,
    createdAt: string,
    documentId: string,
    id: number,
    publishedAt: string,
    updatedAt: string,
    content?: any[]
}

async function getContent(page: PageContentData, strapiEndpoint: StrapiEndpoints): Promise<PageContentData>{
    return (await getStrapiDataById(
        strapiEndpoint,
        "page-contents",
        page.documentId,
        populatePageContentBase()
    )).data;
}

export async function fullContentResolve(page: PageContentData, strapiEndpoint: StrapiEndpoints): Promise<PageContentData> {
    page = await getContent(page, strapiEndpoint);

    // console.log('page', page);

    const tasks: Promise<any>[] = [];
    
    if(page.content){
        page.content.forEach(content => {
            tasks.push(populateContent(content, strapiEndpoint));
        });
    }

    page.content = await Promise.all(tasks);

    return page;
}

export async function populateContent(data: any, strapiEndpoint: StrapiEndpoints) {
    const func = populateFuctions[data.__component];

    if(func == null){
        return data;
    }
    return await func(data, strapiEndpoint);
}

async function PopulatePages(pages: PageContentData[], strapiEndpoint: StrapiEndpoints): Promise<PageContentData[]> {
  const resolvedPageContentsTasks: Promise<PageContentData>[] = [];

  for (const page of pages) {
    resolvedPageContentsTasks.push(fullContentResolve(page, strapiEndpoint))
  }

  return await Promise.all(resolvedPageContentsTasks);
}
