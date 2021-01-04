
from datetime import date, datetime, timezone
from __main__ import UserExtension, initializer
from feedgen.feed import FeedGenerator


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

    def forEachPost(self, name, post):
        self.logger.info(f"Adding \"{post.metadata['title']}\" to feed")
        fe = self.fg.add_entry()
        fe.title(post.metadata["title"])
        fe.author(self.author)
        fe.content(post.html)
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
