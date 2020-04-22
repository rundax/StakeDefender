import {walletFromMnemonic} from 'minterjs-wallet';
import {expect} from 'chai';

describe('index file', function () {


    it('parse env', function () {
        console.log(walletFromMnemonic('add best life appear dune base spoil defy degree warrior census female').getPrivateKeyString());
        let plain = {body: '1.js'};

        expect(plain).to.be.eq(plain);
    });

});
