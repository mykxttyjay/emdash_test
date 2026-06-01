import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$Layout } from './Layout_fHGwmDxs.mjs';
import { $ as $$Header, a as $$Footer, b as $$FloatingOffer, c as $$OfferModal } from './OfferModal_BoUoRV57.mjs';
import { $ as $$Hero2 } from './Hero2_CrFKTtub.mjs';
import { $ as $$Location$1 } from './Location_Cb30ToX0.mjs';
import { $ as $$FAQ } from './FAQ_bRMAU30S.mjs';
import { $ as $$CallToAction } from './CallToAction_Bklq-JiW.mjs';
import { $ as $$FloatingSideButtons } from './FloatingSideButtons_h63HCHvg.mjs';

const $$Location = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Service Areas" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Hero2", $$Hero2, { "title": "Service Areas", "backgroundImage": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" })} ${renderComponent($$result2, "LocationSection", $$Location$1, {})} ${renderComponent($$result2, "FAQ", $$FAQ, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "FloatingOffer", $$FloatingOffer, {})} ${renderComponent($$result2, "FloatingSideButtons", $$FloatingSideButtons, { "showOnScroll": true, "triggerSection": "faq" })} ${renderComponent($$result2, "OfferModal", $$OfferModal, {})} ` })}`;
}, "C:/Users/sabido/electrician_website/src/pages/location.astro", void 0);

const $$file = "C:/Users/sabido/electrician_website/src/pages/location.astro";
const $$url = "/location";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Location,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
