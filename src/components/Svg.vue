<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 20,
  },
  width: {
    type: [Number, String],
  },
  height: {
    type: [Number, String],
  },
  path: {
    type: String,
  },
  transform: {
    type: [Number, String],
  },
  fill: {
    type: String,
  },
});
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width || size"
    :height="height || size"
    :fill="fill"
    :transform="`scale(${transform || 1})`"
  >
    <path :d="path" />
  </svg>
</template>
