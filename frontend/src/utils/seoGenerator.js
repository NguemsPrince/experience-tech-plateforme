// SEO Utilities pour générer automatiquement les meta tags, structured data, etc.

export const generateSitemap = (pages) => {
  const baseUrl = 'https://experiencetech-tchad.com';
  const today = new Date().toISOString().split('T')[0];

  const urls = pages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq || 'weekly'}</changefreq>
    <priority>${page.priority || '0.8'}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
};

export const generateStructuredData = (type, data) => {
  const baseUrl = 'https://experiencetech-tchad.com';

  const schemas = {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Expérience Tech",
      "description": "Services numériques, formations IT et solutions technologiques au Tchad",
      "url": baseUrl,
      "logo": `${baseUrl}/images/logo.png`,
      "sameAs": [
        "https://facebook.com/experiencetech",
        "https://twitter.com/experiencetech",
        "https://linkedin.com/company/experiencetech",
        "https://instagram.com/experiencetech"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+235-60-29-05-10",
        "contactType": "customer service",
        "availableLanguage": ["French", "English", "Arabic"],
        "areaServed": "TD"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Avenue Hassan Djamous",
        "addressLocality": "Abéché",
        "addressRegion": "Ouaddaï",
        "postalCode": "BP 123",
        "addressCountry": "TD"
      }
    },

    course: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": data.name,
      "description": data.description,
      "provider": {
        "@type": "Organization",
        "name": "Expérience Tech",
        "sameAs": baseUrl
      },
      "image": data.image || `${baseUrl}/images/default-course.jpg`,
      "offers": {
        "@type": "Offer",
        "price": data.price || "0",
        "priceCurrency": "XAF",
        "availability": "https://schema.org/InStock",
        "url": `${baseUrl}/course/${data.id}`
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": data.mode || "online",
        "courseWorkload": data.duration || "PT40H",
        "instructor": {
          "@type": "Person",
          "name": data.instructor || "Expérience Tech"
        }
      },
      "aggregateRating": data.rating && {
        "@type": "AggregateRating",
        "ratingValue": data.rating,
        "reviewCount": data.reviewCount || 1,
        "bestRating": "5",
        "worstRating": "1"
      }
    },

    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": data.name,
      "description": data.description,
      "provider": {
        "@type": "Organization",
        "name": "Expérience Tech"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Chad"
      },
      "serviceType": data.serviceType || "Technology Service",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "priceCurrency": "XAF"
        }
      }
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${baseUrl}${item.path}`
      }))
    },

    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "image": data.image || `${baseUrl}/images/default-article.jpg`,
      "datePublished": data.publishedDate,
      "dateModified": data.modifiedDate || data.publishedDate,
      "author": {
        "@type": "Organization",
        "name": "Expérience Tech"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Expérience Tech",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/images/logo.png`
        }
      }
    },

    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    }
  };

  return schemas[type] || null;
};

export const generateMetaTags = (pageData) => {
  const {
    title = 'Expérience Tech - Services Numériques & Formations',
    description = 'Votre partenaire numérique de confiance pour les services technologiques, formations et solutions innovantes au Tchad.',
    keywords = 'services numériques, formation IT, développement web, Tchad, Abéché, technologie',
    image = '/images/og-image.jpg',
    url = '/',
    type = 'website',
    author = 'Expérience Tech',
    locale = 'fr_FR'
  } = pageData;

  const baseUrl = 'https://experiencetech-tchad.com';
  const fullUrl = `${baseUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    // Basic Meta Tags
    title,
    description,
    keywords,
    author,

    // Open Graph / Facebook
    'og:type': type,
    'og:url': fullUrl,
    'og:title': title,
    'og:description': description,
    'og:image': fullImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:locale': locale,
    'og:site_name': 'Expérience Tech',

    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:url': fullUrl,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': fullImage,
    'twitter:creator': '@experiencetech',
    'twitter:site': '@experiencetech',

    // Additional Meta
    'robots': 'index, follow',
    'googlebot': 'index, follow',
    'language': 'French',
    'revisit-after': '7 days',
    'content-language': 'fr',

    // Mobile
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Expérience Tech',

    // Canonical
    canonical: fullUrl
  };
};

export const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Sitemap
Sitemap: https://experiencetech-tchad.com/sitemap.xml

# Crawl-delay
Crawl-delay: 10`;
};

// Hook pour injecter les meta tags dynamiquement
export const useSEO = (pageData) => {
  const metaTags = generateMetaTags(pageData);

  // Fonction pour mettre à jour les meta tags
  const updateMetaTags = () => {
    // Title
    document.title = metaTags.title;

    // Meta tags
    Object.entries(metaTags).forEach(([key, value]) => {
      if (key === 'title' || key === 'canonical') return;

      let selector;
      if (key.startsWith('og:') || key.startsWith('twitter:')) {
        selector = `meta[property="${key}"]`;
      } else {
        selector = `meta[name="${key}"]`;
      }

      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (key.startsWith('og:') || key.startsWith('twitter:')) {
          meta.setAttribute('property', key);
        } else {
          meta.setAttribute('name', key);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', value);
    });

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metaTags.canonical);
  };

  return { metaTags, updateMetaTags };
};

// Pages par défaut pour le sitemap
export const defaultSitemapPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/training', priority: '0.9', changefreq: 'weekly' },
  { path: '/products', priority: '0.7', changefreq: 'weekly' },
  { path: '/news', priority: '0.8', changefreq: 'daily' },
  { path: '/careers', priority: '0.7', changefreq: 'monthly' },
  { path: '/forum', priority: '0.6', changefreq: 'daily' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' }
];

