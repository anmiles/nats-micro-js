# NATS Microservice Library

A convenient microservice library based on NATS and compatible with nats-go microservices

### Description

This is a **typescript-first** library that provides a convinient (in 10 lines of code or less!) way to write **microservises** with out of the box **auto discovery**, **observability** and **load balancing**.

Full interoperability with to-be-released nastcli v0.0.36
that adds `nats micro info`, `nats micro stats` and `nats micro ping` commands

It also support service schema discovery which is not (yet?) supported by `nats micro`

### Limitations / TODO

1. No multi-reply support yet. 

When you send a message you will be getting exactly one response (or a timeout error)

2. No load balancing yet

### Usage

It is extremely simple:

```ts
  const broker = await new Broker('echo' + process.pid).connect();
  
  await Microservice.create(
    broker,
    {
      name: 'echo-service',
      description: 'Simple echo microservice',
      version: '0.0.1',
      methods: {
        echo: {
          handler: (text) => text,
          // subject is autogenerated according to nats micro protocol
        },
        'config-change-event': {
          handler: console.log,
          // subject is manually specified which allows for broadcast
          // event bus
          subject: '$EVT.config.change',
        },
      },
    }
  );
```