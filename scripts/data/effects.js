var CoC = CoC || {};
CoC.data = CoC.data || {};

//Effects
CoC.data.effects = new Backbone.Collection([

  { uid: "attack", name:"Attack", description:"Increases damage on all attacks.", image:"images/effects/attack.jpg", base:5 },
  { uid: "stun", name:"Stun", description:"Chance to Stun on special attacks.", image:"images/effects/stun.jpg", base:15 },
  { uid: "critrate", name:"Critical Rate", description:"Increases the chance for Critical hit.", image:"images/effects/critical.jpg", base:5 },
  { uid: "critdamage", name:"Critical Damage", description:"Increases damage multiplier for Critical hits.", image:"images/effects/critical.jpg", base:15 },
  { uid: "powergain", name:"Power Gain", description:"Gain addition Power for whenever Power is gained.", image:"images/effects/mana.jpg", base:3 },
  { uid: "powersteal", name:"Power Steal", description:"Gain Power when attacking.", image:"images/effects/mana_steal.jpg", base:3 },
  { uid: "perfectblock", name:"Perfect Block", description:"Increased chance to Perfect Block for 0 damage.", image:"images/effects/block.jpg", base:3 },
  { uid: "block", name:"Block Proficiency", description:"Increases Block effectiveness for less damage taken.", image:"images/effects/block.jpg", base:10 },
  { uid: "armor", name:"Armor", description:"Increases Armor so that all damage taken is decreased.", image:"images/effects/armor.jpg", base:4 },
  { uid: "health", name:"Health", description:"Increases champion Health.", image:"images/effects/health.jpg", base:4 },
  { uid: "healthsteal", name:"Health Steal", description:"Gain Health when attacking.", image:"images/effects/health_steal.jpg", base:4 }

], {
  model: CoC.model.Effect
});