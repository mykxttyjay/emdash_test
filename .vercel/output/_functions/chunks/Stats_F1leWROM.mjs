import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { d as $$Button, r as renderScript } from './OfferModal_BoUoRV57.mjs';
import 'clsx';

const $$About = createComponent(($$result, $$props, $$slots) => {
  const cards = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Our Mission",
      description: "To provide reliable, safe, and innovative solutions that power homes and businesses."
    },
    {
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Our Vision",
      description: "To be the most trusted service provider, setting industry standards for excellence."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="about" class="bg-white py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-zsov6f23> <div class="max-w-7xl mx-auto" data-astro-cid-zsov6f23> <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end" data-astro-cid-zsov6f23> <!-- Left Side (Hidden on Mobile) --> <div class="hidden lg:block relative h-[500px] md:h-[650px] about-images opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]" data-astro-cid-zsov6f23> <!-- First Image --> <div class="absolute top-0 left-4 md:left-8 w-[70%] md:w-[450px] h-[450px] md:h-[580px] overflow-hidden shadow-xl z-10 rounded-lg about-image-1 opacity-0 -translate-x-[30px]" data-astro-cid-zsov6f23> <img src="https://images.unsplash.com/photo-1622426385889-4fc93a72423a?q=60&w=600&auto=format&fit=crop" alt="Buildings" class="w-full h-full object-cover" loading="lazy" decoding="async" data-astro-cid-zsov6f23> </div> <!-- Second Image --> <div class="absolute bottom-0 right-0 w-[60%] md:w-96 h-[350px] md:h-[420px] overflow-hidden shadow-xl z-20 rounded-lg about-image-2 opacity-0 translate-x-[30px]" data-astro-cid-zsov6f23> <img src="https://images.unsplash.com/photo-1683295083329-4d4738291f3a?q=60&w=500&auto=format&fit=crop" alt="Electrician at work" class="w-full h-full object-cover" loading="lazy" decoding="async" data-astro-cid-zsov6f23> </div> <!-- Experience Card --> <div class="absolute top-24 right-4 md:top-36 md:right-12 bg-[#F4C430] p-4 md:p-8 shadow-2xl z-30 w-40 md:w-55 border-t-4 border-black rounded-lg about-experience-card opacity-0 scale-[0.8]" data-astro-cid-zsov6f23> <div class="flex flex-col items-start space-y-1 md:space-y-2" data-astro-cid-zsov6f23> <h3 class="text-5xl md:text-7xl font-black text-black tracking-tight counter leading-[0.9]" data-target="20" data-astro-cid-zsov6f23>0+</h3> <div class="text-left" data-astro-cid-zsov6f23> <p class="text-base md:text-lg font-bold text-black leading-tight" data-astro-cid-zsov6f23>Years Experience</p> </div> </div> </div> </div> <!-- Right Side --> <div class="space-y-4 about-content opacity-0" data-astro-cid-zsov6f23> <div class="relative" data-astro-cid-zsov6f23> <p class="text-[#e5b52a] font-semibold mb-2 flex items-center gap-2 relative z-10 text-lg" data-astro-cid-zsov6f23> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-zsov6f23> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-zsov6f23></path> </svg>
About Us
</p> <h2 class="heading-h2 font-bold text-black mb-4 relative z-10 leading-tight" data-astro-cid-zsov6f23>Reliable & Expert<br data-astro-cid-zsov6f23><span class="whitespace-nowrap" data-astro-cid-zsov6f23>Electrical Solutions</span></h2> <p class="text-gray-700 leading-relaxed relative z-10 text-[22px]" data-astro-cid-zsov6f23>
With over two decades of experience, we deliver professional electrical services that prioritize safety, efficiency, and innovation. Our certified team ensures every project meets the highest standards.
</p> </div> <!-- Mission and Vision Cards --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4 about-cards opacity-0 translate-y-5" data-astro-cid-zsov6f23> ${cards.map((card) => renderTemplate`<div class="group border-2 border-gray-300 p-6 hover:border-[#F4C430] transition-all" data-astro-cid-zsov6f23> <div class="relative w-20 h-20 mb-4" data-astro-cid-zsov6f23> <!-- Dashed circle border with rotation animation --> <div class="absolute inset-0 rounded-full border-4 border-dashed border-[#F4C430] opacity-30 group-hover:opacity-50 transition-opacity animate-spin-slow" data-astro-cid-zsov6f23></div> <!-- Inner solid circle with icon --> <div class="absolute inset-0 flex items-center justify-center" data-astro-cid-zsov6f23> <div class="w-12 h-12 bg-[#F4C430] group-hover:bg-black rounded-full flex items-center justify-center transition-colors" data-astro-cid-zsov6f23> <svg class="w-6 h-6 text-black group-hover:text-[#F4C430] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-zsov6f23> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${addAttribute(card.icon, "d")} data-astro-cid-zsov6f23></path> </svg> </div> </div> </div> <h3 class="text-xl font-bold text-black mb-2" data-astro-cid-zsov6f23>${card.title}</h3> <p class="text-gray-700" data-astro-cid-zsov6f23> ${card.description} </p> </div>`)} </div> <!-- About More Button --> <div class="flex items-center gap-6 pt-2 about-button opacity-0 translate-y-5" data-astro-cid-zsov6f23> ${renderComponent($$result, "Button", $$Button, { "href": "/about", "variant": "accent", "size": "md", "icon": false, "data-astro-cid-zsov6f23": true }, { "default": ($$result2) => renderTemplate`
About More
` })} </div> </div> </div> </div> </section> ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/About.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/About.astro", void 0);

const $$Stats = createComponent(($$result, $$props, $$slots) => {
  const stats = [
    {
      target: 500,
      label: "Projects Completed",
      showDivider: true
    },
    {
      target: 350,
      label: "Happy Clients",
      showDivider: true
    },
    {
      target: 20,
      label: "Years Experience",
      showDivider: true
    },
    {
      target: 4.9,
      label: "Client Rating",
      isDecimal: true,
      showDivider: false
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="bg-[#1a1a1a] py-16 px-4 sm:px-6 lg:px-8" id="stats-section"> <div class="max-w-7xl mx-auto"> <div class="grid grid-cols-1 md:grid-cols-4 gap-8"> ${stats.map((stat) => renderTemplate`<div class="text-center relative"> ${stat.showDivider && renderTemplate`<div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-20 bg-white hidden md:block"></div>`} <h3 class="text-5xl font-bold text-[#F4C430] mb-2"> <span class="counter"${addAttribute(stat.target, "data-target")}${addAttribute(stat.isDecimal ? "true" : "false", "data-decimal")}>
0
</span>${stat.isDecimal ? "" : "+"} </h3> <p class="text-white text-lg">${stat.label}</p> </div>`)} </div> </div> </section> ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/Stats.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/Stats.astro", void 0);

export { $$About as $, $$Stats as a };
