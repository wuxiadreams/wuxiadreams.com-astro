globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
const html = () => '<h1 id="privacy-policy">Privacy Policy</h1>\n<p><strong>Last Updated: December 30, 2024</strong></p>\n<p>WuxiaDreams (“we,” “our,” or “us”) respects your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit <a href="https://wuxiadreams.com">https://wuxiadreams.com</a> (the “Site”).</p>\n<h2 id="1-information-we-collect">1. Information We Collect</h2>\n<p>We may collect the following types of information:</p>\n<ul>\n<li><strong>Personal Information</strong>: When you register, we collect your email address and username.</li>\n<li><strong>Usage Data</strong>: We automatically collect information about your device, browser, IP address, and how you interact with the Site (e.g., pages visited, reading history).</li>\n<li><strong>Cookies</strong>: We use cookies to enhance your experience, remember your preferences, and analyze site traffic.</li>\n</ul>\n<h2 id="2-how-we-use-your-information">2. How We Use Your Information</h2>\n<p>We use your information to:</p>\n<ul>\n<li>Provide and maintain the Site.</li>\n<li>Manage your account and reading progress.</li>\n<li>Improve our services and user experience.</li>\n<li>Communicate with you regarding updates or support.</li>\n<li>Display relevant advertisements (via third-party partners).</li>\n</ul>\n<h2 id="3-third-party-services">3. Third-Party Services</h2>\n<p>We may share non-personal information with third-party service providers for analytics and advertising purposes.</p>\n<ul>\n<li><strong>Advertising</strong>: We use third-party advertising companies to serve ads when you visit our Site. These companies may use information about your visits to provide advertisements about goods and services of interest to you.</li>\n</ul>\n<h2 id="4-data-security">4. Data Security</h2>\n<p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>\n<h2 id="5-childrens-privacy">5. Children’s Privacy</h2>\n<p>Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>\n<h2 id="6-changes-to-this-policy">6. Changes to This Policy</h2>\n<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>\n<h2 id="7-contact-us">7. Contact Us</h2>\n<p>If you have questions about this Privacy Policy, please contact us at:\n<strong>Email</strong>: <a href="mailto:wuxiadreams@gmail.com">wuxiadreams@gmail.com</a></p>';
const frontmatter = {};
const file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/privacy-policy/_content.md";
const url = "/privacy-policy/_content";
const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
});
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Privacy Policy — Wuxia Dreams" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-full px-4 py-12"> <div class="mx-auto prose dark:prose-invert prose-h1:font-bold prose-h1:text-3xl prose-a:text-primary prose-p:text-justify prose-img:rounded-xl prose-headings:underline"> ${renderComponent($$result2, "Content", Content, {})} </div> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/privacy-policy/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/privacy-policy/index.astro";
const $$url = "/privacy-policy";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
