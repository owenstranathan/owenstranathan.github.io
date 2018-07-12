---
layout: post
title: Source a bash file only once
date: 2018-07-11 23:00:00 -0400
categories: programming
---

# Problem

I was writing a bunch of bash today because I'm a masochist.
And because bash is like a treasure hunt of programming easter eggs; every day is a new
adventure in how not to program computers.

I learn a new thing about bash almost everyday (or rather, I find a new hacky-ass thing I **can**
do, and probably **shouldn't** do). Today what I learned was sourcing files that contain functions at the
top of a bash script and using this functionality similarly to the `import` statement in python.

So naturally realizing this pattern's potential I decided to take a monster bash program comprized of 20ish scripts all 
clumped together in a disgusting and down right miraculous glob that amazingly does what it's supposed to 
(and probably other shit too), and modularize the sweet jesus out of it...   
Immediately I created like 5 circular imports and because bash has no enforced maximum
recursion depth and no error reporting to speak of (who fucking needs it, am-I-right?)
I spent a few minutes staring at a blank terminal scratching my head.

Once I realized what I'd done I was like, "Awe shit that's a thing, I forgot about that because **python**"
Then I thought well I just gotta do that thing that old c programmers used to do to make sure they didn't
get circular includes. And that's when I write this little bad boy.


``` bash
#!/bin/bash
# pragma.sh

function source_once(){
    local source_name
    set -eu
    source_name="$1"
    set +eu
    if [[ $INCLUDES ]]; then
        if [[ "$INCLUDES" = *"$source_name"* ]]; then
            return 1
        fi
        export INCLUDES="$INCLUDES:$source_name"
        return 0
    else
        export INCLUDES="$source_name"
        return 0
    fi
}

```

then in a script that you want to make sure you only source once. Like this logging script I use

``` bash
#!/bin/bash
# logging.sh

function log(){
    if [[ ! $SCRIPT_NAME ]]; then
        _log --caller="${FUNCNAME[1]}" "$@"
    else
        _log --caller="$SCRIPT_NAME.${FUNCNAME[1]}" "$@"
    fi
}

function _log(){
    # ...getopts and args and set levels and all the good shit...
    datetime="$(date +%H:%M:%ST%m-%d-%YZ)"
    printf "%-20s %-35s %-8s %s\n" "$datetime" "<$CALLER>" "[$LOGLEVEL_STR]" "$MESSAGE" 
    # ...send logs to logstash server and junk...
}
```

all you have to do is throw these couple of lines at the top

``` bash
source "./pragma.sh" # your path may vary because paths are bullshit. I'm sorry...
source_once "$BASH_SOURCE"
if [[ "$?" -ne "0" ]]; then return 0; fi
```

That will stop the source if name of the file given by `"$BASH_SOURCE"` is already in the 
varible `"$INCLUDES"`.

I'm not a master of bash or of anything for that matter, and there is almost certainly a situation
where this will breakdown and become useless. That said it's working for me so far.

🔥🖥🔥️    