# Sphinx configuration for Field Stack Robotics
# Docs: https://www.sphinx-doc.org/en/master/usage/configuration.html

project = "Field Stack Robotics"
author = "Oguzhan Gurbuz"
copyright = "2026, Oguzhan Gurbuz"

extensions = [
    "myst_parser",  # write pages in Markdown (.md)
    "sphinx_design",  # cards and grids on the home page
    "sphinx_sitemap",  # writes sitemap.xml for Google Search Console
]

# Markdown extras: :::{note} blocks, heading anchors, etc.
myst_enable_extensions = ["colon_fence", "deflist", "html_image"]
myst_heading_anchors = 3

source_suffix = {".rst": "restructuredtext", ".md": "markdown"}
exclude_patterns = ["_build", "_snippets"]

# --- Look and feel: PyData Sphinx Theme (the one Jupyter, NumPy and pandas use) ---
html_theme = "pydata_sphinx_theme"
html_title = "Field Stack Robotics"
html_static_path = ["_static"]
templates_path = ["_templates"]
html_js_files = ["github-stats.js", "imu-widget.js", "sidebar-state.js", "theme-toggle.js", "heading-chart.js", "giscus-theme.js"]  # GitHub box numbers, home page IMU animation, left sidebar open/closed sections, light/dark button, heading error chart, comments light/dark
html_css_files = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "custom.css",  # turquoise colors live here
]

# GitHub organization and repository that hold this site.
GITHUB_USER = "field-stack-robotics"
GITHUB_REPO = "fieldstackrobotics.com"
# Shown in the GitHub box in the top bar. "owner/repo" shows stars and forks;
# an organization name alone shows its public repo count.
GITHUB_BOX_REPO = "field-stack-robotics"

html_favicon = "_static/favicon.svg"

# --- Search engines: sitemap.xml and "coming soon" pages ---
# The site's public address. sphinx-sitemap uses it to build full links.
html_baseurl = "https://fieldstackrobotics.com/"
sitemap_url_scheme = "{link}"
html_extra_path = ["_extra"]  # robots.txt goes to the site root

# A page is "coming soon" while it still holds the placeholder note.
# These pages get a noindex tag (see _templates/layout.html) and stay out of
# sitemap.xml. Once a post is written and the note is gone, it is indexed
# automatically, nothing to change here.
from pathlib import Path as _Path

_DOCS = _Path(__file__).parent
COMING_SOON_PAGES = sorted(
    str(f.relative_to(_DOCS).with_suffix("")).replace("\\", "/")
    for f in _DOCS.rglob("*.md")
    if "_build" not in f.parts and "_snippets" not in f.parts
    and "This post is coming soon" in f.read_text(encoding="utf-8")
)
sitemap_excludes = [f"{page}.html" for page in COMING_SOON_PAGES] + ["search.html", "genindex.html"]

html_theme_options = {
    "logo": {
        # Dark text on the white top bar, light text on the dark one
        "image_light": "_static/logo-light.svg",
        "image_dark": "_static/logo-dark.svg",
        "alt_text": "Field Stack Robotics - Home",
    },
    # Thin bar above the top bar on every page. Delete this line to hide it.
    "announcement": 'Model 1, the Field Stack indoor robot kit, is in the works. <a href="/robots/index.html">See all four robots →</a>',
    "navbar_align": "left",
    "header_links_before_dropdown": 10,  # show every section, no "More" menu
    "navbar_center": ["navbar-nav-home"],  # section links with "Home" in front
    "navbar_end": ["theme-switcher", "navbar-github", "navbar-icon-links"],
    "navbar_persistent": [],  # search lives at the top of the left sidebar
    # Right sidebar: card on top, then "On this page"
    # The robots page has no right sidebar, so its four cards get the full width.
    "secondary_sidebar_items": {"**": ["sidebar-card", "page-toc", "edit-this-page"], "robots/index": []},
    "show_toc_level": 2,
    # Left sidebar: every section starts open, with its pages listed underneath (like docs.nav2.org)
    "show_nav_level": 2,
    "navigation_depth": 3,
    "use_edit_page_button": True,
    "icon_links": [
        {
            "name": "YouTube",
            "url": "https://www.youtube.com/",  # your channel
            "icon": "fa-brands fa-youtube",
        },
    ],
    "article_footer_items": ["giscus"],  # comments under every page except home (_templates/giscus.html)
    "footer_start": ["copyright"],
    "footer_end": ["sphinx-version"],
}

# Used by the "Edit on GitHub" button.
html_context = {
    "github_box_repo": GITHUB_BOX_REPO,
    "github_user": GITHUB_USER,
    "github_repo": GITHUB_REPO,
    "github_version": "main",
    "doc_path": "docs",
    "default_mode": "light",  # start in light mode; the button toggles light <-> dark (theme-toggle.js)
    "coming_soon_pages": COMING_SOON_PAGES,  # these get a noindex tag (_templates/layout.html)
}

# Same left sidebar on every page, home page included: the whole site, one page under another.
html_sidebars = {"**": ["search-field", "sidebar-nav-full"]}

# Hide the "Show Source" box in the right sidebar.
html_show_sourcelink = False
