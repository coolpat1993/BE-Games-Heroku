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

function scramble(password) {
  let nameArray = currentOrders[0].Drink.name.split("");
  let passwordArray = password.split("");
  let numberArray = [];
  let backToText = [];

  for (let i = 0; i < nameArray.length; i++) {
    numberArray.push(
      nameArray[i].charCodeAt(0) +
        passwordArray[0].charCodeAt(0) -
        passwordArray[1].charCodeAt(0)
    );
    if (numberArray[i] >= 122) {
      numberArray[i] -= 40;
    }
    backToText.push(String.fromCharCode(numberArray[i]));
  }

  return backToText.join("");
}
console.log(scramble("hello"));

function deScamble(scrambled, password) {
  let scrambledArray = scrambled.split("");
  let passwordArray = password.split("");
  const letterArray = [];
  const backToText = [];

  for (let i = 0; i < scrambledArray.length; i++) {
    if (scrambledArray[i].charCodeAt(0) >= 82) {
      console.log(scrambledArray[i].charCodeAt(0));
    }
    letterArray.push(
      scrambledArray[i].charCodeAt(0) -
        passwordArray[0].charCodeAt(0) +
        passwordArray[1].charCodeAt(0)
    );
    backToText.push(String.fromCharCode(letterArray[i]));
  }
  //   console.log(scrambledArray);
  return backToText.join("");
}

console.log(deScamble("[wxZ/xZ/p/UVYTpS/ZtU[tUrt", "password"));
