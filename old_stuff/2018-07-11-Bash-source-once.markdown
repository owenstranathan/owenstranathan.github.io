---
layout: post
title: Source a bash file once
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

like this

``` bash
#!/bin/bash
# util.sh

function useful_function(){
    echo "I'm useful"
}

export -f useful_function
```

``` bash
#!/bin/bash
# needs_help.sh

source "./util.sh"

function main(){
    useful_function
    # ... presumably other things ...
}
```

So naturally realizing this pattern's potential I decided to take a monster bash program comprized of 20ish scripts all 
clumped together in a disgusting and down right miraculous glob that amazingly does what it's supposed to 
(and probably other shit too), and modularize the sweet jesus out of it...   
Immediately I created like 5 circular imports and because bash has no enforced maximum
recursion depth and no error reporting to speak of (who fucking needs it, am-I-right?)
I spent a few minutes staring at a blank terminal scratching my head.

# Solution 

Once I realized what I'd done I was like, "Awe shit that's a thing, I forgot about that because **python**"
Then I thought well I just gotta do that thing that you do in c/c++ do to make sure you don't get
get circular includes. 


``` cpp
#ifndef UTIL_HPP
#define UTIL_HPP

... Bunch of c++ muju ...

#endif
```

only in bash it's like this

``` bash
#!/bin/bash
# util.sh
if [[ -v UTIL_SH ]]; then
    return 0
fi

export UTIL_SH=1

function useful_function(){
    echo "I'm useful"
}

export -f useful_function
```

``` bash
#!/bin/bash
# needs_help.sh

source "./util.sh"  # sourced completely
source "./util.sh"  # shorted because UTIL_SH is set


function main(){
    useful_function
    # ... presumably other things ...
}
```


That will stop the source if name `UTIL_SH` is already set in the environment

One more thing! Those `export -f` statements at the bottom of the source files are important
If they aren't there then any subshell or subscript entered from the environment that has sourced
the file will not have the functions! So make sure you do that.

I'm not a master of bash, or of anything for that matter, and there is almost certainly a situation
where this will breakdown and become useless. That said it's working for me so far.

🔥🖥🔥️    


#### Edit 09/12/18

I originally kept names of all the sourced files in a big variable named `$INCLUDES`
I have since realized that this is over kill and have taking the C/C++ method of defining 
a unique variable for the file and stopping the source if it's already set. (sort of like a lock)

The limitation of this is that can easily fuck things up by unsetting the variable accidentally.
So make sure you use a really unique name for your source lock
