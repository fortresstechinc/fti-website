/**
 * Runs in <head> on the home page while the HTML parses, so the visitor's
 * approximate location is on its way before React starts and well before the
 * intro ends. What we defend picks the answer up from `window.__ftiWhere`.
 */
export const whereScript = `(function(){if(location.pathname!=="/"||window.__ftiWhere)return;window.__ftiWhere=fetch("/api/where",{cache:"no-store"}).then(function(r){return r.ok?r.json():{found:false}}).catch(function(){return{found:false}})})()`;
