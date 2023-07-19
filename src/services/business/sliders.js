import UserApi from "../UserApi";
import AppConfig from "../../components/constants/AppConfig";

export let getSliders = async () => {
  let sliderImages = [];
  let slides = await UserApi.getSliderData();
  slides.map((data, index) => {
    data.items.map((item, index) => {
      sliderImages.push(item);
    });
  });
  setImagePath(sliderImages);
  return sliderImages;
};

function setImagePath(slides) {
  if (slides && slides.length > 0) {
    slides.forEach(item => {
      item.image = AppConfig.BASE_URL + item.image;
    });
  }
}
