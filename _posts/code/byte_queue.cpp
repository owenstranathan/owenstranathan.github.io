#include <cstdio>
#include <cassert>
#include <cmath>

typedef unsigned char byte;

constexpr unsigned int MAX_BYTES = 2048;
byte data[MAX_BYTES] = {0x0};

void on_out_of_memory() {
	printf("OUT OF MEMORY");
	while(true);
}
void on_illegal_operation() {
	printf("ILLEGAL OP");
	while(true);
}

constexpr int BYTES_PER_QUEUE = 6;
struct Q {
	unsigned int next_idx : 8; // upto 256
	unsigned int first: 3; // up to 8 (only need 6)
	unsigned int last: 3; // up to 8 (only need 6)
	bool free: 1; // 1 or 0
	byte data[BYTES_PER_QUEUE]; // leaves 6 bytes left over for data
}__attribute__((packed));

constexpr int SIZE_OF_QUEUE = sizeof(Q);

Q* const queues = (Q*)(data);
constexpr int MAX_QUEUES= MAX_BYTES / SIZE_OF_QUEUE;

Q* next(Q* q) {
	if(q->next_idx){
		Q& next_ = queues[q->next_idx];
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
		int self_idx = q - queues;
		assert(self_idx != next_idx);
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

void destroy_queue(Q* q) {
	// destroy links
	if(next(q)) { destroy_queue(next(q)); }
	// reset Q
	*q = {0, 0, 0, true, {0x0}};
}

void enqueue_byte(Q*q, byte b) {
	// adds a byte to a queue at the end
	if(q->last < BYTES_PER_QUEUE) {
		q->data[q->last++] = b;
	}
	else {
		Q* next_queue = next(q);
		if(next_queue) {
			enqueue_byte(next_queue, b);
		}
		else {
			Q* next_queue = create_queue();
			assert(next_queue);
			set_next(q, next_queue);
			enqueue_byte(next_queue, b);
		}
	}
}

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


void test_default() {
	Q * q0 = create_queue();
	assert(num_free_queues() == MAX_QUEUES-1);
	enqueue_byte(q0, 0);
	enqueue_byte(q0, 1);
	Q * q1 = create_queue();
	assert(num_free_queues() == MAX_QUEUES-2);
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
	assert(num_free_queues() == MAX_QUEUES-1);
	printf("%d ", dequeue_byte(q1));
	printf("%d ", dequeue_byte(q1));
	printf("%d\n", dequeue_byte(q1));
	destroy_queue(q1);
}

void test_1() {
	Q* q0 = create_queue();
	for(int i = 0; i < BYTES_PER_QUEUE * MAX_QUEUES; ++i) {
		enqueue_byte(q0, i%MAX_QUEUES);
	}
	for(int i = 0; i < BYTES_PER_QUEUE/2; ++i) {
		dequeue_byte(q0);
	}
	assert(num_free_queues() == 0);
	for(int i = 0; i < BYTES_PER_QUEUE/2; ++i) {
		dequeue_byte(q0);
	}
	assert(num_free_queues() == 1);
	destroy_queue(q0);
}

void test_2(const int num_queues, const int num_bytes) {
	Q* l_queues[num_queues];
	for(int i = 0; i < num_queues; ++i) {
		Q* new_queue = create_queue();
		// printf("%d\n", new_queue->next_idx);
		for(int j = 0; j < num_bytes; ++j) {
			enqueue_byte(new_queue, j);
		}
		l_queues[i] = new_queue;
	}

	int used_queues = (ceil((float)num_bytes/(float)BYTES_PER_QUEUE)) * num_queues;
	assert(num_free_queues() == MAX_QUEUES - used_queues);
	for(int i = 0; i < num_queues ; ++i) {
		destroy_queue(l_queues[i]);
	}
	assert(num_free_queues() == MAX_QUEUES);
}

int main() {
	init_queues();
 	test_default();
	test_1();
	test_2(30, 40);
	test_2(15, 80);
	test_2(8, 160);
	return 0;
}
