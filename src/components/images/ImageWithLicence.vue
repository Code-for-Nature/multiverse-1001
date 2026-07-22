<script setup lang="ts">
import type { ImageUrls, ImageWithTextAndLicence } from 'localcosmos-client';
import { imageUrlsToSrcSet } from '@/composables/imageUrlsToSrcSet';
import { useTemplateContent } from '@/composables/useTemplateContent';
import LicenceCircle from '@/components/legal/LicenceCircle.vue';
import type { TemplateContentSource } from '@/composables/useTemplateContent';

const { templateContentImageUrlsToSrcSet, templateContentImageUrl } = useTemplateContent();

const props = withDefaults(defineProps<{
  image: ImageWithTextAndLicence,
  sizes?: string,
  rounded?: string,
  title? : string,
  altText?: string,
  showCaption?: boolean,
  singleLineCaption?: boolean,
  isTemplateContentImage?: boolean, // If true, use different styling for template content images
  templateContentSource?: TemplateContentSource | null, // Optional prop to pass the source for template content images
}>(),(
  {
    showCaption: true,
    singleLineCaption: false,
    isTemplateContentImage: false,
  }
));

const srcSetFn = (imageUrl: ImageUrls): string => {
  if (props.isTemplateContentImage && props.templateContentSource) {
    return templateContentImageUrlsToSrcSet(imageUrl, props.templateContentSource);
  } else {
    return imageUrlsToSrcSet(imageUrl);
  }
}

const imageUrlFn = (imageUrl: string): string => {
  if (props.isTemplateContentImage && props.templateContentSource) {
    return templateContentImageUrl(imageUrl, props.templateContentSource);
  } else {
    return imageUrl;
  }
}

const hasCaption: boolean = !!(props.showCaption && props.image.text);

// sharpen the licence circle if there are no rounded
const sharpLicenceCircle = !props.rounded || (hasCaption && (
  props.rounded === 'rounded' ||
  props.rounded === 'rounded-xs' ||
  props.rounded === 'rounded-sm'
));

</script>

<template>
  <div class="image-with-licence">
    <div
      class="image-container"
      :class="{ 'has-caption': hasCaption }"
    >
      <img
        loading="lazy"
        :src="imageUrlFn(image.imageUrl['2x'])"
        :srcset="srcSetFn(image.imageUrl)"
        :sizes="sizes ? sizes : ''"
        :alt="altText ? altText : image.text ? image.text : ''"
        v-bind:class="rounded ? rounded : 'sharp'"
        v-bind:title="title ? title : undefined"
      />
      <LicenceCircle
        :imageUrl="image.imageUrl['1x']"
        class="image-licence-circle"
        :sharp="sharpLicenceCircle"
      />
    </div>
    <div v-if="showCaption && image.text" class="caption" :class="{ 'single-line-caption': singleLineCaption }">
      <div class="caption-content" v-html="image.text"></div>
      <div class="caption-fade"></div>
    </div>
  </div>
</template>

<style scoped>
.image-with-licence {
  width: 100%;
}

.image-container {
  width: 100%;
  position: relative; /* Ensure the LicenceCircle is positioned relative to this container */
  overflow: hidden; /* Prevent any overflow from affecting layout */
}

.image-container img {
  width: 100%;
  height: auto;
  display: block; /* Fix extra whitespace below the image */
}

.image-container img.rounded {
  border-radius: var(--border-radius-sm);
}

.image-container.has-caption img.rounded {
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
}

.image-container img.rounded-xs {
  border-radius: var(--border-radius-xs);
}

.image-container.has-caption img.rounded-xs {
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
}

.image-licence-circle {
  position: absolute;
  right: -9px;
  bottom: -9px;
}

.caption {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0;
  padding: var(--size-xs) 0 var(--size-xs) var(--size-md);
  background: var(--sea-change-dark-green);
  color: var(--sea-change-light-blue);
  border-radius: 0; /* Match image rounding */
}

.caption.single-line-caption {
  white-space: nowrap; /* Prevent text from wrapping */
  text-overflow: ellipsis; /* Show ellipsis for overflowed text */
  overflow: hidden; /* Hide overflowed content */
}

.caption-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  font-family: 'RobotoCondensed';
  font-weight: 400;
  font-size: var(--font-size-md);
}

.single-line-caption .caption-content {
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflowed content */
  text-overflow: ellipsis; /* Show ellipsis for overflowed text */
}

.caption-content :deep(p) {
  margin: 0;
}

.caption-fade {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 30px; /* Width of fade effect */
  background: linear-gradient(to right, transparent 0%, var(--sea-change-dark-green) 100%);
  pointer-events: none; /* Allow clicks to pass through */
}
</style>