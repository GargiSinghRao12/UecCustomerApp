
export function SigningOut(props) {
    props.navigation.navigate('Login')
  }
  
  export function StringValueFromEnum(enumName, value) {
    for (var k in enumName) if (enumName[k] == value) return k;
    return null;
  }