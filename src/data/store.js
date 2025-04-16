import config from "../../config";
import format from "./format";

import Hashes from "jshashes";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export function store(api, loc) {
  api.config.locales = [loc];

  return new Vuex.Store({
    state: {
      contacts: {},
      sponsors: {},
      embeds: {},
      entries: {},
      geo: {},
      groups: {},
      history: {},
      ids: { entry: { primary: new Set() } },
      iframed: false,
      locale: loc,
      phases: config.elebase.phases,
      queries: { contact: {}, entry: {}, group: {}, user: {} },
      selected: "",
      share: false,
      total: 0,
      users: {},
      viewedTrailCount: 0,
    },
    actions: {
      async contacts({ commit, state }, options) {
        options = options || {};

        if (options.previewing === true) {
          delete options.previewing;
          options.headers = options.headers || {};
          options.headers["Cache-Control"] = "no-cache";
        }

        if (options.first && options.params && options.params.id) {
          if (state.contacts[options.params.id]) {
            return state.contacts[options.params.id];
          }
        }

        const key = new Hashes.SHA1().hex(JSON.stringify(options));

        if (key in state.queries.contact) {
          const q = state.queries.contact[key];
          if (options.first) {
            return state.contacts[q.results[0]];
          }
          return {
            index: q.results.map((id) => state.contacts[id]),
            total: q.total,
          };
        }

        const res = await api.get("/contacts", options);

        if (options.first && res.data && res.data.id) {
          commit("contact", res.data);
          Vue.set(state.queries.contact, key, {
            results: [res.data.id],
            total: 1,
          });
          return state.contacts[res.data.id];
        }

        res.data = res.data || {};
        res.data.index = Array.isArray(res.data.index) ? res.data.index : [];
        res.data.total = !Number.isNaN(Number(res.data.total))
          ? Number(res.data.total)
          : 0;

        commit("contacts", { data: res.data, key });

        return {
          index: res.data.index.map((c) => state.contacts[c.id]),
          total: res.data.total,
        };
      },
      async embedData({ commit, state }, embed) {
        if (!embed || !embed.id) return;

        if (state.embeds[embed.id]) {
          return state.embeds[embed.id];
        }

        const params = { locale: state.locale, url: embed.url };
        const res = await api.get("/embed/data", { params });
        if (!res.data || !res.data.oembed) return;

        res.data.id = embed.id;
        res.data.locale = embed.locale || "";
        res.data.url = embed.url;
        res.data.title = embed.title || "";
        res.data.description = embed.description || "";
        res.data.ip_attribution = embed.ip_attribution || "";

        commit("embed", res.data);

        return state.embeds[res.data.id];
      },
      async sponsors({ commit, state }, options) {
        options = options || {};
        options.params = options.params || {};
        options.params.locale = state.locale;

        if (options.previewing === true) {
          delete options.previewing;
          options.headers = options.headers || {};
          options.headers["Cache-Control"] = "no-cache";
          options.params.phase = "1";
        }

        if (Object.keys(state.sponsors).length > 0) {
          return state.sponsors;
        }
        const res = await api.get("/entries", options);

        res.data = res.data || {};
        res.data.index = Array.isArray(res.data.index) ? res.data.index : [];
        res.data.total = !Number.isNaN(Number(res.data.total))
          ? Number(res.data.total)
          : 0;

        commit("sponsors", { data: res.data });

        return {
          index: res.data.index.map((en) => state.sponsors[en.id]),
          total: res.data.total,
        };
      },
      async entries({ commit, state }, options) {
        options = options || {};
        options.params = options.params || {};
        options.params.locale = state.locale;

        if (options.previewing === true) {
          delete options.previewing;
          options.headers = options.headers || {};
          options.headers["Cache-Control"] = "no-cache";
          options.params.phase = "1,2,3,4";
        }

        if (options.first && options.params && options.params.id) {
          if (state.entries[options.params.id]) {
            return state.entries[options.params.id];
          }
        }

        const key = new Hashes.SHA1().hex(JSON.stringify(options));

        if (key in state.queries.entry) {
          const q = state.queries.entry[key];
          if (options.first) {
            return state.entries[q.results[0]];
          }
          return {
            index: q.results.map((id) => state.entries[id]),
            total: q.total,
          };
        }

        const res = await api.get("/entries", options);

        if (options.first) {
          if (!res.data || !res.data.id) return null;
          commit("entry", res.data);
          Vue.set(state.queries.entry, key, {
            results: [res.data.id],
            total: 1,
          });
          return state.entries[res.data.id];
        }

        res.data = res.data || {};
        res.data.index = Array.isArray(res.data.index) ? res.data.index : [];
        res.data.total = !Number.isNaN(Number(res.data.total))
          ? Number(res.data.total)
          : 0;

        commit("entries", { data: res.data, key });

        return {
          index: res.data.index.map((en) => state.entries[en.id]),
          total: res.data.total,
        };
      },
      async groups({ commit, state }, options) {
        options = options || {};

        if (options.previewing === true) {
          delete options.previewing;
          options.headers = options.headers || {};
          options.headers["Cache-Control"] = "no-cache";
        }

        if (options.first && options.params && options.params.id) {
          if (state.groups[options.params.id]) {
            return state.groups[options.params.id];
          }
        }

        const key = new Hashes.SHA1().hex(JSON.stringify(options));

        if (key in state.queries.group) {
          const q = state.queries.group[key];
          if (options.first) {
            return state.groups[q.results[0]];
          }
          return {
            index: q.results.map((id) => state.groups[id]),
            total: q.total,
          };
        }

        const res = await api.get("/groups", options);

        if (options.first && res.data && res.data.id) {
          commit("group", res.data);
          Vue.set(state.queries.group, key, {
            results: [res.data.id],
            total: 1,
          });
          return state.groups[res.data.id];
        }

        res.data = res.data || {};
        res.data.index = Array.isArray(res.data.index) ? res.data.index : [];
        res.data.total = !Number.isNaN(Number(res.data.total))
          ? Number(res.data.total)
          : 0;

        commit("groups", { data: res.data, key });

        return {
          index: res.data.index.map((g) => state.groups[g.id]),
          total: res.data.total,
        };
      },
      async users({ commit, state }, options) {
        options = options || {};

        if (options.previewing === true) {
          delete options.previewing;
          options.headers = options.headers || {};
          options.headers["Cache-Control"] = "no-cache";
        }

        if (options.first && options.params && options.params.id) {
          if (state.users[options.params.id]) {
            return state.users[options.params.id];
          }
        }

        const key = new Hashes.SHA1().hex(JSON.stringify(options));

        if (key in state.queries.user) {
          const q = state.queries.user[key];
          if (options.first) {
            return state.users[q.results[0]];
          }
          return {
            index: q.results.map((id) => state.users[id]),
            total: q.total,
          };
        }

        const res = await api.get("/users", options);

        if (options.first && res.data && res.data.id) {
          commit("user", res.data);
          Vue.set(state.queries.user, key, {
            results: [res.data.id],
            total: 1,
          });
          return state.users[res.data.id];
        }

        res.data = res.data || {};
        res.data.index = Array.isArray(res.data.index) ? res.data.index : [];
        res.data.total = !Number.isNaN(Number(res.data.total))
          ? Number(res.data.total)
          : 0;

        commit("users", { data: res.data, key });

        return {
          index: res.data.index.map((u) => state.users[u.id]),
          total: res.data.total,
        };
      },
      increaseViewTrailCount({ commit, state }) {
        const count = state.viewedTrailCount;
        commit("trailViewCount", count + 1);
      },
    },
    getters: {
      geo: (state) => () => state.geo,
      locale: (state) => () => state.locale,
      selected: (state) => () => state.selected,
      share: (state) => () => state.share,
      viewedTrailCount: (state) => () => state.viewedTrailCount,
    },
    mutations: {
      trailViewCount(state, count) {
        state.viewedTrailCount = count;
      },
      sponsors(state, { data }) {
        if (!Array.isArray(data.index) || !data.index.length) return;

        for (const s of data.index) {
          Vue.set(state.sponsors, s.id, format.sponsor(s));
        }
      },
      contact(state, c) {
        if (!c || !c.id) return;
        Vue.set(state.contacts, c.id, format.contact(c));
      },
      contacts(state, { data, key }) {
        if (!Array.isArray(data.index) || !data.index.length) return;

        const ids = [];
        for (const c of data.index) {
          Vue.set(state.contacts, c.id, format.contact(c));
          ids.push(c.id);
        }

        Vue.set(state.queries.contact, key, {
          results: ids,
          total: data.total,
        });
      },
      embed(state, em) {
        if (!em || !em.id) return;
        Vue.set(state.embeds, em.id, format.embed(em));
      },
      entries(state, { data, key }) {
        if (!Array.isArray(data.index) || !data.index.length) return;

        const ids = [];
        for (const en of data.index) {
          Vue.set(state.entries, en.id, format.entry(en));
          ids.push(en.id);
        }

        Vue.set(state.queries.entry, key, {
          results: ids,
          total: data.total,
        });
      },
      entry(state, en) {
        if (!en || !en.id) return;
        Vue.set(state.entries, en.id, format.entry(en));
      },
      geo(state, options) {
        state.geo = { ...state.geo, ...options };
      },
      group(state, g) {
        if (!g || !g.id) return;
        Vue.set(state.groups, g.id, g);
      },
      groups(state, { data, key }) {
        if (!Array.isArray(data.index) || !data.index.length) return;

        const ids = [];
        for (const g of data.index) {
          Vue.set(state.groups, g.id, g);
          ids.push(g.id);
        }

        Vue.set(state.queries.group, key, {
          results: ids,
          total: data.total,
        });
      },
      "history.add"(state, { key, val }) {
        Vue.set(state.history, key, val);
      },
      "history.remove"(state, key) {
        if (key in state.history) {
          Vue.delete(state.history, key);
        }
      },
      ids(state, { key, ids, type = "entry" }) {
        if (!Array.isArray(ids)) return;
        ids.forEach((id) => state.ids.entry.primary.add(id));
      },
      iframed(state, val) {
        state.iframed = val;
      },
      selected(state, id) {
        state.selected = id;
      },
      share(state, val) {
        console.log({ share: val });
        state.share = val;
      },
      total(state, val) {
        state.total = val;
      },
      user(state, u) {
        if (!u || !u.id) return;
        Vue.set(state.users, u.id, format.user(u));
      },
      users(state, { data, key }) {
        if (!Array.isArray(data.index) || !data.index.length) return;

        const ids = [];
        for (const u of data.index) {
          Vue.set(state.users, u.id, format.user(u));
          ids.push(u.id);
        }

        Vue.set(state.queries.user, key, {
          results: ids,
          total: data.total,
        });
      },
    },
  });
}
