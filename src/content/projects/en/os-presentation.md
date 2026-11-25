---
lang: 'en'
translationKey: 'os-presentation'
visibility: 'public'
category: 'Systems & Computer Architecture'
tier: 'featured'
status: 'Course Project'
license: 'No license specified'
tags:
  [
    'Linux',
    'C++',
    'Concurrency',
    'Mutex',
    'epoll',
    'Thread Pool',
    'Backpressure',
  ]
title: 'Linux Concurrency and Resource Management Experiments'
description: 'Linux course experiments in concurrency, mutexes, epoll, thread pools, and backpressure, with recorded resource observations.'
repository: 'https://github.com/yyyunx/OS-presentation'
order: 1
reviewed: '2026-11-25'
diagram: 'systems'
sources:
  [
    {
      'title': 'README.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/README.md',
    },
    {
      'title': 'TEST_RESULTS.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/TEST_RESULTS.md',
    },
    {
      'title': 'docs/DASHBOARD_TEST_RESULTS.md',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/docs/DASHBOARD_TEST_RESULTS.md',
    },
    {
      'title': 'resource-management/request_simulator.h',
      'url': 'https://github.com/yyyunx/OS-presentation/blob/87c564a5b6f9a0708fb45554f20c6e177f4eb4a4/resource-management/request_simulator.h',
    },
  ]
---

## Course context

This systems programming course project uses ticket-rush scenarios to make shared state, scheduling, connections, and resource management observable. The dashboard supports explanation; the core is the behavior of the Linux and C++ programs.

## Race conditions and mutexes

The race demo deliberately lets multiple threads inspect the last ticket before decrementing it. Atomic inventory operations avoid C++ data-race undefined behavior, while the multi-step check-and-update still has a logical race.

The mutex version protects the complete check and decrement within one critical section. Atomic individual operations do not automatically make a business operation atomic. The deliberately arranged waiting behavior is for teaching, not a production recommendation.

## Thread-per-connection and epoll

The blocking server creates a worker per connection. The epoll version tracks readiness in an event loop with non-blocking socket I/O. Both still need file descriptors for connections; epoll does not remove the FD limit.

Experiments should compare FD and thread counts under the same client behavior, rather than treating terminal-log speed as throughput. Readiness does not guarantee a complete message, so partial I/O, EAGAIN, disconnects, and cleanup still matter.

## Thread pools and backpressure

A separate local request simulator keeps the worker count fixed while comparing an unbounded and bounded queue. The bounded version waits briefly when full, then rejects new work if capacity remains unavailable, exposing timed backpressure and load shedding separately.

This simulator is not a downstream stage of the network servers and does not claim to have exhausted VM memory.

## Recorded Linux experiment

The repository records a user-run VMware Ubuntu make test session on 2026-10-29. These are observations from that run, not measurements repeated by this website.

The local simulated workload used 1000 requests, 4 workers, and a 10 ms simulated service time. The protected pending queue had capacity 20 and waited at most 1 ms when full.

| Policy       | Processed | Rejected | Maximum pending queue |
| ------------ | --------: | -------: | --------------------: |
| Uncontrolled |      1000 |        0 |                   997 |
| Protected    |       378 |      622 |                    20 |

Both queues drained to zero. Acceptance and rejection counts depend on scheduling and timers, so repeat runs need not match. These numbers describe a queue policy, not production throughput or real-user capacity.

## Validation and limitations

Linux smoke checks cover fragmented protocol messages, multiple commands, FD and thread behavior for idle connections, disconnect cleanup, SIGINT, and resource statistics. Public records distinguish portable Windows checks, Ubuntu VM results, and uncompleted manual scenarios.

The blocking baseline's finished-thread bookkeeping and EMFILE recovery remain limited by the teaching scope. CPU scheduling examples simulate algorithms rather than changing actual Linux scheduling policies.

## Technical observations

Concurrency, non-blocking I/O, and backpressure address different problems. Keeping workload and observation conditions explicit makes it easier to connect visible behavior to operating-system principles.
