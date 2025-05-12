// Level 4 OPW Game Data

const level4Data = {
  "Unit-1": [
    {
      "blends": "bl, cl",
      "words": ["black", "blanket", "clock", "club"]
    },
    {
      "blends": "br, cr",
      "words": ["broom", "bride", "crab", "crocodile"]
    },
    {
      "blends": "fl, gl",
      "words": ["fly", "flag", "globe", "glass"]
    }
  ],
  "Unit-2": [
    {
      "blends": "fr, gr",
      "words": ["frog", "Friday", "green", "grass"]
    },
    {
      "blends": "pl, sl",
      "words": ["plate", "play", "slide", "sleep"]
    },
    {
      "blends": "dr, tr",
      "words": ["drum", "dress", "truck", "tree"]
    }
  ],
  "Unit-3": [
    {
      "blends": "sm, sn",
      "words": ["smile", "smoke", "snake", "snow"]
    },
    {
      "blends": "sp, sw",
      "words": ["spoon", "spot", "swing", "swim"]
    },
    {
      "blends": "st",
      "words": ["stop", "test", "stamp", "fast"]
    }
  ],
  "Unit-4": [
    {
      "blends": "sh",
      "words": ["shell", "fish", "ship", "brush"]
    },
    {
      "blends": "ch, tch",
      "words": ["chick", "lunch", "watch", "catch"]
    },
    {
      "blends": "ph, wh",
      "words": ["phone", "dolphin", "whale", "white"]
    }
  ],
  "Unit-5": [
    {
      "blends": "th",
      "words": ["this", "that", "mother", "father"]
    },
    {
      "blends": "th",
      "words": ["three", "teeth", "think", "bath"]
    },
    {
      "blends": "ck, qu",
      "words": ["duck", "rocket", "queen", "quilt"]
    }
  ],
  "Unit-6": [
    {
      "blends": "ng, nk",
      "words": ["king", "long", "bank", "pink"]
    },
    {
      "blends": "nd, nt",
      "words": ["wind", "hand", "tent", "paint"]
    },
    {
      "blends": "lt, mp",
      "words": ["belt", "adult", "lamp", "camp"]
    }
  ],
  "Unit-7": [
    {
      "blends": "sk, sc",
      "words": ["skunk", "desk", "scale", "school"]
    },
    {
      "blends": "spr, str",
      "words": ["spray", "spring", "string", "strong"]
    },
    {
      "blends": "spl, squ",
      "words": ["splash", "splint", "squid", "square"]
    }
  ],
  "Unit-8": [
    {
      "blends": "c",
      "words": ["rice", "city", "ice cream", "cell phone"]
    },
    {
      "blends": "g",
      "words": ["giraffe", "orange", "giant", "cage"]
    },
    {
      "blends": "s",
      "words": ["rose", "jeans", "cheese", "legs"]
    }
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { level4Data };
}

// For browser use
if (typeof window !== 'undefined') {
  window.level4Data = level4Data;
}
