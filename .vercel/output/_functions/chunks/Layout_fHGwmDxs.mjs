import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { aU as addAttribute, B as maybeRenderHead, aV as renderHead, ba as renderSlot, Q as renderTemplate } from './sequence_DO5rsetM.mjs';
import 'clsx';

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "Electrixa - Professional Electrical Services", description = "Expert electrical services in Los Angeles. 20+ years experience, 24/7 emergency service, licensed & insured electricians. Residential & commercial electrical solutions." } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/png" href="/electrixa.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://images.unsplash.com"><link rel="dns-prefetch" href="https://images.unsplash.com"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">${maybeRenderHead()}<noscript><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet"></noscript><link rel="preload" as="image" href="https://images.unsplash.com/photo-1760886801783-e2d0522dd2c3?q=80&w=1920&auto=format&fit=crop" fetchpriority="high" media="(min-width: 1024px)"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/sabido/electrician_website/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
