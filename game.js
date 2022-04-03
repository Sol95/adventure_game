// Adventure Game!! 

const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let state = {};

function startGame() {
  state = {gold: 0};
  showTextNode(1);

}

// The showTextNode function shows the current 'node' which includes the text and the options. It shows the correct node by finding 
// the id number. It then removes all option buttons, and adds new options if they fit the criteria (showOption function). If the option passes
// the test a button will be created, and the text from the option will be rendered inside the button. The button will receive styling, and
// is given a click event listener.


function showTextNode(textNodeIndex) {
  const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
  textElement.innerText = textNode.text;
  while (optionButtonsElement.firstChild) {
    optionButtonsElement.removeChild(optionButtonsElement.firstChild)
  };

  textNode.options.forEach(option => {
    if (showOption(option)) {
      const button = document.createElement('button');
      button.innerText = option.text;
      button.classList.add('btn');
      button.addEventListener('click', () => selectOption(option));
      optionButtonsElement.appendChild(button);
    }
  });
}

// The selectOption function is the response to the click event listener on an option button. The button will read option.nextText to take
// you to the id of the correct text node. If it is a fail/death it will give you an option to restart the game. If there is an option.setState,
// the function will assign the property & value to state{}. I've put addGold and removeGold in here too, which is essentially the same as
// setting the state, but it's a + or - rather than a direct override. I might put this in a seperate function later.

function selectOption(option) {
  const nextTextNodeId = option.nextText;
  if (nextTextNodeId <= 0) {
    return startGame()
  }
  state = Object.assign(state, option.setState);
  showTextNode(nextTextNodeId);
  if (option.hasOwnProperty('addGold')) {
    state.gold += option.addGold;
  } else if (option.hasOwnProperty('removeGold')) {
    state.gold -= option.removeGold;
  }

}

// The showOption function simply checks if an option should be displayed, based on the 'requiredState'. The option will show if there is no
// required state or if the required state is met

function showOption(option) {
  return option.requiredState == null || option.requiredState(state);
}



