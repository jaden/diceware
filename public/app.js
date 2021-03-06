const crypto = window.crypto || window.msCrypto;

new ClipboardJS('#clipboard-button');

function getRandomNumber(ceiling) {
  return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * ceiling);
}

new Vue({
  el: '#app',
  data: {
    numWords: 7,
    delimiter: ' ',
    passphrase: '',
  },

  mounted: function () {
    this.generatePassphrase();
  },

  methods: {
    generatePassphrase: function () {
      let selectedWords = [];

      for (let i = 0; i < this.numWords; i++) {
        selectedWords.push(words[getRandomNumber(words.length)]);
      }

      this.passphrase = selectedWords.join(this.delimiter);
    }
  }
});
