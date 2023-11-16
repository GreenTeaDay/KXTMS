import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

function QuoteForm() {
  const { token } = useContext(AuthContext);
  const [weight, setWeight] = useState(1);
  const [freightClass, setFreightClass] = useState(60);
  const [originPostalCode, setOriginPostalCode] = useState('');
  const [destPostalCode, setDestPostalCode] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [status, setStatus] = useState('Pending');

  const [quoteResponse, setQuoteResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const items = [{
      weight: parseInt(weight),
      freightClass: freightClass
    }];

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/quotes`, 
        { weight, items, originPostalCode, destPostalCode, estimatedCost, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuoteResponse(response.data);
    } catch (err) {
      setError('Error generating quote: ' + err.message);
    }
  };

  const renderRateDetails = (rate) => {
    if (rate.status === 'error') {
      return <p>Error Message: {rate.error}</p>;
    }
    return (
      <>
        <p>Mode: {rate.mode}</p>
        <p>Payment Terms: {rate.paymentTerms}</p>
        <p>Total Cost: ${rate.total ? rate.total.toFixed(2) : 'N/A'}</p>
        <p>Reference: {rate.ref || 'N/A'}</p>
        <p>Estimated Days: {rate.days || 'N/A'}</p>
        <p>Service Type: {rate.serviceType || 'N/A'}</p>
        <p>Service Description: {rate.serviceDescription || 'N/A'}</p>
        <p>Time: {rate.time || 'N/A'}</p>
        <p>Carrier: {rate.carrier} (Code: {rate.carrierCode})</p>
        <ul>
          {rate.charges && rate.charges.map((charge, chargeIndex) => (
            <li key={chargeIndex}>
              {charge.name}: ${charge.amount ? charge.amount.toFixed(2) : 'N/A'}
            </li>
          ))}
        </ul>
        {rate.bookUrl && <p><a href={rate.bookUrl}>Book this rate</a></p>}
      </>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* ... (rest of your form fields) */}
        <button type="submit">Submit Quote</button>
      </form>

      {quoteResponse && quoteResponse.freightviewQuotes && quoteResponse.freightviewQuotes.rates && (
        <div>
          <h2>Quote Generated Successfully</h2>
          {quoteResponse.freightviewQuotes.rates.map((rate, index) => (
            <div key={index}>
              <h3>Rate #{index + 1}</h3>
              {renderRateDetails(rate)}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div>
          <p className="error">{error}</p>
        </div>
      )}
    </div>
  );
}

export default QuoteForm;
