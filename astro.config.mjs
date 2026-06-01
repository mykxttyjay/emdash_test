// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import emdash, { local, s3 } from 'emdash/astro';
import { sqlite, libsql } from 'emdash/db';

/**
 * EmDash on Vercel
 * 
 * - Production (Vercel): libSQL/Turso for the database, local storage for media
 * - Locally (no env vars set): SQLite + local uploads
 */
const useTurso = !!process.env.TURSO_DATABASE_URL;
const useS3 = !!process.env.S3_BUCKET || !!process.env.S3_ENDPOINT;

const localDbPath = process.env.PERSISTENT_STORAGE_DIR
  ? path.join(process.env.PERSISTENT_STORAGE_DIR, 'data.db')
  : './data.db';

const localUploadsDir = process.env.PERSISTENT_STORAGE_DIR
  ? path.join(process.env.PERSISTENT_STORAGE_DIR, 'uploads')
  : './uploads';

const database = useTurso
  ? libsql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : sqlite({ url: `file:${localDbPath}` });

const storage = useS3
  ? s3({
      publicUrl: process.env.S3_PUBLIC_URL,
    })
  : local({
      directory: localUploadsDir,
      baseUrl: '/_emdash/api/media/file',
    });

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: false },
    maxDuration: 30,
  }),
  // Session configuration for Vercel
  session: {
    driver: sessionDrivers.lruCache({
      max: 2000,
    }),
  },
  server: {
    host: true,
    port: Number(process.env.PORT) || 4321,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    react(),
    emdash({
      siteUrl:
        process.env.SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
      database,
      storage,
      seed: '.emdash/seed.json',
      schema: {
        collections: {
          site_settings: {
            label: 'Site Settings',
            labelSingular: 'Site Settings',
            singleton: true,
            fields: {
              site_name: { type: 'string', label: 'Site Name', required: true },
              tagline: { type: 'string', label: 'Tagline' },
              phone: { type: 'string', label: 'Phone Number', required: true },
              email: { type: 'string', label: 'Email Address', required: true },
              address: { type: 'text', label: 'Business Address' },
              business_hours: { type: 'text', label: 'Business Hours' },
              emergency_phone: { type: 'string', label: '24/7 Emergency Phone' },
              license_number: { type: 'string', label: 'License Number' },
              facebook_url: { type: 'string', label: 'Facebook URL' },
              instagram_url: { type: 'string', label: 'Instagram URL' },
              linkedin_url: { type: 'string', label: 'LinkedIn URL' },
              twitter_url: { type: 'string', label: 'Twitter URL' },
              yelp_url: { type: 'string', label: 'Yelp URL' },
              meta_title: { type: 'string', label: 'Meta Title' },
              meta_description: { type: 'text', label: 'Meta Description' },
              cta_text: { type: 'string', label: 'Primary CTA Text' },
              cta_phone: { type: 'string', label: 'CTA Phone Number' },
            },
          },
          services: {
            label: 'Services',
            labelSingular: 'Service',
            fields: {
              title: { type: 'string', label: 'Service Title', required: true },
              description: { type: 'text', label: 'Description', required: true },
              icon: { type: 'string', label: 'Icon SVG Path' },
              image: { type: 'image', label: 'Service Image' },
              category: { type: 'string', label: 'Category (commercial/residential/specialty/emergency)', required: true },
              link: { type: 'string', label: 'Link URL' },
            },
          },
          testimonials: {
            label: 'Testimonials',
            labelSingular: 'Testimonial',
            fields: {
              name: { type: 'string', label: 'Customer Name', required: true },
              role: { type: 'string', label: 'Role/Location' },
              image: { type: 'image', label: 'Customer Photo', required: true },
              text: { type: 'text', label: 'Testimonial Text', required: true },
              rating: { type: 'number', label: 'Rating (1-5)' },
            },
          },
          stats: {
            label: 'Stats',
            labelSingular: 'Stat',
            fields: {
              target: { type: 'number', label: 'Target Number', required: true },
              label: { type: 'string', label: 'Stat Label', required: true },
              is_decimal: { type: 'boolean', label: 'Is Decimal?' },
              show_divider: { type: 'boolean', label: 'Show Divider?' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          faqs: {
            label: 'FAQs',
            labelSingular: 'FAQ',
            fields: {
              question: { type: 'string', label: 'Question', required: true },
              answer: { type: 'text', label: 'Answer', required: true },
              category: { type: 'string', label: 'Category' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          coupons: {
            label: 'Coupons',
            labelSingular: 'Coupon',
            fields: {
              title: { type: 'string', label: 'Coupon Title', required: true },
              description: { type: 'text', label: 'Description', required: true },
              discount_amount: { type: 'string', label: 'Discount Amount', required: true },
              code: { type: 'string', label: 'Coupon Code' },
              valid_from: { type: 'string', label: 'Valid From Date' },
              valid_until: { type: 'string', label: 'Valid Until Date' },
              terms_conditions: { type: 'text', label: 'Terms & Conditions' },
              is_active: { type: 'boolean', label: 'Active' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          locations: {
            label: 'Locations',
            labelSingular: 'Location',
            fields: {
              name: { type: 'string', label: 'Location Name', required: true },
              description: { type: 'text', label: 'Description', required: true },
              address: { type: 'text', label: 'Full Address' },
              phone: { type: 'string', label: 'Phone Number' },
              email: { type: 'string', label: 'Email' },
              service_area: { type: 'text', label: 'Service Area Description' },
              map_embed_url: { type: 'string', label: 'Google Maps Embed URL' },
              featured_image: { type: 'image', label: 'Location Image' },
              is_active: { type: 'boolean', label: 'Active Location' },
            },
          },
          team: {
            label: 'Team Members',
            labelSingular: 'Team Member',
            fields: {
              name: { type: 'string', label: 'Full Name', required: true },
              position: { type: 'string', label: 'Position/Title', required: true },
              bio: { type: 'text', label: 'Biography' },
              photo: { type: 'image', label: 'Photo' },
              years_experience: { type: 'number', label: 'Years of Experience' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          maintenance_plans: {
            label: 'Maintenance Plans',
            labelSingular: 'Maintenance Plan',
            fields: {
              name: { type: 'string', label: 'Plan Name', required: true },
              price: { type: 'string', label: 'Price', required: true },
              description: { type: 'text', label: 'Plan Description' },
              is_popular: { type: 'boolean', label: 'Most Popular' },
              button_text: { type: 'string', label: 'Button Text' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          hero_sections: {
            label: 'Hero Sections',
            labelSingular: 'Hero Section',
            fields: {
              title: { type: 'string', label: 'Hero Title', required: true },
              subtitle: { type: 'string', label: 'Subtitle' },
              description: { type: 'text', label: 'Description' },
              background_image: { type: 'image', label: 'Background Image' },
              primary_button_text: { type: 'string', label: 'Primary Button Text' },
              primary_button_link: { type: 'string', label: 'Primary Button Link' },
              secondary_button_text: { type: 'string', label: 'Secondary Button Text' },
              secondary_button_link: { type: 'string', label: 'Secondary Button Link' },
              page: { type: 'string', label: 'Display on Page', required: true },
            },
          },
          cta_sections: {
            label: 'CTA Sections',
            labelSingular: 'CTA Section',
            fields: {
              title: { type: 'string', label: 'CTA Title', required: true },
              description: { type: 'text', label: 'Description' },
              button_text: { type: 'string', label: 'Button Text', required: true },
              button_link: { type: 'string', label: 'Button Link' },
              phone_number: { type: 'string', label: 'Phone Number' },
              background_image: { type: 'image', label: 'Background Image' },
              style: { type: 'string', label: 'CTA Style (banner/card/full-width)' },
              page: { type: 'string', label: 'Display on Page' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          process_steps: {
            label: 'Process Steps',
            labelSingular: 'Process Step',
            fields: {
              step_number: { type: 'number', label: 'Step Number', required: true },
              title: { type: 'string', label: 'Step Title', required: true },
              description: { type: 'text', label: 'Step Description', required: true },
              icon: { type: 'string', label: 'Icon Name' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          financing_options: {
            label: 'Financing Options',
            labelSingular: 'Financing Option',
            fields: {
              name: { type: 'string', label: 'Financing Option Name', required: true },
              description: { type: 'text', label: 'Description', required: true },
              apr: { type: 'string', label: 'APR' },
              terms_conditions: { type: 'text', label: 'Terms & Conditions' },
              logo: { type: 'image', label: 'Provider Logo' },
              apply_url: { type: 'string', label: 'Application URL' },
              is_active: { type: 'boolean', label: 'Active' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
          portfolio: {
            label: 'Portfolio',
            labelSingular: 'Portfolio Project',
            fields: {
              title: { type: 'string', label: 'Project Title', required: true },
              description: { type: 'text', label: 'Project Description', required: true },
              full_description: { type: 'text', label: 'Full Project Details' },
              featured_image: { type: 'image', label: 'Featured Image', required: true },
              category: { type: 'string', label: 'Project Category', required: true },
              location: { type: 'string', label: 'Project Location' },
              completed_date: { type: 'string', label: 'Completion Date' },
              client: { type: 'string', label: 'Client Name' },
              is_featured: { type: 'boolean', label: 'Feature on Homepage' },
              display_order: { type: 'number', label: 'Display Order' },
            },
          },
        },
      },
    }),
  ],
});