function getRandomNumbers(ceiling, count) {
  const maxValue = 65535; // 2^16 - 1
  const maxSafeValue = maxValue - (maxValue % ceiling);
  const buffer = new Uint16Array(count);
  const results = new Array(count);

  let resultCount = 0;

  // Only add values in the non-biased range (0 to maxSafeValue)
  while (resultCount < count) {
    crypto.getRandomValues(buffer);

    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] < maxSafeValue) {
        results[resultCount++] = buffer[i] % ceiling;

        if (resultCount >= count) {
          break;
        }
      }
    }
  }

  return results;
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
      if (this.numWords <= 0 || this.numWords > maxNumWords) {
        return this.passphrase = '';
      }

      const randomIndexes = getRandomNumbers(words.length, this.numWords);
      let selectedWords = [];

      for (let i = 0; i < this.numWords; i++) {
        selectedWords.push(words[randomIndexes[i]]);
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
