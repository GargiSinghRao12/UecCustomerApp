/** @format */

import { PixelRatio } from "react-native";
import React from "react";
import currencyFormatter from "currency-formatter";

export default class Tools extends React.Component {
  constructor(props) {
    super(props);
    this.filter = {};
    this.state = {
      value: 2000,
    };
    this.DefaultCurrency = {
      symbol: "₹",
      name: "Rupees",
      code: "INR",
      name_plural: "Rupees",
      decimal: ".",
      thousand: ",",
      precision: 2,
      format: "%s%v", // %s is the symbol and %v is the value
    };
  }

  // format currency
  static getCurrecyFormatted = (price) => {
    let formatedPrice = "";
    if (price && price !== "") {
      price = Math.floor(parseInt(price));
      formatedPrice = currencyFormatter.format(price, {
        ...this.DefaultCurrency,
      });

      // formatedPrice = Math.floor(formatedPrice);
    }

    return formatedPrice;
  };

  static getCurrencyFormattedNoDecimal = (price) => {
    let formatedPrice = "";
    if (price && price !== "") {
      formatedPrice = currencyFormatter.format(price, {
        ...this.DefaultCurrency,
      });
      formatedPrice = Math.floor(formatedPrice);
    }

    return formatedPrice;
  };

}