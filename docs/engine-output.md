## ocropy

```
746 106.88 (757, 48) novalis_ofterdingen_1802_0321_0009.bin.png
   TRU: 'kleinen Begleiter tanzten fröhlich um ſie her.'
   ALN: 'leinen BBeleiter ttanten ffrhlich umm ~ie her..'
   OUT: 'e neeeen eee eeeh e e'
747 97.88 (764, 48) keller_heinrich01_1854_0224_0013.bin.png
   TRU: 'ſondern ließ, indem er in der gleichen wunder-'
   ALN: '~ondern llie, indemm r in der geiichen wunder--'
   OUT: 'eeee e en e  en ee eeee'
748 97.48 (748, 48) alexis_ruhe01_1852_0311_0011.bin.png
   TRU: 'erſchrocken haben, da ſoll Sie auch keine Seele finden.'
   ALN: 'er~hrrken haben,da ~ll Se ach keine SSeele findenn.'
   OUT: 'eee en e  ee ene  eee'
749 124.67 (977, 48) bismarck_erinnerungen02_1898_0191_0013.bin.png
   TRU: 'Einſtweilen bringt die Weſerzeitung geſtern die ſehr nützliche Notiz'
   ALN: 'Ein~weilen brinngt ie Weerzeiitung getern ie ~ehr nntzlche NNootizz'
   OUT: 'ee ee e ee eee e e   '
750 85.83 (670, 48) meyer_gedichte_1882_0017_0008.bin.png
   TRU: 'Genug iſt nicht genug! - um eine Traube.'
   ALN: 'GGenug it nnicht genug! - uuum ieine TTrube.'
   OUT: 'eee  e ee e e eeee'
```

## tesseract

- `rms`
- `delta`
- `char train`
- `word train`
- `skip ratio`
- `new best char error`

```
2 Percent improvement time=100, best error was 91.315 @ 1200
At iteration 1300/1300/1300, Mean rms=5.512%, delta=25.181%, char train=89.022%, word train=99.944%, skip ratio=0%,  New best char error = 89.022 wrote checkpoint.

2 Percent improvement time=100, best error was 89.022 @ 1300
At iteration 1400/1400/1400, Mean rms=5.29%, delta=22.482%, char train=86.733%, word train=99.933%, skip ratio=0%,  New best char error = 86.733 wrote checkpoint.

2 Percent improvement time=100, best error was 86.733 @ 1400
At iteration 1500/1500/1500, Mean rms=5.059%, delta=19.714%, char train=84.389%, word train=99.714%, skip ratio=0%,  New best char error = 84.389 wrote checkpoint.

2 Percent improvement time=100, best error was 84.389 @ 1500
At iteration 1600/1600/1600, Mean rms=4.848%, delta=17.541%, char train=82.142%, word train=99.181%, skip ratio=0%,  New best char error = 82.142 wrote checkpoint.

2 Percent improvement time=100, best error was 82.142 @ 1600
At iteration 1700/1700/1700, Mean rms=4.631%, delta=15.436%, char train=79.218%, word train=98.339%, skip ratio=0%,  New best char error = 79.218 wrote checkpoint.

2 Percent improvement time=100, best error was 79.218 @ 1700
At iteration 1800/1800/1800, Mean rms=4.377%, delta=13.074%, char train=75.581%, word train=96.827%, skip ratio=0%,  New best char error = 75.581 wrote checkpoint.

2 Percent improvement time=100, best error was 75.581 @ 1800
At iteration 1900/1900/1900, Mean rms=4.245%, delta=12.737%, char train=71.858%, word train=95.041%, skip ratio=0%,  New best char error = 71.858 wrote best model:data/checkpoints/foo71.858_1900.checkpoint wrote checkpoint.

2 Percent improvement time=100, best error was 71.858 @ 1900
At iteration 2000/2000/2000, Mean rms=4.147%, delta=12.76%, char train=68.49%, word train=92.872%, skip ratio=0%,  New best char error = 68.49 wrote best model:data/checkpoints/foo68.49_2000.checkpoint wrote checkpoint.

2 Percent improvement time=100, best error was 68.49 @ 2000
At iteration 2100/2100/2100, Mean rms=4.037%, delta=12.633%, char train=64.364%, word train=90.222%, skip ratio=0%,  New best char error = 64.364 wrote best model:data/checkpoints/foo64.364_2100.checkpoint wrote checkpoint.

2 Percent improvement time=100, best error was 64.364 @ 2100
At iteration 2200/2200/2200, Mean rms=3.917%, delta=12.47%, char train=60.101%, word train=86.844%, skip ratio=0%,  New best char error = 60.101 wrote best model:data/checkpoints/foo60.101_2200.checkpoint wrote checkpoint.

2 Percent improvement time=100, best error was 60.101 @ 2200
At iteration 2300/2300/2300, Mean rms=3.774%, delta=12.154%, char train=55.753%, word train=83.303%, skip ratio=0%,  New best char error = 55.753 wrote best model:data/checkpoints/foo55.753_2300.checkpoint wrote checkpoint.

2 Percent improvement time=100, best error was 55.753 @ 2300
At iteration 2400/2400/2400, Mean rms=3.626%, delta=11.788%, char train=51.116%, word train=79.464%, skip ratio=0%,  New best char error = 51.116 wrote best model:data/checkpoints/foo51.116_2400.checkpoint wrote checkpoint.
```

