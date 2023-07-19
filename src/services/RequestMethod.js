// export default class RequestMethod {
    getLocation = async (url, props) => {
        let response = await fetch(url);
        let rawResponse = await response.json();
        if (rawResponse) {
            return rawResponse
        } else {
            return {};
        }
    }
