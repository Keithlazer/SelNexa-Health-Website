// Simple include loader: replace [data-include="name"] with contents of /includes/name.html
(function(){
  async function loadInclude(el){
    const name = el.getAttribute('data-include');
    if (!name) return;
    try {
      const res = await fetch('/includes/' + name + '.html');
      if (!res.ok) throw new Error('Failed to load include: ' + name);
      const text = await res.text();
      el.innerHTML = text;
      // Optionally run any inline scripts inside the included HTML
      el.querySelectorAll('script').forEach((s)=>{ try{ eval(s.textContent); }catch(e){ console.warn('include script error', e); } });
    } catch (err) {
      console.error(err);
    }
  }

  function init(){
    document.querySelectorAll('[data-include]').forEach((el)=> loadInclude(el));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
