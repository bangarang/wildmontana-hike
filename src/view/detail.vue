<template>
  <div :class="'detail-view context-' + context">
    <div class="">
      <!--      <ui-top v-if="context == 'app'"></ui-top>-->
      <div v-if="context == 'app'" class="actions clearfix">
        <div class="back">
          <ui-button
            class="back-button button-clear"
            icon="arrow-left"
            :label="$t('back')"
            @click.native="goBack"
          ></ui-button>
        </div>
        <!--        <ui-share></ui-share>-->
      </div>
      <div v-if="entry" class="content">
        <section class="heading">
          <div v-if="entry.title" class="container">
            <h1>
              <span id="entry-title">{{ entry.title }}</span>
              <!--              <ui-icon-->
              <!--                v-if="entry.featured"-->
              <!--                name="star"-->
              <!--                color="#d9d9d9"-->
              <!--                size="1.6rem"-->
              <!--              ></ui-icon>-->
            </h1>
          </div>
        </section>
        <section v-if="entry.walk.url && entry.walk.dates.length" class="walk">
          <div class="container">
            <a :href="entry.walk.url" class="inner" target="_blank">
              <h2>{{ $t("walk") }}</h2>
              <div class="dates">{{ entry.walk.dates[0] }}</div>
              <div class="details">
                {{ $t("view_details") }}
                <ui-icon name="arrow-right"></ui-icon>
              </div>
              <div class="badge">
                <ui-icon name="walk" color="#8d1d1a" size="5rem"></ui-icon>
              </div>
            </a>
          </div>
        </section>
        <section v-if="contributor" class="contributor">
          <div class="container">
            <div class="name">{{ $t("by", { name: contributor }) }}</div>
          </div>
        </section>
        <main>
          <section
            :key="group.name"
            v-for="group of detailGroups"
            :class="group.name"
          >
            <div v-if="group.name === 'summary-box'" class="container">
              <section
                :key="el.id"
                v-for="(el, index) of group.elementList"
                :class="'element element-' + el.type"
              >
                <div class="container">
                  <div class="sub-container">
                    <p v-if="el.name" class="subheading">{{ el.name }}</p>
                    <component
                      :is="'element-' + el.type"
                      :element="el"
                      :key="id + '::' + el.id"
                      :measurementUnit="getMeasurementUnit(el.id)"
                    ></component>
                  </div>
                </div>
              </section>
            </div>

            <accordion v-else-if="group.name === 'accordion'">
              <accordion-item :key="el.id" v-for="el of group.elementList">
                <template slot="accordion-trigger">
                  <p>{{ el.type === "geo" ? "Nearby Businesses" : el.name }}</p>
                </template>
                <template slot="accordion-content">
                  <a
                    v-if="el.id === '241ebc7c-e491-44f9-84d7-dd71c0b4651d'"
                    :href="googleMapsUrl"
                    target="_blank"
                    rel="noopener"
                    class="google--map--link"
                  >
                    Get Directions
                    <svg
                      data-v-07d7779b=""
                      class="icon icon-arrow-right"
                      style="color: inherit; font-size: 15px"
                    >
                      <use
                        xlink:href="/static/icons.svg#icon-arrow-right"
                      ></use></svg
                  ></a>
                  <component
                    :is="'element-' + el.type"
                    :element="el"
                    :key="id + '::' + el.id"
                    :measurementUnit="getMeasurementUnit(el.id)"
                  ></component>
                </template>
              </accordion-item>
            </accordion>

            <section
              v-else-if="group.name === 'trailDescription'"
              :key="el.id"
              v-for="el of group.elementList"
              :class="
                trailDescription
                  ? 'trailDescription open'
                  : 'trailDescription closed'
              "
            >
              <div class="container">
                <div class="sub-container">
                  <p v-if="el.name" class="subheading">{{ el.name }}</p>
                  <component
                    :is="'element-' + el.type"
                    :element="el"
                    :key="id + '::' + el.id"
                    :measurementUnit="getMeasurementUnit(el.id)"
                  ></component>
                </div>
                <div
                  v-if="trailDescription"
                  class="read-more"
                  @click="toggleTrailDescription"
                >
                  Read Less -
                </div>
                <div v-else class="read-more" @click="toggleTrailDescription">
                  Learn More +
                </div>
              </div>
            </section>

            <section v-else-if="group.name === 'newRelatedCampaigns'">
              <div class="container">
                <h5 class="campaign--section--title">
                  Take Action to Protect this Landscape
                </h5>
                <div v-for="el of group.elementList" class="new--campaign">
                  <img
                    class="campaign--image"
                    v-if="el.image"
                    :src="el.image"
                  />
                  <p class="campaign--title" v-if="el.title">{{ el.title }}</p>
                  <p class="campaign--subtitle" v-if="el.summary">
                    {{ el.summary }}
                  </p>
                  <a
                    class="campaign--link"
                    target="_blank"
                    v-if="el.linkText"
                    :href="el.linkUrl"
                    >{{ el.linkText }}
                    <svg
                      data-v-3803ee32=""
                      data-v-07d7779b=""
                      class="icon icon-arrow-right"
                      style="color: inherit; font-size: 24px"
                    >
                      <use
                        data-v-3803ee32=""
                        xlink:href="/static/icons.svg#icon-arrow-right"
                      ></use></svg
                  ></a>
                </div>
              </div>
            </section>

            <section
              v-else
              :key="el.id"
              v-for="el of group.elementList"
              :class="
                'element element-' + el.type + ' ' + slug(el.name) + ' ' + el.id
              "
            >
              <div class="container">
                <div class="sub-container">
                  <p v-if="el.name" class="subheading">{{ el.name }}</p>
                  <component
                    :is="'element-' + el.type"
                    :element="el"
                    :key="id + '::' + el.id"
                    :measurementUnit="getMeasurementUnit(el.id)"
                    :slug="slug(entry.title)"
                  ></component>
                </div>
              </div>
              <div
                v-if="group.name === 'description'"
                class="container"
                style="display: flex"
              >
                <ui-share color="white"></ui-share>
              </div>
            </section>
          </section>

          <section v-if="campaign" class="container">
            <div class="url">
              <a :href="campaignLink" target="_blank" rel="noopener">
                {{ campaignLinkLabel }}
                <ui-icon name="arrow-right" size="15px"></ui-icon>
              </a>
            </div>
          </section>
          <section v-if="cta">
            <protect-wilderness></protect-wilderness>
          </section>
          <section>
            <div class="container">
              <p style="text-align: center">
                This hike was submitted by a fellow public lands explorer. If
                you find any part of this entry inaccurate, please contact Wild
                Montana at
                <a href="mailto:guide@wildmontana.org">guide@wildmontana.org</a>
                and we will update the listing.
              </p>
            </div>
          </section>
          <section v-if="false" class="sponsor-list">
            <p class="subheading">{{ sponsor_intro_text }}</p>
            <element-sponsor
              :key="sponsor.id"
              :sponsor="sponsor"
              v-for="sponsor of sponsors"
            ></element-sponsor>
          </section>
        </main>
      </div>
      <ui-bottom v-if="context == 'app'"></ui-bottom>
    </div>
  </div>
