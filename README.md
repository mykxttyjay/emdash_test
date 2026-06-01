# Electrician Website with Emdash CMS

A modern electrician website built with Astro, featuring Emdash CMS for content management, Turso database, and deployed on Vercel.

## 🚀 Deployment Status

This project is configured for automatic deployment on Vercel. Every push to the `main` branch triggers a new deployment.

## ✨ Features

- 🎨 Modern, responsive design with Tailwind CSS
- 📝 Emdash CMS for easy content management
- 🗄️ Turso (LibSQL) database for fast, edge-ready data storage
- 🚀 Deployed on Vercel with serverless functions
- ⚡ Server-side rendering (SSR) enabled
- 📱 Mobile-friendly admin panel

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 CMS Setup

This project uses Emdash CMS with Turso database. For detailed setup instructions, see [EMDASH_SETUP.md](./EMDASH_SETUP.md).

### Quick Start

1. **Set up Turso database:**
   ```bash
   turso db create electrician-cms
   turso db show electrician-cms --url
   turso db tokens create electrician-cms
   ```

2. **Configure environment variables:**
   ```bash
   copy .env.example .env
   # Edit .env with your Turso credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access admin panel:**
   ```
   http://localhost:4321/admin
   ```

### CMS Collections

- **Services** - Manage electrical services
- **Testimonials** - Customer reviews
- **Portfolio** - Project showcase
- **Pages** - Website pages
- **Settings** - Site configuration

### Using CMS Data

```astro
---
import { getServices, getTestimonials } from '../lib/cms';

const services = await getServices();
const testimonials = await getTestimonials();
---
```

See [cms-example.astro](./src/pages/cms-example.astro) for a complete example.

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
