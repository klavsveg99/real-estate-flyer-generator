import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface ListingData {
  title: string;
  address: string;
  description: string;
  price: string;
  pricePerSqm: string;
  areaSize: string;
  listingId: string;
  listingDate: string;
  agentName: string;
  agentTitle: string;
  mobile: string;
  phone: string;
  email: string;
  agentAddress: string;
  websiteText: string;
  ctaText: string;
}

interface RequestBody {
  listing: ListingData;
  logo?: string;
  mapImage?: string;
  galleryImages: string[];
}

function generateFlyerHtml(data: RequestBody): string {
  const { listing, logo, mapImage, galleryImages } = data;
  const paragraphs = listing.description.split('\n\n').filter((p) => p.trim());

  const formattedPrice = listing.price ? `$${parseFloat(listing.price.replace(/[^0-9.]/g, '')).toLocaleString('en-US')}` : '';
  const formattedPricePerSqm = listing.pricePerSqm ? `$${parseFloat(listing.pricePerSqm.replace(/[^0-9.]/g, '')).toLocaleString('en-US')}/m²` : '';
  const areaFormatted = listing.areaSize ? `${parseFloat(listing.areaSize.replace(/[^0-9.]/g, '')).toLocaleString('en-US')} m²` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #F9FAFB; }
    .page { width: 210mm; min-height: 297mm; padding: 12mm; margin: 0 auto; background: white; box-sizing: border-box; }
    .brand-line { height: 3px; background: linear-gradient(90deg, #8B5CF6 0%, #7C3AED 100%); border-radius: 2px; margin-bottom: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
    .logo-container { max-width: 140px; max-height: 40px; }
    .logo-container img { max-width: 100%; max-height: 40px; object-fit: contain; }
    .logo-placeholder { width: 120px; height: 32px; background: #e5e7eb; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; }
    .listing-id { background: #8B5CF6; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .main-content { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .property-title { font-size: 18px; font-weight: 700; color: #111827; line-height: 1.2; margin-bottom: 4px; }
    .property-address { font-size: 11px; color: #6b7280; margin-bottom: 12px; }
    .price-section { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; margin-bottom: 12px; }
    .price { font-size: 24px; font-weight: 700; color: #111827; }
    .price-details { font-size: 11px; color: #6b7280; margin-top: 4px; }
    .description { font-size: 10px; line-height: 1.6; color: #4b5563; margin-bottom: 12px; }
    .description p { margin-bottom: 8px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%); color: white; padding: 8px 16px; border-radius: 6px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .map-container { height: 90px; background: #e5e7eb; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
    .map-container img { width: 100%; height: 100%; object-fit: cover; }
    .map-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 10px; }
    .gallery-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; flex: 1; }
    .gallery-item { aspect-ratio: 1; background: #e5e7eb; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
    .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
    .gallery-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 8px; }
    .footer { border-top: 1px solid #e5e7eb; padding-top: 12px; margin-top: auto; }
    .footer-content { display: flex; justify-content: space-between; align-items: flex-start; }
    .agent-info { font-size: 10px; }
    .agent-info h4 { font-weight: 600; color: #111827; margin-bottom: 2px; }
    .agent-info p { color: #6b7280; line-height: 1.4; }
    .contact-info { text-align: right; font-size: 9px; color: #6b7280; }
    .contact-info .website { color: #8B5CF6; font-weight: 500; }
    .footer-bottom { display: flex; justify-content: space-between; margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; }
    .footer-bottom span { font-size: 8px; color: #9ca3af; }
    @media print { body { background: white; } .page { box-shadow: none; margin: 0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="brand-line"></div>
    <div class="header">
      <div class="logo-container">${logo ? `<img src="${logo}" alt="Logo" />` : '<div class="logo-placeholder">Logo</div>'}</div>
      <div class="listing-id">${listing.listingId}</div>
    </div>
    <div class="main-content">
      <div>
        <h1 class="property-title">${listing.title}</h1>
        <p class="property-address">${listing.address}</p>
        <div class="price-section">
          <div class="price">${formattedPrice}</div>
          <div class="price-details">${areaFormatted}${areaFormatted && formattedPricePerSqm ? ' • ' : ''}${formattedPricePerSqm}</div>
        </div>
        <div class="description">${paragraphs.slice(0, 3).map(p => `<p>${p}</p>`).join('')}</div>
        <div class="cta-button">${listing.ctaText || 'Contact Agent'}</div>
      </div>
      <div>
        <div class="map-container">${mapImage ? `<img src="${mapImage}" alt="Map" />` : '<div class="map-placeholder">Map Image</div>'}</div>
        <div class="gallery-grid">
          ${galleryImages.length > 0 ? galleryImages.slice(0, 6).map((img, i) => `<div class="gallery-item"><img src="${img}" alt="Property Image ${i + 1}" /></div>`).join('') : Array(6).fill('<div class="gallery-item"><div class="gallery-placeholder">Image</div></div>').join('')}
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-content">
        <div class="agent-info">
          <h4>${listing.agentName}</h4>
          ${listing.agentTitle ? `<p>${listing.agentTitle}</p>` : ''}
          ${listing.mobile ? `<p>${listing.mobile}</p>` : ''}
          ${listing.phone ? `<p>${listing.phone}</p>` : ''}
          ${listing.email ? `<p>${listing.email}</p>` : ''}
        </div>
        <div class="contact-info">
          ${listing.websiteText ? `<p class="website">${listing.websiteText}</p>` : ''}
          ${listing.agentAddress ? `<p>${listing.agentAddress}</p>` : ''}
        </div>
      </div>
      <div class="footer-bottom">
        <span>${listing.listingDate}</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { listing, logo, mapImage, galleryImages } = body;

    if (!listing?.listingId) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    console.log('Generating PDF for listing:', listing.listingId);

    const html = generateFlyerHtml({ listing, logo, mapImage, galleryImages });

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ],
    });

    console.log('Browser launched, creating page...');
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });

    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();
    console.log('PDF generated successfully');

    const filename = `listing-${listing.listingId.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF: ' + (error as Error).message }, { status: 500 });
  }
}
