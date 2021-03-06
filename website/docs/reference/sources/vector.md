---
delivery_guarantee: "best_effort"
description: "The Vector `vector` source ingests data through another upstream `vector` sink and outputs `log` and `metric` events."
event_types: ["log","metric"]
issues_url: https://github.com/timberio/vector/issues?q=is%3Aopen+is%3Aissue+label%3A%22source%3A+vector%22
operating_systems: ["Linux","MacOS","Windows"]
sidebar_label: "vector|[\"log\",\"metric\"]"
source_url: https://github.com/timberio/vector/tree/master/src/sources/vector.rs
status: "beta"
title: "Vector Source"
unsupported_operating_systems: []
---

The Vector `vector` source ingests data through another upstream [`vector` sink][docs.sinks.vector] and outputs [`log`][docs.data-model.log] and [`metric`][docs.data-model.metric] events.

<!--
     THIS FILE IS AUTOGENERATED!

     To make changes please edit the template located at:

     website/docs/reference/sources/vector.md.erb
-->

## Configuration

import CodeHeader from '@site/src/components/CodeHeader';

<CodeHeader fileName="vector.toml" learnMoreUrl="/docs/setup/configuration/"/ >

```toml
[sources.my_source_id]
  # REQUIRED
  type = "vector" # must be: "vector"
  address = "0.0.0.0:9000" # example

  # OPTIONAL
  shutdown_timeout_secs = 30 # default, seconds
```

## Options

import Fields from '@site/src/components/Fields';

import Field from '@site/src/components/Field';

<Fields filters={true}>


<Field
  common={true}
  defaultValue={null}
  enumValues={null}
  examples={["0.0.0.0:9000","systemd","systemd#1"]}
  groups={[]}
  name={"address"}
  path={null}
  relevantWhen={null}
  required={true}
  templateable={false}
  type={"string"}
  unit={null}
  >

### address

The TCP address to listen for connections on, or `systemd#N to use the Nth socket passed by systemd socket activation. If an address is used it _must_ include a port.



</Field>


<Field
  common={true}
  defaultValue={30}
  enumValues={null}
  examples={[30]}
  groups={[]}
  name={"shutdown_timeout_secs"}
  path={null}
  relevantWhen={null}
  required={true}
  templateable={false}
  type={"int"}
  unit={"seconds"}
  >

### shutdown_timeout_secs

The timeout before a connection is forcefully closed during shutdown.


</Field>


</Fields>

## Output

The `vector` source is a pass-through source and is intended to accept data
from an upstream [`vector` sink][docs.sinks.vector]. Datta is not changed or
augmented.

## How It Works

### Encoding

Data is encoded via Vector's [event protobuf][urls.event_proto] before it is sent over the wire.

### Environment Variables

Environment variables are supported through all of Vector's configuration.
Simply add `${MY_ENV_VAR}` in your Vector configuration file and the variable
will be replaced before being evaluated.

You can learn more in the [Environment Variables][docs.configuration#environment-variables]
section.

### Message Acking

Currently, Vector does not perform any application level message acknowledgement. While rare, this means the individual message could be lost.

### TCP Protocol

Upstream Vector instances forward data to downstream Vector instances via the TCP protocol.


[docs.configuration#environment-variables]: /docs/setup/configuration/#environment-variables
[docs.data-model.log]: /docs/about/data-model/log/
[docs.data-model.metric]: /docs/about/data-model/metric/
[docs.sinks.vector]: /docs/reference/sinks/vector/
[urls.event_proto]: https://github.com/timberio/vector/blob/master/proto/event.proto
