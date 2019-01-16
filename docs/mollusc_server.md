# mollusc_server Architecture

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


---

[TrainingEngine](#trainingengine)
[TrainingConfig](#trainingconfig)
[GroundTruthBag](#groundtruthbag)
[GroundTruthCorpus](#groundtruthcoropus)
