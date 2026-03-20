export { getUrlParams, getToken } from "@/util/token.js";

export const prizeImg_xy = {
  src:new URL( "../../public/k1.png", import.meta.url).href,
  width: "70%",
  top: "0%",
};
export const prizeImg_hy = {
  src:new URL( "../../public/k1.png", import.meta.url).href,
  width: "70%",
  top: "0%",
};
export const prizeImg_my = {
  src:new URL( "../../public/k1.png", import.meta.url).href,
  width: "70%",
  top: "0%",
};
export const prizeImg_max = {
  src:new URL( "../../public/k2.png", import.meta.url).href,
  width: "70%",
  top: "0%",
};

export const PRIZE_TYPE_MAP = {
  "1": prizeImg_xy,
  "2": prizeImg_hy,
  "3": prizeImg_my,
  "4": prizeImg_max,
}

export const getPageTypeImg = (pageType)=>{
  pageType === "xy"
    ? prizeImg_xy
    : pageType === "hy"
      ? prizeImg_hy
      : prizeImg_my;
}

export const getImgInfo = (prizeList, index, defaultImg)=>{
  if (!prizeList?.length) return defaultImg
  return [
    PRIZE_TYPE_MAP[prizeList[index].bq.toString()],
    { src: prizeList[index].img, width: "54%", top: "4%" },
  ]
}

export const prizeImg = {
  src: new URL( "../assets/start.png", import.meta.url).href,
  width: "100%",
  height: "100%",
  top: "-72%",
};

export const prizeImg2 = {
  src: new URL( "../assets/指针 (1).png", import.meta.url).href,
  width: `${40 * (document.body.clientWidth / 375)}px`,
  top: `-${10 * (document.body.clientWidth / 375)}px`,
};

export const getFontsInfo = (prizeList, index)=>{
  if (!prizeList?.length) return []
  return [
    {
      text: prizeList[index].name,
      top: "46%",
      fontSize: "8px",
      fontColor: "#fff",
      wordWrap: false,
    },
    {
      text: prizeList[index].price,
      top: "54%",
      fontSize: "9px",
      fontColor: "#FDEAAE",
    },
  ]
}

export const rotateEl = (el, angle, callback) => {
  const step = 5;
  let curCir = 0;
  let i = 0;
  const toAimRoate = ()=>{
    requestAnimationFrame(()=>{
      i += step;
      el.style.transform = `translate(-50%, 0%) rotate(${i}deg)`;
      if (i >= angle) {
        callback?.();
      }else {
        toAimRoate();
      }
    })
  }
  const doRoate = ()=>{
    requestAnimationFrame(()=>{
      i += step;
      el.style.transform = `translate(-50%, 0%) rotate(${i}deg)`;
      if (i >= 360 && curCir >= 2) {
        i = 0;
        toAimRoate();
      }else {
        if (i >= 360) {
          curCir++;
          i = 0;
        }
        doRoate();
      }
    })
  }

  doRoate();
};
