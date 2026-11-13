// Product-identification artwork copied from each software publisher's public site.
// `src` is relative to the site's assets directory; preserve each source's aspect ratio.
// Sources establish provenance, not a licence or endorsement. Trademarks remain
// with their respective owners. No replacement lettermarks have been generated.

const rights = 'Product trademarks and artwork remain with their respective owners; no reuse licence is inferred.';
const records = [
  {
    id: 'rhino', name: 'Rhino', src: 'software-logos/rhino.png', width: 32, height: 32,
    aliases: ['Rhino', 'Rhino 3D', 'Rhino3D', 'Rhinoceros', '犀牛'],
    source: 'https://www.rhino3d.com/images/favicon.ico', sourcePage: 'https://www.rhino3d.com/',
    notes: 'Official site icon; largest 32 × 32 ICO frame saved losslessly as PNG.'
  },
  {
    id: 'keyshot', name: 'KeyShot', src: 'software-logos/keyshot.svg', width: 458.19, height: 456.5,
    aliases: ['KeyShot', 'KeyShot Studio'],
    source: 'https://trial.keyshot.com/assets/favicon-black.svg', sourcePage: 'https://trial.keyshot.com/',
    brandGuidelines: 'https://www.keyshot.com/legal/trademark-copyright-usage/',
    notes: 'Official trial-site vector icon, original colors.'
  },
  {
    id: 'solidworks', name: 'SolidWorks', src: 'software-logos/solidworks.png', width: 790, height: 147, shape: 'wordmark',
    aliases: ['SolidWorks', 'SOLIDWORKS', 'Solid Works'],
    source: 'https://www.solidworks.com/sites/default/filesd10/2026-03/3DS_SOLIDWORKS_Logotype_RGB_Red.png',
    sourcePage: 'https://www.solidworks.com/partners/solution-partner-graphics-charter',
    notes: 'Official complete red 3DS SOLIDWORKS logo; neither cropped nor recolored.'
  },
  {
    id: 'creo', name: 'Creo', src: 'software-logos/creo.svg', width: 442.2, height: 193.4, shape: 'wordmark',
    aliases: ['Creo', 'PTC Creo', 'Creo Parametric'],
    source: 'https://ptc-p-001.sitecorecontenthub.cloud/api/public/content/c40d9c5ef3b743418581b9864de09791?v=97f9e472',
    sourcePage: 'https://www.ptc.com/en/brand-guide/logos/creo',
    notes: 'Official Creo parent-logo ZIP: _creo PARENT logo/RGB/SVG/creo_RGB_color.svg; original RGB variant.'
  },
  {
    id: 'figma', name: 'Figma', src: 'software-logos/figma.svg', width: 64, height: 64,
    aliases: ['Figma'],
    source: 'https://static.figma.com/app/icon/2/favicon.svg', sourcePage: 'https://www.figma.com/',
    notes: 'Official site vector icon, original colors.'
  },
  {
    id: 'photoshop', name: 'Photoshop', src: 'software-logos/photoshop.svg', width: 240, height: 240,
    aliases: ['Photoshop', 'Adobe Photoshop', 'PS'],
    source: 'https://main--genuine--adobecom.aem.live/genuine-shared/assets/genuine-product-icons/svg/photoshop.svg',
    sourcePage: 'https://www.adobe.com/genuine-shared/fragments/ic-ses-experience/individuals/photoshop',
    brandGuidelines: 'https://www.adobe.com/legal/permissions/icons-web-logos.html',
    notes: 'Adobe-published photoshop-2025 vector; HTTP gzip transfer decoded without changing artwork.'
  },
  {
    id: 'illustrator', name: 'Illustrator', src: 'software-logos/illustrator.svg', width: 240, height: 240,
    aliases: ['Illustrator', 'Adobe Illustrator', 'AI (Illustrator)'],
    source: 'https://main--genuine--adobecom.aem.live/genuine-shared/assets/genuine-product-icons/svg/illustrator.svg',
    sourcePage: 'https://www.adobe.com/genuine-shared/fragments/dm-twp-row-experience/individuals/illustrator',
    brandGuidelines: 'https://www.adobe.com/legal/permissions/icons-web-logos.html',
    notes: 'Adobe-published illustrator-2025 vector; HTTP gzip transfer decoded without changing artwork.'
  },
  {
    id: 'lightroom', name: 'Lightroom', src: 'software-logos/lightroom.svg', width: 240, height: 240,
    aliases: ['Lightroom', 'Adobe Lightroom', 'Adobe Photoshop Lightroom', 'LR'],
    source: 'https://main--genuine--adobecom.aem.live/genuine-shared/assets/genuine-product-icons/svg/lightroom.svg',
    sourcePage: 'https://www.adobe.com/products/photoshop-lightroom.html',
    brandGuidelines: 'https://www.adobe.com/legal/permissions/icons-web-logos.html',
    notes: 'Adobe-published lightroom-2025 vector; HTTP gzip transfer decoded without changing artwork.'
  },
  {
    id: 'procreate', name: 'Procreate', src: 'software-logos/procreate.png', width: 192, height: 192,
    aliases: ['Procreate'],
    source: 'https://procreate-assets-cdn.procreate.com/_nuxt/android-icon-192x192.CWLrxfXY.png', sourcePage: 'https://procreate.com/',
    brandGuidelines: 'https://procreate.com/brand-use',
    notes: 'Official site application icon; original colors and full image.'
  },
  {
    id: 'canva', name: 'Canva', src: 'software-logos/canva.svg', width: 80, height: 30, shape: 'wordmark',
    aliases: ['Canva', '可画', 'Canva 可画', 'Canva可画'],
    source: 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.svg', sourcePage: 'https://www.canva.com/',
    brandGuidelines: 'https://www.canva.dev/docs/connect/guidelines/brand/',
    notes: 'Official Canva gradient wordmark, original proportions.'
  },
  {
    id: 'jianying', name: '剪映', src: 'software-logos/jianying.png', width: 48, height: 48,
    aliases: ['剪映', '剪映专业版', 'Jianying', 'Jianying Pro'],
    source: 'https://lf3-s.vlabstatic.com/obj/vilab-static/ies/ulike/web/resource/fe_official/assets/imgs/lv/favicon.ico', sourcePage: 'https://www.capcut.cn/',
    notes: 'Official Chinese 剪映 site icon; largest 48 × 48 ICO frame saved losslessly as PNG.'
  },
  {
    id: 'xiumi', name: '秀米', src: 'software-logos/xiumi.png', width: 40, height: 40,
    aliases: ['秀米', 'Xiumi', 'Xiu Mi'],
    source: 'https://edt.xiumius.cn/images/b80cd8.xiumi_logo_40.png', sourcePage: 'https://xiumi.us/',
    notes: 'Official Xiumi site logo; original 40 × 40 asset.'
  },
  {
    id: 'python', name: 'Python', src: 'software-logos/python.png', width: 144, height: 144,
    aliases: ['Python', 'Python 3'],
    source: 'https://www.python.org/static/apple-touch-icon-144x144-precomposed.png', sourcePage: 'https://www.python.org/',
    notes: 'Official Python site touch icon; original colors.'
  },
  {
    id: 'processing', name: 'Processing', src: 'software-logos/processing.svg', width: 800, height: 800,
    aliases: ['Processing'],
    source: 'https://processing.org/favicon.svg?v=0f0dee6220d6f6497709adb2b39b429a', sourcePage: 'https://processing.org/',
    notes: 'Official Processing site vector icon; original colors.'
  }
];

export const SOFTWARE_LOGOS = Object.freeze(records.map(record => Object.freeze({
  ...record,
  aliases: Object.freeze(record.aliases),
  shape: record.shape || 'icon',
  aspectRatio: record.width / record.height,
  rights
})));

function normalizeToolName(value) {
  return String(value || '').normalize('NFKC').trim().toLocaleLowerCase('en')
    .replace(/[\s._\-–—·®™]+/g, '');
}

const byToolName = new Map(SOFTWARE_LOGOS.flatMap(record =>
  [record.id, record.name, ...record.aliases].map(alias => [normalizeToolName(alias), record])
));

// Methods and generic capabilities intentionally receive no software icon.
export function softwareLogoFor(toolName) {
  return byToolName.get(normalizeToolName(toolName)) || null;
}
