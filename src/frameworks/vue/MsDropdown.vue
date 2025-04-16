<template>
  <select
    ref="selectElement"
    :name="name"
    :class="className"
    :disabled="disabled"
    :multiple="multiple"
    :required="required"
    @change="handleChange"
  >
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :data-image="option.image"
      :data-description="option.description"
      :class="option.className"
      :title="option.title"
      :style="option.imageCss ? { '--ms-image-css': option.imageCss } : undefined"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<script>
import { defineComponent, onMounted, onBeforeUnmount, watch, ref } from 'vue';
import MsDropdown from '../../js/lib/dd';

export default defineComponent({
  name: 'MsDropdown',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    modelValue: {
      type: [String, Number, Array],
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    imagePosition: {
      type: String,
      default: 'left',
    },
    showFilterAlways: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const selectElement = ref(null);
    let dropdown = null;

    onMounted(() => {
      if (selectElement.value) {
        dropdown = new MsDropdown(selectElement.value, {
          imagePosition: props.imagePosition,
          showFilterAlways: props.showFilterAlways,
        });
      }
    });

    onBeforeUnmount(() => {
      if (dropdown) {
        dropdown.destroy();
      }
    });

    watch(() => props.modelValue, (newValue) => {
      if (dropdown && newValue !== undefined) {
        dropdown.value = newValue;
      }
    });

    const handleChange = (event) => {
      const value = event.target.value;
      emit('update:modelValue', value);
      emit('change', event);
    };

    return {
      selectElement,
      handleChange,
    };
  },
});
</script>
