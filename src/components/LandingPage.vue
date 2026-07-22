<script setup lang="ts">
import { ref, inject, onMounted } from 'vue';
import type { TaxonProfiles, TaxonWithImage, SearchTaxon } from 'localcosmos-client';
import ImageCard from '@/components/ui/ImageCard.vue';
import TaxonName from './ui/TaxonName.vue';
import { getTodaysHero } from '@/composables/getTodaysHero';

import TaxonProfileLink from './ui/TaxonProfileLink.vue';
import HeroPoster from './ui/HeroPoster.vue';

import LoadingSpinner from './ui/LoadingSpinner.vue';

const taxonProfiles = inject('taxonProfiles') as TaxonProfiles;
const todaysHero = ref<TaxonWithImage|null>(null);
const randomTaxa = ref<SearchTaxon[]>([]);
const loading = ref<boolean>(true);

onMounted(async()=>{
  const hero:TaxonWithImage|null = await getTodaysHero();
  if (hero) {
    todaysHero.value = hero;
  }

  randomTaxa.value = taxonProfiles.getRandomTaxonProfiles();

  loading.value = false;
});
</script>

<template>
  <div class="min-h-full">
    <div v-if="loading" class="page-padding container">
      <LoadingSpinner />
    </div>
    <div v-else>
      <div class="hero-container">
        <div class="hero-left"></div>
        <HeroPoster v-if="todaysHero" :hero="todaysHero" />
        <div class="hero-right"></div>
      </div>
      <div class="bg-translucent">
        <div class="page-padding container">
          <div
            v-if="randomTaxa.length"
            class="mt-2xl"
          >
            <div class="mb-lg">
              <h1>{{ $t('Have you heard of it?') }}</h1>
            </div>
            <div class="random-taxa">
              <div
                v-for="(taxon, counter) in randomTaxa"
                :key="counter"
              >
                <TaxonProfileLink
                  :taxon="taxon"
                  class="nolinkstyle"
                >
                  <ImageCard :image="taxon.image" :show-caption="false">
                    <TaxonName
                      :taxon-latname="taxon.taxonLatname"
                      :taxon-author="taxon.taxonAuthor"
                      :hide-taxon-author="true"
                      :narrow="true"
                    >
                    </TaxonName>
                  </ImageCard>
                </TaxonProfileLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.hero > div, .hero > a {
  display: block;
  max-width: 400px;
}

.hero-left,
.hero-right {
  display: none;
}

.random-taxa {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--gap-medium);
}

@media (min-width: 640px) {
}

@media (min-width: 768px) {
  .random-taxa {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {

}

@media (min-width: 1280px) {
  .hero-container {
    display: flex;
    align-items: stretch;
    width: 100%;
  }

  .hero-left,
  .hero-right {
    display: block;
    flex: 1 1 auto;
    pointer-events: none;
  }

  .hero-left {
    background: linear-gradient(to right,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.35) 40%,
      rgba(0, 0, 0, 0.52) 62%,
      rgba(0, 0, 0, 0.7) 80%,
      rgba(0, 0, 0, 1.0) 100%);
  }

  .hero-right {
    background: linear-gradient(to left,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.35) 40%,
      rgba(0, 0, 0, 0.52) 62%,
      rgba(0, 0, 0, 0.7) 80%,
      rgba(0, 0, 0, 1.0) 100%);
  }

  .hero-container :deep(.hero-poster) {
    margin-left: 0;
    margin-right: 0;
  }
}

@media (min-width: 1536px) {

}
</style>