const textNodes = [
  {
    id: 1,
    text: 'Welcome to this text based adventure game. Click start to begin:',
    options: [
      {
        text: 'START',
        nextText: 2,
      },
      {
        text: 'go',
        nextText: 35
      }
    ]
  },
  {
    id: 2,
    text: 'You wake up in a dark cave, with a huge headache and no memory of how you got there. Next to you are some glowing green rocks. They might be dangerous. What would you like to do?',
    options: [
      {
        text: 'Take the rocks',
        setState: { greenRocks: true},
        nextText: 3,
      },
      {
        text: 'Leave the rocks',
        nextText: 3,
      }
    ]
  },
  {
    id: 3,
    text: 'You venture forth down the road, and bump into a wandering trader.',
    options: [
      {
        text: 'Trade the rocks for a sword',
        requiredState: (currentState) => currentState.greenRocks,
        setState: { greenRocks: false, sword: true },
        nextText: 4,
      },
      {
        text: 'Trade the rocks for a shield',
        requiredState: (currentState) => currentState.greenRocks,
        setState: { greenRocks: false, shield: true },
        nextText: 5,
      },
      {
        text: 'Trade the rocks for some gold',
        requiredState: (currentState) => currentState.greenRocks,
        setState: { greenRocks: false },
        addGold: 1,
        nextText: 6,
      },
      {
        text: 'Ignore trader',
        nextText: 7,
      }
    ]  
  },
  {
    id: 4,
    text: 'The trader is happy with the strange green rocks, and hands you a fine looking steel sword.',
    options: [
      {
        text: 'Continue',
        nextText: 7,
      }
    ]
  },
  {
    id: 5,
    text: 'The trader is content with the trade, and hands you a sturdy shield in return.',
    options: [
      {
        text: 'Continue',
        nextText: 7,
      }
    ]
  },
  {
    id: 6,
    text: 'The trader smiles and quickly grabs the green rocks from you, and drops one gold piece into your hand.',
    options: [
      {
        text: 'Continue',
        nextText: 7,
      }
    ]
  },
  {
    id: 7,
    text: 'You leave the trader and walk for many hours before stumbling onto a small town next to a dangerous looking castle.',
    options: [
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => !currentState.sword || !currentState.shield,
        nextText: 8
      },
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => currentState.sword && currentState.shield,
        nextText: 9
      },
      {
        text: 'Find a room to sleep in in the town.',
        requiredState: (currentState) => currentState.gold === 1,
        setState: {stayedAtInn: true },
        removeGold: 1,
        nextText: 10,
      },
      {
        text: 'Find a room to sleep in in the town.',
        requiredState: (currentState) => !currentState.gold > 0,
        nextText: 11,
      },
      {
        text: 'Find some hay in a barn to sleep in.',
        nextText: 12,
      }
    ]  
  },
  {
    id: 8,
    text: 'You encounter a fiery dragon in the castle, and despite your efforts to fight back, he kills you.',
    options: [
      {
        text: 'Restart',
        nextText: -1,
      }
    ]
  },
  {
    id: 9,
    text: 'You kill the dragon and win the game!!.'
  },
  {
    id: 10,
    text: 'You pay the innkeeper 1 gold and rest for the night.',
    options: [
      {
        text: 'Continue',
        nextText: 13,
      }
    ]
  },
  {
    id: 11,
    text: 'Without any gold, you break in to the inn at night and sleep in the bed, only to be awoken by town guards and thrown into jail.',
    options: [
      {
        text: 'Restart',
        nextText: -1,
      }
    ]
  },
  {
    id: 12,
    text: 'You find a barn nearby with some fairly comfortable hay to fall asleep on',
    options: [
      {
        text: 'Continue',
        nextText: 13,
      }
    ]
  },
  {
    id: 13,
    text: 'You wake up after a decently restful night, though still very confused about your situation. What would you like to do today?',
    options: [
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => !currentState.sword || !currentState.shield,
        nextText: 8
      },
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => currentState.sword && currentState.shield,
        nextText: 9
      },
      {
        text: 'Talk to the innkeeper',
        requiredState: (currentState) => currentState.stayedAtInn,
        nextText: 14
      },
      {
        text: 'Head back to the cave',
        nextText: 24
      }, 
    ]
  },
  {
    id: 14,
    text: '"Hi there, how can I help?"',
    options: [
      {
        text: 'Ask about the castle',
        nextText: 15
      },
      {
        text: 'Ask about the cave',
        nextText: 16
      },
      {
        text: 'Ask about the green rocks',
        setState: { priceGreenRocks: true },
        nextText: 17
      },
      {
        text: "Ask him to trade",
        nextText: 18
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]  
  },
  {
    id: 15,
    text: 'Oh that castle is terribly dangerous.  A foul dragon lives there. Your only hope of beating him is with high quality weaponry.',
    options: [
      {
        text: 'Ask another question',
        nextText: 14
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 16,
    text: "I don't know much about that cave, only that if you wish to search it you will need a light source.",
    options: [
      {
        text: 'Ask another question',
        nextText: 14
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 17,
    text: "Ah yes, these are very valuable. If you have any I'll buy them for 5 gold pieces",
    options: [
      {
        text: 'Ask another question',
        nextText: 14
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 18,
    text: '"Take a look:"',
    options: [
      {
        text: 'Buy a sword (5 gold)',
        requiredState: (currentState) => currentState.gold === 5 && !currentState.sword,
        setState: { sword: true },
        removeGold: 5,
        nextText: 19
      },
      {
        text: 'Buy a shield (5 gold)',
        requiredState: (currentState) => currentState.gold === 5 && !currentState.shield,
        setState: { shield: true },
        removeGold: 5,
        nextText: 20
      },
      {
        text: 'Buy a torch (1 gold)',
        requiredState: (currentState) => currentState.gold === 1,
        setState: { torch: true },
        removeGold: 1,
        nextText: 21
      },
      {
        text: 'Sell your green rocks (5 gold)',
        requiredState: (currentState) => currentState.greenRocks,
        setState: { greenRocks: false },
        addGold: 5,
        nextText: 22
      },
      {
        text: 'Ask another question',
        nextText: 14
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 19,
    text: "Thank you. Here's your sword",
    options: [
      {
        text: 'Trade something else',
        nextText: 18
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 20,
    text: "Thank you. Here's your shield",
    options: [
      {
        text: 'Trade something else',
        nextText: 18
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 21,
    text: "Thank you. Here's your torch",
    options: [
      {
        text: 'Trade something else',
        nextText: 18
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 22,
    text: "Thank you. Here's your gold",
    options: [
      {
        text: 'Trade something else',
        nextText: 18
      },
      {
        text: 'Leave',
        nextText: 23
      }
    ]
  },
  {
    id: 23,
    text: 'What would you like to do now?',
    options: [
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => !currentState.sword || !currentState.shield,
        nextText: 8
      },
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => currentState.sword && currentState.shield,
        nextText: 9
      },
      {
        text: 'Talk to the innkeeper',
        requiredState: (currentState) => currentState.stayedAtInn,
        nextText: 14
      },
      {
        text: 'Head back to the cave',
        nextText: 24
      }, 
    ]
  },
  {
    id: 24,
    text: 'You walk along the trail, and you run into the trader again.',
    options: [
      {
        text: "Ask him what he's doing",
        nextText: 26
      },
      {
        text: 'Leave him alone',
        requiredState: (currentState) => !currentState.torch,
        nextText: 29
      },
      {
        text: 'Leave him alone',
        requiredState: (currentState) => currentState.torch,
        nextText: 31
      },      
      {
        text: "Interrogate him about the green rocks.",
        requiredState: (currentState) => currentState.priceGreenRocks && !currentState.alreadyInterrogated,
        setState: { alreadyInterrogated: true},
        addGold: 1,
        nextText: 27
      },
      {
        text: 'Head back to town',
        nextText: 30
      }
    ]
  },
  {
    id: 26,
    text: 'Trying not to be disturbed....',
    options: [
      {
        text: "Leave him alone",
        requiredState: (currentState) => !currentState.torch,
        nextText: 29
      },
      {
        text: 'Leave him alone',
        requiredState: (currentState) => currentState.torch,
        nextText: 31
      },
      {
        text: 'Head back to town',
        nextText: 30
      }
    ]
  },
  {
    id: 27,
    text: '"Okay look I\'m sorry! Please don\'t tell the innkeeper on me. All I have is 1 gold, here take it."',
    options: [
      {
        text: 'Take the gold',
        nextText: 28
      }
    ]
  },
  {
    id: 28,
    text: 'Would you like to continue to the cave, or head back to the town?',
    options: [
      {
        text: 'Continue to the cave',
        requiredState: (currentState) => !currentState.torch,
        nextText: 29
      },
      {
        text: 'Continue to the cave',
        requiredState: (currentState) => currentState.torch,
        nextText: 31
      },
      {
        text: 'Head back',
        nextText: 30
      }
    ]
  },
  {
    id: 29,
    text: 'You enter the cave, and without any light source, you quickly get lost and fall into a deep hole',
    options: [
      {
        text: 'Restart',
        nextText: -1
      },
    ]  
  },
  {
    id: 30,
    text: 'You arrive back in the town. What would you like to do?',
    options: [
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => !currentState.sword || !currentState.shield,
        nextText: 8
      },
      {
        text: 'Explore the castle.',
        requiredState: (currentState) => currentState.sword && currentState.shield,
        nextText: 9
      },
      {
        text: 'Talk to the innkeeper',
        requiredState: (currentState) => currentState.stayedAtInn,
        nextText: 14
      },
      {
        text: 'Head back to the cave',
        nextText: 24
      }, 
    ]
  },
  {
    id: 31,
    text: 'You enter the cave, and light your torch. There are three pathways to follow. Which way would you like to go?',
    options: [
      {
        text: 'Take the left path',
        requiredState: (currentState) => !currentState.sword,
        nextText: 32
      },
      {
        text: 'Take the left path',
        requiredState: (currentState) => currentState.sword,
        setState: { greenRocks: true },
        nextText: 38
      },
      {
        text: 'Take the middle path',
        requiredState: (currentState) => !currentState.beenHereBefore,
        nextText: 33
      },
      {
        text: 'Take the middle path',
        requiredState: (currentState) => currentState.beenHereBefore,
        nextText: 37
      },
      {
        text: 'Take the right path',
        requiredState: (currentState) => !currentState.shield,
        nextText: 34
      },
      {
        text: 'Take the right path',
        requiredState: (currentState) => currentState.shield,
        setState: { greenRocks: true },
        nextText: 39
      },
      {
        text: 'Put out your torch and leave the cave',
        nextText: 36
      }
    ]
  },
  {
    id: 32,
    text: 'A gigantic spider jumps down from the ceiling and wraps you in it\'s web. You\'ll be dinner tonight',
    options: [
      {
        text: 'Restart',
        nextText: -1,
      }
    ]
  },
  {
    id: 33,
    text: 'This area is quite empty, but you notice some more of those glowing green rocks from before. Do you want to take them?',
    options: [
      {
        text: 'Take them',
        setState: { greenRocks: true, beenHereBefore: true },
        nextText: 35
      },
      {
        text: 'Go back',
        nextText: 35
      }
    ]
  },
  {
    id: 34,
    text: 'You follow this path, for quite a while until suddenly a strong burst of wind comes from nowhere and blows out your torch. Without any light source, you quickly get lost and fall into a deep hole.',
    options: [
      {
        text: 'Restart',
        nextText: -1,
      }
    ]
  },
  {
    id: 35,
    text: 'You return to the entrance area of the cave. Where would you like to go?',
    options: [
      {
        text: 'Take the left path',
        requiredState: (currentState) => !currentState.sword,
        nextText: 32
      },
      {
        text: 'Take the left path',
        requiredState: (currentState) => currentState.sword,
        setState: { greenRocks: true },
        nextText: 38
      },
      {
        text: 'Take the middle path',
        requiredState: (currentState) => !currentState.beenHereBefore,
        nextText: 33
      },
      {
        text: 'Take the middle path',
        requiredState: (currentState) => currentState.beenHereBefore,
        nextText: 37
      },
      {
        text: 'Take the right path',
        requiredState: (currentState) => !currentState.shield,
        nextText: 34
      },
      {
        text: 'Take the right path',
        requiredState: (currentState) => currentState.shield,
        setState: { greenRocks: true },
        nextText: 39
      },
      {
        text: 'Put out your torch and leave the cave',
        nextText: 36
      }
    ]
  },
  {
    id: 36,
    text: 'You leave the cave and are back in the sunlight. Do you want to go back to town or talk to the trader again?',
    options: [
      {
        text: 'Talk to the trader',
        nextText: 24
      },
      {
        text: 'Return to the town',
        nextText: 30
      }
    ]
  },
  {
    id: 37,
    text: 'There\'s nothing in this area',
    options: [
      {
        text: 'Go back',
        nextText: 35
      }
    ]
  },
  {
    id: 38,
    text: 'A gigantic spider jumps down from the ceiling and attempts to wrap you in it\'s web. Luckily you have your trusty sword handy and swing at the spider before it can reach you. Behind it\'s corpse you notice some more green rocks.',
    options: [
      {
        text: 'Take them',
        nextText: 35,
      }
    ]
  },
  {
    id: 39,
    text: 'You follow this path, for quite a while until suddenly a strong burst of wind comes from nowhere. Luckily your torch was hidden behind your trusty shield and it stays lit. At the end of the corridor you find some more green rocks on the ground.',
    options: [
      {
        text: 'Take them',
        nextText: 35,
      }
    ]
  }
]

startGame() 