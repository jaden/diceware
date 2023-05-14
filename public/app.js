const crypto = window.crypto || window.msCrypto;

new ClipboardJS('#clipboard-button');

function getRandomNumber(ceiling) {
  return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * ceiling);
}

function getEntropy(length, numPossibleSymbols) {
  if (!length || !numPossibleSymbols) {
    return null;
  }

  return Math.round(Math.log2(Math.pow(numPossibleSymbols, length)) * 100) / 100;
}

const app = Vue.createApp({
  data() {
    return {
      numWords: 5,
      delimiter: ' ',
      passphrase: '',
    };
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
    },
  },

  watch: {
    numWords: function () {
      this.generatePassphrase();
    },

    delimiter: function () {
      this.generatePassphrase();
    },
  },

  computed: {
    entropy: function () {
      return getEntropy(this.numWords, words.length);
    },
  },
});

app.mount('#app');
