import { servicesList } from "@/lib/services";
import { site } from "@/lib/site";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "Manufacturer"],
        "@id": `${site.url}/#business`,
        name: site.name,
        url: site.url,
        email: site.email,
        description:
          "Founder-led sheet metal fabrication workshop in Tughlakabad Village, New Delhi, offering laser cutting, shearing, bending, welding and fabrication under one roof.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Tughlakabad Village",
          addressLocality: "New Delhi",
          addressRegion: "Delhi",
          postalCode: "110020",
          addressCountry: "IN",
        },
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Delhi NCR",
        },
        founder: {
          "@type": "Person",
          name: "Vijay Rajbhar",
        },
        knowsAbout: [
          "Laser sheet cutting",
          "Sheet shearing",
          "Sheet bending",
          "Welding",
          "Sheet metal fabrication",
          "Custom machine parts",
        ],
        makesOffer: servicesList.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.description,
          },
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en-IN",
        publisher: { "@id": `${site.url}/#business` },
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
