const config = {
  app: {
    color: {
      highlight: "#8d1d1a",
    },
    trailViewLimit: 2,
  },
  elebase: {
    key: {
      private:
        "06c73d70893cd230568137abc20abe8ef89fdabb7209befbf1bcfb2fee75652c",
      public: "cd06801a-acfb-44fb-afc1-d0879393578f",
    },
    phases: [4],
  },
  embed: {
    params: {
      vimeo: {
        byline: "false",
        maxheight: "500",
        maxwidth: "1000",
        portrait: "false",
        title: "false",
      },
      youtube: {
        maxheight: "500",
        maxwidth: "1000",
        rel: "0",
        showinfo: "0",
      },
    },
  },
  geo: {
    bbox: [-116.0643, 44.4571, -104.0563, 49.0088],
    center: [-110.236, 46.98],
    path: {
      opacity: [0.4, 1],
      width: [2, 4],
    },
    point: {
      opacity: [0.9, 1],
      radius: [10, 15],
      scale: [1, 1.5],
    },
    polygon: {
      opacity: [0.1, 0.9],
    },
    popups: true,
    search: true,
    style: "default",
    styles: {
      // default: 'mapbox://styles/wildmontana/cjly7knf159532rl72s4ls4dq?optimize=true',
      // hybrid: 'mapbox://styles/wildmontana/cjlfn2lks8rmc2rqvgp326bsk?optimize=true',
      // outdoors: 'mapbox://styles/wildmontana/cjlflw9r42joj2robxhn8faro?optimize=true'
      default: "mapbox://styles/wildmontana/cktug02hb149718oazqodez63",
      hybrid: "mapbox://styles/wildmontana/cktug02hb149718oazqodez63",
      outdoors: "mapbox://styles/wildmontana/cktug02hb149718oazqodez63",
    },
    // Mapbox
    // wildmontana
    // fort-klu-garm6YURM
    // token: 'pk.eyJ1Ijoid2lsZG1vbnRhbmEiLCJhIjoiY2psZmx2M290MGltbzNxcWg4eGowZTcwaiJ9.TBkl9AZAqb1YUMNszfPw9g',
    // token: 'pk.eyJ1Ijoid2lsZG1vbnRhbmEiLCJhIjoiY2twbzdhNHhmMDE3eTJvcWhucWRsNmpiaiJ9.3Al88Op68czfoBuQFJztbw',
    token:
      "pk.eyJ1Ijoid2lsZG1vbnRhbmEiLCJhIjoiY2psZmx2M290MGltbzNxcWg4eGowZTcwaiJ9.TBkl9AZAqb1YUMNszfPw9g",
    zoom: {
      initial: 6,
      locate: 6,
      max: 18,
      min: 2,
    },
  },
  host: {
    development: "localhost:9000",
    production: "hike.wildmontana.org",
    staging: "mapview-wildmontana-test.herokuapp.com",
  },
  id: {
    element: {
      contact: {
        primary: "169afa99-a581-4846-8f23-1112079cdd99",
      },
      datetime: {
        report: "5bbf0bc2-5bab-4777-8368-aff8ac2eda77",
        walk: "d51e08fa-39a4-47db-a37a-a89cce696d8e",
      },
      entry: {
        reports: "f90ce5a4-60b5-4cc5-914c-eb73c0829527",
      },
      geo: {
        location: "19e1d9b7-fc15-4d71-a6ad-80a6f8ee52cd",
        nearby: "e0796da3-2b80-4ef1-a11a-7469fa95b1da",
      },
      file: {
        image: "8d6a8aa1-3821-45fb-8b36-3390aeff276b",
      },
      option: {
        form: "d43a6060-e630-4366-b0d3-b65c87fb83f9",
      },
      text: {
        body: "84ff3b6b-5737-46fc-affa-fc71ac250683",
        summary: "154b6e8f-5703-41c3-990a-9c5136e28caa",
        url: {
          walk: "9d93b9ba-d724-4bdb-b427-1b287ca40c1b",
        },
      },
      trailLength: "980ad63f-cb20-45a9-a268-4ee925b62dec",
      elevationGain: "18473b3c-7323-448d-8983-575a03af7ae0",
    },
    entry: {
      signup: "c9641ce3-a9c2-431e-b029-8085c26821e4",
      sponsor: "e0f1fb71-296f-4030-9022-eda12016a775",
      protect: "ca0e80f3-0371-4b53-80f3-0239fc32cc82",
      protectOverlay: "0b4a6f6b-d27f-4de9-a98b-94e1901def50",
    },
    group: {
      element: {
        filters: "b40fdee4-dacc-4232-8e7d-2574ac169497",
        mileageElevation: "83e92b85-ba05-44a9-86e2-c4886a93e18e",
        hide: {
          detail: "80adc989-cb43-466e-97fc-946e25622524",
          name: "5de14740-fdf2-47bd-a14e-4d2d1e0f47c9",
          campaignLabel: "a2d63f8e-50fe-4f5a-9920-1a8d745910a2",
          campaignLink: "51b387c7-030f-4599-8ff5-573bf1a8627a",
        },
        details: [
          {
            name: "image",
            elements: ["8d6a8aa1-3821-45fb-8b36-3390aeff276b"],
          },
          {
            name: "description",
            elements: ["154b6e8f-5703-41c3-990a-9c5136e28caa"],
          },
          {
            name: "summary-box",
            elements: [
              "980ad63f-cb20-45a9-a268-4ee925b62dec",
              "18473b3c-7323-448d-8983-575a03af7ae0",
              "87356494-e403-4b92-9f60-21f6e24526ad",
            ],
          },
        ],
      },
      measurementUnits: {
        "980ad63f-cb20-45a9-a268-4ee925b62dec": "mi.",
        "18473b3c-7323-448d-8983-575a03af7ae0": "ft.",
        "87356494-e403-4b92-9f60-21f6e24526ad": "ft.",
      },
      entry: {
        featured: "0f205a8c-2f97-4d7d-99d5-4374af088252",
        banner: "7ade643f-735a-444f-8401-ecb71db5e6db",
      },
      user: {
        contributors: "e143242f-05b2-4109-b715-1b5b910a65b4",
      },
      sponsor: {
        logo: "54d99c54-6a7c-4375-b33a-256cee49902c",
        description: "773768d3-7dc0-42d4-bc6a-e8692bfc31da",
        link: "51b387c7-030f-4599-8ff5-573bf1a8627a",
      },
    },
    option: {
      form: {
        signup: "e89f2d77-bef5-4302-9de9-674293412f6a",
        messages: "ea81d095-8937-4731-b5a0-cc56c0cc3674",
      },
      bannerText: "ea81d095-8937-4731-b5a0-cc56c0cc3674",
    },
    project: "4d98752b-d833-4239-8a68-bf5ba176f5df",
    type: {
      business: "d001bc10-9bc4-49c3-9035-a79d1514d48a",
      campaign: "756c78e6-a26e-4212-9355-23720826d6dd",
      report: "67b4f5bf-fbff-4697-86bb-4d32be3fd212",
      trail: "ccc47729-d4fd-49e1-bba8-e24ca134dc8d",
      sponsors: "6f3010d6-0fb0-46c6-b00a-19a1c0aa4325",
      messages: "518ceaad-38d7-4ba1-b3b9-57d893ad9ff6",
    },
  },
  locales: [{ id: "en", label: "English" }],
  pattern: {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    image: /^(http(s?):)([/|.|\w|\s|-])*\.(?:jp(e?)g|gif|png|svg|tif|ico|webp)/,
  },
  tracking: {
    google: {
      enabled: true,
      id: "UA-37465504-1",
      containerId: "GTM-M8TKLMT",
    },
  },
  ttl: {
    dynamic: 1000 * 60 * 60,
    static: 1000 * 60 * 60 * 6,
  },
  url: {
    image: {
      placeholder: {
        business:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/454122ed-e168-48ab-8e24-b59b0244a7eb-placeholder-business.jpg",
        campaign:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/e5cd0e75-ef06-41b0-abf2-7d34274c0379-placeholder-campaign.jpg",
        report:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/dc0dc4fe-38c1-4da3-9cb8-5525d8d25f9c-placeholder-report.jpg",
        trail:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/b14a04a9-abce-4ea1-be7a-4104d1d05113-placeholder-trail.jpg",
      },
      share: {
        large:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/5ca88c3d-2ea4-495f-8248-7ba1d3997888-share-1024.jpg",
        thumb:
          "https://cdn.elebase.io/4d98752b-d833-4239-8a68-bf5ba176f5df/4a35441a-579d-46d2-b95b-36b8728cab87-share-512.jpg",
      },
    },
    salesforceFormAction: "https://go.wildmontana.org/l/784453/2019-12-08/4nv8",
    mainSite: "https://wildmontana.org/",
  },
};

module.exports = config;
