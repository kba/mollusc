# ocr-linegt

> An exchange format for line-based ground truth for OCR

## Rationale

Recent OCR (optical character recognition) engines are not actually
character-based anymore but on neural networks that operate on lines. These
engines can be trained with images of text lines and their transcription
("ground truth"), plus engine-specific configurations.

This format defines a standardized format to bundle such ground truth, based on
the BagIt conventions.

## BagIt

An `ocr_linegt` bag must be a valid BagIt bag:

* Root folder must contain a file `bagit.txt`
* Root folder must contain a file `bag-info.txt` with metadata about the bag
* All payload files must be under a folder `/data`
* Every file in `/data` along with its `<algo>` checksum must be listed in a
  file `manifest-<algo>.txt`

## BagIt profile

In addition to the requirements of BagIt, an `ocr_linegt` bag must adhere to
the `ocr_linegt` BagIt profile.

## Directory structure
