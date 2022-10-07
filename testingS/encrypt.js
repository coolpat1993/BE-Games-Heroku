var CryptoJS = require("crypto-js");

const currentOrders = [
  {
    Drink: {
      price: "£4.80",
      name: "this is a normal sentence",
    },
  },
  {
    Drink: {
      price: "£3.80",
      name: "water",
    },
  },
  {
    Drink: {
      price: "£6.80",
      name: "rum",
    },
  },
];

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(
  currentOrders[0].Drink.name,
  "password"
).toString();

console.log(ciphertext);

// Decrypt

let test = CryptoJS.AES.decrypt(
  "U2FsdGVkX19VnE8rYSjWu3r0LXmsgOei5DKes/BpoqVCwqo7wPveSgCg5cSP5L0b",
  "password"
);
let originalText2 = test.toString(CryptoJS.enc.Utf8);

console.log(originalText2, "<<<<"); // 'my message'

var CryptoJS = require("crypto-js");

// Encrypt
var ciphertext = CryptoJS.AES.encrypt(
  JSON.stringify(currentOrders),
  "secret key 123"
).toString();

// Decrypt
var bytes = CryptoJS.AES.decrypt(ciphertext, "secret key 123");
var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

console.log(decryptedData); // [{id: 1}, {id: 2}]
