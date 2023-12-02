import "./App.css";
import * as S from "./App.styled";
import { useState, useEffect } from "react";
import { axiosInstance } from "./api";
import { API_KEY, BASE_CURRENCY, CURRENCIES } from "./constants";
import { createContext } from "react";
import { Header, CurrenciesConvertorTab, ErrorTab } from "./Components";

export const CurrenciesRatesContext = createContext();

export const App = () => {
  const [currencyRates, setCurrenciesRates] = useState({
    data: null,
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    (async () => {
      setCurrenciesRates({ ...currencyRates, isLoading: true });
      try {
        const result = await axiosInstance.get(
          `?apikey=${API_KEY}&base_currency=${BASE_CURRENCY}&currencies=${CURRENCIES.join(
            ","
          )}`
        );

        const extractedCurrenciesData = Object.fromEntries(
          Object.values(result.data.data).map((item) => [
            [item.code],
            item.value,
          ])
        );
        setCurrenciesRates({
          ...currencyRates,
          isLoading: false,
          data: { [BASE_CURRENCY]: 1, ...extractedCurrenciesData },
        });
      } catch (e) {
        setCurrenciesRates({
          ...currencyRates,
          error: {
            status: e.response.status,
            message: e.response.data.message,
          },
          isLoading: false,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.Container>
      <CurrenciesRatesContext.Provider value={currencyRates}>
        <Header />
        <main>
          {!currencyRates.isLoading &&
          currencyRates.data &&
          !currencyRates.error ? (
            <CurrenciesConvertorTab />
          ) : null}
          {!currencyRates.isLoading &&
          !currencyRates.data &&
          currencyRates.error ? (
            <ErrorTab />
          ) : null}
        </main>
      </CurrenciesRatesContext.Provider>
    </S.Container>
  );
};