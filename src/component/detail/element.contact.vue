<template>
  <div class="element-contact">
    <div class="data">
        <div v-for="c of contacts" class="contact">
          <!-- Label -->
          <div v-if="c.label" class="label">
            <div v-if="c.name" class="name">{{ c.name }}</div>
            <div v-if="c.organization && c.name" class="organization">{{ c.organization }}</div>
            <div v-if="c.organization && !c.name" class="organization-large">{{ c.organization }}</div>
          </div>
          <!-- Locations -->
          <div v-if="c.locations.length" class="locations">
            <div v-for="loc of c.locations" class="location">
              <div v-if="loc.name && loc.name !== c.label" class="name">{{ loc.name }}</div>
              <div v-for="line of loc.address" class="address">{{ line }}</div>
              <div v-if="loc.url" class="url">
                <a :href="loc.url" target="_blank" rel="noopener">
                  {{ $t('get_directions') }}
                  <ui-icon name="arrow-right" size="15px"></ui-icon>
                </a>
              </div>
            </div>
          </div>
          <!-- Phone numbers -->
          <div v-if="c.phones.length" class="phones">
            <div v-for="ph of c.phones" class="phone">
              <a v-if="ph.number.e164" :href="'tel:' + ph.number.e164" class="ellipsis">{{ ph.number.i18n }}</a>
              <span v-if="!ph.number.e164" class="value ellipsis">{{ ph.number.text }}</span>
              <span v-if="ph.name" class="name"> ({{ ph.name }}) </span>
            </div>
          </div>
          <!-- Email -->
          <div v-if="c.email" class="email">
            <a :href="'mailto:' + c.email">{{ c.email }}</a>
          </div>
          <!-- Website -->
          <div v-if="c.url" class="url">
            <a :href="c.url" target="_blank" rel="noopener" @click="track">
                  {{ $t('visit_website') }}
                  <ui-icon name="arrow-right" size="15px"></ui-icon>
            </a>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import Icon from '../icon.vue';

  export default {
    name: 'element-contact',
    components: {
      'ui-icon': Icon
    },
    props: {
      element: {
        type: Object,
        required: true
      },
      entry: {
        type: Object
      }
    },
    data() {
      return {
        contacts: []
      };
    },
    methods: {
      async getContacts() {
        const contacts = this.element.data;
        const ordinals = Object.fromEntries(contacts.map((c, i) => [c.id, i]));

        try {
          await Promise.all(contacts.map(async c => {
            const contact = await this.$store.dispatch('contacts', {
              first: true,
              params: { id: c.id },
              previewing: this.$route.query.preview === 'true'
            });
            if (contact) {
              contact.ordinal = ordinals[c.id];
              this.contacts.push(contact);
            }
          }));
        } catch (err) {
          console.error(err);
        }

        this.contacts.sort((a, b) => a.ordinal - b.ordinal);
      },
      track(evt) {
        const label = 'Outbound Link (Contact URL)';
        const action = 'click';
        const value = evt.target.href;

        if (this.$ga) {
          this.$ga.event(label, action, value);
          return;
        }

        console.info(`${label}: ${action}: ${value}`);
      }
    },
    mounted() {
      this.getContacts();
    }
  };
</script>

<style scoped>
  .contact {
    display: block;
    margin-bottom: 2rem;
  }

  .contact:first-child {
    margin-top: 2rem;
  }

  @media(min-width: 768px) {
    .contact {
      display: inline-block;
      vertical-align: top;
      width: 330px;
      padding: 0 10px 0 0;
    }
  }

  .label {
    font-size: 1.5rem;
    font-weight: var(--font-weight-heavy);
    margin-bottom: 1rem;
  }

  .label > .organization {
    text-transform: none;
    font-size: 90%;
    font-weight: var(--font-weight-light);
    color: var(--color-text-grey-light);
  }

  .label .name {
    text-transform: uppercase;
  }

  .location {
    margin-bottom: 1.5rem;
  }

  .location .name {
    text-transform: uppercase;
  }

  .location .url, .url {
    margin: 0.5rem 0;
    font-weight: var(--font-weight-heavy);
    line-height: 1;
  }

  .value {
    color: var(--color-text-grey-light);
  }

  .phone a, .url a {
    display: block;
  }
</style>
