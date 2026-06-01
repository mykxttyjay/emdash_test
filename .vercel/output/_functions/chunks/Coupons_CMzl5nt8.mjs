import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate, b8 as unescapeHTML } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { d as $$Button, r as renderScript } from './OfferModal_BoUoRV57.mjs';

const $$Coupons = createComponent(($$result, $$props, $$slots) => {
  const coupons = [
    {
      icon: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
      iconColor: "text-[#F4C430]",
      label: "Heroes Discount",
      title: "SAVE NOW",
      titleColor: "text-[#F4C430]",
      subtitle: "Thank You For Your Service!",
      discount: "10%",
      discountSuffix: "OFF",
      description: "<strong>Seniors 65+ & Military save 10%</strong> on all services.",
      terms: "* Valid ID required. Expires: December 2026",
      bgClass: "bg-white",
      textClass: "text-gray-700"
    },
    {
      icon: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z",
      iconColor: "text-black",
      label: "Limited Offer",
      title: "GET FREE",
      titleColor: "text-black",
      subtitle: "See The Problem Clearly!",
      discount: "FREE",
      discountSuffix: "",
      description: "<strong>FREE camera inspection</strong> with any drain cleaning.",
      terms: "* Mention when booking. Expires: December 2026",
      bgClass: "bg-gradient-to-br from-[#F4C430] to-[#e5b52a]",
      textClass: "text-black",
      discountBg: "bg-white text-[#1a1a1a]"
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      iconColor: "text-[#F4C430]",
      label: "Big Savings",
      title: "MEGA DEAL",
      titleColor: "text-[#F4C430]",
      subtitle: "Don't Miss Out!",
      discount: "$50",
      discountSuffix: "OFF",
      description: "<strong>Save $50 on repairs $500+</strong> Perfect for upgrades & installations!",
      terms: "* Min. $500 service. Expires: December 2026",
      bgClass: "bg-white",
      textClass: "text-gray-700"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section id="coupons" class="bg-[#1a1a1a] py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-hmuje5ap> <div class="max-w-7xl mx-auto" data-astro-cid-hmuje5ap> <!-- Section Header --> <div class="mb-6 text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_forwards]" data-astro-cid-hmuje5ap> <div class="flex items-center justify-center gap-2 mb-1" data-astro-cid-hmuje5ap> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-hmuje5ap> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-hmuje5ap></path> </svg> <p class="text-[#F4C430] font-semibold text-lg" data-astro-cid-hmuje5ap>Special Offers</p> </div> <h2 class="heading-h2 font-bold text-white mb-2" data-astro-cid-hmuje5ap>Exclusive Coupons & Deals</h2> <p class="text-gray-300 leading-relaxed max-w-5xl mx-auto text-subtitle" data-astro-cid-hmuje5ap>
Save on professional electrical services with our limited-time offers and special discounts.
</p> </div> <!-- Coupons Grid --> <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-6 mb-8" data-astro-cid-hmuje5ap> ${coupons.map((coupon, index) => renderTemplate`<div${addAttribute(`${coupon.bgClass} relative overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 border-2 border-dashed ${index === 1 ? "border-black md:scale-110 md:z-10" : "border-[#F4C430] md:mt-8"} rounded-lg w-full md:w-1/2 md:flex-shrink coupon-card opacity-0 translate-y-[30px]`, "class")}${addAttribute(index, "data-index")} data-astro-cid-hmuje5ap> <!-- Diagonal Ribbon Banner --> <div${addAttribute(`absolute top-8 -right-12 w-48 transform rotate-45 z-20 shadow-lg ${index === 1 ? "bg-black" : index === 0 || index === 2 ? "bg-black" : "bg-[#F4C430]"}`, "class")} data-astro-cid-hmuje5ap> <p${addAttribute(`text-center py-2 font-black uppercase tracking-wider text-xs ${index === 1 ? "text-[#F4C430]" : index === 0 || index === 2 ? "text-white" : "text-black"}`, "class")} data-astro-cid-hmuje5ap> ${index === 0 ? "Best Value" : index === 1 ? "Popular" : "Hot Deal"} </p> </div> <!-- Top Section with Icon Badge --> <div class="relative p-6 pb-4" data-astro-cid-hmuje5ap> <div class="flex items-center justify-start mb-4" data-astro-cid-hmuje5ap> <div${addAttribute(`w-14 h-14 ${index === 1 ? "bg-white" : "bg-[#F4C430]"} flex items-center justify-center relative z-10`, "class")} data-astro-cid-hmuje5ap> <svg${addAttribute(`w-8 h-8 text-black`, "class")} fill="currentColor" viewBox="0 0 24 24" data-astro-cid-hmuje5ap> <path${addAttribute(coupon.icon, "d")} data-astro-cid-hmuje5ap></path> </svg> </div> </div> <h3${addAttribute(`${coupon.titleColor} text-4xl font-black mb-2 tracking-tight`, "class")} data-astro-cid-hmuje5ap>${coupon.title}</h3> <p${addAttribute(`${index === 1 ? "text-black" : "text-gray-800"} text-base font-bold mb-4`, "class")} data-astro-cid-hmuje5ap>${coupon.subtitle}</p> </div> <!-- Dashed Divider --> <div${addAttribute(`border-t-2 ${index === 1 ? "border-black" : "border-[#F4C430]"} border-dashed mx-6`, "class")} data-astro-cid-hmuje5ap></div> <!-- Bottom Section with Discount --> <div class="p-6 pt-4" data-astro-cid-hmuje5ap> <div${addAttribute(`${coupon.discountBg || "bg-[#1a1a1a] text-white"} text-center py-8 px-4 mb-4 relative`, "class")} data-astro-cid-hmuje5ap> <div class="absolute inset-0 opacity-10" style="background: repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 11px);" data-astro-cid-hmuje5ap></div> <div class="relative" data-astro-cid-hmuje5ap> <span class="text-6xl font-black" data-astro-cid-hmuje5ap>${coupon.discount}</span> ${coupon.discountSuffix && renderTemplate`<span class="text-3xl font-bold ml-2" data-astro-cid-hmuje5ap>${coupon.discountSuffix}</span>`} </div> </div> <p${addAttribute(`${coupon.textClass} text-sm mb-3 leading-relaxed`, "class")} data-astro-cid-hmuje5ap>${unescapeHTML(coupon.description)}</p> <p${addAttribute(`${index === 1 ? "text-black/70" : "text-gray-600"} text-xs italic`, "class")} data-astro-cid-hmuje5ap>${coupon.terms}</p> <!-- Claim Button --> <div class="mt-4" data-astro-cid-hmuje5ap> ${renderComponent($$result, "Button", $$Button, { "variant": index === 1 ? "couponDark" : "coupon", "size": "md", "href": "/contact", "class": "w-full py-3", "data-astro-cid-hmuje5ap": true }, { "default": ($$result2) => renderTemplate`
Claim Offer
` })} </div> </div> </div>`)} </div> </div> </section>  ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/Coupons.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/Coupons.astro", void 0);

export { $$Coupons as $ };
