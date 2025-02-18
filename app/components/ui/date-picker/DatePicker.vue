<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { DatePickerArrow, DatePickerCalendar, DatePickerCell, DatePickerCellTrigger, DatePickerContent, DatePickerGrid, DatePickerGridBody, DatePickerGridHead, DatePickerGridRow, DatePickerHeadCell, DatePickerHeader, DatePickerHeading, DatePickerNext, DatePickerPrev, DatePickerRoot, DatePickerTrigger, useForwardPropsEmits } from 'radix-vue'
import type { DatePickerRootProps, DatePickerRootEmits } from 'radix-vue'
import { DateFormatter, getLocalTimeZone } from '@internationalized/date'

const props = defineProps<DatePickerRootProps>()
const emits = defineEmits<DatePickerRootEmits>()

const df = new DateFormatter('de-DE', {
  dateStyle: 'long'
})

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DatePickerRoot
    v-bind="forwarded"
    :granularity="'day'"
  >
    <DatePickerTrigger class="flex items-center gap-4 justify-between min-w-52 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
      <span
        v-if="modelValue"
        class="text-sm"
      >{{ df.format(modelValue.toDate(getLocalTimeZone())) }}</span>
      <span
        v-else
        class="text-muted-foreground"
      >Datum wählen</span>
      <Icon
        icon="radix-icons:calendar"
        class="size-5"
      />
    </DatePickerTrigger>

    <DatePickerContent
      class="rounded-xl z-50 bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
    >
      <DatePickerArrow class="fill-white" />
      <DatePickerCalendar
        v-slot="{ weekDays, grid }"
        class="p-4"
      >
        <DatePickerHeader class="flex items-center justify-between">
          <DatePickerPrev
            class="inline-flex items-center cursor-pointer text-black justify-center rounded-[9px] bg-transparent w-8 h-8 hover:bg-black hover:text-white active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
          >
            <Icon
              icon="radix-icons:chevron-left"
              class="w-6 h-6"
            />
          </DatePickerPrev>

          <DatePickerHeading class="text-black font-medium" />
          <DatePickerNext
            class="inline-flex items-center cursor-pointer text-black justify-center rounded-[9px] bg-transparent w-8 h-8 hover:bg-black hover:text-white active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black"
          >
            <Icon
              icon="radix-icons:chevron-right"
              class="w-6 h-6"
            />
          </DatePickerNext>
        </DatePickerHeader>
        <div
          class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0"
        >
          <DatePickerGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse select-none space-y-1"
          >
            <DatePickerGridHead>
              <DatePickerGridRow class="mb-1 flex w-full justify-between">
                <DatePickerHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="w-8 rounded-md text-xs text-green8"
                >
                  {{ day }}
                </DatePickerHeadCell>
              </DatePickerGridRow>
            </DatePickerGridHead>
            <DatePickerGridBody>
              <DatePickerGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="flex w-full"
              >
                <DatePickerCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                >
                  <DatePickerCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="relative flex items-center justify-center whitespace-nowrap rounded-[9px] border border-transparent bg-transparent text-sm font-normal data-[disabled]:text-black/30 data-[disabled]:cursor-default data-[disabled]:hover:border-transparent text-black w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black hover:border-black data-[selected]:bg-black data-[selected]:font-medium data-[outside-view]:text-black/30 data-[selected]:text-white data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9 data-[selected]:before:bg-white"
                  />
                </DatePickerCell>
              </DatePickerGridRow>
            </DatePickerGridBody>
          </DatePickerGrid>
        </div>
      </DatePickerCalendar>
    </DatePickerContent>
  </DatePickerRoot>
</template>
