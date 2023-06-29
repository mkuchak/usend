import { defineConfig } from "vitepress";

export default defineConfig({
  lang: "en-US",
  title: "Usend",
  description: "A free alternative for sending emails in Node.js",
  themeConfig: {
    logo: "/usend.svg",
    nav: [
      { text: "Examples", link: "https://github.com/mkuchak/usend/blob/main/lib/example/index.ts" },
    ],
    sidebar: [
      {
        text: "Getting Started",
        collapsed: false,
        items: [
          { text: "Usend", link: "/" },
          { text: "Quick Start", link: "/quick-start" },
          {
            text: "Domain Protection",
            link: "/domain-protection",
          },
          { text: "Custom Vendor", link: "/custom-vendor" },
          { text: "Mocking Response", link: "/mocking-response" },
          { text: "API Reference", link: "/api-reference" },
          { text: "Examples", link: "https://github.com/mkuchak/usend/blob/main/lib/example/index.ts" },
        ],
      },
      {
        items: [
          { text: "Supporters", link: "/supporters" },
          { text: "Contributing", link: "/contributing" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/mkuchak/usend" }],
  },
});
