<template>
  <div class="toggle" v-if="static">
    <label class="toggle-checked">
      <div class="check"></div>
    </label>
  </div>
  <div class="toggle" v-else>
    <input :id="elementId" type="checkbox" :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)" />
    <label :for="elementId">
      <div class="check"></div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { nextInt } from './next';

const props = withDefaults(defineProps<{
  modelValue: boolean
  static: boolean
  color: string
}>(), { color: '#3d5a80', static: false});

defineEmits(['update:modelValue'])

const elementId = 'toggle-' + nextInt();
</script>

<style lang="scss">
.toggle {
  position: relative;
  display: inline-block;
  text-align: left;
}

.toggle label {
  width: 56px;
  background-color: v-bind('color');
  height: 24px;
  display: inline-block;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  margin: 0;
}

.toggle .check {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  position: absolute;
  background: #c34a4a;
  transition: 0.4s ease;
  /* top: 2.25px;
        left: 2.25px; */
  top: 2px;
  left: 2px;
}

.toggle .check:before,
.toggle .check:after {
  content: '';
  position: absolute;
  height: 2px;
  border-radius: 10px;
  background: #fff;
  transition: 0.4s ease;
}

.toggle .check:before {
  width: 13.5px;
  transform: rotate(-45deg) translate(-4px, 9px);
}

.toggle .check:after {
  width: 13.5px;
  transform: rotate(45deg) translate(9px, 4px);
}

.toggle input {
  position: absolute;
  opacity: 0;
}

.toggle input:checked+label .check,
.toggle .toggle-checked .check {
  left: calc(100% - 20px - 2px);
  transform: rotate(360deg);
  background: #8bc34a;
}

.toggle input:checked+label .check:before,
.toggle .toggle-checked .check:before {
  width: 12.5px;
  transform: rotate(-45deg) translate(-3px, 10px);
}

.toggle input:checked+label .check:after,
.toggle .toggle-checked .check:after {
  width: 5px;
  transform: rotate(45deg) translate(10px, 6px);
}
</style>