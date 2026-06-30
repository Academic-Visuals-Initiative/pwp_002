(function() {
    'use strict';

    var app = document.getElementById('app');
    var sectionIds = [];

    function init() {
        loadTheme();
        fetchJSON('data/site.json').then(function(siteData) {
            buildNav(siteData);
            buildFooter(siteData);
            var sections = siteData.sections || [];

            var fetchTasks = [];
            sections.forEach(function(sectionConfig) {
                if (sectionConfig.enabled === false) { fetchTasks.push(null); return; }
                var sectionPath = sectionConfig.file.indexOf('/') >= 0 ? sectionConfig.file : 'data/' + sectionConfig.file;
                fetchTasks.push(
                    fetchJSON(sectionPath).catch(function(err) {
                        console.warn('Skipped section:', sectionConfig.file, err.message);
                        return null;
                    })
                );
            });

            return Promise.all(fetchTasks).then(function(results) {
                var htmlBuffer = [];
                results.forEach(function(sectionData) {
                    if (!sectionData) return;
                    var render = renderers[sectionData.type];
                    if (render) {
                        htmlBuffer.push(render(sectionData));
                        sectionIds.push(sectionData.id);
                    }
                });
                app.innerHTML = htmlBuffer.join('');
            }).then(function() {
                initHamburger();
                initAccordion();
                initCVButton(siteData);
                initAnalytics(siteData);
                initBackToTop();
                fetchJSON('data/contact.json').then(function(c) {
                    initContactForm(c.emailjs || null);
                });
                initScrollSpy();
                showFooter();
                idleInitLeaves();
                initBlog(siteData);
            });
        }).catch(function(err) {
            app.innerHTML = '<p style="padding:4rem;text-align:center;color:var(--text-muted);">Failed to load site data.</p>';
            console.error(err);
        });
    }

    function fetchJSON(path) {
        return fetch(path).then(function(r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        });
    }

    function buildNav(siteData) {
        var navLinks = document.querySelector('.nav-links');
        var mobileNavLinks = document.querySelector('.mobile-nav-links');
        var logo = document.querySelector('.nav-logo');
        if (logo) logo.textContent = siteData.name || '';
        if (siteData.title) document.title = siteData.title;
        if (siteData.favicon) {
            var link = document.createElement('link');
            link.rel = 'icon';
            link.href = siteData.favicon;
            document.head.appendChild(link);
        }
        if (navLinks) {
            var listWrap = document.createElement('div');
            listWrap.className = 'nav-links-list';
            (siteData.sections || []).forEach(function(s) {
                if (s.nav && s.nav.show && s.enabled !== false) {
                    var a = document.createElement('a');
                    a.href = '#' + s.id;
                    a.textContent = s.nav.label || s.id;
                    listWrap.appendChild(a);
                }
            });
            navLinks.insertBefore(listWrap, navLinks.querySelector('.nav-mobile-actions'));
        }
        if (mobileNavLinks) {
            var mFrag = document.createDocumentFragment();
            (siteData.sections || []).forEach(function(s) {
                if (s.nav && s.nav.show && s.enabled !== false) {
                    var a = document.createElement('a');
                    a.href = '#' + s.id;
                    a.textContent = s.nav.label || s.id;
                    mFrag.appendChild(a);
                }
            });
            mobileNavLinks.innerHTML = '';
            mobileNavLinks.appendChild(mFrag);
        }
    }

    function buildFooter(siteData) {
        var footer = document.querySelector('.site-footer');
        if (!footer) return;
        var footerLeft = footer.querySelector('.footer-left');
        var footerRight = footer.querySelector('.footer-right');
        var f = siteData.footer;
        if (!f) return;
        if (footerLeft) footerLeft.textContent = f.name || '';
        if (footerRight && f.links) {
            footerRight.innerHTML = '';
            f.links.forEach(function(link) {
                var el = document.createElement('a');
                el.href = link.url || '#';
                el.textContent = link.label || '';
                footerRight.appendChild(el);
            });
        }
    }

    function showFooter() {
        var footer = document.querySelector('.site-footer');
        if (footer) footer.style.display = '';
        var credit = document.querySelector('.avi-credit');
        if (credit) credit.style.display = '';
    }

    function initCVButton(siteData) {
        var cv = siteData.cv;
        if (!cv || !cv.enabled) {
            document.querySelectorAll('.nav-cv-btn').forEach(function(el) { el.style.display = 'none'; });
            return;
        }
        var buttons = document.querySelectorAll('.nav-cv-btn');
        buttons.forEach(function(btn) {
            btn.style.display = '';
            var mode = cv.mode || 'view';
            var label = cv.labels && cv.labels[mode] ? cv.labels[mode] : 'CV';
            btn.textContent = label;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                if (mode === 'view' && cv.viewer) {
                    window.open(cv.viewer + '?url=' + encodeURIComponent('../' + cv.path), '_blank');
                } else if (mode === 'download') {
                    var a = document.createElement('a');
                    a.href = cv.path;
                    a.download = 'cv.pdf';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } else if (mode === 'external' && cv.external_url) {
                    window.open(cv.external_url, '_blank');
                }
            });
        });
    }

    function initHamburger() {
        var btn = document.getElementById('hamburgerBtn');
        var nav = document.getElementById('navLinks');
        var closeBtn = document.getElementById('mobileCloseBtn');
        if (!btn || !nav) return;
        btn.addEventListener('click', function() {
            nav.classList.add('open');
        });
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                nav.classList.remove('open');
            });
        }
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                nav.classList.remove('open');
            }
        });
    }

    function initAnalytics(siteData) {
        var id = siteData.google_analytics_id;
        if (!id) return;
        var s1 = document.createElement('script');
        s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
        s1.async = true;
        document.head.appendChild(s1);
        var s2 = document.createElement('script');
        s2.textContent = 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","' + id + '");';
        document.head.appendChild(s2);
    }

    function initAccordion() {
        var root = document.getElementById('educationAccordion');
        if (!root) return;
        var firstHeader = root.querySelector('.accordion-header');
        var firstContent = root.querySelector('.accordion-content');
        if (firstHeader) firstHeader.classList.add('active');
        if (firstContent) firstContent.classList.add('open');

        root.addEventListener('click', function(e) {
            var header = e.target.closest('.accordion-header');
            if (!header) return;
            var content = header.nextElementSibling;
            if (!content || !content.classList.contains('accordion-content')) return;

            var wasOpen = content.classList.contains('open');
            root.querySelectorAll('.accordion-content').forEach(function(c) { c.classList.remove('open'); });
            root.querySelectorAll('.accordion-header').forEach(function(h) { h.classList.remove('active'); });

            if (!wasOpen) {
                header.classList.add('active');
                content.classList.add('open');
            }
        });
    }

    function initBackToTop() {
        var btn = document.getElementById('scrollTopBtn');
        if (btn) {
            btn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    function initContactForm(emailjsConfig) {
        var form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = 'Sending...';
            btn.disabled = true;

            if (!emailjsConfig || !emailjsConfig.service_id || !emailjsConfig.template_id) {
                btn.textContent = '✓ Sent (offline)';
                setTimeout(function() { btn.textContent = originalText; btn.disabled = false; }, 2000);
                form.reset();
                return;
            }
            if (typeof emailjs === 'undefined') {
                btn.textContent = '✗ Service unavailable';
                setTimeout(function() { btn.textContent = originalText; btn.disabled = false; }, 2000);
                return;
            }
            var templateParams = {
                from_name: form.from_name.value,
                from_email: form.from_email.value,
                subject: form.subject ? form.subject.value : '',
                message: form.message.value
            };
            emailjs.send(emailjsConfig.service_id, emailjsConfig.template_id, templateParams, emailjsConfig.public_key)
                .then(function() {
                    btn.textContent = '✓ Sent!';
                    form.reset();
                }, function() {
                    btn.textContent = '✗ Failed';
                })
                .finally(function() {
                    setTimeout(function() { btn.textContent = originalText; btn.disabled = false; }, 2500);
                });
        });
    }

    function initScrollSpy() {
        var navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        if (navLinks.length === 0) return;

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.id;
                    navLinks.forEach(function(a) {
                        a.classList.remove('active');
                        if (a.getAttribute('href') === '#' + id) {
                            a.classList.add('active');
                        }
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });

        sectionIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) observer.observe(el);
        });
    }

    function idleInitLeaves() {
        var idle = window.requestIdleCallback || function(cb) { return setTimeout(cb, 2000); };
        idle(function() { initLeaves(); }, { timeout: 3000 });
    }

    function initLeaves() {
        if (window.innerWidth <= 768) return;
        var canvas = document.getElementById('leaves-canvas');
        if (!canvas) return;
        if (!('requestAnimationFrame' in window)) return;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        var W, H;
        var leaves = [];
        var leafCount = 25;
        var leafColors = ['#4A8FD4', '#5BA3E8', '#3B7DD8', '#6DB5F0', '#2E6FC7', '#7CB8E8', '#5599D4'];
        var running = true;
        var lastTime = 0;
        var tick = 0;

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            reset();
        }

        function Leaf() {
            this.reset = function() {
                this.x = Math.random() * W;
                this.y = -30;
                this.size = Math.random() * 7 + 5;
                this.speedY = Math.random() * 0.5 + 0.3;
                this.speedX = Math.random() * 0.3 + 0.15;
                this.angle = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.015;
                this.wobble = Math.random() * 100;
                this.color = leafColors[Math.floor(Math.random() * leafColors.length)];
            };
            this.reset();
            this.y = Math.random() * H;

            this.update = function() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * 0.008 + this.wobble) * 0.25;
                this.angle += this.rotSpeed;
                if (this.y > H + 30 || this.x > W + 30) this.reset();
            };

            this.draw = function() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(this.size * 0.6, -this.size * 0.3, this.size * 0.2, this.size);
                ctx.quadraticCurveTo(-this.size * 0.6, -this.size * 0.3, 0, -this.size);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.globalAlpha = 0.25;
                ctx.fill();
                ctx.restore();
                ctx.globalAlpha = 1;
            };
        }

        function reset() {
            leaves = [];
            for (var i = 0; i < leafCount; i++) leaves.push(new Leaf());
        }

        function animate(now) {
            if (!running) return;
            tick++;
            if (tick % 3 !== 0) { requestAnimationFrame(animate); return; }
            ctx.clearRect(0, 0, W, H);
            for (var i = 0; i < leaves.length; i++) { leaves[i].update(); leaves[i].draw(); }
            requestAnimationFrame(animate);
        }

        document.addEventListener('visibilitychange', function() {
            running = !document.hidden;
            if (running) { requestAnimationFrame(animate); }
        });

        window.addEventListener('resize', resize);
        resize();
        requestAnimationFrame(animate);
    }

    function initBlog(siteData) {
        var sections = siteData.sections || [];
        sections.forEach(function(s) {
            if (s.file.indexOf('blog') !== -1 && s.enabled !== false) {
                var blogPath = s.file.indexOf('/') >= 0 ? s.file : 'data/' + s.file;
                fetchJSON(blogPath).then(function(blogData) {
                    if (blogData && blogData.data && blogData.data.manifest) {
                        fetchJSON(blogData.data.manifest).then(function(manifest) {
                            var posts = (manifest.posts || []).filter(function(p) { return !p.hide; });
                            if (typeof initBlogPreview === 'function') {
                                var featured = posts.filter(function(p) { return p.featured; });
                                initBlogPreview('blogPostPreview', featured.length ? featured : posts, blogData.data.preview_count || 3, blogData.data.read_more_url || 'pages/blog.html');
                            }
                        });
                    }
                }).catch(function(err) {
                    console.warn('Blog preview failed:', err.message);
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
