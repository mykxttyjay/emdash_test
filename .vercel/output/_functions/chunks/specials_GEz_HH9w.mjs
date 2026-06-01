import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$Layout } from './Layout_fHGwmDxs.mjs';
import { $ as $$Header, a as $$Footer, b as $$FloatingOffer, c as $$OfferModal } from './OfferModal_BoUoRV57.mjs';
import { $ as $$Hero2 } from './Hero2_CrFKTtub.mjs';
import { $ as $$Coupons } from './Coupons_CMzl5nt8.mjs';
import { $ as $$FAQ } from './FAQ_bRMAU30S.mjs';
import { $ as $$CallToAction } from './CallToAction_Bklq-JiW.mjs';

const $$Specials = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Special Offers & Coupons - Electrixa" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Hero2", $$Hero2, { "title": "Exclusive Special Offers", "backgroundImage": "https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" })} ${renderComponent($$result2, "Coupons", $$Coupons, {})} ${renderComponent($$result2, "FAQ", $$FAQ, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "FloatingOffer", $$FloatingOffer, {})} ${renderComponent($$result2, "OfferModal", $$OfferModal, {})} ` })}`;
}, "C:/Users/sabido/electrician_website/src/pages/specials.astro", void 0);

const $$file = "C:/Users/sabido/electrician_website/src/pages/specials.astro";
const $$url = "/specials";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Specials,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
