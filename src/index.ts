import { defineNuxtPlugin } from '#app'
import Button from './components/Button.vue'
import Table from "~/components/data/table/Table.vue";
import DatePicker from "~/components/DatePicker.vue";
import LoadSpinner from "~/components/LoadSpinner.vue";
import LoadMask from "~/components/LoadMask.vue";
import Panel from "~/components/Panel.vue";
import PanelGroup from "~/components/Panel-Group.vue";
import BadgeList from "~/components/BadgeList.vue";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('MyButton', Button)
    nuxtApp.vueApp.component('Table', Table)
    nuxtApp.vueApp.component('DatePicker', DatePicker)
    nuxtApp.vueApp.component('LoadSpinner', LoadSpinner)
    nuxtApp.vueApp.component('LoadMask', LoadMask)
    nuxtApp.vueApp.component('Panel', Panel)
    nuxtApp.vueApp.component('PanelGroup', PanelGroup)
    nuxtApp.vueApp.component('BadgeList', BadgeList)
})