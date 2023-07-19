import UserApi from "../UserApi";
import BaseURL from "../BaseURL";
import AppConfig from "../../components/constants/AppConfig";

export let getProductWidgets = async () => {
  let widgetData = await UserApi.getWidgetData();
  if (widgetData && widgetData.length > 0) {
    widgetData = widgetData.filter(item => {
      return item.products && item.products.length > 0;
    });

    widgetData.forEach(widget => {
      widget.products.forEach(product => {
        product.thumbnailUrl = BaseURL.BASE_URL + product.thumbnailUrl;
      });
    });
  }
  return widgetData;
};

export let getProductDetail = async (productId) => {
  let productDetail = await UserApi.getPackSize(productId);
  setImagePath(productDetail);
  return productDetail;
};

function setImagePath(slides) {
  if (slides.images && slides.images.length > 0) {
    slides.images.forEach(item => {
      item.url = AppConfig.BASE_URL + item.url;
      item.thumbnailUrl = AppConfig.BASE_URL + item.thumbnailUrl;
    });
  }
}
