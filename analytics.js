const goatCounterScript =
  document.createElement("script");

goatCounterScript.setAttribute(
  "data-goatcounter",
  "https://digmoca.goatcounter.com/count"
);

goatCounterScript.async = true;

goatCounterScript.src =
  "https://gc.zgo.at/count.js";

document.head.appendChild(
  goatCounterScript
);
