const ID = "prototype-token-settings";

const CHAR = "char";
const NPC = "npc";
const OTHER = "other";
const ACTORS = [CHAR, NPC, OTHER];

const LINK_ACTOR = "actorLink";
const APPEND_NUMBER = "appendNumber";
const PREPEND_ADJ = "prependAdjective";
const DISPLAY_NAME = "displayName";
const ATTRS = [LINK_ACTOR, APPEND_NUMBER, PREPEND_ADJ];

const defaults = {};
defaults[CHAR] = {};
defaults[CHAR][LINK_ACTOR] = true;
defaults[CHAR][APPEND_NUMBER] = false;
defaults[CHAR][PREPEND_ADJ] = false;
defaults[CHAR][DISPLAY_NAME] = 30;
defaults[NPC] = {};
defaults[NPC][LINK_ACTOR] = false;
defaults[NPC][APPEND_NUMBER] = false;
defaults[NPC][PREPEND_ADJ] = true;
defaults[NPC][DISPLAY_NAME] = 30;
defaults[OTHER] = {};
defaults[OTHER][LINK_ACTOR] = false;
defaults[OTHER][APPEND_NUMBER] = false;
defaults[OTHER][PREPEND_ADJ] = false;
defaults[OTHER][DISPLAY_NAME] = 30;

const DISPLAY_CHOICES = {
  0: "Never",
  10: "While Selected",
  20: "Hovered by Owner",
  30: "Hovered by Anyone",
  40: "Always for Owner",
  50: "Always for Anyone",
}

const LOC = {
  "char": "Player Character",
  "npc": "NPC",
  "other": "Other",
  "actorLink": "Link Actor",
  "appendNumber": "Append Incrementing Number",
  "prependAdjective": "Prepend Random Adjective",
  "displayName": "Display Name",
};

Hooks.once("init", () => {
  ACTORS.forEach(actor => {
    ATTRS.forEach(attr => {
      game.settings.register(ID, actor + "." + attr, {
        name: LOC[actor] + " - " + LOC[attr],
        default: defaults[actor][attr],
        type: Boolean,
        scope: "world",
        config: true,
        hint: LOC[attr] + " for " + LOC[actor],
      });
    });

    let attr = DISPLAY_NAME;
    game.settings.register(ID, actor + "." + attr, {
      name: LOC[actor] + " - " + LOC[attr],
      default: defaults[actor][attr],
      type: Number,
      choices: DISPLAY_CHOICES,
      scope: "world",
      config: true,
      hint: LOC[attr] + " for " + LOC[actor],
    });
  });
});

Hooks.on("preCreateActor", function(actor, args, userId) {
  let actorType = OTHER;
  if(actor.constructor.name == "CharacterPF2e")
  {
    actorType = CHAR;
  }
  else if(actor.constructor.name == "NPCPF2e")
  {
    actorType = NPC;
  }

  let prototypeTokenSettings = {};
  prototypeTokenSettings[DISPLAY_NAME] = game.settings.get(ID, actorType + "." + DISPLAY_NAME);
  ATTRS.forEach(attr => {
    prototypeTokenSettings[attr] = game.settings.get(ID, actorType + "." + attr);
  });

  actor.updateSource({prototypeToken: prototypeTokenSettings});
});
