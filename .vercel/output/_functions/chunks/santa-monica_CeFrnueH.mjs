import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$Layout } from './Layout_fHGwmDxs.mjs';
import { d as $$Button, r as renderScript, $ as $$Header, a as $$Footer, b as $$FloatingOffer, c as $$OfferModal } from './OfferModal_BoUoRV57.mjs';
import { $ as $$Hero2 } from './Hero2_CrFKTtub.mjs';
import 'clsx';
import { $ as $$Services } from './Services_CK2jxdCx.mjs';
import { $ as $$Coupons } from './Coupons_CMzl5nt8.mjs';
import { $ as $$Portfolio } from './Portfolio_iA1DEjtT.mjs';
import { $ as $$Testimonials } from './Testimonials_BJhOOogu.mjs';
import { $ as $$CallToAction } from './CallToAction_Bklq-JiW.mjs';
import { $ as $$FloatingSideButtons } from './FloatingSideButtons_h63HCHvg.mjs';

const $$AboutSantaMonica = createComponent(($$result, $$props, $$slots) => {
  const cards = [
    {
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      title: "Local Expertise",
      description: "Deep understanding of Santa Monica's electrical codes and building requirements."
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Fast Response",
      description: "Quick emergency service throughout Santa Monica and surrounding areas."
    },
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Licensed & Insured",
      description: "Fully certified electricians with comprehensive insurance coverage for your protection."
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Competitive Pricing",
      description: "Fair and transparent pricing with free estimates for all Santa Monica residents."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="bg-white py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-p7sdbsda> <div class="max-w-7xl mx-auto" data-astro-cid-p7sdbsda> <!-- Top Section: Image and Text Side by Side --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mb-10" data-astro-cid-p7sdbsda> <!-- Left Side: Single Image --> <div class="hidden lg:block relative h-full about-images opacity-0 animate-[fadeIn_0.8s_ease-out_forwards] ml-auto" data-astro-cid-p7sdbsda> <div class="overflow-hidden shadow-xl rounded-lg about-image-1 opacity-0 -translate-x-[30px]" style="width: 600px; height: 560px;" data-astro-cid-p7sdbsda> <img src="https://images.unsplash.com/photo-1646640381839-02748ae8ddf0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Santa Monica buildings" class="w-full h-full object-cover" loading="lazy" decoding="async" data-astro-cid-p7sdbsda> </div> </div> <!-- Right Side: Text Content --> <div class="space-y-4 about-content opacity-0" data-astro-cid-p7sdbsda> <div class="relative" data-astro-cid-p7sdbsda> <p class="text-[#e5b52a] font-semibold mb-2 flex items-center gap-2 relative z-10 text-lg" data-astro-cid-p7sdbsda> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-p7sdbsda> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-p7sdbsda></path> </svg>
Santa Monica Services
</p> <h2 class="heading-h2 font-bold text-black mb-4 relative z-10 leading-tight" data-astro-cid-p7sdbsda>Your Trusted<br data-astro-cid-p7sdbsda><span class="whitespace-nowrap" data-astro-cid-p7sdbsda>Santa Monica</span><br data-astro-cid-p7sdbsda>Electrician</h2> <p class="text-gray-700 leading-relaxed relative z-10 text-[22px]" data-astro-cid-p7sdbsda>
Proudly serving Santa Monica for over 20 years, we understand the unique electrical needs of coastal properties and local businesses. From beachfront homes to commercial spaces on the Promenade, our certified electricians deliver reliable service.
</p> </div> <!-- Contact Button --> <div class="flex items-center about-button opacity-0 translate-y-5" data-astro-cid-p7sdbsda> ${renderComponent($$result, "Button", $$Button, { "href": "/contact", "variant": "accent", "size": "md", "icon": false, "data-astro-cid-p7sdbsda": true }, { "default": ($$result2) => renderTemplate`
Contact Us Today
` })} </div> </div> </div> <!-- Bottom Section: Feature Cards --> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 about-cards opacity-0 translate-y-5" data-astro-cid-p7sdbsda> ${cards.map((card) => renderTemplate`<div class="group border-2 border-gray-300 p-6 hover:border-[#F4C430] transition-all" data-astro-cid-p7sdbsda> <div class="relative w-20 h-20 mb-4" data-astro-cid-p7sdbsda> <!-- Dashed circle border with rotation animation --> <div class="absolute inset-0 rounded-full border-4 border-dashed border-[#F4C430] opacity-30 group-hover:opacity-50 transition-opacity animate-spin-slow" data-astro-cid-p7sdbsda></div> <!-- Inner solid circle with icon --> <div class="absolute inset-0 flex items-center justify-center" data-astro-cid-p7sdbsda> <div class="w-12 h-12 bg-[#F4C430] group-hover:bg-black rounded-full flex items-center justify-center transition-colors" data-astro-cid-p7sdbsda> <svg class="w-6 h-6 text-black group-hover:text-[#F4C430] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-p7sdbsda> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(card.icon, "d")} data-astro-cid-p7sdbsda></path> </svg> </div> </div> </div> <h3 class="text-xl font-bold text-black mb-2" data-astro-cid-p7sdbsda>${card.title}</h3> <p class="text-gray-700" data-astro-cid-p7sdbsda> ${card.description} </p> </div>`)} </div> </div> </section> ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/AboutSantaMonica.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/AboutSantaMonica.astro", void 0);

const $$WhyChooseSantaMonica = createComponent(($$result, $$props, $$slots) => {
  const services = [
    {
      number: "01",
      title: "Local Santa Monica Team",
      description: "Our electricians live and work in Santa Monica, providing fast response times and understanding of local building codes and regulations.",
      align: "left"
    },
    {
      number: "02",
      title: "Beachfront Specialists",
      description: "Specialized knowledge in handling electrical systems for beachfront properties, including salt-air corrosion prevention and moisture protection.",
      align: "left"
    },
    {
      number: "03",
      title: "Same-Day Service",
      description: "Emergency electrical services with rapid response throughout Santa Monica. We prioritize urgent calls and offer flexible scheduling.",
      align: "left"
    },
    {
      number: "04",
      title: "Fully Licensed & Insured",
      description: "All our electricians are California state-licensed with complete insurance coverage, ensuring your property and investment are fully protected.",
      align: "right"
    },
    {
      number: "05",
      title: "Smart Home Integration",
      description: "Expert installation of smart home systems, EV chargers, and energy-efficient solutions perfect for Santa Monica's eco-conscious community.",
      align: "right"
    },
    {
      number: "06",
      title: "Transparent Pricing",
      description: "Upfront, honest pricing with detailed free estimates before we start. No hidden fees or surprise charges for Santa Monica residents.",
      align: "right"
    }
  ];
  const leftServices = services.filter((s) => s.align === "left");
  const rightServices = services.filter((s) => s.align === "right");
  return renderTemplate`${maybeRenderHead()}<section class="relative bg-[#F8F8F8] pt-12 pb-20 px-4 sm:px-6 lg:px-8"> <div class="max-w-7xl mx-auto"> <!-- Section Header --> <div class="text-center mb-12"> <p class="text-[#F4C430] font-semibold text-lg flex items-center justify-center gap-2 mb-2"> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path> </svg>
Local Expertise
</p> <h2 class="heading-h2 font-bold text-black mb-4" style="font-size: 63px; white-space: nowrap;">
Why Choose Our Santa Monica Services
</h2> <p class="text-gray-700 leading-relaxed max-w-5xl mx-auto text-subtitle mb-20">
We understand Santa Monica's unique electrical needs, from coastal properties to modern smart homes. Our local expertise ensures reliable, code-compliant solutions.
</p> </div> <!-- Three Column Layout: Left Services - Center Image - Right Services --> <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-5 items-start"> <!-- Left Column - Services 01-03 --> <div class="space-y-12"> ${leftServices.map((service) => renderTemplate`<div class="flex gap-4"> <div class="flex-shrink-0"> <span class="text-[#F4C430] font-bold text-3xl">${service.number}.</span> </div> <div> <h3 class="font-bold text-black mb-2" style="font-size: 25px;">${service.title}</h3> <p class="text-gray-600 leading-relaxed text-base"> ${service.description} </p> </div> </div>`)} </div> <!-- Center Image --> <div class="flex justify-center lg:mx-4"> <img src="/lights.png" alt="Modern Electrical Pendant Lighting" class="w-full max-w-[400px] h-auto object-contain"> </div> <!-- Right Column - Services 04-06 --> <div class="space-y-12"> ${rightServices.map((service) => renderTemplate`<div class="flex gap-4"> <div> <h3 class="font-bold text-black mb-2 text-right" style="font-size: 25px;">${service.title}</h3> <p class="text-gray-600 leading-relaxed text-base text-right"> ${service.description} </p> </div> <div class="flex-shrink-0"> <span class="text-[#F4C430] font-bold text-3xl">${service.number}.</span> </div> </div>`)} </div> </div> </div> </section> ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/WhyChooseSantaMonica.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/WhyChooseSantaMonica.astro", void 0);

const $$SantaMonica = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Santa Monica Services" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, {})} ${renderComponent($$result2, "Hero2", $$Hero2, { "backgroundImage": "https://images.unsplash.com/photo-1523430410476-0185cb1f6ff9?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", "title": "Santa Monica" })} ${renderComponent($$result2, "AboutSantaMonica", $$AboutSantaMonica, {})} ${renderComponent($$result2, "WhyChooseSantaMonica", $$WhyChooseSantaMonica, {})} ${renderComponent($$result2, "Coupons", $$Coupons, {})} ${renderComponent($$result2, "Services", $$Services, {})} ${renderComponent($$result2, "Portfolio", $$Portfolio, {})} ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, {})}  ${maybeRenderHead()}<section class="bg-[#F8F8F8] py-20 px-4 sm:px-6 lg:px-8"> <div class="max-w-7xl mx-auto"> <!-- Section Header --> <div class="text-center mb-10"> <h2 class="heading-h2 font-bold text-black mb-2">Find Us in Santa Monica</h2> <p class="text-gray-700 leading-relaxed max-w-4xl mx-auto text-subtitle">
Conveniently located to serve all of Santa Monica and surrounding areas
</p> </div> <div class="grid grid-cols-1"> <!-- Map - Full Width --> <div class="w-full"> <div class="bg-white shadow-xl overflow-hidden h-full min-h-[500px]"> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d211877.8952805003!2d-118.6919155!3d34.0194543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2a4cec2910019%3A0xb4170ab5ff23f5ab!2sSanta%20Monica%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" class="w-full h-full" title="Google Maps showing Santa Monica location"></iframe> </div> </div> </div> </div> </section> ${renderComponent($$result2, "Footer", $$Footer, {})} ${renderComponent($$result2, "FloatingOffer", $$FloatingOffer, {})} ${renderComponent($$result2, "FloatingSideButtons", $$FloatingSideButtons, { "showOnScroll": true, "triggerSection": "coupons" })} ${renderComponent($$result2, "OfferModal", $$OfferModal, {})} ` })}`;
}, "C:/Users/sabido/electrician_website/src/pages/santa-monica.astro", void 0);

const $$file = "C:/Users/sabido/electrician_website/src/pages/santa-monica.astro";
const $$url = "/santa-monica";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$SantaMonica,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
