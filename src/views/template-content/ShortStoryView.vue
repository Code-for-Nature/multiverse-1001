<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ImageWithTextAndLicence, Page } from 'localcosmos-client';

type GalleryImage = ImageWithTextAndLicence & { aspectRatio: string };
import { useTemplateContent } from '@/composables/useTemplateContent';
import type { TemplateContentSource } from '@/composables/useTemplateContent';
import TemplateContentContainer from '@/components/container/TemplateContentContainer.vue';

import { useRouter } from 'vue-router';
import { useLanguageStore } from '@/stores/language';

import { MasonryWall } from '@yeger/vue-masonry-wall'
import ImagePreview from '@/components/images/ImagePreview.vue';

const router = useRouter();
const languageStore = useLanguageStore();
const { fetchTemplateContent, templateContentImageUrl } = useTemplateContent();

const loading = ref<boolean>(true);

const route = useRoute();
const slug = route.params.slug as string; 
const templateData = ref<Page| null>(null);
const templateSource = ref<TemplateContentSource | null>(null);

const galleryImages = ref<GalleryImage[]>([]);

const preloadImage = (url: string): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 4, height: 3 });
    img.src = url;
  });

let date: string | null = null;

onMounted(async() => {
  const result = await fetchTemplateContent(slug);
  templateData.value = result.templateData;
  templateSource.value = result.source;
  if (templateData.value) {
    if (templateData.value?.publishedAt ||  templateData.value?.lastModified ) {
      date = new Date(templateData.value?.publishedAt ||  templateData.value?.lastModified).toLocaleDateString(languageStore.currentLanguage, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (templateData.value.contents.imageGallery && templateData.value.contents.imageGallery.length > 0) {
      for (const image of templateData.value.contents.imageGallery) {
        const url1x = templateContentImageUrl(image.imageUrl['1x'], templateSource.value);
        const { width, height } = await preloadImage(url1x);
        const galleryImage: GalleryImage = {
          imageUrl: {
            '1x': url1x,
            '2x': templateContentImageUrl(image.imageUrl['2x'], templateSource.value),
            '4x': templateContentImageUrl(image.imageUrl['4x'], templateSource.value),
          },
          text: image.text,
          licence: image.licence,
          aspectRatio: `${width} / ${height}`,
        };
        galleryImages.value.push(galleryImage);
      }
    }

  }
  else {
    // 404 Not Found
    router.replace({ name: 'not-found' });
  }
  loading.value = false;
});
</script>

<template>
  <TemplateContentContainer :loading="loading">
    <div v-if="templateData">
      <div class="rail-padding">
        <div
          class="featured-image"
          :style="{
            backgroundImage: templateData.contents.featuredImage
              ? `url(${templateContentImageUrl(templateData.contents.featuredImage.imageUrl['4x'], templateSource)})`
              : 'none'
          }"
        >
          <div class="featured-image-overlay"></div>
          <div class="story-meta">
            <div>
              <div class="story-title">
                <h1>{{ templateData.title }}</h1>
              </div>
              <div v-if="templateData.contents.scientificName" class="story-scientific-name mb-md">
                <i>{{ templateData.contents.scientificName }}</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container bg-solid page-padding-bottom">
        <div class="story-content-container pt-3xl">
          <div class="article-container leading-sentence px-2xl mb-2xl" v-if="templateData.contents.leadingSentence" v-html="templateData.contents.leadingSentence"></div>
          <div class="article-container px-2xl" v-html="templateData.contents.text"></div>
        </div>
        <div class="story-gallery-container">
          <div class="article-container px-2xl mt-2xl">
            <MasonryWall :items="galleryImages" :min-columns="2" :gap="16">
              <template #default="{ item }">
                <div :style="{ aspectRatio: item.aspectRatio }">
                  <ImagePreview :image="item" :show-caption="false" />
                </div>
              </template>
            </MasonryWall>
          </div>
        </div>
      </div>
    </div>
  </TemplateContentContainer>
</template>

<style scoped>

.featured-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 90vh;
  height: 90dvh;
  background-color: var(--sea-change-dark-green);
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.featured-image-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.2) 20%, rgba(0, 0, 0, 0.68) 100%);
  z-index: 0;
}

.story-meta {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--size-xl);
}

.story-meta > div {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.story-scientific-name {
  font-style: italic;
  font-size: 38px;
  color: var(--sea-change-yellow);
  font-family: var(--font-lusitana-1001);
}

.story-content-container, .story-gallery-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.story-content-container {
    padding-top: 100px;
}

.story-gallery-container {
  padding-top: 50px;
}

.story-date {
  color: var(--sea-change-yellow);
  font-size: 19px;
  font-family: var(--font-grotesque-1001);
  font-weight: 200;
  text-transform: uppercase;
}

.story-author {
  color: #FFFFFF;
  font-size: 19px;
  font-family: var(--font-grotesque-1001);
  text-transform: uppercase;
  font-weight: 800;
}

.story-title h1 {
  color: #FFFFFF;
}

.leading-sentence {
  font-weight: bold;
  font-size: 22px;
  color: var(--sea-change-dark-green);
  font-family: var(--font-lusitana-1001);
}

.masonry-item {
  border: 1px solid red;
}

.masonry-item img {
  width: 100%;
  height: auto;
  display: block;
}

/* Tablet and up: image right, text left */
@media (min-width: 768px) {
}

@media (min-width: 640px) {
}

@media (min-width: 1024px) {

}

@media (min-width: 1280px) {
  .story-title h1 {
    font-size: 54px;
  }

  .story-scientific-name {
    font-size: 49px;
  }

}

@media (min-width: 1536px) {

}
</style>