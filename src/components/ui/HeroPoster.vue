<script setup lang="ts">
import type { TaxonWithImage } from 'localcosmos-client';
import { PhCaretRight } from '@phosphor-icons/vue';

import VernacularName from '../text/VernacularName.vue';
import TaxonProfileLink from './TaxonProfileLink.vue';
import ColorButton from './ColorButton.vue';


const props = defineProps<{
  hero: TaxonWithImage
}>();

const today = new Date();
const dateString = today.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
</script>

<template>
  <div class="hero-poster" >
    <div :style="'--hero-bg-image: url(' + hero.image.imageUrl['4x'] + ');'">
      <div>
        <div class="hero-date">
          {{ $t('wonder of') }} {{ dateString }}
        </div>
        <div class="hero-name">
          <VernacularName
            :taxon-latname="hero.taxonLatname"
            :taxon-author="hero.taxonAuthor"
            :hide-taxon-author="true"
          />
        </div>
        <div class="hero-scientificname">
          <i>{{ hero.taxonLatname }}</i>
        </div>
        <div class="mt-xl text-center">
          <TaxonProfileLink :taxon="hero" class="nolinkstyle">
            <ColorButton
              text="SPECIES PROFILE"
              size="medium"
              type="default"
              bgColor="var(--sea-change-light-turquoise)"
              textColor="var(--sea-change-dark-turquoise)"
            >
              <template #right>
                <PhCaretRight size="16" weight="bold" />
              </template>
            </ColorButton>
          </TaxonProfileLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-poster {
  width: 100%;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;

}

.hero-date {
  color: var(--sea-change-yellow);
  text-transform: uppercase;
  font-weight: 600;
  font-style: normal;
  text-align: center;
}

.hero-name {
  font-size: 2rem;
  font-family: var(--font-quincy-1001);
  color: white;
  padding: var(--size-sm) 0;
  text-align: center;
}

.hero-scientificname {
  color: var(--sea-change-light-turquoise);
  font-size: 1rem;
  font-style: italic;
  text-align: center;
}

.hero-poster > div {
  width: 100%;
  height: 100%;
  position: relative;
  background-image:
    radial-gradient(circle at center, rgba(0, 0, 0, 0.3) 32%, rgba(0, 0, 0, 0.70) 100%),
    var(--hero-bg-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 640px) {
}

@media (min-width: 768px) {
  .hero-poster {
    margin-left: var(--navigation-rail-width);
    width: calc(100% - var(--navigation-rail-width));
  }
}

@media (min-width: 1024px) {
  .hero-poster {
    aspect-ratio: 3/2;
  }
}

@media (min-width: 1280px) {
  .hero-poster {
    aspect-ratio: 16/12;
    width: calc(1280px - (var(--size-md) *2 ));
    margin: 0 auto;
    margin-top: var(--desktop-header-bar-height);
  }
}

@media (min-width: 1536px) {
}

</style>