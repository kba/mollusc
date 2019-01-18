# mollusc Architecture

## packages

~~~mermaid
graph RL

backend --> shared;
server --> shared
server --> backend
cli --> shared
cli --> backend
cli --> server
~~~

## Data Model

### GroundTruthBag

BagIt folder with line transcriptions

### GroundTruthCorpus

A set of ground truth data, one or more [GroundTruthBag]

### TrainingEngine

An engine like kraken, to be started as an external process

### TrainingConfig

Specifies how to train:

* [GroundTruthBag] to use

### Engine

Wraps a training engine, basically a child process with captured STDOUT/STDERR, suspendable, resumable etc.

### TrainingSession

Passed to engine at instantiation, serves as exchange object, easily serializabel, contains

- TrainingConfig
- environment variables
- log of STDOUT/STDERR
- epochs
  - structured log by parsing output
  - every epoch has e.g. current xyz error rate etc.

---

[TrainingEngine](#trainingengine)
[TrainingConfig](#trainingconfig)
[GroundTruthBag](#groundtruthbag)
[GroundTruthCorpus](#groundtruthcoropus)
