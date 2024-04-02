import "./App.css";
import "leaflet/dist/leaflet.css";
import Modal from "./components/UI/Modal";

import Main from "./navigation/Main";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { refreshAuthToken } from "./services/auth";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      //  refetchInterval: 10000, // Refetch every 10 seconds
      refetchOnMount: true,
      staleTime: 0,
      onError: (error) => {
        // Check if the error is an auth error (e.g., token expired)
        console.log("error", error);
      },
    },
  },
});
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  // useAuthInterceptor(); // Use the interceptor hook
  return (
    <QueryClientProvider client={queryClient}>
      <Modal>
        <Toaster />
        <Elements stripe={stripePromise}>
          <Main />
        </Elements>
      </Modal>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
