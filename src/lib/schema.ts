interface FAQItem {
  question: string;
  answer: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates FAQ schema for structured data
 */
export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

/**
 * Generates breadcrumb schema for structured data
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

/**
 * Generates organization schema for structured data
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Rashmi Metaliks Limited",
    "url": "https://www.rashmimetaliks.com",
    "logo": "https://www.rashmimetaliks.com/lovable-uploads/rashmi-logo.png",
    "description": "Rashmi Metaliks Limited is one of the world's largest manufacturers of Ductile Iron (DI) Pipes with an annual capacity of 770,000 MT.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Premlata, 39 Shakespeare Sarani, 6th Floor",
      "addressLocality": "Kolkata",
      "addressRegion": "West Bengal",
      "postalCode": "700017",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-33-2289-2734/35/36",
      "contactType": "customer service",
      "email": "info@rashmimetaliks.com"
    },
    "sameAs": [
      "https://www.linkedin.com/company/rashmi-metaliks-limited/",
      "https://www.facebook.com/rashmimetaliks/"
    ]
  };
} 