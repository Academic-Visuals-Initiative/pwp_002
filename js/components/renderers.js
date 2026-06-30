var renderers = {};

renderers.hero = function(data) {
    var d = data.data;
    var imgHtml = d.image
        ? '<div class="hero-image-wrapper"><img src="' + escapeHTML(d.image) + '" alt="' + escapeHTML(d.alt || '') + '" width="800" height="600" fetchpriority="high"></div>'
        : '';
    var nameParts = d.name.split(' ');
    var nameFirst = nameParts[0] || '';
    var nameRest = nameParts.slice(1).join(' ') || '';
    return '<section class="page-section" id="' + data.id + '">' +
        '<div class="hero-layout">' +
            '<div class="hero-text">' +
                (d.badge ? '<div class="badge">' + escapeHTML(d.badge) + '</div>' : '') +
                '<h1>' + escapeHTML(nameFirst) + ' <span>' + escapeHTML(nameRest || d.accent || '') + '</span></h1>' +
                (d.tagline ? '<p class="tagline">' + escapeHTML(d.tagline) + '</p>' : '') +
                (d.description ? '<p class="description">' + escapeHTML(d.description) + '</p>' : '') +
            '</div>' +
            imgHtml +
        '</div>' +
    '</section>';
};

renderers.about = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var paras = '';
    if (d.paragraphs) {
        d.paragraphs.forEach(function(p) {
            paras += '<p>' + escapeHTML(p) + '</p>';
        });
    }
    var skillsHtml = '';
    if (d.skills && d.skills.length) {
        skillsHtml = '<div class="skills-list">';
        d.skills.forEach(function(group) {
            skillsHtml += '<div class="skill-group">';
            if (group.category) {
                skillsHtml += '<span class="skill-category">' + escapeHTML(group.category) + '</span>';
            }
            if (group.items) {
                skillsHtml += '<div class="skill-tags">';
                group.items.forEach(function(item) {
                    skillsHtml += '<span class="skill-tag">' + escapeHTML(item) + '</span>';
                });
                skillsHtml += '</div>';
            }
            skillsHtml += '</div>';
        });
        skillsHtml += '</div>';
    }
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="about-layout">' +
            '<div class="about-paragraphs">' + paras + skillsHtml + '</div>' +
        '</div>' +
    '</section>';
};

renderers.education = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var items = '';
    if (d.items) {
        d.items.forEach(function(item) {
            var highlights = '';
            if (item.highlights && item.highlights.length) {
                highlights = '<div class="info-block">' +
                    '<div class="block-label">' + escapeHTML(item.highlights_label || 'Highlights') + '</div>' +
                    '<ul>' + item.highlights.map(function(h) { return '<li>' + escapeHTML(h) + '</li>'; }).join('') + '</ul>' +
                '</div>';
            }
            var specsHtml = '';
            if (item.specs && item.specs.length) {
                specsHtml = '<div class="specs-grid">';
                item.specs.forEach(function(s) {
                    specsHtml += '<div class="spec-row">' +
                        '<strong>' + escapeHTML(s.key) + '</strong>' +
                        '<span>' + nl2br(escapeHTML(s.val)) + '</span>' +
                    '</div>';
                });
                specsHtml += '</div>';
            }
            var linkHtml = '';
            if (item.link && item.link.url) {
                linkHtml = '<a href="' + item.link.url + '" target="_blank" class="timeline-link">' +
                    escapeHTML(item.link.text) + '</a>';
            }
            items += '<div class="accordion-item">' +
                '<button class="accordion-header" data-id="' + escapeHTML(item.id) + '">' +
                    escapeHTML(item.tab_num || '') +
                '</button>' +
                '<div class="accordion-content">' +
                    '<div class="meta-tag">' + escapeHTML(item.tab_meta || '') + '</div>' +
                    '<h3>' + escapeHTML(item.title) + '</h3>' +
                    '<h4>' + escapeHTML(item.institution) + '</h4>' +
                    (item.date ? '<div class="accordion-date">' + escapeHTML(item.date) + '</div>' : '') +
                    highlights +
                    specsHtml +
                    linkHtml +
                '</div>' +
            '</div>';
        });
    }
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="education-layout">' +
            '<div>' +
                (d.description ? '<p class="timeline-description">' + escapeHTML(d.description) + '</p>' : '') +
            '</div>' +
            '<div class="timeline-display" id="educationAccordion">' + items + '</div>' +
        '</div>' +
    '</section>';
};

