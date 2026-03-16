import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './auth/msalConfig';
import { store } from './store/store';
import { router } from './router';

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </MsalProvider>
  );
}

export default App;
