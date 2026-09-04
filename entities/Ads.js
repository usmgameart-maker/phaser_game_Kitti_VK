// показ интерстициальной рекламы через VK Bridge (между уровнями)
// вне VK (GitHub Pages напрямую, локальный тест) просто ничего не делает

let lastAdTime = 0;
const MIN_INTERVAL_MS = 60000; // не чаще раза в минуту, как рекомендует VK

export function showInterstitialAd()
{
    if (typeof vkBridge === 'undefined')
        return Promise.resolve();

    const now = Date.now();

    if (now - lastAdTime < MIN_INTERVAL_MS)
        return Promise.resolve();

    lastAdTime = now;

    return vkBridge.send('VKWebAppShowNativeAds', { ad_format: 'interstitial' })
        .catch(() => null);
}
