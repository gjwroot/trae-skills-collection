/**
 * News Aggregator - Frontend Application
 */
(function () {
    'use strict';

    // === State ===
    let currentView = localStorage.getItem('newsView') || 'card';
    let currentCategory = 'all';
    let currentSearch = '';
    let articles = [];
    let categoryCounts = {};

    // === DOM Elements ===
    const newsContainer = document.getElementById('newsContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const searchInput = document.getElementById('searchInput');
    const categoryTabs = document.getElementById('categoryTabs');
    const viewSwitcher = document.getElementById('viewSwitcher');
    const themeToggle = document.getElementById('themeToggle');
    const refreshBtn = document.getElementById('refreshBtn');
    const statsBar = document.getElementById('statsBar');
    const totalCountEl = document.getElementById('totalCount');

    // === Init ===
    function init() {
        initTheme();
        initView();
        bindEvents();
        fetchNews();
    }

    // === Theme ===
    function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        if (next === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', next);
    }

    // === View ===
    function initView() {
        document.querySelectorAll('.view-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.view === currentView);
        });
    }

    function setView(view) {
        currentView = view;
        localStorage.setItem('newsView', view);
        document.querySelectorAll('.view-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        renderArticles();
    }

    // === Data Fetching ===
    function fetchNews() {
        showLoading();
        var params = new URLSearchParams();
        if (currentCategory !== 'all') params.set('category', currentCategory);
        if (currentSearch) params.set('search', currentSearch);

        fetch('/api/news?' + params.toString())
            .then(function (r) { return r.json(); })
            .then(function (data) {
                articles = data.articles || [];
                categoryCounts = data.category_counts || {};
                updateStats(data.total || 0);
                renderArticles();
            })
            .catch(function (err) {
                console.error('Fetch error:', err);
                newsContainer.innerHTML = '<div class="empty-state"><h3>加载失败</h3><p>请检查服务器是否运行，或先运行 python src/main.py 抓取数据</p></div>';
            });
    }

    function showLoading() {
        newsContainer.innerHTML = '<div class="loading">正在加载新闻...</div>';
    }

    function updateStats(total) {
        var catText = currentCategory === 'all' ? '全部分类' : currentCategory;
        totalCountEl.textContent = '共 ' + articles.length + ' 条新闻' +
            (currentSearch ? ' (搜索: "' + currentSearch + '")' : '');
    }

    // === Rendering ===
    function renderArticles() {
        if (articles.length === 0) {
            newsContainer.innerHTML = '<div class="empty-state"><h3>暂无新闻</h3><p>请先运行 python src/main.py 抓取数据</p></div>';
            return;
        }

        switch (currentView) {
            case 'card':
                renderCardView();
                break;
            case 'list':
                renderListView();
                break;
            case 'magazine':
                renderMagazineView();
                break;
            default:
                renderCardView();
        }
    }

    function scoreClass(score) {
        if (score >= 6) return 'high';
        if (score >= 4) return 'mid';
        return 'low';
    }

    function formatTime(t) {
        if (!t) return '';
        try {
            var d = new Date(t);
            if (isNaN(d.getTime())) return '';
            var now = new Date();
            var diff = (now - d) / 1000;
            if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
            if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
            if (diff < 604800) return Math.floor(diff / 86400) + ' 天前';
            return d.toLocaleDateString('zh-CN');
        } catch (e) {
            return '';
        }
    }

    function escapeHtml(s) {
        if (!s) return '';
        var div = document.createElement('div');
        div.textContent = s;
        return div.innerHTML;
    }

    function truncate(s, len) {
        if (!s) return '';
        return s.length > len ? s.substring(0, len) + '...' : s;
    }

    // === Card View ===
    function renderCardView() {
        var html = '<div class="card-grid">';
        articles.forEach(function (a) {
            var sc = a.ai_score || 0;
            var title = escapeHtml(a.title);
            var summary = escapeHtml(truncate(a.summary, 150));
            var source = escapeHtml(a.source);
            var time = formatTime(a.published_at);
            var link = a.link ? escapeHtml(a.link) : '#';
            var cat = a.category || 'society';

            html += '<div class="news-card">' +
                '<div class="card-header">' +
                    '<div class="card-title"><a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></div>' +
                    '<span class="score-badge ' + scoreClass(sc) + '">' + sc.toFixed(1) + '</span>' +
                '</div>';
            if (summary) {
                html += '<div class="card-summary">' + summary + '</div>';
            }
            html += '<div class="card-meta">' +
                    '<span class="meta-source">' + source + '</span>' +
                    '<span class="meta-category">' + cat + '</span>';
            if (time) {
                html += '<span class="meta-time">' + time + '</span>';
            }
            html += '</div></div>';
        });
        html += '</div>';
        newsContainer.innerHTML = html;
    }

    // === List View ===
    function renderListView() {
        var html = '<div class="list-view">';
        articles.forEach(function (a) {
            var sc = a.ai_score || 0;
            var title = escapeHtml(a.title);
            var source = escapeHtml(a.source);
            var time = formatTime(a.published_at);
            var link = a.link ? escapeHtml(a.link) : '#';

            html += '<div class="list-item">' +
                '<div class="list-score ' + scoreClass(sc) + '">' + sc.toFixed(1) + '</div>' +
                '<div class="list-title"><a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></div>' +
                '<div class="list-source">' + source + '</div>' +
                '<div class="list-time">' + time + '</div>' +
                '</div>';
        });
        html += '</div>';
        newsContainer.innerHTML = html;
    }

    // === Magazine View ===
    function renderMagazineView() {
        if (articles.length === 0) return;

        var hero = articles[0];
        var rest = articles.slice(1);
        var sc = hero.ai_score || 0;
        var title = escapeHtml(hero.title);
        var summary = escapeHtml(truncate(hero.summary, 300));
        var source = escapeHtml(hero.source);
        var time = formatTime(hero.published_at);
        var link = hero.link ? escapeHtml(hero.link) : '#';

        var html = '<div class="magazine-view">';

        // Hero card
        html += '<div class="magazine-hero">' +
            '<div class="hero-title"><a href="' + link + '" target="_blank" rel="noopener">' + title + '</a></div>';
        if (summary) {
            html += '<div class="hero-summary">' + summary + '</div>';
        }
        html += '<div class="hero-meta">' +
                '<span class="meta-source">' + source + '</span>' +
                '<span class="score-badge ' + scoreClass(sc) + '">' + sc.toFixed(1) + '</span>';
        if (time) {
            html += '<span class="meta-time">' + time + '</span>';
        }
        html += '</div></div>';

        // Grid
        if (rest.length > 0) {
            html += '<div class="magazine-grid">';
            rest.forEach(function (a) {
                var sc2 = a.ai_score || 0;
                var t2 = escapeHtml(a.title);
                var s2 = escapeHtml(truncate(a.summary, 120));
                var src2 = escapeHtml(a.source);
                var time2 = formatTime(a.published_at);
                var link2 = a.link ? escapeHtml(a.link) : '#';

                html += '<div class="magazine-card">' +
                    '<div class="mag-title"><a href="' + link2 + '" target="_blank" rel="noopener">' + t2 + '</a></div>';
                if (s2) {
                    html += '<div class="mag-summary">' + s2 + '</div>';
                }
                html += '<div class="mag-meta">' +
                        '<span class="meta-source">' + src2 + '</span>' +
                        '<span class="score-badge ' + scoreClass(sc2) + '">' + sc2.toFixed(1) + '</span>';
                if (time2) {
                    html += '<span class="meta-time">' + time2 + '</span>';
                }
                html += '</div></div>';
            });
            html += '</div>';
        }

        html += '</div>';
        newsContainer.innerHTML = html;
    }

    // === Event Binding ===
    function bindEvents() {
        // View switcher
        viewSwitcher.addEventListener('click', function (e) {
            var btn = e.target.closest('.view-btn');
            if (btn && btn.dataset.view) {
                setView(btn.dataset.view);
            }
        });

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Category tabs
        categoryTabs.addEventListener('click', function (e) {
            var tab = e.target.closest('.cat-tab');
            if (tab) {
                currentCategory = tab.dataset.category;
                document.querySelectorAll('.cat-tab').forEach(function (t) {
                    t.classList.toggle('active', t.dataset.category === currentCategory);
                });
                fetchNews();
            }
        });

        // Search
        var searchTimer;
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(function () {
                currentSearch = searchInput.value.trim();
                fetchNews();
            }, 400);
        });

        // Refresh
        refreshBtn.addEventListener('click', function () {
            refreshBtn.classList.add('spinning');
            fetch('/api/refresh', { method: 'POST' })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    setTimeout(function () {
                        refreshBtn.classList.remove('spinning');
                        fetchNews();
                    }, 3000);
                })
                .catch(function () {
                    refreshBtn.classList.remove('spinning');
                });
        });
    }

    // === Start ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
