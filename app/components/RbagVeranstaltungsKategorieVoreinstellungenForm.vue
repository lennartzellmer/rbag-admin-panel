<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'
import { z } from 'zod'
import { voreinstellungenSchema } from '~/shared/validation/veranstaltungKategorieSchema'

// =============================================================================
// Types and schema
// =============================================================================
const schema = voreinstellungenSchema

type Schema = z.output<typeof schema>

type Adresse = NonNullable<Schema['ort']>
type Programm = NonNullable<Schema['programm']>[number]
type Angebot = NonNullable<Programm['angebote']>[number]
type Angebotsfeld = NonNullable<Angebot['felder']>[number]
type TeilnahmeBeitraege = NonNullable<Schema['teilnahmebeitraege']>
type Teilnahmegruppe = TeilnahmeBeitraege['teilnahmegruppen'][number]

// =============================================================================
// Emits
// =============================================================================
const emit = defineEmits<{ (
  event: 'submit',
  payload: Schema
): void }>()

// =============================================================================
// State helpers
// =============================================================================
const form = useTemplateRef('form')

const fieldTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Select', value: 'select' },
  { label: 'Multi Select', value: 'multiselect' },
  { label: 'Checkbox', value: 'checkbox' }
]

const state = reactive<Schema>({
  zielgruppe: '',
  beschreibung: '',
  ort: undefined,
  anzeigebild: undefined,
  leitung: [],
  programm: [],
  teilnahmebeitraege: undefined
})

const ortEnabled = ref(false)
const teilnahmeEnabled = ref(false)

const createAdresse = (): Adresse => ({
  name: '',
  adresszeile1: '',
  adresszeile2: undefined,
  plz: '',
  ort: '',
  land: ''
})

const createProgramm = (): Programm => ({
  name: '',
  beschreibung: undefined,
  anzeigebild: undefined,
  angebote: []
})

const createAngebot = (): Angebot => ({
  name: '',
  beschreibung: undefined,
  felder: [],
  leitung: []
})

const createAngebotsfeld = (): Angebotsfeld => ({
  name: '',
  typ: 'text',
  optionen: [],
  erforderlich: false
})

const createTeilnahmegruppen = (): Teilnahmegruppe => ({
  name: '',
  minAlter: 0,
  maxAlter: 0,
  beitrag: 0,
  gefoerderterBeitrag: 0
})

const ensureOrtState = () => {
  if (ortEnabled.value && !state.ort) {
    state.ort = createAdresse()
  }

  if (!ortEnabled.value) {
    state.ort = undefined
  }
}

watch(ortEnabled, ensureOrtState)

const ensureTeilnahmeState = () => {
  if (teilnahmeEnabled.value && !state.teilnahmebeitraege) {
    state.teilnahmebeitraege = {
      teilnahmegruppen: [],
      einzelzimmerzuschlag: undefined
    }
  }

  if (!teilnahmeEnabled.value) {
    state.teilnahmebeitraege = undefined
  }
}

watch(teilnahmeEnabled, ensureTeilnahmeState)

const updateOptionalString = (value?: string | null) => (value && value.trim().length > 0 ? value : undefined)

const toObjectUrl = (value: File | File[] | null | undefined) => {
  if (!value) return undefined
  const file = Array.isArray(value) ? value[0] : value
  return file ? URL.createObjectURL(file) : undefined
}

// =============================================================================
// List helpers
// =============================================================================
const addLeitung = () => {
  state.leitung = [...(state.leitung ?? []), '']
}

const removeLeitung = (index: number) => {
  state.leitung?.splice(index, 1)
}

const addProgramm = () => {
  state.programm = [...(state.programm ?? []), createProgramm()]
}

const removeProgramm = (index: number) => {
  state.programm?.splice(index, 1)
}

const addAngebot = (programmIndex: number) => {
  state.programm ??= []
  state.programm[programmIndex].angebote = [
    ...(state.programm[programmIndex].angebote ?? []),
    createAngebot()
  ]
}

const removeAngebot = (programmIndex: number, angebotIndex: number) => {
  state.programm?.[programmIndex].angebote?.splice(angebotIndex, 1)
}

const addFeld = (programmIndex: number, angebotIndex: number) => {
  state.programm ??= []
  state.programm[programmIndex].angebote ??= []
  state.programm[programmIndex].angebote![angebotIndex].felder = [
    ...(state.programm[programmIndex].angebote![angebotIndex].felder ?? []),
    createAngebotsfeld()
  ]
}