</template>

<script>
import Bottom from "../component/bottom.vue";
import Button from "../component/button.vue";
import ElementContact from "../component/detail/element.contact.vue";
import ElementDateTime from "../component/detail/element.datetime.vue";
import ElementEmbed from "../component/detail/element.embed.vue";
import ElementEntry from "../component/detail/element.entry.vue";
import ElementFile from "../component/detail/element.file.vue";
import ElementGeo from "../component/detail/element.geo.vue";
import ElementNumber from "../component/detail/element.number.vue";
import ElementOption from "../component/detail/element.option.vue";
import ElementText from "../component/detail/element.text.vue";
import ElementSponsor from "../component/detail/element.sponsor.vue";
import Icon from "../component/icon.vue";
import Share from "../component/share.vue";
import Top from "../component/top.vue";
import ProtectWilderness from "../component/protect-wilderness.vue";
import config from "../../config";
import excerpt from "../utility/excerpt";
import slug from "../utility/slug";
import Accordion from "../component/accordion/accordion.vue";
import AccordionItem from "../component/accordion/accordion-item.vue";

function array_move(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing purposes
}

export default {
  name: "detail-view",
  metadata() {
    const en = this.entry || {};
    en.elements = Array.isArray(en.elements) ? en.elements : [];

    let desc = "";
    const el = en.elements.find(
      (el) => el.id === config.id.element.text.summary
    );
    if (el && el.data) desc = excerpt(el.data, 250);

    return {
      title: `${en.title || "Page Title"} | ${this.$t("site_name")}`,
      description: desc || this.$t("meta.description"),
      path: this.$route.fullPath,
      image: en.image && en.image.url ? `${en.image.url}?q=90` : "",
    };
  },
  async prefetch({ store, route }) {
    console.log({ route });
    try {
      await store.dispatch("entries", {
        first: true,
        // params: { id: route.params.id || route.meta.id },
        params: { id: "c9641ce3-a9c2-431e-b029-8085c26821e4" },
        previewing: route.query.preview === "true",
      });
    } catch (err) {
      if (err && err.code !== 404) console.error(err);
      throw { code: 404 };
    }
  },
  components: {
    "element-contact": ElementContact,
    "element-datetime": ElementDateTime,
    "element-embed": ElementEmbed,
    "element-entry": ElementEntry,
    "element-file": ElementFile,
    "element-geo": ElementGeo,
    "element-number": ElementNumber,
    "element-option": ElementOption,
    "element-text": ElementText,
    "element-sponsor": ElementSponsor,
    "ui-bottom": Bottom,
    "ui-button": Button,
    "ui-icon": Icon,
    "ui-share": Share,
    "ui-top": Top,
    "protect-wilderness": ProtectWilderness,
    Accordion,
    AccordionItem,
  },
  props: {
    context: {
      type: String,
      default: "app",
      validator(val) {
        return ["app", "panel"].includes(val);
      },
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      user: null,
      trailDescription: false,
    };
  },
  computed: {
    contributor() {
      if (!this.user || (!this.user.name.first && !this.user.name.last))
        return null;
      return `${this.user.name.first} ${this.user.name.last}`.trim();
    },
    cta() {
      return this.entry.types.some((t) => t.id === config.id.type.trail);
    },
    elements() {
      const hide = config.id.group.element.hide;
      const phases = config.elebase.phases;
      const enabled = this.entry.elements.filter((el) => {
        if (!el.groups.every((id) => id !== hide.detail)) return false;
        if (el.id === hide.campaignLabel || el.id === hide.campaignLink)
          return false;
        if (el.type === "boolean" || el.type === "id" || el.data === null)
          return false;
        if (el.type === "text" && !el.data) return false;
        if (Array.isArray(el.data) && !el.data.length) return false;
        if (
          el.type === "entry" &&
          !el.data.some((en) => phases.includes(en.phase))
        )
          return false;
        if (el.type === "geo" && !Array.isArray(el.data.features)) return false;
        return true;
      });

      return enabled.map((el) => ({
        ...el,
        name: el.groups.some((id) => id === hide.name) ? "" : el.name,
      }));
    },
    entry() {
      return this.$store.state.entries[this.id];
    },

    detailGroups() {
      // categories elements into different groups
      const details = [...config.id.group.element.details];
      const categorized = [];
      const groups = details.map((group) => {
        const elements = this.elements.filter((el) => {
          const inGroup = group.elements.includes(el.id);
          if (inGroup) {
            categorized.push(el.id);
            return true;
          }
          return false;
        });
        group.elementList = elements;
        return group;
      });

      // add into other group which are not categorized
      const secondaryNameArray = ["Trail Features", "Seasons", "Trail Surface"];
      const accordionNameArray = [
        "Getting Here",
        "Vehicle Access to Trailhead",
        "Shown in Map or Guidebook",
        "Fees / Restrictions / Notes",
        "Contacts",
        "Nearby Businesses",
      ];

      const trailDescription = "84ff3b6b-5737-46fc-affa-fc71ac250683";
      const contactManagingAgency = "169afa99-a581-4846-8f23-1112079cdd99";
      const trailDescriptionGroup = {
        name: "trailDescription",
        elementList: this.elements.filter((el) => el.id === trailDescription),
      };

      const relatedCampaignsGroup = {
        name: "relatedCampaigns",
        elementList: this.elements.filter(
          (el) => el.name === "Related Campaigns"
        ),
      };

      // console.log({ relatedCampaignsGroup: relatedCampaignsGroup.elementList });

      const newRelatedCampaignsEntries =
        relatedCampaignsGroup.elementList &&
        relatedCampaignsGroup.elementList[0]
          ? relatedCampaignsGroup.elementList[0].data
              .map((el) => {
                const campaignEntry = this.campaignEntry(el.id);
                if (campaignEntry) {
                  const campaignSummary = campaignEntry.elements.find(
                    (item) => item.name === "Summary"
                  );
                  const campaignLinkText = campaignEntry.elements.find(
                    (item) => item.name === "Link Text"
                  );
                  const campaignLinkUrl = campaignEntry.elements.find(
                    (item) => item.name === "Link URL"
                  );
                  const campaignImages = campaignEntry.elements.find(
                    (item) => item.name === "Images"
                  );
                  // console.log({
                  //   campaignSummary,
                  //   campaignLinkText,
                  //   campaignLinkUrl,
                  //   campaignImages,
                  // });
                  return {
                    title: el.title,
                    summary: campaignSummary.data,
                    linkText: campaignLinkText.data,
                    linkUrl: campaignLinkUrl.data,
                    image: campaignImages.data[0].url,
                  };
                }
              })
              .filter((a) => a !== undefined)
          : [];

      const newRelatedCampaignsGroup = {
        name: "newRelatedCampaigns",
        elementList: newRelatedCampaignsEntries,
      };

      // console.log({
      //   newRelatedCampaignsGroup: newRelatedCampaignsGroup.elementList,
      // });

      const secondaryGroups = {
        name: "secondary",
        elementList: this.elements.filter(
          (el) =>
            !categorized.includes(el.id) &&
            secondaryNameArray.includes(el.name) &&
            !accordionNameArray.includes(el.name)
        ),
      };
      const accordionGroups = {
        name: "accordion",
        elementList: this.elements.filter(
          (el) =>
            (!categorized.includes(el.id) &&
              accordionNameArray.includes(el.name)) ||
            (el.type === "geo" && !secondaryNameArray.includes(el.name)) ||
            el.id === contactManagingAgency
        ),
      };

      const otherGroup = {
        name: "other",
        elementList: this.elements.filter(
          (el) =>
            !categorized.includes(el.id) &&
            !secondaryNameArray.includes(el.name) &&
            !accordionNameArray.includes(el.name) &&
            el.type !== "geo" &&
            el.name !== "Related Campaigns" &&
            el.id !== trailDescription &&
            el.id !== contactManagingAgency
        ),
      };
      const allGroups = [
        ...groups,
        secondaryGroups,
        trailDescriptionGroup,
        relatedCampaignsGroup,
        otherGroup,
        accordionGroups,
        newRelatedCampaignsGroup,
      ].filter((g) => g.elementList.length > 0);

      // console.log({ allGroups });

      const summaryIndex = allGroups.findIndex(
        (group) => group.name === "summary-box"
      );

      // console.log({ elements: this.elements, accordionGroups, allGroups });
      array_move(allGroups, summaryIndex, 0);

      return allGroups;
    },
    sponsors() {
      const sponsors = [];
      for (const s in this.$store.state.sponsors) {
        sponsors.push(this.$store.state.sponsors[s]);
      }
      return sponsors;
    },
    sponsor_intro_text() {
      const entry = this.$store.state.entries[config.id.entry.sponsor];
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
    campaign() {
      return this.entry.type === "campaign";
    },
    campaignLink() {
      const linkElement = this.entry.elements.find(
        (el) => el.id === config.id.group.element.hide.campaignLink
      );
      return linkElement ? linkElement.data : "";
    },
    campaignLinkLabel() {
      const linkElement = this.entry.elements.find(
        (el) => el.id === config.id.group.element.hide.campaignLabel
      );
      return linkElement ? linkElement.data : "";
    },
    randomText() {
      return "TEst" + Math.random();
    },
    googleMapsUrl() {
      const el = this.entry.elements.find(
        (el) => el.id === config.id.element.geo.location
      );
      const point = JSON.parse(el.data.features[0].json).coordinates;
      const zoom = el.data.zoom;

      return `https://www.google.com/maps/dir//${point[1]},${point[0]}/@${point[1]},${point[0]},${zoom}z`;
    },
  },
  methods: {
    async getUser() {
      try {
        const user = await this.$store.dispatch("users", {
          first: true,
          params: { id: this.entry.users[0] },
          previewing: this.$route.query.preview === "true",
        });
        this.user = user;
      } catch (err) {
        console.error(err);
      }
    },
    goBack() {
      // console.log({ history: window.history });
      // if (window.history.length > 1) {
      //   return this.$router.back();
      // }
      //
      // this.$router.push("/");
      // this.$router.go(-1)
      // this.$router.push("/hike");
      if (this.$route.params.slug) {
        this.$router.push(`/hike?trail=${this.$route.params.slug}`);
      } else {
        this.$router.push(`/hike`);
      }
    },
    getMeasurementUnit(elementId) {
      return config.id.group.measurementUnits[elementId];
    },
    slug(string) {
      return slug(string);
    },
    campaignEntry(id) {
      return this.$store.state.entries[id];
    },
    toggleTrailDescription() {
      // console.log({ trailDescription: this.trailDescription });
      this.trailDescription = !this.trailDescription;
    },
  },
  mounted() {
    // if (
    //   window.dataLayer &&
    //   slug(this.entry.id) === "sign-up-to-add-trails-and-trail-reports"
    // ) {
    //   console.log("SIGNUP MOUNTED", {
    //     entry: this.entry,
    //     title: slug(this.entry.id),
    //   });
    //   window.dataLayer.push({
    //     event: "Add a Trail",
    //     pageUrl: window.location.href, //URL shown in URL bar
    //     // pageTitle: "Hike Wild Montana - Allen Peak Trail 466", //site name - {trail name},
    //     // trailName: "Allen Peak Trail 466",
    //     action: "Click - Add Trail",
    //   });
    // }
    // if (window.dataLayer) {
    //   window.dataLayer.push({
    //     event: "virtualPageview",
    //     pageUrl: window.location.href, //URL shown in URL bar
    //     pageTitle: `Hike Wild Montana - ${this.entry.title}`, //site name - {trail name},
    //     trailName: this.entry.title,
    //     action: "Click - Navigation Link",
    //   });
    // }
    if (this.entry.type === "report" && this.entry.users.length) {
      this.getUser();
    }
    if (this.context === "app") {
      document.documentElement.style.overflow = "auto";
    }
  },
  // updated() {
  //   console.log("DETAIL UPDATED", {
  //     entry: this.entry,
  //     title: slug(this.entry.title),
  //   });
  //   window.dataLayer.push({
  //     event: "virtualPageview",
  //     pageUrl: `https://wildmontana.org/hike?trail=${slug(this.entry.title)}`, //URL shown in URL bar
  //     pageTitle: `Hike Wild Montana - ${this.entry.title}`, //site name - {trail name},
  //     trailName: "Allen Peak Trail 466",
  //     action: "Click - Navigation Link",
  //   });
  // },
};
</script>

<style scoped>
.relatedCampaigns {
  display: none;
}

.detail-view.context-app {
  padding: 100px 0 0;
}

.back {
  float: left;
  margin: -2rem 0 3rem;
  padding: 0 20px;
}

.back .button {
  font-weight: var(--font-weight-light);
}

.back .button,
.back .button:hover,
.back .button:active,
.back .button:focus {
  border-color: transparent;
}

.back .button:hover {
  opacity: 0.7;
}

.share {
  position: relative;
  margin: 0;
  padding: 0;
  display: flex;
}

.content {
  padding: 0;
}

.heading h1 {
  margin: 1rem 0 0 0;
  padding: 0;
  font-size: 2.5rem;
}

.detail-view.context-app .heading h1 {
  font-size: 3rem;
}

.heading h1 .icon {
  margin: 0.4rem 0 0 1rem;
}

@media (min-width: 768px) {
  .detail-view {
  }

  .content {
    //padding: 0 20px;
  }

  .heading h1 {
    margin-top: 2rem;
  }
}

section {
  position: relative;
  padding-bottom: 2rem;
  margin: 0 auto;
}

.h4 {
  margin-bottom: 1rem;
}

.walk .container > a {
  display: block;
  padding: 2rem;
  color: var(--color-text-default);
  border: none;
  background-color: var(--color-bg-section);
}

.walk .container > a:hover,
.walk .container > a:active {
  background-color: var(--color-bg-section);
  opacity: 1;
}

.walk h2 {
  margin-bottom: 0.3rem;
  font-size: 2.3rem;
}

.walk .dates {
  font-size: 85%;
  line-height: 150%;
  color: var(--color-text-grey-light);
}

.walk .details {
  margin-top: 1.5rem;
  font-size: 90%;
  line-height: 1;
  color: var(--color-text-highlight);
}
.read-more {
  color: var(--color-text-highlight);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 10px 0;
  cursor: pointer;
  transition: 0.25s ease;
}
.read-more:hover {
  opacity: 0.7;
}

.walk .details {
  border: none;
  transition: color var(--duration-short);
}

.walk .details .icon {
  margin-top: -1px;
  transition: transform var(--duration-short) ease-out;
}

.walk:hover .details .icon {
  transform: translateX(5px);
}

.walk .badge {
  position: absolute;
  top: 50%;
  right: 4rem;
  margin-top: -2rem;
}

.image,
.summary-box,
.description {
  background-color: #163c47;
}

.description {
  margin-bottom: 2rem;
}

.image,
.summary-box,
.other,
.description {
  padding-bottom: 0;
}

.secondary {
  display: flex;
  justify-content: space-between;
}

.secondary section {
  margin: 0;
  padding-bottom: 0;
}

.summary-box {
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.summary-box > .container {
  display: flex;
  justify-content: space-between;
}

.summary-box .element {
  margin: 0;
  padding: 0;
  justify-content: space-between;
}
.summary-box .element .sub-container {
}
.summary-box .element >>> .data {
  font-size: 17px;
  line-height: 22px;
  color: #fff;
}
.summary-box .element >>> .container {
  padding: 0;
}
.summary-box .element >>> .subheading {
  font-family: "Lato", sans-serif;
  color: #fff;
  margin-bottom: 0;
}
.summary-box .element >>> .subheading::after {
  content: ":";
  margin-right: 8px;
}
.sponsor-list .subheading {
  margin: 20px;
  padding: 0;
}
.url {
  margin: 0.5rem 0;
  font-weight: var(--font-weight-heavy);
  line-height: 1;
}
.google--map--link {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.google--map--link svg {
  margin-left: 10px;
}

.campaign--section--title {
  font-weight: bold;
}
.campaign--image {
  margin-bottom: 18px;
}
.campaign--title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 0;
}

.campaign--link {
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
}
.campaign--link svg {
  margin-left: 5px;
}

.new--campaign {
  margin-bottom: 20px;
}
</style>

<style>
.trailDescription.open .data > * {
  display: block;
}

.trailDescription .data > * {
  display: none;
}
.trailDescription .data > *:first-child {
  display: block;
}
.trailDescription .data > *:last-child {
  margin-bottom: 1.2rem;
}

.detail-view.context-app .trailDescription .data > * {
  display: block;
}
.detail-view.context-app .trailDescription .read-more {
  display: none;
}

.detail-view.context-panel .heading {
  display: none;
}
</style>
