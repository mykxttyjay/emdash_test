import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { d as $$Button, r as renderScript } from './OfferModal_BoUoRV57.mjs';

const $$FAQ = createComponent(($$result, $$props, $$slots) => {
  const faqs = [
    {
      question: "What areas do you serve?",
      answer: "We provide electrical services throughout Los Angeles County, including Santa Monica, Pasadena, Glendale, and Beverly Hills."
    },
    {
      question: "Do you offer 24/7 emergency electrical services?",
      answer: "Yes, we offer 24/7 emergency services for urgent issues like power outages, electrical fires, and sparking outlets."
    },
    {
      question: "Are your electricians licensed and insured?",
      answer: "Absolutely. All our electricians are fully licensed, certified, and insured, maintaining the highest industry standards."
    },
    {
      question: "How much do your electrical services cost?",
      answer: "Pricing varies based on project scope. We offer free estimates and transparent pricing with no hidden fees."
    },
    {
      question: "Do you provide warranties on your work?",
      answer: "Yes, all installations and repairs come with comprehensive warranties and a satisfaction guarantee."
    },
    {
      question: "How quickly can you respond to service calls?",
      answer: "For emergencies, we offer same-day service. For scheduled appointments, we work around your availability."
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="faq" class="bg-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" data-astro-cid-mh6t5pw4> <div class="max-w-7xl mx-auto relative z-10" data-astro-cid-mh6t5pw4> <!-- Section Header --> <div class="mb-12 text-center faq-header" data-astro-cid-mh6t5pw4> <div class="flex items-center justify-center gap-2 mb-2" data-astro-cid-mh6t5pw4> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-mh6t5pw4> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-mh6t5pw4></path> </svg> <p class="text-[#e5b52a] font-semibold text-lg" data-astro-cid-mh6t5pw4>Frequently Asked Questions</p> </div> <h2 class="heading-h2 font-black text-black mb-4" data-astro-cid-mh6t5pw4>Got Questions? We've Got Answers</h2> <p class="text-gray-700 leading-relaxed max-w-3xl mx-auto text-xl" data-astro-cid-mh6t5pw4>
Everything you need to know about our electrical services
</p> </div> <!-- Two Column Layout --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-12" data-astro-cid-mh6t5pw4> <!-- Left Side: FAQ Questions --> <div class="space-y-4 faq-questions" data-astro-cid-mh6t5pw4> ${faqs.map((faq, index) => renderTemplate`<div${addAttribute(`faq-item group bg-[#F8F8F8] border-l-4 ${index === 0 ? "border-[#F4C430]" : "border-transparent"} hover:border-[#F4C430] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer`, "class")} data-astro-cid-mh6t5pw4> <div class="faq-question p-5"${addAttribute(index, "data-index")} data-astro-cid-mh6t5pw4> <div class="flex items-center gap-3 mb-2" data-astro-cid-mh6t5pw4> <div class="w-10 h-10 bg-[#F4C430] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300" data-astro-cid-mh6t5pw4> <span class="text-black font-black text-lg" data-astro-cid-mh6t5pw4>${index + 1}</span> </div> <div class="flex-1" data-astro-cid-mh6t5pw4> <h3 class="font-bold text-black leading-tight group-hover:text-[#F4C430] transition-colors" style="font-size: 18px;" data-astro-cid-mh6t5pw4>${faq.question}</h3> </div> <svg${addAttribute(`faq-icon w-6 h-6 text-gray-400 group-hover:text-[#F4C430] flex-shrink-0 transition-all duration-300 mr-2 ${index === 0 ? "rotate-180" : ""}`, "class")} fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-mh6t5pw4> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" data-astro-cid-mh6t5pw4></path> </svg> </div> <div${addAttribute(`faq-answer overflow-hidden transition-all duration-300 ml-13 ${index === 0 ? "" : "max-h-0"}`, "class")}${addAttribute(index === 0 ? "max-height: 200px;" : "", "style")} data-astro-cid-mh6t5pw4> <p class="text-gray-700 leading-relaxed pb-2" style="font-size: 16px;" data-astro-cid-mh6t5pw4>${faq.answer}</p> </div> </div> </div>`)} </div> <!-- Right Side: CTA Box --> <div class="bg-[#1a1a1a] p-10 h-full flex flex-col justify-between faq-cta" data-astro-cid-mh6t5pw4> <div data-astro-cid-mh6t5pw4> <!-- Heading --> <h3 class="text-3xl font-black text-white mb-4 leading-tight" data-astro-cid-mh6t5pw4>
Need Electrical Help?
</h3> <p class="text-gray-300 text-lg mb-6 leading-relaxed" data-astro-cid-mh6t5pw4>
Our certified electricians are ready to assist you.
</p> <!-- Stats --> <div class="grid grid-cols-2 gap-4 mb-6 pb-8 border-b-2 border-gray-700" data-astro-cid-mh6t5pw4> <div data-astro-cid-mh6t5pw4> <p class="text-5xl font-black text-[#F4C430] mb-3" data-astro-cid-mh6t5pw4>24/7</p> <p class="text-gray-400 text-base font-semibold uppercase" data-astro-cid-mh6t5pw4>Available</p> </div> <div data-astro-cid-mh6t5pw4> <p class="text-5xl font-black text-[#F4C430] mb-3" data-astro-cid-mh6t5pw4>20+</p> <p class="text-gray-400 text-base font-semibold uppercase" data-astro-cid-mh6t5pw4>Years Experience</p> </div> </div> <!-- Contact Options --> <div class="space-y-4 mb-8" data-astro-cid-mh6t5pw4> <a href="tel:+12345678912" class="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 transition-all group" data-astro-cid-mh6t5pw4> <div class="w-12 h-12 bg-[#F4C430] flex items-center justify-center flex-shrink-0" data-astro-cid-mh6t5pw4> <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-mh6t5pw4> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" data-astro-cid-mh6t5pw4></path> </svg> </div> <div data-astro-cid-mh6t5pw4> <p class="text-gray-400 uppercase font-semibold" data-astro-cid-mh6t5pw4>Call Us Now</p> <p class="text-white font-black text-xl" data-astro-cid-mh6t5pw4>+(234) 567 8912</p> </div> </a> <a href="mailto:info@electrixa.com" class="flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 transition-all group" data-astro-cid-mh6t5pw4> <div class="w-12 h-12 bg-[#F4C430] flex items-center justify-center flex-shrink-0" data-astro-cid-mh6t5pw4> <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-mh6t5pw4> <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" data-astro-cid-mh6t5pw4></path> </svg> </div> <div data-astro-cid-mh6t5pw4> <p class="text-gray-400 uppercase font-semibold" data-astro-cid-mh6t5pw4>Email Us</p> <p class="text-white font-black text-xl" data-astro-cid-mh6t5pw4>info@electrixa.com</p> </div> </a> </div> <!-- CTA Button --> ${renderComponent($$result, "Button", $$Button, { "variant": "couponWhite", "size": "md", "href": "/contact", "class": "w-full py-4", "data-astro-cid-mh6t5pw4": true }, { "default": ($$result2) => renderTemplate`
Get Free Quote
` })} </div> </div> </div> </div> </section>  ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/FAQ.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/FAQ.astro", void 0);

export { $$FAQ as $ };
