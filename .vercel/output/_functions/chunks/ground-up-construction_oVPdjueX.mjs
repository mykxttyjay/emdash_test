import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$Layout } from './Layout_fHGwmDxs.mjs';
import { $ as $$Header, a as $$Footer, b as $$FloatingOffer, c as $$OfferModal } from './OfferModal_BoUoRV57.mjs';
import { $ as $$Hero2 } from './Hero2_CrFKTtub.mjs';
import { $ as $$ServiceDetailSection } from './ServiceDetailSection_CSDEOklx.mjs';
import { $ as $$Testimonials } from './Testimonials_BJhOOogu.mjs';
import { $ as $$FAQ } from './FAQ_bRMAU30S.mjs';
import { $ as $$Location } from './Location_Cb30ToX0.mjs';
import { $ as $$CallToAction } from './CallToAction_Bklq-JiW.mjs';
import { $ as $$FloatingSideButtons } from './FloatingSideButtons_h63HCHvg.mjs';
import { $ as $$WhyChooseUs } from './WhyChooseUs_CEwd2RZ1.mjs';
import { $ as $$Coupons } from './Coupons_CMzl5nt8.mjs';

const $$GroundUpConstruction = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Ground-Up Electrical Construction" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Hero2", $$Hero2, { "backgroundImage": "https://images.unsplash.com/photo-1605313294941-ea43850d9de5?q=80&w=1140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "title": "Ground-up Electrical Construction", "titleSize": "heading-h2" })} ${renderComponent($$result2, "ServiceDetailSection", $$ServiceDetailSection, { "title": "Ground-Up Electrical", "description": "Expert electrical construction services for new commercial and residential buildings. From initial planning to final inspection, we deliver comprehensive electrical systems that meet all code requirements.", "image": "https://images.unsplash.com/photo-1660330589487-39cc0177ba89?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "imageAlt": "Ground-up electrical construction", "showPricing": true, "pricingTitle": "Ground-up Construction", "pricingCardImage": "https://images.unsplash.com/photo-1702128411190-5061e7756d5c?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "pricingCardDescription": "Complete electrical infrastructure for new construction projects from foundation to finish.", "pricingDescription": "Complete electrical infrastructure for new commercial construction projects. From initial design to final installation, we expertly handle all critical aspects of electrical systems for your building.", "pricingIcon": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='black' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'/%3E%3C/svg%3E", "pricingFeatures": [
    "Full electrical system design & planning",
    "Power distribution & panel installation",
    "Code-compliant wiring & conduit systems",
    "Coordination with general contractors"
  ], "services": [
    { name: "Ground-up Construction", link: "/ground-up-construction" },
    { name: "Emergency & Standby Power", link: "/services/commercial/power-systems" },
    { name: "Commercial HVAC Electrical", link: "/services/commercial/hvac" },
    { name: "Electrical Panels", link: "/services/commercial/panels" }
  ] })} ${renderComponent($$result2, "WhyChooseUs", $$WhyChooseUs, {})} ${renderComponent($$result2, "Coupons", $$Coupons, {})} ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} ${renderComponent($$result2, "FAQ", $$FAQ, {})} ${renderComponent($$result2, "Location", $$Location, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})} ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "FloatingOffer", $$FloatingOffer, {})} ${renderComponent($$result2, "FloatingSideButtons", $$FloatingSideButtons, { "showOnScroll": true, "triggerSection": "why-choose-us" })} ${renderComponent($$result2, "OfferModal", $$OfferModal, {})} ` })}`;
}, "C:/Users/sabido/electrician_website/src/pages/ground-up-construction.astro", void 0);

const $$file = "C:/Users/sabido/electrician_website/src/pages/ground-up-construction.astro";
const $$url = "/ground-up-construction";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$GroundUpConstruction,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
