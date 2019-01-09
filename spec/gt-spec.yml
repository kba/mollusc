# linegt

> An exchange format for line-based ground truth for OCR

<!-- BEGIN-MARKDOWN-TOC -->
* [Rationale](#rationale)
* [BagIt](#bagit)
* [BagIt profile](#bagit-profile)
	* [Gt-Transcription-Extension](#gt-transcription-extension)
	* [Gt-Transcription-Media-Type](#gt-transcription-media-type)
	* [Gt-Image-Extension](#gt-image-extension)
	* [Gt-Image-Media-Type](#gt-image-media-type)
	* [Gt-Directory](#gt-directory)
	* [Gt-Directory-Structure](#gt-directory-structure)

<!-- END-MARKDOWN-TOC -->

## Rationale

Recent OCR (optical character recognition) engines are not actually
character-based anymore but on neural networks that operate on lines. These
engines can be trained with images of text lines and their transcription
("ground truth"), plus engine-specific configurations.

This format defines a standardized format to bundle such ground truth, based on
the BagIt conventions.

## BagIt

An `linegt` bag must be a valid BagIt bag:

* Root folder must contain a file `bagit.txt`
* Root folder must contain a file `bag-info.txt` with metadata about the bag
* All payload files must be under a folder `/data`
* Every file in `/data` along with its `<algo>` checksum must be listed in a
  file `manifest-<algo>.txt`

## BagIt profile

In addition to the requirements of BagIt, an `ocr_linegt` bag must adhere to
the `ocr_linegt` BagIt profile.

### Gt-Transcription-Extension

Extension of the transcription files. Default: `.gt.txt`.

### Gt-Transcription-Media-Type

Media type of the transcription files. Default: `text/plain`.

### Gt-Image-Extension

Extension of the transcription files. Default: `.gt.txt`.

### Gt-Image-Media-Type

Media type of the transcription files. Default: `text/plain`.

### Gt-Directory

Directory below `/data` containing the ground truth. Default: `ground-truth`.

### Gt-Directory-Structure

Directory structure. One of 

  - `flat`: img and transcription in the [`Gt-Directory`]
  - `flat-nested`: img and transcription in the same dir below [`Gt-Directory`]
  - `subfolders`: img and transcription in subfolders [`Gt-Image-Directory`] and [`Gt-Transcription-Directory`] of [`Gt-Directory`]
  - `subfolders-nested`: img and transcription in subfolders [`Gt-Image-Directory`] and [`Gt-Transcription-Directory`] in the same dir below Gt-Directory

[`Gt-Directory`]: #gt-directory
[`Gt-Image-Directory`]: #gt-image-directory
[`Gt-Transcription-Directory`]: #gt-transcription-directory
