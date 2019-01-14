# -*- coding: utf-8 -*-
from setuptools import setup

setup(
    name='mollusc',
    version='0.0.1',
    description='Engine independent OCR training',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    author='Konstantin Baierer',
    author_email='unixprog@gmail.com',
    url='https://github.com/kba/mollusc',
    license='Apache License 2.0',
    install_requires=open('requirements.txt').read().split('\n'),
    packages=['mollusc'],
    package_data={'': ['*.json']},
    entry_points={
        'console_scripts': [
            'mollusc=mollusc.cli:main',
        ]
    },
    keywords=['OCR', 'training', 'optical character recognition', 'ocropy', 'ocropus', 'kraken', 'calamari', 'tesseract', 'ocrd-train'],
)
