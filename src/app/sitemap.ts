import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/constants';
import { caseStudies } from '@/data/caseStudies';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = SITE_CONFIG.url;

    const caseStudyUrls: MetadataRoute.Sitemap = caseStudies.map((caseStudy) => ({
        url: `${baseUrl}/work/${caseStudy.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/cv`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        ...caseStudyUrls,
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/pricing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
    ];
}
