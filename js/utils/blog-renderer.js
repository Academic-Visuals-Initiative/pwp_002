function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function imgPath(src) {
    if (!src || src.indexOf('http') === 0 || src.indexOf('//') === 0) return src;
    var prefix = typeof IMG_PREFIX !== 'undefined' ? IMG_PREFIX : '';
    return prefix + src;
}

function renderBlogCard(post, link) {
    var imgHtml = post.image ? '<div class="blog-card-image"><img src="' + imgPath(post.image) + '" alt="' + escapeHTML(post.title) + '" width="600" height="400" loading="lazy"></div>' : '';
    return '<a href="' + (link || '#') + '" class="blog-card">' +
        imgHtml +
        '<div class="blog-card-body">' +
            '<div class="blog-card-meta">' + formatDate(post.date) + '</div>' +
            '<h3>' + escapeHTML(post.title) + '</h3>' +
            (post.excerpt ? '<p>' + escapeHTML(post.excerpt) + '</p>' : '') +
            '<span class="blog-card-footer">Read more</span>' +
        '</div>' +
    '</a>';
}

function initBlogPreview(containerId, posts, count, readMoreUrl) {
    var container = document.getElementById(containerId);
    if (!container || !posts || !posts.length) return;
    var html = '';
    for (var i = 0; i < Math.min(count, posts.length); i++) {
        html += renderBlogCard(posts[i], readMoreUrl + '?post=' + posts[i].id);
    }
    container.innerHTML = html;
}
