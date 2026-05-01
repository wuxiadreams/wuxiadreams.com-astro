globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_Czee9Eh7.mjs";
import { m as maybeRenderHead, u as unescapeHTML, r as renderTemplate } from "./transition_DzUAhAmX.mjs";
import { r as renderComponent } from "./index_Hi_Vvptw.mjs";
import { $ as $$Layout } from "./layout_D8_XCjtG.mjs";
const html = () => '<h1 id="terms-of-service">Terms of Service</h1>\n<p><strong>Last Updated: December 30, 2024</strong></p>\n<p>Welcome to WuxiaDreams (“we,” “our,” or “us”). By accessing or using our website, <a href="https://wuxiadreams.com">https://wuxiadreams.com</a> (the “Site”), you agree to be bound by these Terms of Service (“Terms”). If you do not agree to these Terms, please do not use the Site.</p>\n<h2 id="1-acceptance-of-terms">1. Acceptance of Terms</h2>\n<p>By registering for an account or accessing our content, you confirm that you are at least 13 years old and have the legal capacity to enter into this agreement.</p>\n<h2 id="2-description-of-service">2. Description of Service</h2>\n<p>WuxiaDreams is a platform dedicated to providing novel reading services. We offer a collection of novels for your personal entertainment and non-commercial use.</p>\n<h2 id="3-user-accounts">3. User Accounts</h2>\n<p>To access certain features, you may need to register for an account. You agree to:</p>\n<ul>\n<li>Provide accurate and complete information.</li>\n<li>Maintain the confidentiality of your account credentials.</li>\n<li>Notify us immediately of any unauthorized use of your account.</li>\n</ul>\n<p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>\n<h2 id="4-user-conduct">4. User Conduct</h2>\n<p>You agree not to:</p>\n<ul>\n<li>Use the Site for any illegal purpose.</li>\n<li>Attempt to scrape, crawl, or harvest data from the Site.</li>\n<li>Interfere with the Site’s operation or security.</li>\n<li>Post or transmit harmful or offensive content.</li>\n</ul>\n<h2 id="5-intellectual-property">5. Intellectual Property</h2>\n<p>All content on the Site, including text, graphics, logos, and software, is the property of WuxiaDreams or its content suppliers and is protected by copyright laws. The novels available on the Site are for your personal reading only. You may not reproduce, distribute, or sell any content without explicit permission.</p>\n<h2 id="6-disclaimer-of-warranties">6. Disclaimer of Warranties</h2>\n<p>The Site is provided on an “as is” and “as available” basis. We make no warranties, expressed or implied, regarding the availability, accuracy, or reliability of the Site or its content.</p>\n<h2 id="7-limitation-of-liability">7. Limitation of Liability</h2>\n<p>To the fullest extent permitted by law, WuxiaDreams shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Site.</p>\n<h2 id="8-changes-to-terms">8. Changes to Terms</h2>\n<p>We may modify these Terms at any time. Your continued use of the Site after changes constitutes acceptance of the new Terms.</p>\n<h2 id="9-contact-us">9. Contact Us</h2>\n<p>If you have any questions about these Terms, please contact us at:\n<strong>Email</strong>: <a href="mailto:wuxiadreams@gmail.com">wuxiadreams@gmail.com</a></p>';
const frontmatter = {};
const file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/terms-of-service/_content.md";
const url = "/terms-of-service/_content";
const Content = createComponent((result, _props, slots) => {
  const { layout, ...content } = frontmatter;
  content.file = file;
  content.url = url;
  return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
});
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Terms of Service — Wuxia Dreams" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="w-full px-4 py-12"> <div class="mx-auto prose dark:prose-invert prose-h1:font-bold prose-h1:text-3xl prose-a:text-primary prose-p:text-justify prose-img:rounded-xl"> ${renderComponent($$result2, "Content", Content, {})} </div> </main> ` })}`;
}, "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/terms-of-service/index.astro", void 0);
const $$file = "/Users/yangfuzhang/Desktop/wuxiadreams/wuxiadreams.com/src/pages/terms-of-service/index.astro";
const $$url = "/terms-of-service";
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
