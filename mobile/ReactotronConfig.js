import Reactotron, { networking } from "reactotron-react-native";

Reactotron.configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(networking({
    ignoreUrls: /symbolicate|logs/,
    ignoreContentTypes: /^(image)\/.*$/i,
  }))
  .connect(); // let's connect!