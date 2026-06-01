import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { r as renderScript } from './OfferModal_BoUoRV57.mjs';
import 'clsx';

const $$PortfolioCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$PortfolioCard;
  const { image, title, category } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="portfolio-slide flex-shrink-0 w-[280px] md:w-[335px]"> <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500"> <!-- Image --> <div class="relative h-[350px] md:h-[400px] overflow-hidden"> <img${addAttribute(image, "src")}${addAttribute(title, "alt")} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" decoding="async"> <!-- Overlay --> <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div> <!-- Content --> <div class="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"> <span class="inline-block px-3 py-1 bg-[#F4C430] text-black text-xs font-bold uppercase tracking-wider mb-2"> ${category} </span> <h3 class="text-white text-lg font-bold leading-tight"> ${title} </h3> </div> </div> </div> </div>`;
}, "C:/Users/sabido/electrician_website/src/components/ui/PortfolioCard.astro", void 0);

const $$Portfolio = createComponent(($$result, $$props, $$slots) => {
  const projects = [
    {
      image: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=1169&auto=format&fit=crop",
      title: "Residential Wiring Installation",
      category: "Residential"
    },
    {
      image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=1170&auto=format&fit=crop",
      title: "Commercial Panel Upgrade",
      category: "Commercial"
    },
    {
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1170&auto=format&fit=crop",
      title: "Industrial Electrical Systems",
      category: "Industrial"
    },
    {
      image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1170&auto=format&fit=crop",
      title: "Emergency Power Solutions",
      category: "Emergency"
    },
    {
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1170&auto=format&fit=crop",
      title: "Smart Home Integration",
      category: "Smart Home"
    },
    {
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1170&auto=format&fit=crop",
      title: "Lighting Installation",
      category: "Lighting"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<section class="bg-white py-20 overflow-hidden" data-astro-cid-7kp4msfm> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-7kp4msfm> <!-- Section Header --> <div class="text-center mb-12 portfolio-header opacity-0" data-astro-cid-7kp4msfm> <p class="text-[#F4C430] font-semibold text-[18px] mb-2 flex items-center justify-center gap-3" data-astro-cid-7kp4msfm> <svg class="w-5 h-5 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-7kp4msfm> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-7kp4msfm></path> </svg>
Recent Projects
</p> <h2 class="heading-h2 font-bold text-black" data-astro-cid-7kp4msfm>Our Electrical Work Speaks for Itself</h2> </div> </div> <!-- Full Width Carousel Container --> <div class="relative portfolio-carousel opacity-0" data-astro-cid-7kp4msfm> <div class="overflow-hidden" data-astro-cid-7kp4msfm> <div class="portfolio-track flex transition-transform duration-500 ease-in-out gap-3 px-3" data-astro-cid-7kp4msfm> ${projects.map((project) => renderTemplate`${renderComponent($$result, "PortfolioCard", $$PortfolioCard, { "image": project.image, "title": project.title, "category": project.category, "data-astro-cid-7kp4msfm": true })}`)} <!-- Duplicate slides for infinite loop --> ${projects.map((project) => renderTemplate`${renderComponent($$result, "PortfolioCard", $$PortfolioCard, { "image": project.image, "title": project.title, "category": project.category, "data-astro-cid-7kp4msfm": true })}`)} </div> </div> <!-- Navigation Arrows --> <button class="portfolio-prev hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-[#F4C430] transition-all duration-300 z-10" data-astro-cid-7kp4msfm> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" data-astro-cid-7kp4msfm> <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" data-astro-cid-7kp4msfm></path> </svg> </button> <button class="portfolio-next hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-[#F4C430] rounded-full flex items-center justify-center shadow-lg hover:bg-black hover:text-[#F4C430] transition-all duration-300 z-10" data-astro-cid-7kp4msfm> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" data-astro-cid-7kp4msfm> <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" data-astro-cid-7kp4msfm></path> </svg> </button> </div> </section>  ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/Portfolio.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/Portfolio.astro", void 0);

export { $$Portfolio as $ };
