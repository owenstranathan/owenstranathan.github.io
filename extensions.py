
from datetime import date, datetime, timezone
import re

from __main__ import UserExtension, initializer
from feedgen.feed import FeedGenerator

class PageForPostExtension(UserExtension):
    @initializer
    def __init__(self, logger, working_dir, out_dir, site_data, jinja_env):
        pass

    def pre_render_post(self, name, post):
        name = name.strip(".md")
        regex = r'\d{4}-\d{2}-\d{2}-'
        datelessName = re.sub(regex, "", name)
        post.metadata["path"] = f"{post.metadata['date'].strftime('%Y')}/{post.metadata['date'].strftime('%m')}/{post.metadata['date'].strftime('%d')}/{datelessName.lower()}.html"
        post.metadata["link"] = f"{self.site_data['url']}/{post.metadata['path']}"

    def should_skip_template(self, name, template, posts):
        if name != "post.html":
            return False
        for name, post in posts.items():
            rendered = template.render(site=self.site_data, post=post, posts=list(posts.values()))
            out = self.out_dir / f"{post.metadata['path']}"
            if not out.parent.exists():
                out.parent.mkdir(parents=True)
            self.logger.info(f"Writing post rendered template to {out}")
            with out.open("w", encoding="utf-8") as outf:
                outf.write(rendered)
        return True

class FeedGeneratorExtension(UserExtension):
    @initializer
    def __init__(self, logger, working_dir, out_dir, site_data, jinja_env):
        self.logger.info("Creating rss feed for site")
        self.author = {"name":site_data["author"], "email":site_data["email"]}
        self.fg = FeedGenerator()
        self.fg.title(site_data["title"])
        self.fg.author(self.author)
        self.fg.link(href=f"{site_data['url']}/feed", rel='self')
        self.fg.language("en")
        self.fg.lastBuildDate(datetime.now(timezone.utc))
        self.fg.description(site_data["description"])

    def post_render_post(self, name, post):
        self.logger.info(f"Adding \"{post.metadata['title']}\" to feed")
        fe = self.fg.add_entry()
        fe.title(post.metadata["title"])
        fe.author(self.author)
        fe.content(post.html)
        fe.link(href=f"{post.metadata['link']}")
        if isinstance(post.metadata["date"], str):
            publish_date = datetime.strptime(post.metadata["date"], "%Y-%m-%d")
        elif isinstance(post.metadata["date"], date):
            publish_date = datetime.combine(post.metadata["date"], datetime.min.time())
        else:
            publish_date = post.metadata["date"]
        publish_date = publish_date.replace(tzinfo=timezone.utc)
        fe.published(publish_date)
        post_categories = []
        if categories:= post.metadata.get("categories", None):
            for category in categories:
                post_categories.append({"term":category, "scheme":None, "label":category})

    def finalize(self):
        out_file = self.out_dir/"feed.xml"
        self.logger.info(f"Writing feed to {out_file}")
        self.fg.rss_file(str(out_file))
