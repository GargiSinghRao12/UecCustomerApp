import Toast from "react-native-simple-toast";

export let simpleToast = (message, withGravity = false, toastType = Toast.SHORT) => {
  if (withGravity) {
    Toast.showWithGravity(message, toastType);
  } else {
    Toast.show(message, toastType);
  }
};
