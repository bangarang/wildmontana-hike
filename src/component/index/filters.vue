<template>
  <div :class="{ filters: true, expanded }">
    <div v-for="(group, id) in filters" class="filter-group">
      <div v-if="group.name" class="name">{{ group.name }}</div>
      <div v-if="group.options.length" class="checkboxes">
        <div
          v-for="o of group.options"
          :class="{ filter: true, active: o.active }"
        >
          <label class="styled-checkbox">
            <input
              type="checkbox"
              v-model="o.active"
              @change="$emit('changed', filters)"
            />
            <span class="checkmark"></span>
            <span class="label-text">{{ o.label }}</span>
          </label>
        </div>
      </div>
    </div>
    <div class="filter-group mobile--only">
      <div class="name">Mileage Range</div>
      <div class="elevation--top--labels">
        <span>{{ roundtripDistance[0] }}</span>
        <span v-if="roundtripDistance[1] === 25">25+</span>
        <span v-if="roundtripDistance[1] !== 25">{{
          roundtripDistance[1]
        }}</span>
      </div>
      <vue-slider
        v-model="roundtripDistance"
        @change="updateRoundtrip"
        min="0"
        max="25"
      ></vue-slider>
      <div class="elevation--top--labels">
        <span>MIN</span>
        <span>MAX</span>
      </div>
    </div>
    <div class="filter-group mobile--only">
      <div class="name">Elevation Gain (ft)</div>
      <div class="elevation--top--labels">
        <span>{{ elevationGain[0] }}</span>
        <span v-if="elevationGain[1] === 5000">5000+</span>
        <span v-if="elevationGain[1] !== 5000">{{ elevationGain[1] }}</span>
      </div>
      <vue-slider
        v-model="elevationGain"
        @change="updateElevationGain"
        min="0"
        max="5000"
      ></vue-slider>
      <div class="elevation--top--labels">
        <span>MIN</span>
        <span>MAX</span>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component/dist-css/vue-slider-component.umd.min.js";
import "vue-slider-component/dist-css/vue-slider-component.css";
import "vue-slider-component/theme/default.css";
export default {
  name: "index-filters",
  components: {
    VueSlider,
  },
  props: {
    filters: {
      type: Object,
      required: true,
    },
    roundtripDistance: {
      type: Array,
    },
    elevationGain: {
      type: Array,
    },
  },
  data() {
    return {
      expanded: true,
    };
  },
  methods: {
    updateRoundtrip(roundtripDistance) {
      this.$emit("roundtrip", roundtripDistance);
    },
    updateElevationGain(elevationGain) {
      this.$emit("elevation", elevationGain);
    },
  },
};
</script>

<style scoped>
.filters {
  position: absolute;
  top: 100%;
  left: 0;
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: white;
  box-shadow: var(--box-shadow-small);
}
.mobile--only {
  display: none;
}

@media (min-width: 640px) {
  .filters {
    min-width: 220px;
  }
}

.filters .checkboxes {
  display: none;
}

.filters.expanded .checkboxes {
  display: flex;
  flex-wrap: wrap;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:first-child {
  margin-top: -1rem;
}

.filter-group .name {
  line-height: 3.6rem;
  color: #59c3d9;
}

.filter {
  flex: 1 1 50%;
}

.filter:not(:last-child) {
  margin-bottom: 1rem;
}

.filter label {
  margin-bottom: 0;
  font-weight: var(--font-weight-light);
  line-height: 1;
  color: #c7c7c7;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

/* .filter label input[type="checkbox"] {
  opacity: 1;
  width: unset;
  pointer-events: all;
  left: -10px;
  top: 5px;
} */

.filter.active label {
  color: #e7e7e7;
}

.filter span,
.filter input {
  display: inline-block;
  vertical-align: middle;
}

.filter span {
  margin-left: 0.5rem;
}

.filter input {
  /* margin: 0 3px 0 0; */
  margin: 3px 3px 0 0;
}

.styled-checkbox {
  display: inline-block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}

.styled-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: transparent;
  border: 2px solid #fff;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.styled-checkbox:hover input ~ .checkmark {
  background-color: transparent;
  /* gold is an option too: #FCB514 */
  border-color: #59c3d9;
}

.styled-checkbox input:checked ~ .checkmark {
  background-color: transparent;
  border-color: #59c3d9;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.styled-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.styled-checkbox .checkmark:after {
  left: 9px;
  top: -7px;
  width: 9px;
  height: 21px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}

.styled-checkbox .label-text {
  margin-left: 8px;
}

@media (max-width: 720px) {
  .mobile--only {
    display: block;
  }
  .filter label {
    margin-left: 2px;
  }
  /* .filter input {
    margin: 3px 3px 0 0;
  } */
}
</style>
<style>
.vue-slider-process {
  background: #59c3d9;
}
.vue-slider-dot-handle {
  background: #59c3d9;
  border: #fff 2px solid;
}
.vue-slider-dot {
  width: 16px !important;
  height: 16px !important;
  transition: 0.25s ease;
}
.vue-slider-dot:focus {
  width: 22px !important;
  height: 22px !important;
}
.vue-slider-dot-tooltip-inner {
  background-color: #59c3d9;
  border-color: #59c3d9;
}
</style>
