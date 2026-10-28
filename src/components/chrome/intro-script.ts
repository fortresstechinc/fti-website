/** How long the intro holds the screen, matching the CSS timeline in Intro.module.css. */
export const INTRO_LENGTH = 2600;
export const INTRO_KEY = "fti-intro";

/**
 * Runs in <head> while the HTML parses, before first paint: the first page of a
 * visit stamps the time; any later page load in the same tab hides the intro.
 */
export const introScript = `(function(){try{var t=sessionStorage.getItem("${INTRO_KEY}");if(t&&Date.now()-Number(t)>${INTRO_LENGTH})document.documentElement.setAttribute("data-intro","seen");else if(!t)sessionStorage.setItem("${INTRO_KEY}",String(Date.now()))}catch(e){}})()`;
