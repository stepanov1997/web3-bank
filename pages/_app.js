import '../styles/globals.css'
import {wrapper} from "../store/store";
import {Provider} from "react-redux";

export default function MyApp({ Component, ...rest }) {
  const {store, props} = wrapper.useWrappedStore(rest);
  return (
      <Provider store={store}>
        <Component {...props.pageProps} />
      </Provider>
  )
}
