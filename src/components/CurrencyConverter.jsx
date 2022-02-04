import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CurrencyConverter(props) {

  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [countries, setCountries] = useState([]);

  // GET EXCHANGE RATES
  const getExchangeRate = async (fromCurrency, toCurrency) => {

    try {
      const response = await axios.get('http://data.fixer.io/api/latest?access_key=bff19ec48eef8c31fbf96d2b514ae472');
      const rate = response.data.rates;
      const euro = 1/rate[fromCurrency];
      const exchangeRate = euro * rate[toCurrency];
      setExchangeRate(exchangeRate);
    } catch (ex) {
      console.log(ex.message);
    }
  }

  // GET COUNTRIES
  const getCountries = async (toCurrency) => {
    if(toCurrency) {
      try{
        const response = await axios.get(`http://api.countrylayer.com/v2/currency/${toCurrency}?access_key=eabbbdc71392d4e08f9fc53c6872c942`);
        
        const countries = response.data.map(country => country.name);
        console.log(countries);
        setCountries(countries);

      } catch(ex) {
        console.log(ex.message);
      }
    } else {
      console.log('Provide a proper currency');
    }
  }

  // CONVERT CURRENCT
  const convertCurrency = (amountToConvert) => {
    const convertedAmount = (amountToConvert * exchangeRate).toFixed(2);

    return `${amountToConvert} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
  }

  useEffect(() => {
    getExchangeRate(fromCurrency, toCurrency);
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    getCountries(toCurrency);
  }, [toCurrency])

  const handleSubmit = (event) => {
    event.preventDefault();
    const fromCurrency = event.target[0].value;
    const toCurrency = event.target[1].value;
    const amountToConvert = event.target[2].value;
    
    if(fromCurrency && toCurrency) {
      setFromCurrency(fromCurrency);
      setToCurrency(toCurrency);

      console.log(convertCurrency(amountToConvert));
    } else {
      console.log(`Input proper currency codes!`);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="From">Enter the currency you want to convert from:</label>
          <input type="text" placeholder="From" name="from" />
        </div>

        <div>
          <label htmlFor="To">Enter the currency you want to convert to:</label>
          <input type="text" placeholder="To" name="to"/>
        </div>

        <div>
          <label htmlFor="amountToConvert">Amount to convert:</label>
          <input type="text" placeholder="Amount to convert" name="amountToConvert"/>
        </div>

        <button type="submit">Exchange</button>
      </form>

      <div>
        
      </div>
    </div>
  );
}

export default CurrencyConverter;

// Exchange Rate -> http://data.fixer.io/api/latest?access_key=bff19ec48eef8c31fbf96d2b514ae472
// Countries -> http://api.countrylayer.com/v2/currency/USD?access_key=eabbbdc71392d4e08f9fc53c6872c942

// 1st fucntion -> getExchangeRate
// 2nd Function -> getCountries
// 3rd function -> convertCurrency

// call convert currency to get meaningful data