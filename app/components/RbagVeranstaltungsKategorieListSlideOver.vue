<script setup lang="ts">
import { useOffsetPagination } from '@vueuse/core'
import { getVeranstaltungsKategorienPaginated } from '~/service/veranstaltung-kategorie'

const kategorien = ref<Awaited<ReturnType<typeof getVeranstaltungsKategorienPaginated>>['data']>([])
const selectedCategoryId = ref<string | null>(null)

const selectedCategory = computed(() => {
  return kategorien.value.find(kategorie => kategorie.id === selectedCategoryId.value) || null
})

const fetchData = async ({ currentPage, currentPageSize }: { currentPage: number, currentPageSize: number }) => {
  const response = await getVeranstaltungsKategorienPaginated({
    currentPage,
    currentPageSize
  })
  kategorien.value = response.data
}

const {
  currentPage,
  currentPageSize,
  pageCount
} = useOffsetPagination({
  total: 0,
  page: 1,
  pageSize: 10,
  onPageChange: fetchData,
  onPageSizeChange: fetchData
})

fetchData({ currentPage: currentPage.value, currentPageSize: currentPageSize.value })
</script>

<template>
  <USlideover
    title="Veranstaltungskategorien"
    description="Kategorien können Standardtexte und Einstellungen für Veranstaltungen setzen."
  >
    <UButton
      label="Open"
      color="neutral"
      variant="subtle"
    />

    <template #body>
      <div
        class="gap-3 grid grid-cols-1"
      >
        <template
          v-for="kategorie in kategorien"
          :key="kategorie.id"
        >
          <RbagKategorieCard
            :title="kategorie.name"
            :description="kategorie.beschreibung"
            @edit="selectedCategoryId = kategorie.id"
          />
        </template>
      </div>
      <div v-if="selectedCategory">
        <RbagKategorieForm :category="selectedCategory" />
      </div>
      <div
        v-if="pageCount > 1"
        class="mt-8"
      >
        <UPagination
          :items-per-page="pageCount"
          :default-page="1"
          :sibling-count="1"
          @update:page="currentPage = $event"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-end w-full">
        <UButton
          color="primary"
          icon="i-lucide-plus"
          label="Hinzufügen"
        />
      </div>
    </template>
  </USlideover>
</template>
