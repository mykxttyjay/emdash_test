import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$Layout } from './Layout_fHGwmDxs.mjs';
import { $ as $$Header, a as $$Footer, b as $$FloatingOffer, c as $$OfferModal } from './OfferModal_BoUoRV57.mjs';
import { $ as $$Hero2 } from './Hero2_CrFKTtub.mjs';
import { $ as $$About$1, a as $$Stats } from './Stats_F1leWROM.mjs';
import { $ as $$Services } from './Services_CK2jxdCx.mjs';
import { $ as $$FAQ } from './FAQ_bRMAU30S.mjs';
import { $ as $$Location } from './Location_Cb30ToX0.mjs';
import { $ as $$FloatingSideButtons } from './FloatingSideButtons_h63HCHvg.mjs';

const $$About = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "About Electrixa" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Hero2", $$Hero2, { "title": "About Us" })} ${renderComponent($$result2, "AboutSection", $$About$1, {})} ${renderComponent($$result2, "Services", $$Services, {})} ${renderComponent($$result2, "Stats", $$Stats, {})} ${renderComponent($$result2, "FAQ", $$FAQ, {})} ${renderComponent($$result2, "Location", $$Location, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "FloatingOffer", $$FloatingOffer, {})} ${renderComponent($$result2, "FloatingSideButtons", $$FloatingSideButtons, { "showOnScroll": true, "triggerSection": "about" })} ${renderComponent($$result2, "OfferModal", $$OfferModal, {})} ` })}`;
}, "C:/Users/sabido/electrician_website/src/pages/about.astro", void 0);

const $$file = "C:/Users/sabido/electrician_website/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
