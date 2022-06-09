�Ҷ���kIA�f  ڗ��1\O<�@������Fnsd��nD5�ݼhk�>H�	�Nx�:��N��.�EWF�s����14\�D�e ��K����K+d�K�gr�7�'`}��n��AS*ܨ�B/7��m�K
Ұ9 p �'�m�\�Y��-��ɌL����'��ƺ�QUnx9�PЀ�	�D;#:.1�3F@&!J��&�i3�.��9�X�`C�o���0������(M��l��&��c�śs�>��hGP�m�. -B�7\w]zYhY�ͬ� W�#߆h�a���"#��b������.��\/�s~�D �O�$�tn�8����%����`㏛�!�Rc�s���a}�%��̀���>��!�r�zYed�,�Л+�(D�`�'Fݭ]�U�%�9ǻ��%�^Z�`T���i���tɨ�#ջ{�'%��.yd����+���;T3���J���H�6��+�����%����۾��>!뻺 ûo������Wr��/s�O 1��&m�^}&��W��D��7)��d��	�#XS�Q���ըM���s�0��Y� 1b8���K��[ ��|�m�[� iq���4$�s<�sm��i�[�^U���e�.�C��������	#V�M��7���ü̽��s��
���v�b�L�^�F�.�^\S�S��X� �s��xx3�N���� L|��a������a"j!F���t������(9�r�h����]P��a���:]|��[�XT�k7'=a�r����;�:��W>z}T��*<e�"*���sՂ�-5�h}T�<f�"vO���s�
P�V��灌���F���������h�z�fkk��L�8��j>�9�N+�; O?Yf�Y"s��9g8�9��O`�#�]aO?~gl辑��s�
��'���k�E���Q41t)Ѿ��+9W�5��#�}�|k,���]�G�:~A�|j�����c���8�#@+x�B���S:fC7��� ��@��l�"�\t�+8DI#�^�s����	���k�ڏ�/��q��R�u�Kz9�O����f$��_$�[�C7͉.���o�P����fk�zP�bL�D��>�d������_�ZKȶ"����z��b4�
�.��r;Ͼ���0�qk�{�SY�;$�e�9%���=ϡK�P~��3�($y�j_ ���e��ŲE��p�D�r��sAQ��⢗/:VtiW�X��Jn=ۇ��Ïg��(d����.��w���a�&Z蒬���Φ�QH?�����@;?� j�޶l�Gs�uI�ڝw�3�(���j�<�ţ�̲��������%��}�#F!�\q㗷��8^,[ԮŚ�.!��%��CnwNdS�'�-�Х�$-r�����"��� '��V�+��T�h��������/1n�Ǟ�lKS���V�"ꐙ���ՃN����iY��W��PR��:�Ujۉ�.���+�k+�|<=I鼙���bj��V�z���2S�TIT��|%9P;.kN��������'>9^��U    IEND�B`�"use strict";

const {
  app
} = require('electron');

const buildInfo = require('./buildInfo');

const paths = require('../common/paths');

paths.init(buildInfo);

const moduleUpdater = require('../common/moduleUpdater');

const updater = require('../common/updater');

const requireNative = require('./requireNative');

function getAppMode() {
  if (process.argv && process.argv.includes('--overlay-host')) {
    return 'overlay-host';
  }

  return 'app';
}

const mode = getAppMode();

if (mode === 'app') {
  require('./bootstrap');
} else if (mode === 'overlay-host') {
  // Initialize the update system just enough to find installed native modules.
  const appSettings = require('./appSettings');

  appSettings.init();

  const {
    NEW_UPDATE_ENDPOINT
  } = require('./Constants');

  if (buildInfo.newUpdater) {
    if (!updater.tryInitUpdater(buildInfo, NEW_UPDATE_ENDPOINT)) {
      throw new Error('Failed to initialize modules in overlay host.');
    } // Load the module search path but if there's a pending host update, don't
    // restart into it.


    updater.g