import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { Q as renderTemplate, aU as addAttribute, B as maybeRenderHead } from './sequence_DO5rsetM.mjs';
import 'clsx';
import { r as renderScript } from './OfferModal_BoUoRV57.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Location = createComponent(($$result, $$props, $$slots) => {
  const locations = [
    {
      id: "santa-monica",
      name: "Santa Monica",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52901.88730408103!2d-118.52168654863281!3d34.01945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2a4cec2910019%3A0xb4170ab5ff23f5ab!2sSanta%20Monica%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
      pageUrl: "/santa-monica",
      isActive: true
    },
    {
      id: "pasadena",
      name: "Pasadena",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52901.88730408103!2d-118.17168654863281!3d34.14778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c2dc38330b51%3A0x52b41161ad24f9ad!2sPasadena%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
      pageUrl: "/location",
      isActive: false
    },
    {
      id: "glendale",
      name: "Glendale",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52901.88730408103!2d-118.28168654863281!3d34.14257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c0d213b24fb5%3A0x77a87b57698badf1!2sGlendale%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
      pageUrl: "/location",
      isActive: false
    },
    {
      id: "hollywood",
      name: "Beverly Hills",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52901.88730408103!2d-118.40168654863281!3d34.10149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2bc04d6d147ab%3A0xd6c1d5b0f2f5c64e!2sBeverly%20Hills%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus",
      pageUrl: "/location",
      isActive: false
    }
  ];
  return renderTemplate(_a || (_a = __template(["", '<section class="relative bg-[#F8F8F8] py-20 px-4 sm:px-6 lg:px-8" data-astro-cid-5gdy3rwf> <div class="max-w-7xl mx-auto relative z-10" data-astro-cid-5gdy3rwf> <!-- Section Header --> <div class="text-center mb-10 location-header" data-astro-cid-5gdy3rwf> <div class="flex items-center justify-center gap-2 mb-1" data-astro-cid-5gdy3rwf> <svg class="w-6 h-6 text-[#F4C430]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-5gdy3rwf> <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" data-astro-cid-5gdy3rwf></path> </svg> <p class="text-[#e5b52a] font-semibold text-[18px] tracking-wider" data-astro-cid-5gdy3rwf>Our Location</p> </div> <h2 class="heading-h2 font-bold text-black mb-4" data-astro-cid-5gdy3rwf>Service Areas in Los Angeles</h2> <p class="text-gray-700 text-xl max-w-4xl mx-auto" data-astro-cid-5gdy3rwf>\nExpert electrical services across multiple locations with 24/7 emergency support\n</p> </div> <!-- Main Content Grid --> <div class="grid lg:grid-cols-3 gap-6" data-astro-cid-5gdy3rwf> <!-- Left Column: Location Tabs & Description --> <div class="lg:col-span-1 space-y-6" data-astro-cid-5gdy3rwf> <!-- Location Tabs --> <div class="bg-black p-6 shadow-lg rounded-lg location-tabs" data-astro-cid-5gdy3rwf> <h3 class="text-[31px] font-bold text-white mb-4" data-astro-cid-5gdy3rwf>\nSelect Location\n</h3> <div class="space-y-3" data-astro-cid-5gdy3rwf> ', ` </div> </div> <!-- Contact CTA --> <div class="bg-black text-white p-6 shadow-lg rounded-lg location-cta" data-astro-cid-5gdy3rwf> <h3 class="text-[31px] font-bold mb-2" data-astro-cid-5gdy3rwf>Need Service Now?</h3> <p class="text-gray-300 text-[16px] mb-4" data-astro-cid-5gdy3rwf>Call us for immediate assistance</p> <a href="tel:+2345678912" class="flex items-center justify-center gap-3 bg-[#F4C430] text-black font-bold py-3 px-6 hover:bg-[#e5b52a] transition-colors" data-astro-cid-5gdy3rwf> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-5gdy3rwf> <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" data-astro-cid-5gdy3rwf></path> </svg>
+(234) 567 8912
</a> </div> </div> <!-- Right Column: Map --> <div class="lg:col-span-2" data-astro-cid-5gdy3rwf> <div class="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden shadow-2xl location-map h-full min-h-[500px] lg:min-h-[600px] rounded-lg" data-astro-cid-5gdy3rwf> <!-- Map iframe --> <iframe id="location-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52901.88730408103!2d-118.52168654863281!3d34.01945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2a4cec2910019%3A0xb4170ab5ff23f5ab!2sSanta%20Monica%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus" width="100%" height="100%" class="" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Google Maps showing service area location" data-astro-cid-5gdy3rwf></iframe> <!-- Map Controls Overlay --> <div class="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm shadow-xl p-4 z-[1000] max-w-xs" data-astro-cid-5gdy3rwf> <div class="flex items-start gap-3" data-astro-cid-5gdy3rwf> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0" data-astro-cid-5gdy3rwf> <svg class="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-5gdy3rwf> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-astro-cid-5gdy3rwf></path> </svg> </div> <div data-astro-cid-5gdy3rwf> <p class="font-bold text-black text-sm" data-astro-cid-5gdy3rwf>Service Area</p> <p class="text-gray-600 text-xs mt-1" data-astro-cid-5gdy3rwf>We serve all of Los Angeles County with 24/7 emergency support</p> </div> </div> </div> </div> </div> </div> </div> </section> <script>
  // Update location when tabs are clicked
  document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.location-tab');
    const mapIframe = document.getElementById('location-map');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mapUrl = tab.getAttribute('data-map-url');
        
        // Remove active state from all tabs
        tabs.forEach(t => {
          t.classList.remove('bg-[#F4C430]');
          t.classList.add('bg-[#2a2a2a]');
          
          const icons = t.querySelectorAll('svg');
          const textSpan = t.querySelector('span span');
          icons.forEach(icon => {
            icon.classList.remove('text-black');
            icon.classList.add('text-gray-400');
          });
          if (textSpan) {
            textSpan.classList.remove('text-black');
            textSpan.classList.add('text-white');
          }
        });

        // Add active state to clicked tab
        tab.classList.add('bg-[#F4C430]');
        tab.classList.remove('bg-[#2a2a2a]');
        
        const icons = tab.querySelectorAll('svg');
        const textSpan = tab.querySelector('span span');
        icons.forEach(icon => {
          icon.classList.add('text-black');
          icon.classList.remove('text-gray-400');
        });
        if (textSpan) {
          textSpan.classList.add('text-black');
          textSpan.classList.remove('text-white');
        }

        // Update map
        if (mapUrl && mapIframe) {
          mapIframe.src = mapUrl;
        }
      });
    });
  });
<\/script>  `, ""])), maybeRenderHead(), locations.map((location) => renderTemplate`<button${addAttribute(`location-tab w-full px-5 py-4 ${location.isActive ? "bg-[#F4C430]" : "bg-[#2a2a2a]"} border-2 border-transparent font-semibold transition-all hover:bg-[#F4C430] flex items-center justify-between group`, "class")}${addAttribute(location.id, "data-location-id")}${addAttribute(location.mapUrl, "data-map-url")} data-astro-cid-5gdy3rwf> <span class="flex items-center gap-3" data-astro-cid-5gdy3rwf> <svg${addAttribute(`w-5 h-5 ${location.isActive ? "text-black" : "text-gray-400"} group-hover:text-black transition-colors`, "class")} fill="currentColor" viewBox="0 0 24 24" data-astro-cid-5gdy3rwf> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-astro-cid-5gdy3rwf></path> </svg> <span${addAttribute(`text-left ${location.isActive ? "text-black" : "text-white"} group-hover:text-black`, "class")} data-astro-cid-5gdy3rwf>${location.name}</span> </span> <svg${addAttribute(`w-5 h-5 ${location.isActive ? "text-black" : "text-gray-400"} group-hover:text-black transition-colors`, "class")} fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-5gdy3rwf> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" data-astro-cid-5gdy3rwf></path> </svg> </button>`), renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/Location.astro?astro&type=script&index=0&lang.ts"));
}, "C:/Users/sabido/electrician_website/src/components/sections/Location.astro", void 0);

export { $$Location as $ };
