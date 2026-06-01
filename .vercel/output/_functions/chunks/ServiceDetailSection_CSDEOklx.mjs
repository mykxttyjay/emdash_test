import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { B as maybeRenderHead, aU as addAttribute, Q as renderTemplate, bb as defineScriptVars } from './sequence_DO5rsetM.mjs';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';
import { $ as $$ServiceCard } from './ServiceCard_DsN5M8PL.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$ServiceDetailSection = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$ServiceDetailSection;
  const { image, imageAlt, title, description, services, serviceCards, allServiceData, showPricing = false, pricingTitle, pricingDescription, pricingCardDescription, pricingCardImage, pricingFeatures, pricingIcon } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="bg-[#F8F8F8] py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-esx7k6tr> <div class="max-w-7xl mx-auto" data-astro-cid-esx7k6tr> <div class="grid grid-cols-1 lg:grid-cols-[1.99fr_0.8fr] gap-6 items-start" data-astro-cid-esx7k6tr> <!-- Left: Image and Description --> <div data-astro-cid-esx7k6tr> <img${addAttribute(image, "src")}${addAttribute(imageAlt, "alt")} class="w-full h-[383px] object-cover mb-6 rounded-lg" data-astro-cid-esx7k6tr> <h2 class="text-4xl font-bold text-black mb-4" id="service-title" data-astro-cid-esx7k6tr>${title}</h2> <p class="text-gray-700 leading-relaxed mb-8" style="font-size: 22px;" id="service-description" data-astro-cid-esx7k6tr> ${description} </p> ${showPricing && renderTemplate`<div class="mb-8 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start" data-astro-cid-esx7k6tr> <!-- Left: Service Card --> ${renderComponent($$result, "ServiceCard", $$ServiceCard, { "name": pricingTitle || "Service Details", "image": pricingCardImage || image, "description": pricingCardDescription || "Complete electrical infrastructure for new construction projects from foundation to finish.", "icon": pricingIcon, "data-astro-cid-esx7k6tr": true })} <!-- Right: Content --> <div data-astro-cid-esx7k6tr> ${pricingDescription && renderTemplate`<p class="text-gray-600 text-base mb-4 leading-relaxed" data-astro-cid-esx7k6tr>${pricingDescription}</p>`} ${pricingFeatures && pricingFeatures.length > 0 && renderTemplate`<ul class="space-y-3" data-astro-cid-esx7k6tr> ${pricingFeatures.map((feature) => renderTemplate`<li class="flex items-start gap-3" data-astro-cid-esx7k6tr> <svg class="w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" data-astro-cid-esx7k6tr></path> </svg> <span class="text-gray-700" data-astro-cid-esx7k6tr>${feature}</span> </li>`)} </ul>`} </div> </div>`} <!-- Service Category Tabs --> ${serviceCards && serviceCards.length > 0 && renderTemplate`<div class="flex flex-wrap gap-4 mb-8" data-astro-cid-esx7k6tr> ${serviceCards.map((card, index) => renderTemplate`<button${addAttribute(index, "data-card-index")}${addAttribute(`service-card-tab px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all duration-300 rounded ${index === 0 ? "bg-[#F4C430] text-black" : "bg-white text-gray-700 hover:bg-[#F4C430] hover:text-black border border-gray-300"}`, "class")} data-astro-cid-esx7k6tr> ${card.name} </button>`)} </div>`} <!-- Service Cards Grid --> <div id="service-cards-container" class="space-y-6" data-astro-cid-esx7k6tr> ${serviceCards && serviceCards.length > 0 && renderTemplate`<div class="grid grid-cols-1 md:grid-cols-[1fr_1.89fr] gap-6 items-start" data-astro-cid-esx7k6tr> <div id="service-card-wrapper" data-astro-cid-esx7k6tr> ${renderComponent($$result, "ServiceCard", $$ServiceCard, { "name": serviceCards[0].name, "image": serviceCards[0].image, "description": serviceCards[0].description, "icon": serviceCards[0].icon, "data-astro-cid-esx7k6tr": true })} </div> <div data-astro-cid-esx7k6tr> <h3 class="text-2xl font-bold text-black mb-3" id="card-title" data-astro-cid-esx7k6tr>${serviceCards[0].name}</h3> <p class="text-gray-700 leading-relaxed mb-4" id="card-description" data-astro-cid-esx7k6tr> ${serviceCards[0].detailedDescription || serviceCards[0].description || "Professional electrical solutions tailored to your specific needs with guaranteed quality and safety."} </p> ${serviceCards[0].features && serviceCards[0].features.length > 0 && renderTemplate`<ul class="space-y-2" id="card-features" data-astro-cid-esx7k6tr> ${serviceCards[0].features.map((feature) => renderTemplate`<li class="flex items-start gap-2" data-astro-cid-esx7k6tr> <svg class="w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" data-astro-cid-esx7k6tr></path> </svg> <span class="text-gray-700" data-astro-cid-esx7k6tr>${feature}</span> </li>`)} </ul>`} </div> </div>`} </div> </div> <!-- Right: Services List --> <div class="flex flex-col gap-4 justify-end items-end" data-astro-cid-esx7k6tr> <!-- Our Services Card --> <div class="bg-[#1a1a1a] p-8 inline-block rounded-lg" data-astro-cid-esx7k6tr> <h3 class="text-2xl font-bold text-white mb-6" data-astro-cid-esx7k6tr>Our Services</h3> <div class="space-y-4 flex flex-col items-end" data-astro-cid-esx7k6tr> ${services.map((service, index) => renderTemplate`<a${addAttribute(service.link || "#", "href")}${addAttribute(`flex items-center justify-between px-6 py-4 transition-all duration-300 group min-w-[300px] ${index === 0 ? "bg-[#F4C430] text-black hover:bg-[#e5b52a]" : "bg-[#2a2a2a] text-white hover:bg-[#F4C430] hover:text-black"}`, "class")} data-astro-cid-esx7k6tr> <span class="font-bold uppercase tracking-wide" style="font-size: 13px;" data-astro-cid-esx7k6tr>${service.name}</span> <svg class="w-4 h-4 transition-transform group-hover:translate-x-1 flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-esx7k6tr></path> </svg> </a>`)} </div> </div> <!-- Get Started Today Card --> <div class="bg-[#1a1a1a] p-8 inline-block rounded-lg min-w-[300px]" data-astro-cid-esx7k6tr> <h3 class="text-2xl font-bold text-white mb-4" data-astro-cid-esx7k6tr>Get Started Today</h3> <p class="text-gray-300 mb-6 leading-relaxed" data-astro-cid-esx7k6tr>
Our certified electricians are ready to assist you with electrical solutions.
</p> <!-- Contact Info --> <div class="space-y-4 mb-4" data-astro-cid-esx7k6tr> <div class="flex items-center gap-3" data-astro-cid-esx7k6tr> <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" data-astro-cid-esx7k6tr></path> </svg> <span class="text-gray-300 font-medium" data-astro-cid-esx7k6tr>+(234) 567 8912</span> </div> <div class="flex items-center gap-3" data-astro-cid-esx7k6tr> <svg class="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-astro-cid-esx7k6tr></path> </svg> <span class="text-gray-300 font-medium" data-astro-cid-esx7k6tr>info@electrixa.com</span> </div> <div class="flex items-start gap-3" data-astro-cid-esx7k6tr> <svg class="w-6 h-6 text-gray-300 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-esx7k6tr> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" data-astro-cid-esx7k6tr></path> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" data-astro-cid-esx7k6tr></path> </svg> <span class="text-gray-300 font-medium" data-astro-cid-esx7k6tr>Los Angeles, California</span> </div> </div> <!-- Get In Touch Button --> <a href="/contact" class="block w-full bg-[#F4C430] text-black font-bold text-center py-4 rounded-lg hover:bg-[#e5b52a] transition-all duration-300 uppercase tracking-wide" data-astro-cid-esx7k6tr>
Get In Touch
</a> </div> <!-- Special Offer Card --> <div class="bg-gradient-to-r from-[#F4C430] to-[#e5b52a] p-6 rounded-lg text-black coupon-pulse" data-astro-cid-esx7k6tr> <div class="text-center min-w-[320px]" data-astro-cid-esx7k6tr> <h3 class="text-2xl font-bold mb-2" data-astro-cid-esx7k6tr>Special Offer</h3> <div class="text-4xl font-bold mb-2" data-astro-cid-esx7k6tr>$50 OFF</div> <div class="border-t-2 border-black border-dashed pt-4" data-astro-cid-esx7k6tr> <p class="text-xs font-medium" data-astro-cid-esx7k6tr>Valid for new customers only</p> </div> </div> </div> </div> </div> </div> </section> ${serviceCards && serviceCards.length > 0 && renderTemplate(_a || (_a = __template(["<script>(function(){", `
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.service-card-tab');
      const cardTitle = document.getElementById('card-title');
      const cardDescription = document.getElementById('card-description');
      const cardFeatures = document.getElementById('card-features');
      const cardWrapper = document.getElementById('service-card-wrapper');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const cardIndex = parseInt(tab.getAttribute('data-card-index'));
          const card = serviceCards[cardIndex];
          
          if (!card) return;
          
          // Update active tab styling
          tabs.forEach(t => {
            t.classList.remove('bg-[#F4C430]', 'text-black');
            t.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
          });
          tab.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
          tab.classList.add('bg-[#F4C430]', 'text-black');
          
          // Update content
          cardTitle.textContent = card.name;
          cardDescription.textContent = card.detailedDescription || card.description || 'Professional electrical solutions tailored to your specific needs with guaranteed quality and safety.';
          
          // Update ServiceCard using the enhanced component format with icon
          const iconHTML = card.icon ? \`
            <div class="w-5 h-5 flex-shrink-0" style="display: inline-block;">
              \${card.icon.replace('data:image/svg+xml,', '').replace(/%3C/g, '<').replace(/%3E/g, '>').replace(/%22/g, '"').replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%2F/g, '/').replace(/%27/g, "'")}
            </div>
          \` : '';
          
          cardWrapper.innerHTML = \`
            <div class="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <!-- Image (keeps square aspect ratio) -->
              <div class="w-full aspect-square overflow-hidden bg-gray-200">
                <img 
                  src="\${card.image}" 
                  alt="\${card.name}"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <!-- Default Bottom Label (Always visible) -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 py-4 px-4 flex items-center gap-2 z-10 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                \${iconHTML}
                <h4 class="font-black text-black text-[16px] leading-tight">\${card.name}</h4>
              </div>
              
              <!-- Hover Overlay - Slides from bottom to top with enhanced effects -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-out flex flex-col items-start justify-center px-8 z-20">
                <!-- Decorative line -->
                <div class="w-16 h-1 bg-black mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
                
                <h4 class="font-black text-black text-left text-[20px] mb-4 leading-tight opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-4 group-hover:translate-y-0">\${card.name}</h4>
                
                <p class="text-black text-left text-[15px] font-semibold leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 transform translate-y-4 group-hover:translate-y-0">\${card.description || 'Professional electrical services for your needs'}</p>
              </div>
            </div>
          \`;
          
          // Update features
          if (card.features && card.features.length > 0) {
            cardFeatures.innerHTML = card.features.map(feature => \`
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span class="text-gray-700">\${feature}</span>
              </li>
            \`).join('');
          }
        });
      });
    });
  })();<\/script>`], ["<script>(function(){", `
    document.addEventListener('DOMContentLoaded', () => {
      const tabs = document.querySelectorAll('.service-card-tab');
      const cardTitle = document.getElementById('card-title');
      const cardDescription = document.getElementById('card-description');
      const cardFeatures = document.getElementById('card-features');
      const cardWrapper = document.getElementById('service-card-wrapper');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const cardIndex = parseInt(tab.getAttribute('data-card-index'));
          const card = serviceCards[cardIndex];
          
          if (!card) return;
          
          // Update active tab styling
          tabs.forEach(t => {
            t.classList.remove('bg-[#F4C430]', 'text-black');
            t.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300');
          });
          tab.classList.remove('bg-white', 'text-gray-700', 'border', 'border-gray-300');
          tab.classList.add('bg-[#F4C430]', 'text-black');
          
          // Update content
          cardTitle.textContent = card.name;
          cardDescription.textContent = card.detailedDescription || card.description || 'Professional electrical solutions tailored to your specific needs with guaranteed quality and safety.';
          
          // Update ServiceCard using the enhanced component format with icon
          const iconHTML = card.icon ? \\\`
            <div class="w-5 h-5 flex-shrink-0" style="display: inline-block;">
              \\\${card.icon.replace('data:image/svg+xml,', '').replace(/%3C/g, '<').replace(/%3E/g, '>').replace(/%22/g, '"').replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%2F/g, '/').replace(/%27/g, "'")}
            </div>
          \\\` : '';
          
          cardWrapper.innerHTML = \\\`
            <div class="group cursor-pointer relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <!-- Image (keeps square aspect ratio) -->
              <div class="w-full aspect-square overflow-hidden bg-gray-200">
                <img 
                  src="\\\${card.image}" 
                  alt="\\\${card.name}"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              
              <!-- Default Bottom Label (Always visible) -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 py-4 px-4 flex items-center gap-2 z-10 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                \\\${iconHTML}
                <h4 class="font-black text-black text-[16px] leading-tight">\\\${card.name}</h4>
              </div>
              
              <!-- Hover Overlay - Slides from bottom to top with enhanced effects -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#F4C430] via-[#F4C430]/95 to-[#F4C430]/80 translate-y-full group-hover:translate-y-0 transition-all duration-700 ease-out flex flex-col items-start justify-center px-8 z-20">
                <!-- Decorative line -->
                <div class="w-16 h-1 bg-black mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
                
                <h4 class="font-black text-black text-left text-[20px] mb-4 leading-tight opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 transform translate-y-4 group-hover:translate-y-0">\\\${card.name}</h4>
                
                <p class="text-black text-left text-[15px] font-semibold leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300 transform translate-y-4 group-hover:translate-y-0">\\\${card.description || 'Professional electrical services for your needs'}</p>
              </div>
            </div>
          \\\`;
          
          // Update features
          if (card.features && card.features.length > 0) {
            cardFeatures.innerHTML = card.features.map(feature => \\\`
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-[#F4C430] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
                <span class="text-gray-700">\\\${feature}</span>
              </li>
            \\\`).join('');
          }
        });
      });
    });
  })();<\/script>`])), defineScriptVars({ serviceCards }))}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/ServiceDetailSection.astro", void 0);

export { $$ServiceDetailSection as $ };
