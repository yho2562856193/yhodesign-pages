// Restore the retained Journey in the published site and local previews.
export const releaseFeatures=Object.freeze({journey:true});
export function journeyIsVisible(url){
 const page=new URL(url);
 return releaseFeatures.journey||(['127.0.0.1','localhost','[::1]'].includes(page.hostname)&&/^journey-v\d+$/.test(page.searchParams.get('preview')||''));
}
export const journeyEnabled=typeof location!=='undefined'&&journeyIsVisible(location.href);
