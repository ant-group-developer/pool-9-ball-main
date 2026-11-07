// Local adapter: no ads or remote tracking. Breaks resolve at once so play continues.
// There are no ads, so a rewarded break counts as watched: the in-game reward
// (extra time, 2x coins) is granted instead of leaving a button that never pays out.
(() => {
  const noop = () => {};
  window.PokiSDK = {
    adBlocked: true,
    init: () => Promise.resolve(),
    setDebug: noop,
    gameLoadingStart: noop,
    gameLoadingProgress: noop,
    gameLoadingFinished: noop,
    gameplayStart: noop,
    gameplayStop: noop,
    happyTime: noop,
    commercialBreak: () => Promise.resolve(),
    rewardedBreak: () => Promise.resolve(true)
  };
})();
