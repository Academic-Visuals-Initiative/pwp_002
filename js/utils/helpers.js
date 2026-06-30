function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch(e) {}
}

function getPreferredTheme() {
    try {
        var stored = localStorage.getItem('theme');
        if (stored) return stored;
    } catch(e) {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'dark' : 'light');
}

function loadTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
              .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function nl2br(str) {
    if (!str) return '';
    return str.replace(/\n/g, '<br>');
}

function formatText(str) {
    if (!str) return '';
    return str.replace(/`([^`]+)`/g, '<code>$1</code>')
              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function customIcon(name, alt, size) {
    if (!name) return '';
    size = size || 20;
    return '<img class="ci-icon" src="assets/icons/your custom icons/' + encodeURI(name) + '.svg" alt="' + escapeHTML(alt || '') + '" width="' + size + '" height="' + size + '">';
}

document.addEventListener('click', function(e) {
    var toggle = e.target.closest('[data-toggle-theme]');
    if (toggle) {
        e.preventDefault();
        toggleTheme();
    }
});
