import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { d as $$Button } from './OfferModal_BoUoRV57.mjs';

const $$CallToAction = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<section class="bg-[#1a1a1a] py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden"> <div class="max-w-7xl mx-auto"> <div class="flex flex-col md:flex-row items-center justify-between gap-8"> <!-- Left Side: Text Content --> <div class="flex-1"> <h2 class="text-[58px] font-bold text-white mb-4 leading-tight">
Have Questions? <span class="text-[#F4C430]">+(234) 567 8912</span> </h2> <p class="text-gray-300 text-lg leading-relaxed">
We provide the best team that can do anything for you. We have a reliable company & our work is trusted.
</p> </div> <!-- Right Side: CTA Button --> <div class="flex-shrink-0"> ${renderComponent($$result, "Button", $$Button, { "variant": "accent", "size": "md", "href": "tel:+2345678912" }, { "default": ($$result2) => renderTemplate`
CALL US NOW
` })} </div> </div> </div> </section>`;
}, "C:/Users/sabido/electrician_website/src/components/sections/CallToAction.astro", void 0);

export { $$CallToAction as $ };
