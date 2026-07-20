import { inject } from 'vue';
import type { Features, FrontendSettings, ImageUrls, ImageWithTextAndLicence, LocalCosmosApi } from 'localcosmos-client';
import { LCApiResultTypes } from 'localcosmos-client';
import type { MultiversePage } from '@/types/template-content';
import { useNetworkInformationStore } from '@/stores/network-information';

export enum TemplateContentSource {
  REMOTE = 'remote',
  LOCAL = 'local',
  PREVIEW = 'preview'
}


export enum TemplateContentFetchReason {
  OFFLINE = 'offline',
  API_FAILED = 'api_failed',
  LOCAL_IS_UP_TO_DATE = 'local_is_up_to_date'
}

export type FetchTemplateContentResult = {
  templateData: MultiversePage | null;
  source: TemplateContentSource | null;
  reason: TemplateContentFetchReason | null;
};


export function useTemplateContent() {
  const isInPreviewMode = inject('isInPreviewMode') as boolean;
  const features = inject('features') as Features;
  const settings = inject('settings') as FrontendSettings;
  const LCApi = inject('LCApi') as LocalCosmosApi;
  const networkInformationStore = useNetworkInformationStore();

  const templateContentImageUrl = (imageUrl: string, source: TemplateContentSource | null): string => {
    let serverUrl = '';

    if (settings.PREVIEW === true || source === TemplateContentSource.PREVIEW || source === TemplateContentSource.REMOTE) {
      serverUrl = settings.SERVER_URL;
    }

    // Make sure this does not result in a double slash in the URL.
    if (serverUrl.endsWith('/') && imageUrl.startsWith('/')) {
      serverUrl = serverUrl.slice(0, -1);
    }

    return `${serverUrl}${imageUrl}`;
  };

  const templateContentImageUrlsToSrcSet = (imageUrls: ImageUrls, source: TemplateContentSource | null): string => {
    const availableSizes: Partial<Record<'1x' | '2x' | '4x' | '8x', number>> = {
      ...(imageUrls['1x'] ? { '1x': 250 } : {}),
      ...(imageUrls['2x'] ? { '2x': 500 } : {}),
      ...(imageUrls['4x'] ? { '4x': 1000 } : {}),
      ...(imageUrls['8x'] ? { '8x': 2000 } : {})
    };

    const srcSetSizes = settings.OPTIONS.doNotBuildLargeImages === true
      ? ['1x', '2x'] as const
      : ['1x', '2x', '4x', '8x'] as const;

    const firstAvailableImageUrl = srcSetSizes
      .map((size) => imageUrls[size])
      .find((imageUrl) => Boolean(imageUrl));

    let serverUrl = '';

    if (settings.PREVIEW === true || source === TemplateContentSource.PREVIEW || source === TemplateContentSource.REMOTE) {
      serverUrl = settings.SERVER_URL;
    }

    if (serverUrl.endsWith('/') && firstAvailableImageUrl?.startsWith('/')) {
      serverUrl = serverUrl.slice(0, -1);
    }

    return srcSetSizes
      .filter((size) => Boolean(imageUrls[size]) && Boolean(availableSizes[size]))
      .map((size) => `${serverUrl}${imageUrls[size]} ${availableSizes[size]}w`)
      .join(', ');
  };

  const getImagePath = (image: ImageWithTextAndLicence | null | undefined): string | null => {
    if (!image?.imageUrl) {
      return null;
    }

    return image.imageUrl['8x']
      || image.imageUrl['4x']
      || image.imageUrl['2x']
      || image.imageUrl['1x']
      || Object.values(image.imageUrl).find((url) => Boolean(url))
      || null;
  };

  const fetchTemplateContent = async (slug: string): Promise<FetchTemplateContentResult> => {
    const isOnline = networkInformationStore.isOnline;

    const tcResult: FetchTemplateContentResult = {
      templateData: null,
      source: null,
      reason: null
    };

    let localPage: MultiversePage | null = null;

    if (isInPreviewMode) {
      const result = await LCApi.getTemplateContentPreview(slug);
      if (result.type === LCApiResultTypes.success) {
        tcResult.templateData = result.data as MultiversePage;
        tcResult.source = TemplateContentSource.PREVIEW;
      }
    } else {
      if (features && features.TemplateContent && features.TemplateContent.slugs && features.TemplateContent.slugs[slug]) {

        let remotePage: MultiversePage | null = null;

        if (isOnline) {
          const response = await LCApi.getTemplateContent(slug);
          if (response.type === LCApiResultTypes.success) {
            remotePage = response.data as MultiversePage;
          }

        }

        const url = features.TemplateContent.slugs[slug].path;
        const response = await fetch(url);
        localPage = await response.json() as MultiversePage;

        if (remotePage && remotePage.version > localPage.version) {
          tcResult.templateData = remotePage;
          tcResult.source = TemplateContentSource.REMOTE;
          console.debug('Fetched template content from API', url, tcResult.templateData);
        } else {
          tcResult.templateData = localPage;
          tcResult.source = TemplateContentSource.LOCAL;
          console.debug('Fetched template content from features', url, tcResult.templateData);
        }
      }
    }

    return tcResult;
  };

  return {
    fetchTemplateContent,
    getImagePath,
    templateContentImageUrl,
    templateContentImageUrlsToSrcSet
  };
}