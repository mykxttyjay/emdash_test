import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import 'clsx';

const $$Hero2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Hero2;
  const {
    title,
    backgroundImage = "https://images.unsplash.com/photo-1683094113822-36663c546b0b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    titleSize = "heading-h1"
  } = Astro2.props;
  return renderTemplate`<!-- Hero Section -->${maybeRenderHead()}<section class="relative text-white px-4 sm:px-6 lg:px-8 pt-20 pb-20"> <!-- Background Image with Black & White Filter --> <div class="absolute inset-0 bg-cover bg-center grayscale"${addAttribute(`background-image: url('${backgroundImage}');`, "style")}></div> <!-- Dark Overlay --> <div class="absolute inset-0 bg-black/50"></div> <!-- Content --> <div class="relative max-w-7xl mx-auto text-center"> <h1${addAttribute(`${titleSize} font-bold mb-4`, "class")}>${title}</h1> </div> </section>`;
}, "C:/Users/sabido/electrician_website/src/components/sections/Hero2.astro", void 0);

export { $$Hero2 as $ };
