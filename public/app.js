function getRandomNumber(ceiling) {
  const maxUint = 0xFFFFFFFF; // 2^32 - 1
  const maxSafeValue = maxUint - (maxUint % ceiling);
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] > maxSafeValue); // Loop until it's in the safe, non-biased range

  return buffer[0] % ceiling;
}

function getEntropy(length, numPossibleSymbols) {
  if (!length || !numPossibleSymbols) {
    return null;
  }

  return Math.round(length * Math.log2(numPossibleSymbols) * 100) / 100;
}

const defaultNumWords = 5;
const maxNumWords = 50;

const app = Vue.createApp({
  data() {
    return {
      numWords: defaultNumWords,
      delimiter: ' ',
      passphrase: '',
      clipboardButton: null,
      isToastVisible: false,
    };
  },

  mounted: function () {
    this.clipboardButton = new ClipboardJS('#clipboard-button');
    this.clipboardButton.on('success', this.showToast);
    this.generatePassphrase();
  },

  methods: {
    generatePassphrase: function () {
      let selectedWords = [];

      if (this.numWords <= 0 || this.numWords > maxNumWords) {
        this.numWords = defaultNumWords;
      }

      for (let i = 0; i < this.numWords; i++) {
        selectedWords.push(words[getRandomNumber(words.length)]);
      }

      this.passphrase = selectedWords.join(this.delimiter);
    },
    showToast: function () {
      this.isToastVisible = true;

      setTimeout(this.hideToast, 5500);
    },

    hideToast: function () {
      this.isToastVisible = false;
    }
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
