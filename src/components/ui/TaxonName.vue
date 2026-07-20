<script setup lang="ts">
import { t } from 'i18next';

const props = defineProps<{
  taxonLatname: string,
  taxonAuthor?: string|null,
  vernacularName?: string|null,
  singleLine?: boolean,
  hideTaxonAuthor?: boolean,
  morphotype?: string,
  narrow?: boolean,
  fontFamily?: string,
  fontSize?: string,
}>();

let scientificName: string = props.taxonLatname;
let fontFamily = props.fontFamily || 'var(--font-public-sans-1001)';
let fontSize = props.fontSize || '16px';

if (props.taxonAuthor) {
  scientificName = `${props.taxonLatname} ${props.taxonAuthor}`;
}
let usedVernacularName:string|null = t(scientificName);

if (props.vernacularName) {
  usedVernacularName = props.vernacularName;
} else if (usedVernacularName.indexOf(props.taxonLatname) == 0) {
  usedVernacularName = null;
}

if (usedVernacularName && props.morphotype) {
  usedVernacularName = `${usedVernacularName} (${props.morphotype})`;
}
</script>

<template>
  <div>
    <div
      class="name-container"
      :class="{ 'single-line': singleLine, 'narrow': narrow }"
    >
      <span
        v-if="usedVernacularName"
        class="primary-name"
        :style="{ fontFamily: fontFamily, fontSize: fontSize }"
      >
        {{ usedVernacularName }}
      </span>
      <span
        v-else
        class="alternative-primary-name"
        :style="{ fontFamily: fontFamily, fontSize: fontSize }"
      >
        <i>{{ taxonLatname }}</i> <br>
        <span v-if="taxonAuthor" class="scientific-name">{{ taxonAuthor }}</span>
        <span v-if="props.morphotype" class="morphotype">({{ props.morphotype }})</span>
      </span>
    </div>
    <div
      v-if="usedVernacularName"
      class="scientific-name secondary"
      :class="singleLine ? 'single-line' : ''"
    >
      <i>{{ taxonLatname }}</i>
      <span v-if="!hideTaxonAuthor">{{ taxonAuthor }}</span>
    </div>
  </div>
</template>

<style scoped>
.narrow {
  font-family: var(--font-family-tight);
}

.primary-name {
  font-weight: bold;
}

.scientific-name {
  font-size: 16px;
}

.scientific-name.secondary {
  font-size: 14px;
  color: var(--color-grey);
}

.name-container.single-line, .scientific-name.single-line {
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflowing text */
  text-overflow: ellipsis; /* Add ellipsis for truncated text */
  vertical-align: middle; /* Align text vertically */
}
</style>