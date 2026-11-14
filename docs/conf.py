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
html_js_files = ["imu-widget.js", "sidebar-state.js", "theme-toggle.js", "heading-chart.js", "giscus-theme.js"]  # home page IMU animation, left sidebar open/closed sections, light/dark button, heading error chart, comments light/dark
html_css_files = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "custom.css",  # turquoise colors live here
]

# GitHub organization and repository that hold this site.
GITHUB_USER = "field-stack-robotics"
GITHUB_REPO = "fieldstackrobotics.com"
# The GitHub box in the top bar links here (an organization or "owner/repo").
GITHUB_BOX_REPO = "field-stack-robotics"
# Discord server invite, used by the Discord box in the top bar (_templates/navbar-discord.html).
DISCORD_INVITE = "https://discord.gg/NCBbzgu32"

html_favicon = "_static/favicon.svg"

# --- Search engines: sitemap.xml and "coming soon" pages ---
# The site's public address. sphinx-sitemap uses it to build full links.
html_baseurl = "https://fieldstackrobotics.com/"
sitemap_url_scheme = "{link}"
html_extra_path = ["_extra"]  # robots.txt goes to the site root

# --- Published pages and "coming soon" pages ---
# Only the pages listed here are shown in full. Every other page is built as a
# "coming soon" page: its title and first paragraph, a coming soon note and the
# email box. The draft text stays in the .md file but is not published anywhere
# (not on the page, not in search, not in Google).
# To publish a post when it's ready, add its path here (without .md).
PUBLISHED_PAGES = {
    "index",
    "about",
    "robots/index",
    "robots/model-1",
}

import re as _re
from pathlib import Path as _Path

_DOCS = _Path(__file__).parent
COMING_SOON_PAGES = sorted(
    page
    for page in (
        str(f.relative_to(_DOCS).with_suffix("")).replace("\\", "/")
        for f in _DOCS.rglob("*.md")
        if "_build" not in f.parts and "_snippets" not in f.parts
    )
    if page not in PUBLISHED_PAGES
)


def _coming_soon(app, docname, source):
    """Swap the body of an unpublished page for the coming soon version."""
    if docname in PUBLISHED_PAGES:
        return
    text = source[0]
    title = next((line for line in text.splitlines() if line.startswith("# ")), "# Coming soon")
    after_title = text.split(title, 1)[-1].strip()
    first_par = after_title.split("\n\n", 1)[0].strip() if after_title else ""
    if not first_par or first_par[0] in ":`<!|{[(-*#":
        first_par = ""  # only keep a plain-text intro
    # Keep the section's page list so the left sidebar still works
    toctrees = _re.findall(r"```\{toctree\}.*?```", text, flags=_re.S)
    source[0] = "\n\n".join(
        part for part in [
            title,
            first_par,
            '<div class="rln-soon"><span class="rln-soon__badge">Coming soon</span>'
            "<p>This post is being written. Model 1 is being built right now, "
            "and every step will be published here.</p></div>",
            "```{include} /_snippets/signup.md\n```",
            *toctrees,
        ] if part
    ) + "\n"


def setup(app):
    app.connect("source-read", _coming_soon)


sitemap_excludes = [f"{page}.html" for page in COMING_SOON_PAGES] + ["search.html", "genindex.html"]

html_theme_options = {
    "logo": {
        # Dark text on the white top bar, light text on the dark one
        "image_light": "_static/logo-stacked-light.svg",
        "image_dark": "_static/logo-stacked-dark.svg",
        "alt_text": "Field Stack Robotics - Home",
    },
    # Thin bar above the top bar on every page. Delete this line to hide it.
    "announcement": 'Model 1, the Field Stack indoor robot kit, is in the works. <a href="/robots/index.html">See all four robots →</a>',
    "navbar_align": "left",
    "navbar_center": ["navbar-nav-home"],  # Home, Robots, Start here, About & Contact (_templates/navbar-nav-home.html)
    "navbar_end": ["navbar-github", "navbar-discord", "theme-switcher"],  # light/dark button last (_templates/theme-switcher.html)
    "navbar_persistent": [],  # search lives at the top of the left sidebar
    # Right sidebar: card on top, then "On this page"
    # The robots page has no right sidebar, so its four cards get the full width.
    "secondary_sidebar_items": {"**": ["sidebar-card", "page-toc", "edit-this-page"], "robots/index": []},
    "show_toc_level": 2,
    # Left sidebar: every section starts open, with its pages listed underneath (like docs.nav2.org)
    "show_nav_level": 2,
    "navigation_depth": 3,
    "use_edit_page_button": True,
    "article_footer_items": ["giscus"],  # comments under every page except home (_templates/giscus.html)
    "footer_start": ["copyright"],
    "footer_end": ["sphinx-version"],
}

# Used by the "Edit on GitHub" button.
html_context = {
    "github_box_repo": GITHUB_BOX_REPO,
    "discord_invite": DISCORD_INVITE,
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
