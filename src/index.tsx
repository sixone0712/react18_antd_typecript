import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
// import '@fontsource/roboto'; // Defaults to weight 400.
// import '@fontsource/roboto/100.css'; // Weight 100.
// import '@fontsource/roboto/700.css'; // Weight 700.
//TODO: 폰트 로딩 때문에 폰트가 나중에 바뀜, cdn을 로컬로 가져와서 @fontface로 불러와야 할듯....
// import '@fontsource/saira'; // Defaults to weight 400.
// import '@fontsource/saira/100.css'; // Weight 100.
// import '@fontsource/saira/700.css'; // Weight 700.
// import 'normalize.css';
import store from './reducers/store';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
