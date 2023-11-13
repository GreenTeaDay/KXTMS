import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function QuoteForm() {
  const { token } = useContext(AuthContext);
  const [weight, setWeight] = useState('');
  const [originPostalCode, setOriginPostalCode] = useState('');
  const [destPostalCode, setDestPostalCode] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [status, setStatus] = useState('Pending');

  // New state to store the quote response
  const [quoteResponse, setQuoteResponse] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    console.log("handleSubmit called");
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/quotes`, 
        { weight, originPostalCode, destPostalCode, estimatedCost, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuoteResponse(response.data); // Store the quote response
    } catch (err) {
      setError('Error generating quote: ' + err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Generate a Quote</h2>
        <div>
          <label>Weight:</label>
          <input
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Origin Postal Code:</label>
          <input
            type="number"
            value={originPostalCode}
            onChange={e => setOriginPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Destination Postal Code:</label>
          <input
            type="number"
            value={destPostalCode}
            onChange={e => setDestPostalCode(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estimated Cost:</label>
          <input
            type="number"
            value={estimatedCost}
            onChange={e => setEstimatedCost(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit">Submit Quote</button>  
      </form>
      {quoteResponse && quoteResponse.rates && (
      <div>
        <h2>Quote Generated Successfully</h2>
        {quoteResponse.rates.map((rate, index) => (
          <div key={index}>
            <h3>Rate #{index + 1}</h3>
            <p>Status: {rate.status}</p>
            <p>Mode: {rate.mode}</p>
            <p>Payment Terms: {rate.paymentTerms}</p>
            <p>Total Cost: ${rate.total.toFixed(2)}</p>
            <p>Reference: {rate.ref}</p>
            <p>Estimated Days: {rate.days}</p>
            <p>Service Type: {rate.serviceType}</p>
            <p>Service Description: {rate.serviceDescription}</p>
            <p>Time: {rate.time}</p>
            <p>Carrier: {rate.carrier} (Code: {rate.carrierCode})</p>
            <ul>
              {rate.charges.map((charge, chargeIndex) => (
                <li key={chargeIndex}>
                  {charge.name}: ${charge.amount.toFixed(2)}
                </li>
              ))}
            </ul>
            <p><a href={rate.bookUrl}>Book this rate</a></p>
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
