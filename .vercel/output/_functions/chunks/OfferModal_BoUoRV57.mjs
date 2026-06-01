import { c as createComponent } from './astro-component_C8F1Lt7S.mjs';
import 'piccolore';
import { T as createRenderInstruction, Q as renderTemplate, aU as addAttribute, B as maybeRenderHead, ba as renderSlot } from './sequence_DO5rsetM.mjs';
import 'clsx';
import { r as renderComponent } from './entrypoint_CQVACFYb.mjs';

async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Header = createComponent(($$result, $$props, $$slots) => {
  const serviceCategories = [
    {
      title: "Commercial Electrical",
      href: "/commercial-electrical",
      services: [
        { name: "Ground-up Electrical Construction", href: "/ground-up-construction" },
        { name: "Emergency & Standby Power Systems", href: "#" },
        { name: "Commercial HVAC Electrical", href: "#" },
        { name: "Commercial Electrical Panels", href: "#" }
      ]
    },
    {
      title: "Residential Electrical",
      href: "#",
      services: [
        { name: "Car Charging Stations/ EV", href: "#" },
        { name: "Ceiling Fan", href: "#" },
        { name: "GFCI Outlets", href: "#" },
        { name: "Backup Generators", href: "#" }
      ]
    },
    {
      title: "Specialty Services",
      href: "#",
      services: [
        { name: "Holiday Lighting Installation", href: "#" },
        { name: "Landscape Lighting", href: "#" },
        { name: "Pool & Spa Electrical", href: "#" },
        { name: "Property Management", href: "#" }
      ]
    },
    {
      title: "Emergency Services",
      href: "#",
      services: [
        { name: "24-hour Emergency Service", href: "#" },
        { name: "HVAC", href: "#" },
        { name: "Heating", href: "#" },
        { name: "Water Heater", href: "#" }
      ]
    }
  ];
  const serviceAreas = [
    { name: "Santa Monica", href: "/santa-monica" },
    { name: "Pasadena", href: "#" },
    { name: "Glendale", href: "#" },
    { name: "Beverly Hills", href: "#" }
  ];
  return renderTemplate(_a || (_a = __template(["<!-- Top Bar with Contact Info -->", '<div id="top-contact-bar" class="hidden lg:block bg-[#F4C430] relative overflow-hidden transition-all duration-300" data-astro-cid-gfykqide> <!-- Diagonal Dark Section on Right --> <div class="absolute top-0 right-0 bottom-0 w-[45%] bg-black" style="clip-path: polygon(10% 0, 100% 0, 100% 100%, 0% 100%);" data-astro-cid-gfykqide></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 py-2 relative z-10" data-astro-cid-gfykqide> <div class="flex justify-between items-center" data-astro-cid-gfykqide> <!-- Left Side: Location, Email, Time/Date --> <div class="flex items-center gap-6" data-astro-cid-gfykqide> <!-- Location --> <a href="https://www.google.com/maps/search/?api=1&query=Los+Angeles,+CA" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 group cursor-pointer" data-astro-cid-gfykqide> <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-astro-cid-gfykqide></path> </svg> <span class="text-black group-hover:text-white transition-colors font-semibold" style="font-size: 13px;" data-astro-cid-gfykqide>Los Angeles, California</span> </a> <!-- Email --> <a href="mailto:info@electrixa.com" class="flex items-center gap-2 group cursor-pointer" data-astro-cid-gfykqide> <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" data-astro-cid-gfykqide></path> </svg> <span class="text-black group-hover:text-white transition-colors font-semibold" style="font-size: 13px;" data-astro-cid-gfykqide>info@electrixa.com</span> </a> <!-- Office Hours --> <div class="flex items-center gap-2" data-astro-cid-gfykqide> <svg class="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" data-astro-cid-gfykqide></path> </svg> <span class="text-black font-semibold" style="font-size: 13px;" data-astro-cid-gfykqide>Mon-Fri: 8AM-6PM | Sat-Sun: 9AM-5PM</span> </div> </div> <!-- Right Side: Specials & Financing Buttons --> <div class="flex items-center gap-3" data-astro-cid-gfykqide> <!-- Specials Button - Enhanced --> <a href="/specials" class="inline-flex items-center gap-2 bg-black text-[#F4C430] font-black px-5 py-2.5 transition-all duration-300 hover:bg-[#F4C430] hover:text-black relative overflow-hidden group border-2 border-[#F4C430]" data-astro-cid-gfykqide> <svg class="w-4 h-4 relative z-10 group-hover:rotate-[360deg] transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" data-astro-cid-gfykqide></path> </svg> <span class="relative z-10 text-xs tracking-wider font-black" data-astro-cid-gfykqide>SPECIALS</span> </a> <!-- Financing Button - Enhanced --> <a href="/financing" class="inline-flex items-center gap-2 bg-black text-[#F4C430] font-black px-5 py-2.5 transition-all duration-300 hover:bg-[#F4C430] hover:text-black relative overflow-hidden group border-2 border-[#F4C430]" data-astro-cid-gfykqide> <svg class="w-4 h-4 relative z-10 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-gfykqide></path> </svg> <span class="relative z-10 text-xs tracking-wider font-black" data-astro-cid-gfykqide>FINANCING</span> </a> </div> </div> </div> </div> <!-- Navigation Bar - Sticky --> <nav class="bg-white border-b border-gray-200 sticky top-0 z-[100] shadow-md relative" data-astro-cid-gfykqide> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1" data-astro-cid-gfykqide> <div class="flex justify-between items-center py-4 lg:py-2" data-astro-cid-gfykqide> <!-- Logo --> <a href="/" class="flex items-center gap-2 lg:gap-3" data-astro-cid-gfykqide> <img src="/electrixa.png" alt="Electrixa Logo" class="h-10 lg:h-12 object-contain" style="mix-blend-mode: multiply;" data-astro-cid-gfykqide> <span class="font-bold text-black text-lg lg:text-[25px]" data-astro-cid-gfykqide>ELECTRIXA</span> </a> <!-- Hamburger Menu Button (Mobile Only) --> <button id="mobile-menu-button" class="lg:hidden flex items-center justify-center w-10 h-10 text-black hover:text-[#F4C430] transition-colors" aria-label="Toggle menu" data-astro-cid-gfykqide> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-gfykqide></path> </svg> </button> <!-- Navigation Menu - Centered (Desktop Only) --> <ul class="hidden lg:flex gap-8 list-none m-0 p-0 text-base absolute left-1/2 transform -translate-x-1/2" data-astro-cid-gfykqide> <li data-astro-cid-gfykqide><a href="/" class="text-black hover:text-accent transition-colors font-semibold" data-astro-cid-gfykqide>Home</a></li> <li data-astro-cid-gfykqide><a href="/about" class="text-black hover:text-accent transition-colors font-semibold" data-astro-cid-gfykqide>About</a></li> <li class="relative group" data-astro-cid-gfykqide> <a href="/services" class="text-black hover:text-accent transition-colors font-semibold flex items-center gap-1" data-astro-cid-gfykqide>\nServices\n<svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-gfykqide></path> </svg> </a> </li> <li class="relative group service-area-nav" data-astro-cid-gfykqide> <a href="/location" class="text-black hover:text-accent transition-colors font-semibold flex items-center gap-1" data-astro-cid-gfykqide>\nService Area\n<svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-gfykqide></path> </svg> </a> </li> <li data-astro-cid-gfykqide><a href="/contact" class="text-black hover:text-accent transition-colors font-semibold" data-astro-cid-gfykqide>Contact</a></li> </ul> <!-- Call Now Button --> <a href="tel:+12345678912" class="hidden lg:inline-flex items-center gap-2 bg-[#F4C430] text-black font-bold px-6 py-2 hover:bg-[#e5b52a] transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-glow relative overflow-hidden border-2 border-black" data-astro-cid-gfykqide> <span class="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" data-astro-cid-gfykqide></span> <svg class="w-5 h-5 animate-ring relative z-10" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" data-astro-cid-gfykqide></path> </svg> <span class="flex flex-col items-start relative z-10" data-astro-cid-gfykqide> <span class="font-semibold" style="font-size: 11px;" data-astro-cid-gfykqide>Call Now</span> <span class="font-bold" style="font-size: 14px;" data-astro-cid-gfykqide>+(234) 567 8912</span> </span> </a> </div> </div> <!-- Services Dropdown - Aligned with Nav Menu --> <div class="absolute bg-white border-b border-gray-200 py-6 px-8 opacity-0 invisible transition-all duration-200 shadow-lg z-[110] services-dropdown rounded-b-lg" style="top: 100%;" data-astro-cid-gfykqide> <div class="grid grid-cols-4 gap-8" data-astro-cid-gfykqide> ', ' </div> </div> <!-- Service Area Dropdown --> <div class="absolute bg-white shadow-lg opacity-0 invisible transition-all duration-200 min-w-[200px] z-[110] service-area-dropdown rounded-b-lg overflow-hidden" style="top: 100%;" data-astro-cid-gfykqide> ', ` </div> </nav> <script>
  // Dropdown hover handlers with dynamic positioning
  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav');
    const navContainer = document.querySelector('nav > div');
    const servicesLink = document.querySelector('nav ul li:nth-child(3)');
    const servicesDropdown = document.querySelector('.services-dropdown');
    const serviceAreaLink = document.querySelector('.service-area-nav');
    const serviceAreaDropdown = document.querySelector('.service-area-dropdown');
    
    // Position dropdowns
    function positionDropdowns() {
      if (servicesDropdown && navContainer) {
        const containerRect = navContainer.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        // Services dropdown: from logo to call button (full container width)
        const containerLeftOffset = containerRect.left - navRect.left;
        const containerWidth = containerRect.width;
        servicesDropdown.style.left = containerLeftOffset + 'px';
        servicesDropdown.style.width = containerWidth + 'px';
      }
      
      if (serviceAreaLink && serviceAreaDropdown) {
        const linkRect = serviceAreaLink.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        
        // Service Area dropdown: positioned below the link
        const leftOffset = linkRect.left - navRect.left;
        serviceAreaDropdown.style.left = leftOffset + 'px';
      }
    }
    
    // Position on load and resize
    positionDropdowns();
    window.addEventListener('resize', positionDropdowns);
    
    // Services dropdown hover
    if (servicesLink && servicesDropdown && nav) {
      servicesLink.addEventListener('mouseenter', () => {
        servicesDropdown.classList.remove('invisible', 'opacity-0');
        servicesDropdown.classList.add('visible', 'opacity-100');
      });
      
      servicesLink.addEventListener('mouseleave', (e) => {
        const rect = servicesDropdown.getBoundingClientRect();
        const isMovingToDropdown = e.clientY > rect.top;
        
        if (!isMovingToDropdown) {
          setTimeout(() => {
            if (!servicesDropdown.matches(':hover')) {
              servicesDropdown.classList.add('invisible', 'opacity-0');
              servicesDropdown.classList.remove('visible', 'opacity-100');
            }
          }, 100);
        }
      });
      
      servicesDropdown.addEventListener('mouseenter', () => {
        servicesDropdown.classList.remove('invisible', 'opacity-0');
        servicesDropdown.classList.add('visible', 'opacity-100');
      });
      
      servicesDropdown.addEventListener('mouseleave', () => {
        servicesDropdown.classList.add('invisible', 'opacity-0');
        servicesDropdown.classList.remove('visible', 'opacity-100');
      });
    }
    
    // Service Area dropdown hover
    if (serviceAreaLink && serviceAreaDropdown && nav) {
      serviceAreaLink.addEventListener('mouseenter', () => {
        serviceAreaDropdown.classList.remove('invisible', 'opacity-0');
        serviceAreaDropdown.classList.add('visible', 'opacity-100');
      });
      
      serviceAreaLink.addEventListener('mouseleave', (e) => {
        const rect = serviceAreaDropdown.getBoundingClientRect();
        const isMovingToDropdown = e.clientY > rect.top;
        
        if (!isMovingToDropdown) {
          setTimeout(() => {
            if (!serviceAreaDropdown.matches(':hover')) {
              serviceAreaDropdown.classList.add('invisible', 'opacity-0');
              serviceAreaDropdown.classList.remove('visible', 'opacity-100');
            }
          }, 100);
        }
      });
      
      serviceAreaDropdown.addEventListener('mouseenter', () => {
        serviceAreaDropdown.classList.remove('invisible', 'opacity-0');
        serviceAreaDropdown.classList.add('visible', 'opacity-100');
      });
      
      serviceAreaDropdown.addEventListener('mouseleave', () => {
        serviceAreaDropdown.classList.add('invisible', 'opacity-0');
        serviceAreaDropdown.classList.remove('visible', 'opacity-100');
      });
    }
  });
<\/script> <!-- Mobile Menu Dropdown --> <div id="mobile-menu" class="lg:hidden hidden bg-white border-b border-gray-200 shadow-lg sticky top-[60px] z-[99]" data-astro-cid-gfykqide> <div class="max-w-7xl mx-auto px-4 py-4" data-astro-cid-gfykqide> <!-- Mobile Top Bar Items --> <div class="mb-6 pb-4 border-b border-gray-200 space-y-3" data-astro-cid-gfykqide> <!-- Email --> <a href="mailto:info@electrixa.com" class="flex items-center gap-3 group" data-astro-cid-gfykqide> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0" data-astro-cid-gfykqide> <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" data-astro-cid-gfykqide></path> </svg> </div> <span class="text-black font-semibold group-hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide>info@electrixa.com</span> </a> <!-- Location --> <a href="https://www.google.com/maps/search/?api=1&query=Los+Angeles,+CA" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 group" data-astro-cid-gfykqide> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0" data-astro-cid-gfykqide> <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" data-astro-cid-gfykqide></path> </svg> </div> <span class="text-black font-semibold group-hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide>Los Angeles, California</span> </a> <!-- Specials --> <a href="/specials" class="flex items-center gap-3 group" data-astro-cid-gfykqide> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0" data-astro-cid-gfykqide> <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" data-astro-cid-gfykqide></path> </svg> </div> <span class="text-black font-semibold group-hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide>SPECIALS</span> </a> <!-- Financing --> <a href="/financing" class="flex items-center gap-3 group" data-astro-cid-gfykqide> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0" data-astro-cid-gfykqide> <svg class="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" data-astro-cid-gfykqide></path> </svg> </div> <span class="text-black font-semibold group-hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide>FINANCING</span> </a> </div> <!-- Mobile Navigation Links --> <ul class="space-y-4" data-astro-cid-gfykqide> <li data-astro-cid-gfykqide><a href="/" class="block text-black hover:text-[#F4C430] transition-colors font-semibold text-lg" data-astro-cid-gfykqide>Home</a></li> <li data-astro-cid-gfykqide><a href="/about" class="block text-black hover:text-[#F4C430] transition-colors font-semibold text-lg" data-astro-cid-gfykqide>About</a></li> <!-- Services Accordion --> <li data-astro-cid-gfykqide> <button id="mobile-services-toggle" class="w-full flex justify-between items-center text-black hover:text-[#F4C430] transition-colors font-semibold text-lg" data-astro-cid-gfykqide>
Services
<svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-gfykqide></path> </svg> </button> <div id="mobile-services-menu" class="hidden mt-2 ml-4 space-y-3" data-astro-cid-gfykqide> `, ' </div> </li> <!-- Service Area Accordion --> <li data-astro-cid-gfykqide> <button id="mobile-areas-toggle" class="w-full flex justify-between items-center text-black hover:text-[#F4C430] transition-colors font-semibold text-lg" data-astro-cid-gfykqide>\nService Area\n<svg class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" data-astro-cid-gfykqide></path> </svg> </button> <div id="mobile-areas-menu" class="hidden mt-2 ml-4 space-y-2" data-astro-cid-gfykqide> ', ` </div> </li> <li data-astro-cid-gfykqide><a href="/contact" class="block text-black hover:text-[#F4C430] transition-colors font-semibold text-lg" data-astro-cid-gfykqide>Contact</a></li> <!-- Mobile Call Now Button --> <li class="pt-2" data-astro-cid-gfykqide> <a href="tel:+12345678912" class="flex items-center justify-center gap-3 w-full bg-[#F4C430] text-black font-bold px-6 py-4 hover:bg-[#e5b52a] transition-all duration-300 hover:scale-105 hover:shadow-xl animate-glow relative overflow-hidden" data-astro-cid-gfykqide> <span class="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300" data-astro-cid-gfykqide></span> <svg class="w-6 h-6 animate-ring relative z-10" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gfykqide> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" data-astro-cid-gfykqide></path> </svg> <span class="flex flex-col items-start relative z-10" data-astro-cid-gfykqide> <span class="font-semibold" style="font-size: 11px;" data-astro-cid-gfykqide>Call Now</span> <span class="font-bold" style="font-size: 14px;" data-astro-cid-gfykqide>+(234) 567 8912</span> </span> </a> </li> </ul> </div> </div> <script>
  window.addEventListener('load', function() {
    const topBar = document.getElementById('top-contact-bar');
    
    if (topBar) {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const heroSection = document.getElementById('hero-section');
        
        // Get hero section height if it exists
        let heroHeight = window.innerHeight * 0.9; // Default to 90vh
        if (heroSection) {
          heroHeight = heroSection.offsetHeight;
        } else {
          // If no hero-section, check for other hero sections
          const allHeroSections = document.querySelectorAll('section[class*="hero"], section[style*="padding-top: 80px"]');
          if (allHeroSections.length > 0) {
            heroHeight = allHeroSections[0].offsetHeight;
          }
        }
        
        // Keep top bar visible while in hero section
        // Only hide it after scrolling past the hero section
        if (scrollTop < heroHeight - 100) {
          // Still in hero section - keep top bar visible
          topBar.style.transform = 'translateY(0)';
          topBar.style.opacity = '1';
          topBar.style.pointerEvents = 'auto';
        } else {
          // Past hero section - hide top bar
          topBar.style.transform = 'translateY(-100%)';
          topBar.style.opacity = '0';
          topBar.style.pointerEvents = 'none';
        }
      };
      
      // Run on load to set initial state
      handleScroll();
      
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const servicesToggle = document.getElementById('mobile-services-toggle');
    const servicesMenu = document.getElementById('mobile-services-menu');
    const areasToggle = document.getElementById('mobile-areas-toggle');
    const areasMenu = document.getElementById('mobile-areas-menu');
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuButton.querySelector('svg path');
        if (icon) {
          if (mobileMenu.classList.contains('hidden')) {
            icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
          } else {
            icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
          }
        }
      });
    }
    
    if (servicesToggle && servicesMenu) {
      servicesToggle.addEventListener('click', () => {
        servicesMenu.classList.toggle('hidden');
        const icon = servicesToggle.querySelector('svg');
        if (icon) icon.classList.toggle('rotate-180');
      });
    }
    
    if (areasToggle && areasMenu) {
      areasToggle.addEventListener('click', () => {
        areasMenu.classList.toggle('hidden');
        const icon = areasToggle.querySelector('svg');
        if (icon) icon.classList.toggle('rotate-180');
      });
    }
  });
<\/script>`])), maybeRenderHead(), serviceCategories.map((category) => renderTemplate`<div data-astro-cid-gfykqide> <a${addAttribute(category.href, "href")} class="text-black font-bold mb-3 pb-2 border-b-2 border-[#F4C430] whitespace-nowrap inline-block hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide>${category.title}</a> <ul class="space-y-2 mt-3" data-astro-cid-gfykqide> ${category.services.map((service) => renderTemplate`<li data-astro-cid-gfykqide> <a${addAttribute(service.href, "href")} class="block text-gray-700 hover:text-accent transition-colors" style="font-size: 14px;" data-astro-cid-gfykqide> ${service.name} </a> </li>`)} </ul> </div>`), serviceAreas.map((area) => renderTemplate`<a${addAttribute(area.href, "href")} class="block px-6 py-3 text-black font-semibold hover:bg-gray-50 hover:text-[#F4C430] transition-all border-b border-gray-100 last:border-b-0" style="font-size: 14px;" data-astro-cid-gfykqide> ${area.name} </a>`), serviceCategories.map((category) => renderTemplate`<div data-astro-cid-gfykqide> <a${addAttribute(category.href, "href")} class="block text-[#F4C430] font-bold mb-2" data-astro-cid-gfykqide>${category.title}</a> <ul class="space-y-1 ml-4" data-astro-cid-gfykqide> ${category.services.map((service) => renderTemplate`<li data-astro-cid-gfykqide> <a${addAttribute(service.href, "href")} class="block text-gray-700 hover:text-[#F4C430] transition-colors text-sm" data-astro-cid-gfykqide> ${service.name} </a> </li>`)} </ul> </div>`), serviceAreas.map((area) => renderTemplate`<a${addAttribute(area.href, "href")} class="block text-gray-700 hover:text-[#F4C430] transition-colors" data-astro-cid-gfykqide> ${area.name} </a>`));
}, "C:/Users/sabido/electrician_website/src/components/sections/Header.astro", void 0);