const removeFeld = (programmIndex: number, angebotIndex: number, feldIndex: number) => {
  state.programm?.[programmIndex].angebote?.[angebotIndex].felder?.splice(feldIndex, 1)
}

const addOption = (programmIndex: number, angebotIndex: number, feldIndex: number) => {
  state.programm ??= []
  state.programm[programmIndex].angebote ??= []
  state.programm[programmIndex].angebote![angebotIndex].felder ??= []
  const feld = state.programm[programmIndex].angebote![angebotIndex].felder![feldIndex]
  feld.optionen = [...(feld.optionen ?? []), '']
}

const removeOption = (
  programmIndex: number,
  angebotIndex: number,
  feldIndex: number,
  optionIndex: number
) => {
  state.programm?.[programmIndex].angebote?.[angebotIndex].felder?.[feldIndex].optionen?.splice(optionIndex, 1)
}

const addTeilnahmegruppe = () => {
  if (!state.teilnahmebeitraege) return
  state.teilnahmebeitraege.teilnahmegruppen = [
    ...(state.teilnahmebeitraege.teilnahmegruppen ?? []),
    createTeilnahmegruppen()
  ]
}

const removeTeilnahmegruppe = (index: number) => {
  state.teilnahmebeitraege?.teilnahmegruppen.splice(index, 1)
}

// =============================================================================
// Image handlers
// =============================================================================
const handleRootImageUpload = (file: File | File[] | null | undefined) => {
  state.anzeigebild = updateOptionalString(toObjectUrl(file))
}

const handleProgrammImageUpload = (programmIndex: number, file: File | File[] | null | undefined) => {
  if (!state.programm) return
  state.programm[programmIndex].anzeigebild = updateOptionalString(toObjectUrl(file))
}

// =============================================================================
// Submission
// =============================================================================
const onSubmit = (event: FormSubmitEvent<Schema>) => {
  emit('submit', event.data)
}
</script>