renderers.publications = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var featuredHtml = '';
    if (d.featured && d.featured.length) {
        d.featured.forEach(function(pub) {
            var paras = '';
            if (pub.paragraphs) {
                pub.paragraphs.forEach(function(p) {
                    paras += '<p>' + escapeHTML(p) + '</p>';
                });
            }
            var tags = '';
            if (pub.tags && pub.tags.length) {
                tags = '<div class="tag-row">' + pub.tags.map(function(t) {
                    return '<span class="tag">' + escapeHTML(t) + '</span>';
                }).join('') + '</div>';
            }
            var links = '';
            if (pub.links) {
                links = pub.links.map(function(l) {
                    var downloadAttr = l.download ? ' download' : '';
                    var infoHtml = l.info ? '<span class="info-lbl">' + escapeHTML(l.info) + '</span>' : '';
                    return '<a href="' + l.url + '" class="pub-link-item"' + downloadAttr + ' target="_blank">' +
                        '<span class="label-group">' + customIcon(l.icon || 'article') + '<span>' + escapeHTML(l.label) + '</span></span>' +
                        infoHtml +
                    '</a>';
                }).join('');
            }
            var hasImage = !!pub.image;
            var imgHtml = hasImage
                ? '<div class="pub-img-container"><img src="' + pub.image + '" alt="' + escapeHTML(pub.alt || pub.title) + '" width="800" height="600" loading="lazy"></div>'
                : '';
            var noImgClass = hasImage ? '' : ' featured-pub--no-image';
            var journalHtml = pub.journal ? '<div class="journal-label">' + escapeHTML(pub.journal) + '</div>' : '';
            featuredHtml += '<div class="featured-pub' + noImgClass + '">' +
                imgHtml +
                '<div class="pub-info">' +
                    '<div>' + tags +
                        journalHtml +
                        '<h3>' + escapeHTML(pub.title) + '</h3>' +
                        '<div class="authors">' + escapeHTML(pub.authors) + '</div>' +
                        '<div class="paragraphs-stack">' + paras + '</div>' +
                    '</div>' +
                    (links ? '<div class="links-stack">' + links + '</div>' : '') +
                '</div>' +
            '</div>';
        });
    }
    var itemsHtml = '';
    if (d.items && d.items.length) {
        itemsHtml = '<div class="items-list">';
        d.items.forEach(function(pub) {
            var pubTags = '';
            if (pub.tags && pub.tags.length) {
                pubTags = '<div class="tags">' + pub.tags.map(function(t) {
                    return '<span>' + escapeHTML(t) + '</span>';
                }).join('') + '</div>';
            }
            var links = '';
            if (pub.links) {
                links = pub.links.map(function(l) {
                    var downloadAttr = l.download ? ' download' : '';
                    var iconHtml = l.icon ? customIcon(l.icon) : '';
                    return '<a href="' + l.url + '"' + downloadAttr + '>' + iconHtml + escapeHTML(l.label) + '</a>';
                }).join('');
            }
            var journalHtml = pub.journal ? '<div class="journal-label">' + escapeHTML(pub.journal) + '</div>' : '';
            var itemImgHtml = pub.image ? '<div class="item-card-image"><img src="' + pub.image + '" alt="' + escapeHTML(pub.alt || pub.title) + '" width="600" height="400" loading="lazy"></div>' : '';
            itemsHtml += '<div class="item-card">' +
                pubTags +
                journalHtml +
                '<h4>' + escapeHTML(pub.title) + '</h4>' +
                '<div class="authors">' + escapeHTML(pub.authors) + '</div>' +
                itemImgHtml +
                (pub.summary ? '<p>' + escapeHTML(pub.summary) + '</p>' : '') +
                (links ? '<div class="card-links">' + links + '</div>' : '') +
            '</div>';
        });
        itemsHtml += '</div>';
    }
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="publications-layout">' +
            (d.focus ? '<p class="publications-intro">' + escapeHTML(d.focus) + '</p>' : '') +
            featuredHtml +
            itemsHtml +
            (d.all_link ? '<div class="section-view-wrapper"><a href="' + d.all_link + '" target="_blank" class="section-view-link">' + escapeHTML(d.all_link_label || 'View all publications') + '</a></div>' : '') +
        '</div>' +
    '</section>';
};