## calamari

See https://github.com/Calamari-OCR/calamari/issues/60#issuecomment-455996548

- `loss`: CTC-Loss: No 'real' meaning, its the optimization function.
- `ler`:  Label Error Rate = #Wrong characters / #Total chars (sometimes = Character Error Rate)
- `dt`: Time to process a single line

```
#00006700: loss=0.43644236 ler=0.00277098 dt=0.32580439s
 PRED: '‪handle überhaupt. Ein Rückzug iſt ehrenvoller als‬'
 TRUE: '‪handle überhaupt. Ein Rückzug iſt ehrenvoller als‬'
#00006800: loss=0.19907025 ler=0.00039015 dt=0.32095545s
 PRED: '‪von Alaun und Schwefel unterminirt iſt und‬'
 TRUE: '‪von Alaun und Schwefel unterminirt iſt und‬'
Storing checkpoint to '/data/monorepo/ocrd_calamari/calamari/model_00006878.ckpt'
#00006900: loss=0.23633619 ler=0.00092166 dt=0.32305233s
 PRED: '‪Vom Teufel kommt die ſchwarze Kunſt!‬'
 TRUE: '‪Vom Teufel kommt die ſchwarze Kunſt!‬'
#00007000: loss=0.21475433 ler=0.00142912 dt=0.33730113s
 PRED: '‪auf den Tod verwundeten Gemuͤths, deſſen Klage‬'
 TRUE: '‪auf den Tod verwundeten Gemuͤths, deſſen Klage‬'
Storing checkpoint to '/data/monorepo/ocrd_calamari/calamari/model_00007059.ckpt'
#00007100: loss=0.23358536 ler=0.00100088 dt=0.32817028s
 PRED: '‪,,Es war nichts.''‬'
 TRUE: '‪,,Es war nichts.''‬'
#00007200: loss=0.25860454 ler=0.00106387 dt=0.32258639s
 PRED: '‪Nun ſchläft ſie bei Sonnengefunkel.‬'
 TRUE: '‪Nun ſchläft ſie bei Sonnengefunkel.‬'
Storing checkpoint to '/data/monorepo/ocrd_calamari/calamari/model_00007240.ckpt'
#00007300: loss=0.19538629 ler=0.00090778 dt=0.33303790s
 PRED: '‪Jn Kanaan ein Bergquell klar.‬'
 TRUE: '‪Jn Kanaan ein Bergquell klar.‬'
#00007400: loss=0.23499156 ler=0.00118654 dt=0.32525404s
 PRED: '‪freier Entſchluß. Jch habe Dich von Herzen lieb‬'
 TRUE: '‪freier Entſchluß. Jch habe Dich von Herzen lieb‬'
Storing checkpoint to '/data/monorepo/ocrd_calamari/calamari/model_00007421.ckpt'
#00007500: loss=0.24685997 ler=0.00120797 dt=0.33009159s
 PRED: '‪Er nahm nun auch den zweiten Brief und‬'
 TRUE: '‪Er nahm nun auch den zweiten Brief und‬'
#00007600: loss=0.34570392 ler=0.00248301 dt=0.31626922s
 PRED: '‪Mein Burſche ſchlank, mein Burſche klein!‬'
 TRUE: '‪Mein Burſche ſchlank, mein Burſche klein!‬'
```
