import { Guard, INCORRECT_PASSWORD } from './guard';
import { HDKey, MnemonicController } from 'lib/bip39';
import { assert } from 'lib/assert';
import { BrowserStorage } from 'lib/storage';
import { utils } from 'aes-js';


(async function start() {
  /// start testing.
  console.log('reset storage');
  await BrowserStorage.clear();

  /// guard
  console.log('start guard testing');
  const mnemonic = new MnemonicController();
  const guard = new Guard();

  await guard.sync();

  assert(!guard.isEnable, 'guard.isEnable is true');
  assert(!guard.isReady, 'guard.isReady is true');

  const wordsSHouldBe = 'insect harsh unable fog damp together skin eager clutch pyramid travel budget flat flag ten bone whisper carbon addict siren elegant legend mandate cover';
  const seedShouldBe = '9de4324c250bc7f98aac98eb10e13f523fd68df6dbe4fd36b552a80de07ffaa91aaa521f88d4502e98719002462e4fb4f348196a695ac78ad8afa3ebf0e03dd4';
  const entropy = '750d2bb12d2373c772a2272c95e39e0ec588b077b8cafa844c0d64b478ff21c1';
  const words = mnemonic.entropyToMnemonic(utils.hex.toBytes(entropy));
  const password = 'test';

  assert(wordsSHouldBe === words, 'words are different');

  guard.setupVault(words, password);

  assert(utils.hex.fromBytes(guard.seed) === seedShouldBe, 'seed bytes are different');
  assert(guard.isEnable, 'guard.isEnable is false');
  assert(guard.isReady, 'guard.isReady is false');
  assert(guard.seed.length === 64, 'seed length should be 64');

  await guard.logout();

  assert(!guard.isEnable, 'guard.isEnable is true');
  assert(guard.isReady, 'guard.isReady is false');

  try {
    guard.unlock('wrong password');
  } catch (err) {
    assert((err as Error).message === INCORRECT_PASSWORD, 'incorrect error');
  }

  assert(!guard.isEnable, 'guard.isEnable is true');
  assert(guard.isReady, 'guard.isReady is false');

  guard.unlock(password);

  assert(guard.isEnable, 'guard.isEnable is false');
  assert(guard.isReady, 'guard.isReady is false');
  /// guard

  console.log('start testing HDKey');

  /// HDKey
  function testKeys(index: number) {
    const hdKey = new HDKey().fromMasterSeed(guard.seed);
    const childKey = hdKey.derive(mnemonic.getPath(index));
    const privateKey = childKey.privateKey.toString('hex');
    const publicKey = childKey.publicKey.toString('hex');

    return {
      privateKey,
      publicKey
    };
  }

  const res0 = testKeys(0);

  assert('20cbb3e05d1be2385e5e795db63fa436b47ebfbc15b25a1193d8f8ef8f699f5b' === res0.privateKey, 'Incorrect PrivateKey');
  assert('030087d0aac1660e043807c2fa28e0d7193c1a7eaefa9d84104192a0ce90e4626e' === res0.publicKey, 'Incorrect PublicKey');

  const res1 = testKeys(1);

  assert('bc34c1499276cdd920bf004cfc209ea13781868409c4861fede0edcb1a484124' === res1.privateKey, 'Incorrect PrivateKey');
  assert('0288a73c45888665af33bc5148ae90aed9bf02b5dc99e9b4b15a3270ba9ea883c5' === res1.publicKey, 'Incorrect PublicKey');

  const res2 = testKeys(55);

  assert('38f7eee62d803325fca53521a767781777ce9dfd5b3c469aeb5c52cab9c38fa5' === res2.privateKey, 'Incorrect PrivateKey');
  assert('0319fcfecfb3750e378cf1d26516772cce2a9fc969bd3b50df2d1fddb4083f0600' === res2.publicKey, 'Incorrect PublicKey');
  /// HDKey
  console.log(guard);
}());