renderers.projects = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var featuredHtml = '';
    if (d.featured && d.featured.length) {
        featuredHtml = '<div class="featured-projects-grid">';
        d.featured.forEach(function(proj) {
            var imgHtml = proj.image
                ? '<div class="proj-img"><img src="' + proj.image + '" alt="' + escapeHTML(proj.alt || proj.title) + '" width="800" height="600" loading="lazy"></div>'
                : '';
            var linkHtml = proj.url ? '<a href="' + proj.url + '" target="_blank" class="btn-action">' + escapeHTML(proj.btn_label || 'See details') + '</a>' : '';
            featuredHtml += '<div class="featured-card">' +
                imgHtml +
                (proj.status ? '<span class="status-badge">' + escapeHTML(proj.status) + '</span>' : '') +
                '<h3>' + escapeHTML(proj.title) + '</h3>' +
                (proj.description ? '<p>' + escapeHTML(proj.description) + '</p>' : '') +
                linkHtml +
            '</div>';
        });
        featuredHtml += '</div>';
    }
    var itemsHtml = '';
    if (d.items && d.items.length) {
        itemsHtml = '<div class="minor-projects-grid">';
        d.items.forEach(function(proj) {
            var linkHtml = proj.url ? '<a href="' + proj.url + '" target="_blank">' + escapeHTML(proj.btn_label || 'Details') + '</a>' : '';
            var itemImgHtml = proj.image ? '<div class="minor-card-image"><img src="' + proj.image + '" alt="' + escapeHTML(proj.alt || proj.title) + '" width="600" height="400" loading="lazy"></div>' : '';
            itemsHtml += '<div class="minor-card">' +
                (proj.status ? '<span class="status">' + escapeHTML(proj.status) + '</span>' : '') +
                itemImgHtml +
                '<h4>' + escapeHTML(proj.title) + '</h4>' +
                (proj.description ? '<p>' + escapeHTML(proj.description) + '</p>' : '') +
                linkHtml +
            '</div>';
        });
        itemsHtml += '</div>';
    }
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="projects-layout">' +
            (d.tagline ? '<p class="projects-intro">' + escapeHTML(d.tagline) + '</p>' : '') +
            featuredHtml +
            itemsHtml +
            (d.view_all && d.view_all.url ? '<div class="section-view-wrapper"><a href="' + d.view_all.url + '" target="_blank" class="section-view-link">' + escapeHTML(d.view_all.label || 'View all projects') + '</a></div>' : '') +
        '</div>' +
    '</section>';
};