const $$Button = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Button;
  const {
    variant = "accent",
    size = "md",
    href,
    type = "button",
    class: className,
    disabled = false,
    icon = false
  } = Astro2.props;
  const baseStyles = variant === "coupon" || variant === "couponDark" || variant === "couponWhite" || variant === "secondary" ? "font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105" : "font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-[8px_8px_0_rgba(0,0,0,0.8)]";
  const variants = {
    primary: "bg-[#F4C430] text-black hover:bg-black hover:text-[#F4C430] hover:shadow-[10px_10px_0_rgba(244,196,48,0.8)]",
    secondary: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black",
    accent: "bg-[#F4C430] text-black hover:bg-black hover:text-[#F4C430] hover:shadow-[10px_10px_0_rgba(244,196,48,0.8)]",
    outline: "border-2 border-[#F4C430] text-[#F4C430] bg-transparent hover:bg-[#F4C430] hover:text-black hover:shadow-[8px_8px_0_rgba(244,196,48,0.8)]",
    coupon: "bg-[#F4C430] text-black hover:bg-black hover:text-[#F4C430] shadow-none",
    couponDark: "bg-black text-[#F4C430] hover:bg-white hover:text-black shadow-none",
    couponWhite: "bg-[#F4C430] text-black hover:bg-white hover:text-black shadow-none"
  };
  const sizes = {
    sm: "px-6 py-2 text-base",
    md: "px-12 py-4 text-lg flex items-center justify-center",
    lg: "px-8 h-[65px] text-[20px] flex items-center justify-center"
  };
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className || ""}`;
  const Tag = href ? "a" : "button";
  return renderTemplate`${renderComponent($$result, "Tag", Tag, { "href": href, "class": buttonClass, ...href ? {} : { type }, ...disabled ? { disabled: true } : {}, "data-astro-cid-6ygtcg62": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<span class="flex items-center justify-center gap-3 w-full" data-astro-cid-6ygtcg62> ${renderSlot($$result2, $$slots["default"])} ${icon && renderTemplate`<svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3" data-astro-cid-6ygtcg62> <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" data-astro-cid-6ygtcg62></path> </svg>`} </span> ` })}`;
}, "C:/Users/sabido/electrician_website/src/components/ui/Button.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const quickLinks = [
    { name: "Home", href: "" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Service Area", href: "/location" },
    { name: "Contact", href: "/contact" }
  ];
  const services = [
    { name: "Commercial Electrical", href: "/commercial-electrical" },
    { name: "Residential Electrical", href: "/services" },
    { name: "Specialty Services", href: "/services" },
    { name: "Emergency Services", href: "/services" }
  ];
  const contactInfo = [
    {
      icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
      label: "Call Us",
      value: "+(234) 567 8912"
    },
    {
      icon: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
      label: "Email Us",
      value: "info@electrixa.com"
    },
    {
      icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
      label: "Address",
      value: "Los Angeles, California"
    }
  ];
  const socialIcons = [
    {
      name: "Facebook",
      href: "#",
      icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    },
    {
      name: "X/Twitter",
      href: "#",
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
    },
    {
      name: "Instagram",
      href: "#",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="bg-black text-white"> <!-- Main Footer Content --> <div class="pt-16 pb-8 px-4 sm:px-6 lg:px-8"> <div class="max-w-7xl mx-auto"> <!-- Top Section: Logo, Tagline, Quick Links, Services --> <div class="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"> <div class="max-w-md"> <div class="flex items-center gap-3 mb-4"> <img src="/electrixa.png" alt="Electrixa Logo" class="h-10 hidden md:block"> <!-- Mobile optimized logo --> <div class="h-10 w-10 bg-[#F4C430] flex items-center justify-center md:hidden font-black text-black text-xl">E</div> <h2 class="text-white font-bold" style="font-size: 25px;">
ELECTRIXA
</h2> </div> <p class="text-gray-400 mb-6" style="font-size: 16px;">
With a commitment to excellence, we thrive in delivering exceptional solutions and building lasting partnerships. Our journey is defined by a relentless pursuit of growth.
</p> <!-- Social Icons --> <div class="flex items-center gap-4"> ${socialIcons.map((social) => renderTemplate`<a${addAttribute(social.href, "href")} target="_blank" rel="noopener noreferrer" class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center hover:bg-[#e5b52a] transition-colors"${addAttribute(`Visit our ${social.name} page`, "aria-label")}> <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"> <path${addAttribute(social.icon, "d")}></path> </svg> </a>`)} </div> </div> <!-- Quick Links --> <div class="lg:ml-8"> <h3 class="text-white font-bold text-xl mb-4">Quick Links</h3> <ul class="space-y-3"> ${quickLinks.map((link) => renderTemplate`<li> <a${addAttribute(link.href, "href")} class="text-gray-400 hover:text-[#F4C430] transition-colors flex items-center gap-2" style="font-size: 16px;"> <span class="text-[#F4C430]">›</span> ${link.name} </a> </li>`)} </ul> </div> <!-- Services --> <div> <h3 class="text-white font-bold text-xl mb-4">Services</h3> <ul class="space-y-3"> ${services.map((service) => renderTemplate`<li> <a${addAttribute(service.href, "href")} class="text-gray-400 hover:text-[#F4C430] transition-colors flex items-center gap-2" style="font-size: 16px;"> <span class="text-[#F4C430]">›</span> ${service.name} </a> </li>`)} </ul> </div> <!-- Contact Info --> <div> <h3 class="text-white font-bold text-xl mb-4">Contact</h3> <div class="space-y-4"> ${contactInfo.map((contact) => renderTemplate`<div class="flex items-center gap-3"> <div class="w-10 h-10 bg-[#F4C430] rounded-full flex items-center justify-center flex-shrink-0"> <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24"> <path${addAttribute(contact.icon, "d")}></path> </svg> </div> <div> <p class="text-gray-400 text-sm">${contact.label}</p> <p class="text-white font-bold">${contact.value}</p> </div> </div>`)} </div> </div> </div> </div> </div> <!-- Bottom Footer --> <div class="border-t border-gray-800 py-6 px-4 sm:px-6 lg:px-8"> <div class="max-w-7xl mx-auto text-center"> <!-- Copyright --> <p class="text-gray-400" style="font-size: 13px;">© 2026 Electrician Template. All rights reserved.</p> </div> </div> </footer>`;
}, "C:/Users/sabido/electrician_website/src/components/sections/Footer.astro", void 0);

const $$FloatingOffer = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="floating-offer" class="fixed bottom-8 right-12 z-50 transition-all duration-300" data-astro-cid-7a45kj3h> <button id="floating-offer-btn" class="group relative flex items-center gap-3 bg-gradient-to-r from-[#F4C430] to-[#e5b52a] text-black px-6 py-4 shadow-2xl hover:shadow-[0_20px_60px_rgba(244,196,48,0.6)] transition-all duration-500 hover:from-[#e5b52a] hover:to-[#F4C430] animate-[floatingPulse_2s_ease-in-out_infinite] hover:animate-none overflow-hidden" data-astro-cid-7a45kj3h> <!-- Shimmer effect --> <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" data-astro-cid-7a45kj3h></div> <!-- Pulsing rings - more visible --> <div class="absolute inset-0 border-4 border-[#F4C430] animate-[ping_1.5s_ease-in-out_infinite] opacity-90" data-astro-cid-7a45kj3h></div> <div class="absolute inset-0 border-2 border-white/50 animate-[ping_2s_ease-in-out_infinite] opacity-75" data-astro-cid-7a45kj3h></div> <div class="relative w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0 shadow-xl group-hover:rotate-[20deg] transition-all duration-500" data-astro-cid-7a45kj3h> <!-- Glow effect behind icon --> <div class="absolute inset-0 bg-[#F4C430] rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" data-astro-cid-7a45kj3h></div> <svg class="relative w-6 h-6 text-[#F4C430] transition-transform duration-500 animate-[wiggle_1s_ease-in-out_infinite]" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-7a45kj3h> <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" data-astro-cid-7a45kj3h></path> </svg> </div> <div class="relative text-left pr-2" data-astro-cid-7a45kj3h> <p class="text-black font-black text-xs uppercase tracking-widest mb-0.5 transition-all duration-500" data-astro-cid-7a45kj3h>Limited Time</p> <p class="text-black font-black text-lg transition-all duration-500" data-astro-cid-7a45kj3h>Get $50 OFF</p> </div> <!-- Sparkle effect - single red dot in upper right corner --> <div class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-[ping_1s_ease-in-out_infinite] opacity-90" data-astro-cid-7a45kj3h></div> </button> </div>  ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/FloatingOffer.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/FloatingOffer.astro", void 0);

const $$OfferModal = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="offer-modal" class="fixed inset-0 backdrop-blur-lg bg-black/50 z-[100] hidden items-center justify-center p-4" data-astro-cid-gryac3mr> <div class="bg-white rounded-2xl max-w-lg w-full overflow-hidden relative animate-fade-in shadow-2xl" data-astro-cid-gryac3mr> <!-- Close Button --> <button id="close-modal" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-50 shadow-lg" aria-label="Close offer modal" data-astro-cid-gryac3mr> <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-gryac3mr> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-astro-cid-gryac3mr></path> </svg> </button> <!-- Hero Image Section --> <div class="relative h-48 overflow-hidden" data-astro-cid-gryac3mr> <img src="https://images.unsplash.com/photo-1758101755915-462eddc23f57?q=60&w=600&auto=format&fit=crop" alt="Electrical services background" class="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" data-astro-cid-gryac3mr> <div class="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" data-astro-cid-gryac3mr></div> <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center" data-astro-cid-gryac3mr> <div class="bg-[#F4C430] px-4 py-1 rounded-full mb-2" data-astro-cid-gryac3mr> <p class="font-bold text-xs uppercase tracking-wide text-black" data-astro-cid-gryac3mr>Exclusive Offer</p> </div> <h2 class="text-2xl font-bold mb-1" data-astro-cid-gryac3mr>Special Electrical Offer</h2> <p class="text-base" data-astro-cid-gryac3mr>Special discounts available now</p> </div> </div> <!-- Content Section --> <div class="p-6" data-astro-cid-gryac3mr> <h3 class="text-2xl font-bold text-black mb-3 text-center" data-astro-cid-gryac3mr>Expert Electrical Services</h3> <p class="text-gray-600 text-center mb-6 text-base" data-astro-cid-gryac3mr>
Expert electricians ready to help with installations, repairs, and emergency services. Quality work guaranteed.
</p> <!-- Countdown Timer --> <div class="mb-6 py-6 border-y border-gray-200" data-astro-cid-gryac3mr> <p class="text-center font-black text-black uppercase tracking-wider mb-4" style="font-size: 20px;" data-astro-cid-gryac3mr>Offer Ends In</p> <div class="grid grid-cols-4 gap-3" data-astro-cid-gryac3mr> <div class="text-center bg-gradient-to-br from-[#F4C430] to-[#e5b52a] rounded-lg p-3 overflow-hidden" data-astro-cid-gryac3mr> <div class="countdown-flip" data-astro-cid-gryac3mr> <p id="countdown-days" class="text-3xl font-black text-black transition-all duration-500" data-astro-cid-gryac3mr>00</p> </div> <p class="text-black text-xs uppercase font-bold mt-1" data-astro-cid-gryac3mr>Days</p> </div> <div class="text-center bg-gradient-to-br from-[#F4C430] to-[#e5b52a] rounded-lg p-3 overflow-hidden" data-astro-cid-gryac3mr> <div class="countdown-flip" data-astro-cid-gryac3mr> <p id="countdown-hours" class="text-3xl font-black text-black transition-all duration-500" data-astro-cid-gryac3mr>00</p> </div> <p class="text-black text-xs uppercase font-bold mt-1" data-astro-cid-gryac3mr>Hours</p> </div> <div class="text-center bg-gradient-to-br from-[#F4C430] to-[#e5b52a] rounded-lg p-3 overflow-hidden" data-astro-cid-gryac3mr> <div class="countdown-flip" data-astro-cid-gryac3mr> <p id="countdown-minutes" class="text-3xl font-black text-black transition-all duration-500" data-astro-cid-gryac3mr>00</p> </div> <p class="text-black text-xs uppercase font-bold mt-1" data-astro-cid-gryac3mr>Minutes</p> </div> <div class="text-center bg-gradient-to-br from-[#F4C430] to-[#e5b52a] rounded-lg p-3 overflow-hidden" data-astro-cid-gryac3mr> <div class="countdown-flip" data-astro-cid-gryac3mr> <p id="countdown-seconds" class="text-3xl font-black text-black transition-all duration-500" data-astro-cid-gryac3mr>00</p> </div> <p class="text-black text-xs uppercase font-bold mt-1" data-astro-cid-gryac3mr>Seconds</p> </div> </div> </div> <!-- CTA Buttons --> <div class="space-y-3" data-astro-cid-gryac3mr> <a href="tel:+12345678912" class="block w-full bg-[#F4C430] text-black text-center py-3 font-bold text-base hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-none shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_0_rgba(244,196,48,1)]" data-astro-cid-gryac3mr> <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" data-astro-cid-gryac3mr> <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" data-astro-cid-gryac3mr></path> </svg>
Call Now: +(234) 567 8912
</a> <button id="maybe-later-btn" class="w-full text-center text-gray-500 hover:text-gray-700 transition-colors cursor-pointer mt-2" style="font-size: 13px;" data-astro-cid-gryac3mr>
No thanks, I'll pass
</button> </div> </div> </div> </div> ${renderScript($$result, "C:/Users/sabido/electrician_website/src/components/sections/OfferModal.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/sabido/electrician_website/src/components/sections/OfferModal.astro", void 0);

export { $$Header as $, $$Footer as a, $$FloatingOffer as b, $$OfferModal as c, $$Button as d, renderScript as r };
