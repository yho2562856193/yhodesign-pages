// Geometry is traced from the supplied final handwriting frame, not a substitute font.
// Source: letters-intro-final-v5.webp, 1600 × 1200. OpenCV RETR_CCOMP,
// saturation >= 65: the enclosed counter of the SECOND “o” in “haocong ye”.
export const sourceWidth=1600;
export const sourceHeight=1200;
export const portalPolygon='M746 580L747 579L748 579L749 580L749 590L750 591L750 594L751 595L751 598L753 600L753 601L754 602L754 603L756 605L756 606L759 609L760 609L762 611L763 611L764 612L765 612L767 614L767 615L766 616L765 616L764 617L763 617L762 618L760 618L759 619L757 619L756 620L748 620L747 619L746 619L745 618L744 618L743 617L742 617L737 612L737 611L736 610L736 609L735 608L735 606L734 605L734 593L735 592L735 589L737 587L737 586L742 581L743 581L744 580Z';
// Periodic cubic spline fitted to that trace (arc-length parameters, smoothing 10).
// Ten continuous cubic segments remove magnified raster stair steps. Both
// directions stay <0.83 source pixels from the original, preserving its shape.
export const portalContour='M745.855 579.611C746.549 579.45 747.258 579.359 747.805 579.484C750.393 580.078 749.365 585.523 749.568 589.615C749.671 591.705 750.096 593.442 750.628 595.162C751.822 599.019 753.561 602.793 756.286 605.824C758.177 607.927 760.543 609.672 763.085 611.258C764.555 612.174 766.083 613.037 766.3 614.009C766.599 615.352 764.394 616.902 762.125 617.991C752.24 622.737 741.14 618.729 736.21 610.14C732.735 604.086 732.325 595.755 735.457 589.066C737.613 584.461 741.448 580.634 745.855 579.611Z';
// Area centroid of the shared cubic counter: center the visible opening itself,
// rather than the offset center of its largest inscribed circle.
export const portalFocus=Object.freeze({x:746.45965,y:602.674726});
// The raw trace has 6.5161 source pixels of clearance around this centroid;
// the fitted curve has 6.5925. Both safely contain the radius used below.
// A smaller radius also covers anti-aliasing at the edge of the SVG mask.
export const portalSafeRadius=6.2;
export const portalHandoff=.12;
export const portalZoomStart=.28;
export const portalMaskEnd=.62;
// Exhaustive measurement of all 472 frames, including the full “i am” phrase.
// Coordinates use an exclusive right/bottom edge. Add 2px for anti-aliased ink.
export const movieInkBounds=Object.freeze({left:224,top:502,right:1374,bottom:698});
const fitBounds={left:222,top:500,right:1376,bottom:700};

const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
const smooth=value=>{const t=clamp(value);return t*t*(3-2*t);};
const mix=(a,b,t)=>a+(b-a)*t;

/**
 * A single, reversible source-to-viewport mapping for the poster AND its hole.
 * Apply `transform` to an SVG image at (0,0), size 1600×1200, and to portalContour.
 * Use frame(0)'s x/y/imageWidth/imageHeight to position the unchanged video.
 * 0–12% crossfades video to poster; 12–28% only centers the selected counter.
 * All zoom starts at 28% and revolves around that fixed viewport center.
 * The mask is revealed gradually from 28–62%, after centering is complete.
 */
export function calculatePortalFrame({width,height,progress=0}){
  const w=Math.max(1,Number.isFinite(width)?width:1);
  const h=Math.max(1,Number.isFinite(height)?height:1);
  const p=clamp(progress);
  const fitWidth=2*Math.max(sourceWidth/2-fitBounds.left,fitBounds.right-sourceWidth/2);
  const fitHeight=2*Math.max(sourceHeight/2-fitBounds.top,fitBounds.bottom-sourceHeight/2);
  const baseScale=Math.min(w*.85/fitWidth,h*.5/fitHeight,1060/774);
  const baseX=(w-sourceWidth*baseScale)/2;
  const baseY=(h-sourceHeight*baseScale)/2;
  // All four viewport corners fit inside a circle wholly contained in the o.
  const endScale=Math.max(baseScale,Math.hypot(w/2,h/2)/portalSafeRadius*1.035);
  const zoom=smooth((p-portalZoomStart)/(1-portalZoomStart));
  const scale=baseScale*Math.exp(Math.log(endScale/baseScale)*zoom);
  const focusProgress=smooth((p-portalHandoff)/(portalZoomStart-portalHandoff));
  const focusX=mix(baseX+portalFocus.x*baseScale,w/2,focusProgress);
  const focusY=mix(baseY+portalFocus.y*baseScale,h/2,focusProgress);
  const x=focusX-portalFocus.x*scale;
  const y=focusY-portalFocus.y*scale;
  const transform=`translate(${x} ${y}) scale(${scale})`;
  return {
    progress:p,x,y,scale,transform,holeTransform:transform,
    imageWidth:sourceWidth*scale,imageHeight:sourceHeight*scale,
    posterOpacity:smooth(p/portalHandoff),
    videoOpacity:1-smooth(p/portalHandoff),
    backdropOpacity:1-smooth((p-portalHandoff)/.12),
    ctaOpacity:1-smooth(p/portalHandoff),
    maskOpacity:smooth((p-portalZoomStart)/(portalMaskEnd-portalZoomStart)),
    open:p>=1
  };
}
