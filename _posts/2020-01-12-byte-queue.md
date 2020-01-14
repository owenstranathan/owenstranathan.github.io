---
layout: post
date: 2020-01-12
categories: [programming, interviewing, code-challenge, long]
---

#### [skip my rambling introduction and just see some code](#code)

Last Thursday I was looking for a job. I was feeling really unaccomplished and frankly a little desperate.
It seemed like things just weren't going my way, and so to make myself feel better I went on Gamasutra and applied to all
the jobs they had posted that I thought I was even remotely qualified for. It takes me about 40 minutes to an hour to learn
about each company, decide if I'm interested/minimally qualified and write genuine cover letter. So I really only go out 2-3 applications.
This made me feel at least a little acomplished (I could at least say, if nothing else, I had applied for some jobs that day). This took me 2-3 hours
and I finished in the early afternoon went back to working on my game.

About 30 minutes later, I recieved an email from one of the studios that I had applied to,
lets call them ***AAA Productions***.
The email was an average HR/Recruiting auto response, it thanked me for applying and asked that I complete a programming challenge
and return it along with an explaination of my solution and a signed NDA(Non-Disclosure Agreement).

This challenge turned out to be rather fun and was great practice for c/c++ skills in general.
After first reading the prompt for the challenge I felt pretty confident I could do it quickly, after a couple hours and
a few restarts I was not only enjoying myself but also humbled by the fact that it wasn't as easy as I thought.
I thought this challenge was interesting and fun enough to go over here in a full on, legit blog post.
So without further ado...


## The Prompt

As a pre-interview, we're asking all development candidates to send in a solution  
to a programming problem. Details on the programming problem are given below. We apologize for  
the imposition—if you've ever tried to fill a programming position, you know that resumes are  
not an ideal way to evaluate programming ability.  

We're not expecting you to spend more than a couple of hours on your solution. If you would  
like clarifications on the problem, feel free to send mail to recruiting@AAAProductions.com.  

What to send us:
  * An up-to-date copy of your resume.
  * A short discussion (a paragraph or two) about the possible solutions you see to the
	  problem, and why you chose the approach you did.
  * Implementation of your solution in C/C++, preferably in a single source file.

#### Problem Statement

The problem is to write a set of functions to manage a variable number of byte queues, each with  
variable length, in a small, fixed amount of memory.  

You should provide implementations of the following four functions:  
```cpp

 // Creates a FIFO byte queue, returning a handle to it.
 Q * create_queue();
 // Destroy an earlier created byte queue.
 void destroy_queue(Q * q);
 // Adds a new byte to a queue.
 void enqueue_byte(Q * q, unsigned char b);
 // Pops the next byte off the FIFO queue
 unsigned char dequeue_byte(Q * q);

```
So, the output from the following set of calls:

```cpp

  Q * q0 = create_queue();
  enqueue_byte(q0, 0);
  enqueue_byte(q0, 1);
  Q * q1 = create_queue();
  enqueue_byte(q1, 3);
  enqueue_byte(q0, 2);
  enqueue_byte(q1, 4);
 
  printf("%d ", dequeue_byte(q0));
  printf("%d\n", dequeue_byte(q0));
  enqueue_byte(q0, 5);
  enqueue_byte(q1, 6);
  printf("%d ", dequeue_byte(q0));
  printf("%d\n", dequeue_byte(q0));
  destroy_queue(q0);
  printf("%d ", dequeue_byte(q1));
  printf("%d ", dequeue_byte(q1));
  printf("%d\n", dequeue_byte(q1));
  destroy_queue(q1);

 ```

should be:

```

 0 1
 2 5
 3 4 6

```

You can define the type Q to be whatever you want.  
Your code is not allowed to call malloc() or other heap management routines. Instead, all storage  
(other than local variables in your functions) must be within a provided array:  
```cpp

 unsigned char data[2048];

```

Memory efficiency is important. On average while your system is running, there will be about 15  
queues with an average of 80 or so bytes in each queue. Your functions may be asked to create a  
larger number of queues with less bytes in each. Your functions may be asked to create a smaller  
number of queues with more bytes in each.  

Execution speed is important. Worst-case performance when adding and removing bytes is more  
important than average-case performance.  