<template>
  <UForm
    ref="form"
    class="space-y-8"
    :state="state"
    :schema="schema"
    :validate-on="['submit']"
    @submit="onSubmit"
  >
    <div class="grid gap-6">
      <UFormField name="zielgruppe" label="Zielgruppe">
        <UInput
          v-model="state.zielgruppe"
          placeholder="Zielgruppe"
        />
      </UFormField>

      <UFormField name="beschreibung" label="Beschreibung">
        <UTextarea
          v-model="state.beschreibung"
          placeholder="Beschreibe die Veranstaltung"
          :rows="4"
        />
      </UFormField>

      <UFormField name="anzeigebild" label="Anzeigebild (optional)">
        <UFileUpload
          v-slot="{ open }"
          accept="image/*"
          @update:model-value="handleRootImageUpload"
        >
          <div class="flex items-center gap-3">
            <UInput
              v-model="state.anzeigebild"
              placeholder="Bild URL oder Upload"
              class="w-full"
              @update:model-value="value => state.anzeigebild = updateOptionalString(value)"
            />
            <UButton
              color="neutral"
              variant="outline"
              label="Datei wählen"
              @click="open()"
            />
          </div>
        </UFileUpload>
      </UFormField>

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="font-medium text-default">Leitung</label>
          <UButton
            color="neutral"
            variant="ghost"
            size="xs"
            icon="i-lucide-plus"
            @click="addLeitung"
          />
        </div>
        <div class="space-y-3">
          <div
            v-for="(leiter, index) in state.leitung"
            :key="index"
            class="flex items-center gap-3"
          >
            <UFormField :name="`leitung.${index}`" :label="index === 0 ? 'Leitung' : undefined">
              <UInput v-model="state.leitung![index]" placeholder="Name" />
            </UFormField>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-trash"
              @click="removeLeitung(index)"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label class="font-medium text-default">Ort (optional)</label>
            <p class="text-sm text-muted">Füge eine Adresse hinzu</p>
          </div>
          <UCheckbox v-model="ortEnabled" label="Ort hinzufügen" />
        </div>

        <div v-if="state.ort" class="grid gap-4 md:grid-cols-2">
          <UFormField name="ort.name" label="Bezeichnung">
            <UInput v-model="state.ort.name" placeholder="Ort Name" />
          </UFormField>
          <UFormField name="ort.adresszeile1" label="Adresszeile 1">
            <UInput v-model="state.ort.adresszeile1" placeholder="Straße 1" />
          </UFormField>
          <UFormField name="ort.adresszeile2" label="Adresszeile 2 (optional)">
            <UInput
              v-model="state.ort.adresszeile2"
              placeholder="Straße 2"
              @update:model-value="value => state.ort!.adresszeile2 = updateOptionalString(value)"
            />
          </UFormField>
          <UFormField name="ort.plz" label="PLZ">
            <UInput v-model="state.ort.plz" placeholder="12345" />
          </UFormField>
          <UFormField name="ort.ort" label="Ort">
            <UInput v-model="state.ort.ort" placeholder="Stadt" />
          </UFormField>
          <UFormField name="ort.land" label="Land">
            <UInput v-model="state.ort.land" placeholder="Land" />
          </UFormField>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label class="font-medium text-default">Programm (optional)</label>
            <p class="text-sm text-muted">Füge Programmpunkte hinzu</p>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            size="xs"
            icon="i-lucide-plus"
            label="Programm hinzufügen"
            @click="addProgramm"
          />
        </div>

        <div class="space-y-6">
          <UCard
            v-for="(programm, programmIndex) in state.programm"
            :key="programmIndex"
            :ui="{ body: 'space-y-4' }"
          >
            <div class="flex justify-between">
              <p class="font-medium">Programmpunkt {{ programmIndex + 1 }}</p>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-trash"
                @click="removeProgramm(programmIndex)"
              />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <UFormField :name="`programm.${programmIndex}.name`" label="Name">
                <UInput v-model="programm.name" placeholder="Programmtitel" />
              </UFormField>
              <UFormField :name="`programm.${programmIndex}.anzeigebild`" label="Anzeigebild (optional)">
                <UFileUpload
                  v-slot="{ open }"
                  accept="image/*"
                  @update:model-value="file => handleProgrammImageUpload(programmIndex, file)"
                >
                  <div class="flex items-center gap-3">
                    <UInput
                      v-model="programm.anzeigebild"
                      placeholder="Bild URL oder Upload"
                      @update:model-value="value => programm.anzeigebild = updateOptionalString(value)"
                    />
                    <UButton
                      color="neutral"
                      variant="outline"
                      label="Datei wählen"
                      @click="open()"
                    />
                  </div>
                </UFileUpload>
              </UFormField>
            </div>
            <UFormField :name="`programm.${programmIndex}.beschreibung`" label="Beschreibung (optional)">
              <UTextarea
                v-model="programm.beschreibung"
                placeholder="Beschreibe den Programmpunkt"
                :rows="3"
                @update:model-value="value => programm.beschreibung = updateOptionalString(value)"
              />
            </UFormField>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="font-medium">Angebote</span>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-plus"
                  @click="addAngebot(programmIndex)"
                />
              </div>

              <div class="space-y-4">
                <UCard
                  v-for="(angebot, angebotIndex) in programm.angebote"
                  :key="angebotIndex"
                  :ui="{ body: 'space-y-4' }"
                >
                  <div class="flex justify-between">
                    <p class="font-medium">Angebot {{ angebotIndex + 1 }}</p>
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-lucide-trash"
                      @click="removeAngebot(programmIndex, angebotIndex)"
                    />
                  </div>
                  <div class="grid gap-4 md:grid-cols-2">
                    <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.name`" label="Name">
                      <UInput v-model="angebot.name" placeholder="Angebotstitel" />
                    </UFormField>
                    <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.leitung`" label="Leitung (optional)">
                      <UInput
                        v-model="angebot.leitung?.[0]"
                        placeholder="Verantwortliche Personen"
                        @update:model-value="value => angebot.leitung = value ? [value] : []"
                      />
                    </UFormField>
                  </div>
                  <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.beschreibung`" label="Beschreibung (optional)">
                    <UTextarea
                      v-model="angebot.beschreibung"
                      placeholder="Beschreibe das Angebot"
                      :rows="3"
                      @update:model-value="value => angebot.beschreibung = updateOptionalString(value)"
                    />
                  </UFormField>

                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="font-medium">Felder</span>
                      <UButton
                        color="neutral"
                        variant="ghost"
                        size="xs"
                        icon="i-lucide-plus"
                        @click="addFeld(programmIndex, angebotIndex)"
                      />
                    </div>
                    <div class="space-y-3">
                      <UCard
                        v-for="(feld, feldIndex) in angebot.felder"
                        :key="feldIndex"
                        :ui="{ body: 'space-y-3' }"
                      >
                        <div class="flex justify-between">
                          <p class="font-medium">Feld {{ feldIndex + 1 }}</p>
                          <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-lucide-trash"
                            @click="removeFeld(programmIndex, angebotIndex, feldIndex)"
                          />
                        </div>
                        <div class="grid gap-3 md:grid-cols-2">
                          <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.felder.${feldIndex}.name`" label="Name">
                            <UInput v-model="feld.name" placeholder="Feldname" />
                          </UFormField>
                          <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.felder.${feldIndex}.typ`" label="Typ">
                            <USelect
                              v-model="feld.typ"
                              :options="fieldTypeOptions"
                              option-attribute="label"
                              value-attribute="value"
                            />
                          </UFormField>
                        </div>
                        <UCheckbox v-model="feld.erforderlich" label="Erforderlich" />
                        <div class="space-y-2">
                          <div class="flex items-center justify-between">
                            <span class="text-sm font-medium">Optionen</span>
                            <UButton
                              color="neutral"
                              variant="ghost"
                              size="xs"
                              icon="i-lucide-plus"
                              @click="addOption(programmIndex, angebotIndex, feldIndex)"
                            />
                          </div>
                          <div class="space-y-2">
                            <div
                              v-for="(option, optionIndex) in feld.optionen"
                              :key="optionIndex"
                              class="flex items-center gap-3"
                            >
                              <UFormField :name="`programm.${programmIndex}.angebote.${angebotIndex}.felder.${feldIndex}.optionen.${optionIndex}`">
                                <UInput v-model="feld.optionen![optionIndex]" placeholder="Option" />
                              </UFormField>
                              <UButton
                                color="neutral"
                                variant="ghost"
                                icon="i-lucide-trash"
                                @click="removeOption(programmIndex, angebotIndex, feldIndex, optionIndex)"
                              />
                            </div>
                          </div>
                        </div>
                      </UCard>
                    </div>
                  </div>
                </UCard>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <label class="font-medium text-default">Teilnahmebeiträge (optional)</label>
            <p class="text-sm text-muted">Füge Teilnahmegruppen und Zuschläge hinzu</p>
          </div>
          <UCheckbox v-model="teilnahmeEnabled" label="Beitrag hinzufügen" />
        </div>

        <div v-if="state.teilnahmebeitraege" class="space-y-4">
          <UFormField name="teilnahmebeitraege.einzelzimmerzuschlag" label="Einzelzimmerzuschlag (optional)">
            <UInput
              v-model.number="state.teilnahmebeitraege.einzelzimmerzuschlag"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
            />
          </UFormField>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-medium">Teilnahmegruppen</span>
              <UButton
                color="neutral"
                variant="outline"
                size="xs"
                icon="i-lucide-plus"
                label="Gruppe hinzufügen"
                @click="addTeilnahmegruppe"
              />
            </div>
            <div class="space-y-4">
              <UCard
                v-for="(gruppe, index) in state.teilnahmebeitraege.teilnahmegruppen"
                :key="index"
                :ui="{ body: 'space-y-3' }"
              >
                <div class="flex justify-between">
                  <p class="font-medium">Gruppe {{ index + 1 }}</p>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-trash"
                    @click="removeTeilnahmegruppe(index)"
                  />
                </div>
                <div class="grid gap-3 md:grid-cols-2">
                  <UFormField :name="`teilnahmebeitraege.teilnahmegruppen.${index}.name`" label="Name">
                    <UInput v-model="gruppe.name" placeholder="Gruppenname" />
                  </UFormField>
                  <UFormField :name="`teilnahmebeitraege.teilnahmegruppen.${index}.minAlter`" label="Mindestalter">
                    <UInput v-model.number="gruppe.minAlter" type="number" min="0" placeholder="0" />
                  </UFormField>
                  <UFormField :name="`teilnahmebeitraege.teilnahmegruppen.${index}.maxAlter`" label="Höchstalter">
                    <UInput v-model.number="gruppe.maxAlter" type="number" min="0" placeholder="0" />
                  </UFormField>
                  <UFormField :name="`teilnahmebeitraege.teilnahmegruppen.${index}.beitrag`" label="Beitrag">
                    <UInput v-model.number="gruppe.beitrag" type="number" min="0" step="0.01" placeholder="0" />
                  </UFormField>
                  <UFormField :name="`teilnahmebeitraege.teilnahmegruppen.${index}.gefoerderterBeitrag`" label="Geförderter Beitrag">
                    <UInput v-model.number="gruppe.gefoerderterBeitrag" type="number" min="0" step="0.01" placeholder="0" />
                  </UFormField>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <UButton type="submit" label="Speichern" />
    </div>
  </UForm>
</template>
