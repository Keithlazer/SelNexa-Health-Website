// One-time helper: visit https://www.selnexahealth.com/?clear-sw=1 to run
// This script will unregister service workers and delete caches, then reload.
(function(){
    try {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        if (!params.has('clear-sw')) return; // only run when requested

        async function clearAll() {
            if ('serviceWorker' in navigator) {
                const regs = await navigator.serviceWorker.getRegistrations().catch(()=>[]);
                await Promise.all(regs.map(r=>r.unregister().catch(()=>false)));
            }
            if ('caches' in window) {
                const keys = await caches.keys().catch(()=>[]);
                await Promise.all(keys.map(k=>caches.delete(k).catch(()=>false)));
            }
            try { localStorage.clear(); sessionStorage.clear(); } catch(e){}
            // add a short delay then reload to fetch fresh assets
            setTimeout(()=>{
                // append a timestamp to bust any lingering intermediate caches
                const url = new URL(window.location.href);
                url.searchParams.set('cleared', Date.now());
                url.searchParams.delete('clear-sw');
                window.location.replace(url.toString());
            }, 500);
        }

        clearAll();
    } catch (e) {
        // fail silently
        console.error('clear-sw helper failed', e);
    }
})();