If you are unable to satisfy a request due to lack of memory, your code should call a provided  
failure function, which will not return:  
```cpp

 void on_out_of_memory();

```

If the caller makes an illegal request, like attempting to dequeue a byte from an empty queue,  
your code should call a provided failure function, which will not return:  

```cpp

 void on_illegal_operation();

```

There may be spikes in the number of queues allocated, or in the size of an individual queue.  
Your code should not assume a maximum number of bytes in a queue (other than that imposed  
by the total amount of memory available, of course!) You can assume that no more than 64  
queues will be created at once.  

### Code 

I'll show you all the code first, then I'll talk about it.

[skip to discussion](#discussion)

```cpp

{% include_relative code/byte_queue.cpp %}

```

### Discussion

This was a really fun coding challenge. In the last 6 months I've spent a lot of my time tinkering with a custom
2D game engine. I stopped working on that about a month and a half ago but I really enjoyed working on it, this challenge
felt similar to that work and I really enjoyed thinking about how to squeeze as much data into as small of a
space as possible.

So let's just walk through the code and my though process along the way, we'll also talk about some of the other things
that could be done to improve this bit of code.

Let's start by taking a look at the first few lines:

```cpp

typedef unsigned char byte;

constexpr unsigned int MAX_BYTES = 2048;
byte data[MAX_BYTES] = {0x0};

void on_out_of_memory() { ... }
void on_illegal_operation() { ... }

```

These are just the basic things that the prompt told me were given,
2KB of storage in a contiguous array and few functions to
call when we're out of memory or in the event of an illegal operation.
Simple enough.

I also didn't want to type `unsigned char` a thousand times
so I typedef'd it as a `byte` and I made 2048 a constant (`MAX_BYTES`) so that I can't mess it up.

#### Queue list and Queue chunk

As fundamental aspect of my solution for this problem we're going to be logically partitioning the array into 8 byte chunks
and defining a data structure to fit into that 8 bytes. This structure will act as a sinlge node in a linked list.
We will call this structure in text a "queue chunk" or just "chunk" and in code it will be represented by the `Q`
struct.

The entire queue itself does not have a code representation, but consists of multiple linked `Q` queue chunks.
We will call the entire queue the "queue list" and sometimes just "queue" althought that's a bit confusing.

Now I didn't magically decide that 8 byte chunks was the right number.
I only new that the number needed to divide 2KB(2048) evenly.

To arrive at the right number I started by making my structure as small a possible.

The structure would need a few things to work as a queue chunk/linked list:

  * A pointer to the first byte in the queue chunk
  * A pointer to the last element in the queue chunk
  * A piece of contiguous storage of known or knowable size to store the bytes of the queue

As well as a few things to work as a "linked-list" of queue segments/chunks:

  * A pointer to the next chunk in the list
  * A flag indicating whether or not this chunk is free

Sounds like a pretty simple data structure, and it is, the trick is in fitting it into just a few bytes.
Let's do a quick naive implementation to see how big our struct will be if we just define it as simply as possible.

#### Naive Struct

```cpp

struct Q {
	byte* first;
	byte* last;
	Q* next;
	bool free;
	// ... leave out the contiguous storage for now, 
	// because it's dependent on how small we make our struct ...
};

```

This struct satisfies all our criteria (minus the storage) for tracking a queue. Great, I guess we're done.
But wait... hows but is it? This bad boy weighs in at whopping 32 bytes!
(Thats 8 bytes per pointer [^1] (3*8=24) and 8 bytes for the boolean.)

The reason that pointers are 8 bytes (not always true [^1])
is that pointers need to be able to address the entire virtual address space.  

We, however, don't need the entire virutal address space. 
We just need the 2048 addresses between `data` and `data+MAX_BYTES`.  
Furthermore, an entire byte for a boolean is a terrible waste. We can do better.  


#### Packed Struct

To do that we're going to use a c and c++11 feature called bit fields. [^2]

Let's take a look:

```cpp

constexpr int BYTES_PER_QUEUE = 6; // store 6 bytes per queue, more on this later

struct Q {
	unsigned int first: 3; // 3 bits can represent up to 8
	unsigned int last: 3; // ditto
	unsigned int next_idx : 8; // 8-bits can represent up to 256
	bool free: 1; // 1 bit is 1 or 0
	byte storage[BYTES_PER_QUEUE];
}__attribute__((packed));

constexpr int SIZE_OF_QUEUE = sizeof(Q); // 8 bytes

```

As you can see the feature gives us a syntax to specify the bit width of each of our structure fields.  
Before this feature in c++ you would have has to figure out how many bytes your struct would be and then do
a lot of bitwise math operations to extract your values. This feature extracts that away into the compiler.

So in our new smallest possible struct, we store the index of our first byte in our queue and the index of our last byte
using just 3 **bits** each.
(this means that we can't have more than 8 bytes per queue chunk).  

Also instead of a pointer `Q*` we can store the index to the next `Q` in our 8 bit (1 byte) `next_idx` field
(this means we can't have more that 256 queues).  

When using but fields it's important to remember that a struct **must** occupy integer numbers of bytes.
This means you can't not use only part of a byte.
So if you have a struct that uses 12 bits, it will occupy 16 bits (2 bytes) of space.
The remaining 6 bits will become padding to the next byte.


The only thing unaccounted for is our boolean `free` flag. So far we've used 8 + 3 + 3 = 14 bits, and so we have
2 bits left to the next byte. We can use one for the bool to indicate weather or not our chunk is free
(i.e. part of an existing queue list or not) [^3].

Since our struct without storage is only 2 bytes we can do some math to determine how
large we should make our storage per queue to satisfy the problem requirements.

The problem said that we should expect to have on average of **15** queues with **80** bytes each.
So if we divide for the bytes per queue we get:

**2048/15 = 136.533333...**

We can't have any fractional bytes so let's bump it to **16** so we can have an even split:  

**2048 / 16 = 128**

this means that if we have **16** queues they can at maximum occupy 128 bytes.
We still need to account for the size of the struct that is not storage so we multiply
the current size of our `Q`(2 bytes) by our number of queues(16):

**2 * 16 = 32**

then we subtract:

**128 - 32 = 96**

and we divide again:

**96 / 16 = 6**

And that gives us our *6* bytes as the maximum we can have in a single queue chunk if we want to allow for **16** queues
that each have **96** bytes. Which is well within the problem constraints

We also could have justified our **6** by recognizing that `next_idx` has a maximum value of **255**
and so we can't divide our **2048** bytes into more than 256 chunks without loosing the ability to 
address a portion of our data[^4]

So now that we have our structure defined and justified

Lets take a look at some of our helper functions and global constants that are going to help us write the functions
asked for in the prompt.

#### Helpers and misc.

``` cpp

Q* const queues = (Q*)(data);
constexpr int MAX_QUEUES = MAX_BYTES / SIZE_OF_QUEUE;

Q* next(Q* q) {
	if(q->next_idx){
		Q& next_ = queues[q->next_idx];
		// (this works because pointer math automatically accounts for sizeof(Q))
		int idx = &next_ - queues; 
		assert(idx > 0 && idx < MAX_QUEUES);
		return &next_;
	} else {
		return nullptr;
	}
}

void set_next(Q* q, Q* next) {
	if(next) {
		int next_idx = next - queues;
		assert(next_idx > 0 && next_idx < MAX_QUEUES);
		q->next_idx = next_idx;
	} else {
		q->next_idx = 0;
	}
}

void clear_queue(Q* q) {
	for(int i = 0; i < BYTES_PER_QUEUE; ++i) {
		q->data[i] = 0;
	}
	q->first = q->last = 0;
}

void init_queues() {
	for(int i = 0; i < MAX_QUEUES; i++) {
		queues[i] = {0, 0, 0, true, {0x0}};
	}
}

void print_queue(Q* q){
	printf("#%li (%p): ", q - queues, q);
	for(int j = 0; j < BYTES_PER_QUEUE; ++j) {
		printf("%d ", q->data[j]);
	}
	printf("[%d] ", q->next_idx);
	if(!q->free){
		printf("[X]\n");
	} else {
		printf("[ ]\n");
	}

}

void print_queues() {
	for(int i = 0; i < MAX_QUEUES; ++i) {
		if(!queues[i].free) {
			print_queue(&queues[i]);
		}
	}
}

int num_free_queues() {
	int free = 0;
	for(int i = 0; i < MAX_QUEUES; ++i) {
		if(queues[i].free) {
			free++;
		}
	}
	return free;
}

```

First we declare a few convienent constants to use later on.

The first one defines a constant `Q` pointer at the beginning of the `data` byte array
this lets us treat `data` like an array of `Q` structs, makes it easy to do pointer math with the size of Q to
get our indices (thanks compiler!).

Next we define a constant number for the maximum queue chunks in our memory:
this is just `MAX_BYTES/SIZE_OF_QUEUE` = **2048 / 8 = 256**

Then we have 2 helper methods `Q* next(Q*)` and `void set_next(Q*, Q*)` that lets us quickly convert the
`next_idx` field of a given `Q` to a `Q*` and vice-versa.

The function `void clear_queue(Q*)` clears the data in a `Q` queue chunk and the function `void init_queues()` initializes `MAX_QUEUES` `Q` objects
in the storage array pointed to by `data` and `queues`. This method need to be called before the other functions so we can track which chunks are "free"

The functions `void print_queue(Q* q)` and `void print_queues()` print the info on a given queue or each free queue chunk respectively,
I used them for testing and just left them. And the function
`int num_free_queues()` counts how many queues are currently free and returns it, I use it in some of the assertions in the test functions.

With that all out of the way we can finally start working on the functions asked for by the prompt!


##### Creating a queue

The first function the prompt wanted us to write was `Q* create_queue()`, let's look at that next.

```cpp

Q* create_queue(Q* cur = nullptr) {
	for(int i = 0; i < MAX_QUEUES; i++) {
		if(queues[i].free) {
			queues[i].free = false;
			return &queues[i];
		}
	}
	on_out_of_memory();
	return nullptr;
}

```

This function very simply iterates every `Q` queue chunk up to `MAX_QUEUES` in the storage array and returns the first free chunk it finds.
If it does not find any free chunks it calls `on_out_of_memory` as specified by the prompt, which we expect to never return.

It's worth thinking about the time complexity of this function because it potentially iterates the entire data storage jumping by `SIZE_OF_QUEUE`(8)
bytes. This means that the function runs in **O(N)** or linear time where **N = `MAX_QUEUES`**. This could be improved to constant O(1) if we kept a free list
(See footnote [^3]) of free chunks. Then all we would need to do is store the head of the free list locally, update the head to point to the next item of the free list and return the old head. If the head were `nullptr` then the free list is empty and we would call `on_out of memory`.

##### Destroying a queue

The next prompted function is `void destroy_queue(Q*)`

```cpp

void destroy_queue(Q* q) {
	// destroy links
	if(next(q)) { destroy_queue(next(q)); }
	// reset Q
	*q = {0, 0, 0, true, {0x0}};
}

```

This function recursively dives to the last chunk in a queue list, clearing each chunk, setting it's `next_idx` to 0 and marking it free,
as it goes until it gets to the end (`next(q) == nullptr`).

This function also has a linear time complexity of **O(n)** but this time the little **n**, is the **length of the queue list**.

Again if we had used a free list we could make this function constant O(1) time, in which case we would just add the pointer `q`
to the back of the free list. This would require that we store a pointer to the back of the freelist somewhere in our data array.

##### Enqueuing a byte

Next up is `void enqueue_byte(Q*, byte)`

```cpp

void enqueue_byte(Q*q, byte b) {
	if(q->last < BYTES_PER_QUEUE) {
		q->data[q->last++] = b;
	}
	else {
		Q* next_queue = next(q);
		if(next_queue) {
			enqueue_byte(next(q), b);
		}
		else {
			next_queue = create_queue();
			assert(next_queue);
			set_next(q, next_queue);
			enqueue_byte(next_queue, b);
		}
	}
}


```

This function has a little more going on than the others.

There are 3 situations that arise when we try to enqueue a byte:
1. The current chunk is not full and can take another byte. 
  This is the case in the first if, where we just add the byte to the `q->data` array and increment the `q->last` index.
2. The current chunk is full and is **pro**ceeded by an existing chunk (`next(q) != nullptr`).
  This is the case in the if after the first else, where we just recursively call `enqueue_byte` with the next `Q` queue chunk.
3. The current chunk is full and has has no next chunk (`next(q) == nullptr`).
  this is the case in the second else, where we create a new queue chunk (if it failed to create the program should call
  `on_out_of_memory` and hang), set the new queue to be the next queue in the list,
  and recursively call `enqueue_byte` with this new next queue chunk

Similar to destroy queue this function has linear time, as it potentially chases the tail of the queue list. So it's complexity is **O(n)** again with **n** being the length of the queue list.

In this case the use of a free list is not helpful because it would do nothing to help us retrieve the tail of
a given queue list.

##### Dequeuing a byte

finally we come to `byte dequeue_byte(Q*)`:

```cpp

byte dequeue_byte(Q*& q) {
	// removes the first byte of a queue and returns it
	assert(q->first < BYTES_PER_QUEUE);
	if(q->first == q->last && q->first == 0) { // this queue is empty
		on_illegal_operation();
		assert(false);
		return 1; // unreachable
	}
	byte* our_byte = q->data + q->first;
	byte ret = *our_byte;
	*our_byte = 0;
	++q->first;
	if(q->first == q->last) {
		// this queue just got empty;
		Q* next_queue = next(q);
		if(next_queue != nullptr) {
			// this queue has a link (so it's not technically empty)
			*q = {0, 0, 0, true, {0x0}};
			q = next_queue;
		} else {
			// this queue is empty empty; so just start from beginning again
			q->first = 0;
			q->last= 0;
		}
	} else {
		// there's actually nothing to do here
	}
	return ret;
}

```

An important modification I made it that my `dequeue_byte` takes a reference to a pointer to `Q` (`Q*&`). Which let's us change 
where the input pointer, points.


This function is probably the most complex, conceptually but, ironically has the smallest time complexity.

The first thing this function does (after the assertion for sanity checking) is check that this queue chunk is not empty.
If the chunk is empty then `on_illegal_operation` is called (as specified), which should never return and the program hangs.  
Otherwise, we get the first byte in our `q->data` array at index `q->first` and store its value temporarily. Then we clear its place
and increment `q->first`.  
Second we do a little maintenance.
To keep our queue list in good order we need to check to see if `q->first == q->last` (i.e. this chunk is empty).
If the chunk is empty then we check for a next chunk in the queue list. If we find one then we clear this chunk, free it and set the parameter `Q* q`
to the next chunk in the list. Otherwise we reset `q->first` and `q->last`.

Finally we return the stored byte from the beginning of the function.


##### The rest of it

The final few functions are test functions I wrote to test the behavior of my queue structure. I won't go over them here.


### Conclusion

This was a very fun little challenge. I find that frequently (and especially in the world of web development) we programmers tend to idealize
out problems and worse our solutions and we forget that our code runs on a real computer, in the real world. Problems with strict memory requirements
list this one are a great exercise to get us thinking about what is actually happening in our code, and teaches us not be wasteful with out memory.

I probably spent too much time on this little challenge. But I really enjoyed myself, and I wanted to write this blog
to help cement the experience.

___

[^1]: this will vary by the system as the size of a pointer is not guaranteed. On my 64-bit mac book and windows machines my pointers are 8 bytes(most of the time) but were I on a 32 bit system they would be 4 bytes, or 2 bytes if I'm on a 16 bit embedded system of somekind.
[^2]: This feature is also in C (I don't know when it came about, but I think C had it first)
[^3]: We could do away with the free flag if we were to use a [free list](https://en.wikipedia.org/wiki/Free_list) to track free chunks (we won't do this because it adds an extra layer of complication). And for the sake of memory efficiency it's irrelevant since our first and last index only occupy 6 bits we have 2 extra bits that would be padded out, so it doesn't hurt to use them. Using a free list would improve the performance of some of our functions but for our purposes it's not worth the effort.
[^4]: You might be thinking that we could double our addressable space if we use our last bit for our index and make the `next_idx` definition 9-bits long.This would grow our address space to 512. But importantly this would force our maximum chunk size to only 4 bytes long, giving a storage bytes per chunk of just 2! The resulting scheme could not accomidate our 15 queues of 80 bytes long requirement. Because each chunk would be 2 bytes then an 80 byte queue list would need `80 / 2 = 40` chunks which would occupy 4 bytes each for a total of `40 * 4 = 160` bytes per list! If we were create 15 of these we would need `160 * 15 = 2400` bytes which is **352** bytes more than we have available. So really our scheme of 6 bytes per queue chunk is the best we can do in this scenario.