renderers.contact = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var addressHtml = '';
    if (d.address && d.address.length) {
        addressHtml = d.address.map(function(line) {
            return escapeHTML(line);
        }).join('<br>');
    }
    var gi = d.google_icons || {};
    var lb = d.labels || {};
    var metaItems = '';
    if (d.email) {
        metaItems += '<div class="detail-row">' +
            customIcon(gi.email || 'mail', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.email || 'Email') + '</h5>' +
                '<a href="mailto:' + escapeHTML(d.email) + '">' + escapeHTML(d.email) + '</a>' +
            '</div>' +
        '</div>';
    }
    if (d.best_time_to_email) {
        metaItems += '<div class="detail-row">' +
            customIcon(gi.best_time_to_email || 'calender', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.best_time_to_email || 'Best time to email') + '</h5>' +
                '<span>' + nl2br(escapeHTML(d.best_time_to_email)) + '</span>' +
            '</div>' +
        '</div>';
    }
    if (d.phone) {
        metaItems += '<div class="detail-row">' +
            customIcon(gi.phone || 'phone', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.phone || 'Phone') + '</h5>' +
                '<span>' + escapeHTML(d.phone) + '</span>' +
            '</div>' +
        '</div>';
    }
    if (d.department || d.institution) {
        var affil = '';
        if (d.department) affil += d.department;
        if (d.institution) affil += (affil ? '\n' : '') + d.institution;
        metaItems += '<div class="detail-row">' +
            customIcon(gi.department || 'building', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.department || 'Affiliation') + '</h5>' +
                '<span>' + nl2br(escapeHTML(affil)) + '</span>' +
            '</div>' +
        '</div>';
    }
    if (d.active_hours) {
        var hours = d.active_hours.time || '';
        if (d.active_hours.note) hours = hours + '\n(' + d.active_hours.note + ')';
        metaItems += '<div class="detail-row">' +
            customIcon(gi.active_hours || 'clock', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.active_hours || 'Hours') + '</h5>' +
                '<span>' + nl2br(escapeHTML(hours)) + '</span>' +
            '</div>' +
        '</div>';
    }
    if (addressHtml) {
        metaItems += '<div class="detail-row">' +
            customIcon(gi.address || 'pin', '', 28) +
            '<div class="detail-content">' +
                '<h5>' + escapeHTML(lb.address || 'Address') + '</h5>' +
                '<span>' + addressHtml + '</span>' +
            '</div>' +
        '</div>';
    }
    var formHtml = '';
    if (d.right && d.right.form) {
        formHtml = '<form class="contact-form" id="contactForm">' +
            '<div class="form-group">' +
                '<label for="name">Your Name</label>' +
                '<input type="text" id="name" name="from_name" required placeholder="What should I call you?">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="email">Email Address</label>' +
                '<input type="email" id="email" name="from_email" required placeholder="How can I write back to you?">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="subject">Subject</label>' +
                '<input type="text" id="subject" name="subject" placeholder="What\'s this about?">' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="msg">Message</label>' +
                '<textarea id="msg" name="message" rows="5" required placeholder="Let\'s chat..."></textarea>' +
            '</div>' +
            '<button type="submit" class="submit-btn">' + escapeHTML(d.button || 'Send a Message') + '</button>' +
        '</form>';
    } else if (d.right && d.right.map) {
        formHtml = '<div class="contact-map">' +
            '<iframe src="' + escapeHTML(d.right.map) + '" width="100%" height="100%" style="border:0;min-height:400px;" allowfullscreen="" loading="lazy"></iframe>' +
        '</div>';
    } else if (d.right && d.right.image) {
        formHtml = '<div class="contact-image"><img src="' + escapeHTML(d.right.image) + '" alt="' + escapeHTML(d.right.image_alt || '') + '" style="width:100%;height:auto;display:block"></div>';
    }
    var socialsHtml = '';
    if (d.icons && d.icons.length) {
        socialsHtml = '<div class="socials-row">';
        d.icons.forEach(function(icon) {
            socialsHtml += '<a href="' + icon.url + '" target="_blank" title="' + escapeHTML(icon.label || '') + '">' +
                '<img src="assets/icons/academic social icons/' + icon.name + '.svg" alt="' + escapeHTML(icon.label || icon.name) + '" width="22" height="22">' +
            '</a>';
        });
        socialsHtml += '</div>';
    }
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="contact-layout">' +
            '<div class="contact-info">' +
                (d.message ? '<p class="message">' + escapeHTML(d.message) + '</p>' : '') +
                '<div class="contact-details">' + metaItems + '</div>' +
                socialsHtml +
            '</div>' +
            formHtml +
        '</div>' +
    '</section>';
};

renderers.blog = function(data) {
    var d = data.data;
    var heading = d.heading || '';
    var readMoreUrl = d.read_more_url || 'blog/blog.html';
    return '<section class="page-section" id="' + data.id + '">' +
        (d.heading_label ? '<div class="section-meta">' + escapeHTML(d.heading_label) + '</div>' : '') +
        '<h2 class="section-title">' + escapeHTML(heading) + '</h2>' +
        '<div class="blog-preview">' +
            (d.tagline ? '<p class="blog-preview-tagline">' + escapeHTML(d.tagline) + '</p>' : '') +
            '<div class="blog-cards" id="blogPostPreview"></div>' +
            '<div class="blog-preview-wrapper"><a href="' + readMoreUrl + '" class="blog-preview-link">' + escapeHTML(d.read_more || 'Read all posts') + '</a></div>' +
        '</div>' +
    '</section>';
};
