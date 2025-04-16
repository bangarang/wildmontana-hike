<template>
  <div class="form" :id="'form-' + form">
    <div class="inner">
      <div v-for="e of errors" class="alert alert-error">{{ e.text }}</div>
      <form v-if="!done" :class="form">
        <div v-if="form == 'signup'" :class="form + '-fields'">
          <!-- First name -->
          <label
            :for="form + '-fname'"
            :class="{ invalid: fname === false }"
          >{{ $t('first_name') }}*</label>
          <input
            :id="form + '-fname'"
            type="text"
            :class="{ invalid: fname === false }"
            v-model="input.name.first"
            @change.once="touched.name.first = true"
            required
          >
          <!-- Last name -->
          <label
            :for="form + '-lname'"
            :class="{ invalid: lname === false }"
          >{{ $t('last_name') }}*</label>
          <input
            :id="form + '-lname'"
            type="text"
            :class="{ invalid: lname === false }"
            v-model="input.name.last"
            @change.once="touched.name.last = true"
            required
          >
          <!-- Email address -->
          <label
            :for="form + '-email'"
            :class="{ invalid: email === false }"
          >{{ $t('email') }}*</label>
          <input
            :id="form + '-email'"
            type="text"
            :class="{ invalid: email === false }"
            v-model="input.email"
            @change.once="touched.email = true"
            required
          >
          <!-- Password -->
          <label
            :for="form + '-pwd'"
            :class="{ invalid: pwd === false }"
          >{{ $t('password') }}*</label>
          <input
            :id="form + '-pwd'"
            type="password"
            :class="{ invalid: pwd === false }"
            v-model="input.pwd"
            @change.once="touched.pwd = true"
            required
          >
        </div>
        <ui-button
          class="submit"
          :disabled="submitting"
          :label="submitting ? $t('submitting') + '...' : $t('submit')"
          @click.native="post"
          @keyup.enter="post"
        ></ui-button>
      </form>
      <div v-if="done" class="alert alert-success" v-html="$options.filters.markdown($t('confirm.' + form))"></div>
    </div>
  </div>
</template>

<script>
  import Button from './button.vue';
  import config from '../../config';
  import http from 'axios';

  export default {
    name: 'ui-form',
    components: {
      'ui-button': Button
    },
    props: {
      id: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        done: false,
        errors: [],
        input: {
          email: '',
          name: { first: '', last: '' },
          pwd: ''
        },
        submitting: false,
        touched: {
          email: false,
          name: { first: false, last: false },
          pwd: false
        }
      };
    },
    computed: {
      email() {
        return !this.touched.email ? null : config.pattern.email.test(this.input.email);
      },
      fname() {
        return !this.touched.name.first ? null : this.input.name.first.length > 0;
      },
      form() {
        const options = config.id.option.form;
        return Object.keys(options).find(k => options[k] === this.id);
      },
      lname() {
        return !this.touched.name.last ? null : this.input.name.last.length > 0;
      },
      pwd() {
        return !this.touched.pwd ? null : this.input.pwd.length >= 8 && this.input.pwd.length <= 72;
      },
      valid() {
        if (this.form === 'signup') {
          if (this.fname && this.lname && this.email && this.pwd) {
            return true;
          }
        }

        return false;
      }
    },
    methods: {
      error(err) {
        if (!err) return;
        console.error(err);
        const id = err.id || 'invalid_fields';
        const text = this.$t(`error.${err.id}`) || this.$t('error.internal_error');
        this.errors.push({ id, text });
      },
      async post() {
        this.errors = [];

        if (!this.valid) {
          const id = 'invalid_fields';
          this.errors.push({ id, text: this.$t(`error.${id}`) });
          return;
        }

        const input = {};
        Object.keys(this.input).forEach(k => this.input[k] && (input[k] = this.input[k]));

        try {
          this.submitting = true;
          await http.post(`https://wildmontana-hike.herokuapp.com/forms/${this.form}`, input);
          this.done = true;
          if (this.$ga) this.$ga.event('Form', 'submit', this.form);
        } catch (txn) {
          const { error } = txn.response.data;
          this.error(error);
        } finally {
          this.submitting = false;
        }
      }
    }
  };
</script>

<style scoped>
  .form {
    padding: 4rem 0 0;
    border-top: 1px solid var(--color-border);
  }

  .form .inner {
    margin: 0 auto;
    padding: 0 0 3rem;
    max-width: 500px;
  }

  .form label {
    font-weight: var(--font-weight-light);
  }

  .submit {
    margin-top: 1.5rem;
  }
</style>
