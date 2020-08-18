import os
import sys
from collections import namedtuple

from pathlib import Path

from yaml import load, dump, load_all

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

Post = namedtuple("Post", ["source", "front", "body", "meta", "compiled"])

def serialize_post(post_data):
    # todo get front matter, parse it and put everything in a named tuple
    blah = post_data.split("---")
    if len(blah)>2:
        front = blah[1]
        body = "".join(blah[2:])
    else:
        front = None
        body = post_data
    try:
        meta = next(load_all(post_data, Loader=Loader))
    except Exception as e:
        meta = None
        print(e)
    return Post(post_data, front, body, meta, "")


def main(path):
    if(os.path.exists(path)):
        cwd = Path(os.path.abspath(path))
    else:
        cwd = Path(os.path.abspath(os.getcwd()))
    site_conf = cwd / "site.yaml"
    templates = cwd / "templates"
    posts = cwd / "posts"
    index = templates / "index.html"
    if not index.exists():
        print("can't work without an index.html")
        sys.exit(-1)

    if site_conf.exists():
        with site_conf.open() as infstream:
            site_data = load(infstream, Loader=Loader)
    assert(templates.exists() and templates.is_dir())
    assert(posts.exists() and posts.is_dir())
    templates_dict = {}
    posts_dict = {}
    def read_file(f, dic, serializer = lambda d: d):
        with f.open() as inf:
            dic[str(f.absolute())] = serializer(inf.read())
    def read_dir(d, dic, file_ext=None, serializer = lambda d: d):
        for f in d.iterdir():
            if f.is_file():
                if file_ext is None:
                    read_file(f, dic, serializer=serializer)
                elif f.name.endswith(file_ext):
                    read_file(f, dic, serializer=serializer)
            else:
                read_dir(f, dic, file_ext = file_ext, serializer=serializer)
    read_dir(templates, templates_dict)
    read_dir(posts, posts_dict, file_ext=".md", serializer=serialize_post)
    # TODO for each post compile it with the global data from site.yaml and it's front matter
    # then compile all the templates and output their corresponding pages
    # TODO: Mako has too much special syntax that directly conflicts with markdown. So let's do jinja
    for key, value in posts_dict.items():
        print(key)
        breakpoint()
        post_data = value.meta
        post_data["site"] = site_data
        # TODO: render the post with the post_data


if __name__ == "__main__":
    if(len(sys.argv) > 1):
        main(sys.argv[1])
    else:
        main()
