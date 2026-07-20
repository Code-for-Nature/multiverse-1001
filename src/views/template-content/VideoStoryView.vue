<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { Page } from 'localcosmos-client';
import type { ContentVideo } from '@/types/template-content';
import { useTemplateContent } from '@/composables/useTemplateContent';
import type { TemplateContentSource } from '@/composables/useTemplateContent';
import TemplateContentContainer from '@/components/container/TemplateContentContainer.vue';
import VideoEmbed from '@/components/template-content/VideoEmbed.vue';
import LargeCard from '@/components/container/LargeCard.vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const { fetchTemplateContent } = useTemplateContent();

const loading = ref<boolean>(true);

const route = useRoute();
const slug = route.params.slug as string; 
const templateData = ref<Page| null>(null);
const templateSource = ref<TemplateContentSource | null>(null);


const video = ref<ContentVideo | null>(null);

onMounted(async() => {
  const result = await fetchTemplateContent(slug);
  templateData.value = result.templateData;
  templateSource.value = result.source;
  if (templateData.value) {
    video.value = templateData.value.contents.video || null;
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
    <div v-if="templateData" class="container">
      <LargeCard class="pb-2xl page-padding-y">
        <div class="container-md sm-page-padding-x">
          <div class="py-2xl">
          <h1 class="mt-2xl">{{ templateData.title }}</h1>
          </div>
        </div>
        <div class="mt-xl">
            <VideoEmbed v-if="video" :video="video" />
            <div v-else class="text-center text-gray-500">No video available</div>
        </div>
      </LargeCard>
    </div>
  </TemplateContentContainer>
</template>

<style scoped>


/* Tablet and up: image right, text left */
@media (min-width: 768px) {

}

@media (min-width: 640px) {
}

@media (min-width: 1024px) {

}

@media (min-width: 1280px) {

}

@media (min-width: 1536px) {

}
</style>