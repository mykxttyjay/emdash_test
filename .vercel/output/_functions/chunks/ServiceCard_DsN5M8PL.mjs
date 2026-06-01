import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate, B as maybeRenderHead, aU as addAttribute, b8 as unescapeHTML } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';

const $$ServiceCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ServiceCard;
  const { name, image, description = "Professional electrical services for your needs", icon, link } = Astro2.props;
  const CardWrapper = link ? "a" : "div";
  return renderTemplate`${renderComponent($$result, "CardWrapper", CardWrapper, { "href": link, "class": "group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500 block" }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<div class="w-full aspect-square overflow-hidden bg-gray-200"> <img${addAttribute(image, "src")}${addAttribute(name, "alt")} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" decoding="async"> </div>  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 py-4 px-4 flex items-center gap-2 z-10 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2"> ${icon && renderTemplate`<div class="w-5 h-5 flex-shrink-0">${unescapeHTML(icon.replace("data:image/svg+xml,", "").replace(/%3C/g, "<").replace(/%3E/g, ">").replace(/%22/g, '"').replace(/%20/g, " ").replace(/%3D/g, "=").replace(/%2F/g, "/"))}</div>`} <h4 class="font-black text-black text-[16px] leading-tight">${name}</h4> </div>  <div class="absolute inset-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-out flex flex-col items-start justify-center px-8 z-20"> <!-- Decorative line --> <div class="w-16 h-1 bg-black mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div> <h4 class="font-black text-black text-left text-[20px] mb-4 leading-tight opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-4 group-hover:translate-y-0">${name}</h4> <p class="text-black text-left text-[15px] font-semibold leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 transform translate-y-4 group-hover:translate-y-0">${description}</p> </div> ` })}`;
}, "C:/Users/sabido/electrician_website/src/components/ui/ServiceCard.astro", void 0);

export { $$ServiceCard as $ };
