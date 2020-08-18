import os
import sys
from collections import namedtuple

from pathlib import Path

from yaml import load, dump, load_all

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

from jinja2 import Template, FileSystemLoader, Environment

class Post:
    def __init__(self, source_text, front_matter, body_text, metadata, rendered_text):
        source_text
        self.front_matter = front_matter
        self.body_text = body_text
        self.metadata = metadata
        self.rendered_text = rendered_text
        self.html = ""

    def compile(self):
        # TODO: compile the markdown to html and put it in the html field
        pass

def serialize_post(source_text):
    # todo get front matter, parse it and put everything in a named tuple
    yaml_docs = source_text.split("---")
    if len(yaml_docs)>2:
        front_matter = yaml_docs[1]
        body_text = "".join(yaml_docs[2:])
    else:
        front_matter = None
        body_text = source_text
    try:
        metadata = next(load_all(source_text, Loader=Loader))
    except Exception as e:
        metadata = None
        print(e)
    return Post(source_text, front_matter, body_text, metadata, "")


def main(path):
    if(os.path.exists(path)):
        cwd = Path(os.path.abspath(path))
    else:
        cwd = Path(os.path.abspath(os.getcwd()))
    site_conf = cwd / "site.yaml"
    templates = cwd / "templates"
    posts = cwd / "posts"
    index = templates / "index.html"
    if not templates.exists():
        print("Can't work without templates")
        sys.exit(-1)
    if not index.exists():
        print("can't work without an index.html")
        sys.exit(-1)
    jinja_env = Environment(loader=FileSystemLoader([str(templates), str(posts)]))

    if site_conf.exists():
        with site_conf.open() as infstream:
            site_data = load(infstream, Loader=Loader)
    assert(templates.exists() and templates.is_dir())
    assert(posts.exists() and posts.is_dir())
    templates_dict = {}
    posts_dict = {}
    def read_file(f, dic, root=None, serializer = lambda d: d):
        with f.open() as inf:
            if root:
                name = str(f.relative_to(root))
            else:
                name = str(f.absolue())
            dic[name] = serializer(inf.read())
    def read_dir(d, dic, root=None, file_ext=None, serializer = lambda d: d):
        for f in d.iterdir():
            if f.is_file():
                if file_ext is None:
                    read_file(f, dic, root, serializer=serializer)
                elif f.name.endswith(file_ext):
                    read_file(f, dic, root, serializer=serializer)
            else:
                read_dir(f, dic, file_ext = file_ext, serializer=serializer)
    read_dir(templates, templates_dict, root=templates)
    read_dir(posts, posts_dict, root=posts, file_ext=".md", serializer=serialize_post)
    # TODO for each post compile it with the global data from site.yaml and it's front matter
    # then compile all the templates and output their corresponding pages
    # TODO: Mako has too much special syntax that directly conflicts with markdown. So let's do jinja
    for name, post in posts_dict.items():
        print(f"Rendering post {name}")
        post_metadata = post.metadata
        template = jinja_env.get_template(name)
        post.rendered_text = template.render(site=site_data, **post_metadata)
    for name, template in templates_dict.items():
        template = jinja_env.get_template(name)
        rendered = template.render(site=site_data, posts=post_dict)
        print(f"Rendering template {name}")


if __name__ == "__main__":
    if(len(sys.argv) > 1):
        main(sys.argv[1])
    else:
        main()
