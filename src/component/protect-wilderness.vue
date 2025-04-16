<template>
  <div class="form-wrapper">
    <p class="intro-text">{{ protect_wilderness_intro }}</p>
    <div :key="e.id" v-for="e of errors" class="alert alert-error">
      {{ e.text }}
    </div>
    <form
      class="form"
      @submit="post"
      :action="formAction"
      method="post"
      target="_blank"
    >
      <div class="form-field">
        <input
          type="text"
          v-model="input.firstName"
          :placeholder="$t('first_name') + '*'"
          name="first_name"
          class="mr10"
        />
        <input
          type="text"
          v-model="input.lastName"
          :placeholder="$t('last_name') + '*'"
          name="last_name"
        />
      </div>
      <div class="form-field">
        <input
          type="text"
          v-model="input.email"
          :placeholder="$t('email') + '*'"
          name="email"
        />
      </div>
      <div class="form-field">
        <input
          type="text"
          v-model="input.city"
          :placeholder="$t('city') + '*'"
          name="city"
          class="mr10"
        />
        <input
          type="text"
          v-model="input.state"
          :placeholder="$t('state') + '*'"
          name="state"
          class="mr10"
        />
        <input
          type="text"
          v-model="input.zip"
          :placeholder="$t('zip') + '*'"
          name="zip"
        />
      </div>
      <div class="action-buttons">
        <button
          v-if="popup"
          v-on:click="onCancel"
          type="button"
          class="button signup-button"
        >
          {{ $t("no_thanks") }}
        </button>
        <button type="submit" class="button signup-button">
          {{ submitting ? $t("submitting") + "..." : $t("submit") }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import config from "../../config";
import http from "axios";

export default {
  name: "protect-wilderness",
  props: {
    popup: {
      type: Boolean,
    },
  },
  data() {
    return {
      submitting: false,
      input: {
        email: "",
        firstName: "",
        lastName: "",
        city: "",
        state: "",
        zip: "",
      },
      errors: [],
      formAction: config.url.salesforceFormAction,
    };
  },
  computed: {
    valid() {
      if (
        this.input.firstName &&
        this.input.lastName &&
        this.input.email &&
        config.pattern.email.test(this.input.email) &&
        this.input.city &&
        this.input.state &&
        this.input.zip
      ) {
        return true;
      }
      return false;
    },
    protect_wilderness_intro() {
      const entryId = this.popup
        ? config.id.entry.protectOverlay
        : config.id.entry.protect;
      const entry = this.$store.state.entries[entryId];
      if (entry) {
        const messageElement = entry.elements.find(
          (el) => el.id === config.id.option.form.messages
        );
        if (messageElement) {
          return messageElement.data;
        }
      }
      return "";
    },
  },
  methods: {
    onCancel() {
      this.$emit("cancel", false);
    },
    async post(e) {
      this.errors = [];

      if (!this.valid) {
        const id = "invalid_fields";
        this.errors.push({ id, text: this.$t(`error.${id}`) });
        e.preventDefault();
        return;
      }
      localStorage.setItem("wilder_protect", true);

      //clear form
      setTimeout(() => {
        this.$emit("cancel", true);
        this.input = {
          email: "",
          firstName: "",
          lastName: "",
          city: "",
          state: "",
          zip: "",
        };
      }, 2000);
    },
  },
};
</script>

<style scoped>
.form-wrapper {
  padding: 30px;
  border-radius: 2px;
  background-color: #fff6e1;
}
.form-wrapper .form {
  margin-bottom: 0;
}
.form-wrapper .form-field {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
}
.action-buttons {
  text-align: left;
}
.action-buttons button {
  background-color: var(--color-bg-highlight);
  border-color: var(--color-bg-highlight);
}
.mr10 {
  margin-right: 10px;
}

@media (max-width: 688px) {
  .form-wrapper .form-field {
    flex-direction: column;
  }
}
</style>
