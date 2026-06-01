import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { d as $$Button, r as renderScript } from './OfferModal_BoUoRV57.mjs';

const $$WhyChooseUs = createComponent(($$result, $$props, $$slots) => {
  const cards = [
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Reliable Solutions",
      description: "Trusted electrical services backed by certified professionals and proven track record of excellence."
    },
    {
      icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      title: "Dedicated to Quality",
      description: "Every project meets highest standards with meticulous attention to detail and complete safety."
    },
    {
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Partnering for Success",
      description: "Building lasting relationships through exceptional service and reliable support for your specific needs."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="why-choose-us" class="bg-white py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-hbs2bwk2> <div class="max-w-7xl mx-auto" data-astro-cid-hbs2bwk2> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-10" data-astro-cid-hbs2bwk2> <!-- Left Side --> <div class="relative why-image" data-astro-cid-hbs2bwk2> <img src="https://images.unsplash.com/photo-1615774925655-a0e97fc85c14?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Professional Electrician" class="w-full h-[525px] object-cover rounded-lg" data-astro-cid-hbs2bwk2> </div> <!-- Right Side --> <div class="why-content" data-astro-cid-hbs2bwk2> <p class="text-[#e5b52a] font-semibold mb-4 flex items-center gap-2" style="font-size: 18px;" data-astro-cid-hbs2bwk2> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-hbs2bwk2> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-hbs2bwk2></path> </svg>
Why Choose Us
</p> <h2 class="heading-h2 font-bold text-black mb-6" style="line-height: 1.2;" data-astro-cid-hbs2bwk2>
Reliable Service<br data-astro-cid-hbs2bwk2>You Can Trust
</h2> <p class="text-gray-700 leading-relaxed mb-8" style="font-size: 22px;" data-astro-cid-hbs2bwk2>
With decades of experience and commitment to excellence, we deliver electrical solutions that prioritize safety, reliability, and customer satisfaction.
</p> <!-- Checkmarks --> <div class="space-y-4 mb-8 why-checkmarks" data-astro-cid-hbs2bwk2> <div class="flex items-start gap-3 why-check-item" data-index="0" data-astro-cid-hbs2bwk2> <svg class="w-6 h-6 text-[#F4C430] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-hbs2bwk2> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" data-astro-cid-hbs2bwk2></path> </svg> <p class="text-gray-700" style="font-size: 16px;" data-astro-cid-hbs2bwk2>Powered by years of industry experience and excellence.</p> </div> <div class="flex items-start gap-3 why-check-item" data-index="1" data-astro-cid-hbs2bwk2> <svg class="w-6 h-6 text-[#F4C430] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-hbs2bwk2> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" data-astro-cid-hbs2bwk2></path> </svg> <p class="text-gray-700" style="font-size: 16px;" data-astro-cid-hbs2bwk2>Dedicated to providing safe and efficient electrical services.</p> </div> </div> <!-- Contact Us Button --> <div class="flex flex-wrap items-center gap-8 why-button" data-astro-cid-hbs2bwk2> ${renderComponent($$result, "Button", $$Button, { "variant": "accent", "size": "md", "href": "/contact", "icon": false, "data-astro-cid-hbs2bwk2": true }, { "default": ($$result2) => renderTemplate`
Contact Us
` })} </div> </div> </div> <!-- Bottom Cards --> <div class="grid grid-cols-1 md:grid-cols-3 gap-6 why-cards" data-astro-cid-hbs2bwk2> ${cards.map((card, index) => renderTemplate`<div class="bg-[#FFF9E6] p-6 flex gap-4 rounded-lg why-card"${addAttribute(index, "data-card-index")} data-astro-cid-hbs2bwk2> <div class="flex-shrink-0" data-astro-cid-hbs2bwk2> <svg class="w-12 h-12 text-[#F4C430]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" data-astro-cid-hbs2bwk2> <path stroke-linecap="round" stroke-linejoin="round"${addAttribute(card.icon, "d")} data-astro-cid-hbs2bwk2></path> </svg> </div> <div data-astro-cid-hbs2bwk2> <h3 class="text-xl font-bold text-black mb-2" data-astro-cid-hbs2bwk2>${card.title}</h3> <p class="text-gray-700" style="font-size: 16px;" data-astro-cid-hbs2bwk2> ${card.description} </p> </div> </div>`)} </div> </div> </section>  ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/WhyChooseUs.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/WhyChooseUs.astro", void 0);

export { $$WhyChooseUs as $ };
