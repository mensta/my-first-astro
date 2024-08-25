import config from "@/config/adsense.json";

const ADSENSE_PUB_ID = config.adsense_pub_id;
const ADSENSE_INARTICLE_SLOT_ID = config.adsense_inarticle_slot_id;
const ADSENSE_TEST_MODE = config.adsense_test_mode;

let oncePageLoaded = false;

function insertInArticleAds() {
  const h2Elements = document.querySelectorAll("article h2");
  const endAdContainer = document.getElementById("article-end-ad");
  const adCode = `
      <ins class="adsbygoogle" style="display:block"
           data-ad-client="ca-pub-${ADSENSE_PUB_ID}"
           data-ad-slot="${ADSENSE_INARTICLE_SLOT_ID}"
           data-ad-layout="in-article"
           data-ad-format="fluid"
           ${ADSENSE_TEST_MODE ? 'data-adtest="on"' : ''}>
      </ins>`;
  let insertCount = 0;

  for (let i = 0; i < h2Elements.length; i++) {
    if (i % 2 === 0) {
      insertCount++;
      h2Elements[i].insertAdjacentHTML("beforebegin", adCode);
    }
  }

  if (endAdContainer) {
    endAdContainer.innerHTML = adCode;
    insertCount++;
  }

  Array(insertCount).fill().forEach(() => (window.adsbygoogle = window.adsbygoogle || []).push({}));
}

window.addEventListener(
  "scroll",
  function () {
    console.log("Activate Google AdSense");

    insertInArticleAds();

    let ads = document.createElement("script");
    ads.type = "text/javascript";
    ads.async = true;
    ads.crossOrigin = "anonymous";
    ads.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${ADSENSE_PUB_ID}`;
    let ref = document.getElementsByTagName("script")[0];
    ref.parentNode?.insertBefore(ads, ref);
  },
  { capture: true, once: true },
);

document.addEventListener('astro:page-load', () => {
  if (!oncePageLoaded) {
    oncePageLoaded = true;
    return;
  }
  insertInArticleAds();
});
