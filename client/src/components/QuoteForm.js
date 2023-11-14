import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function QuoteForm() {

  
  const { token } = useContext(AuthContext);
  const [weight, setWeight] = useState(1); // Default to 0 or another sensible default

  const [freightClass, setFreightClass] = useState(60); // Added state for freightClass
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

    console.log("Weight:", weight);


     // Constructing the items array
     const items = [{
      weight: parseInt(weight), // Ensure weight is an integer
      freightClass: freightClass // Using the freightClass state
    }];

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/quotes`, 
        { weight, items, originPostalCode, destPostalCode, estimatedCost, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuoteResponse(response.data); // Store the quote response
      console.log("quoteResponse:", response.data);
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
          <label>Freight Class:</label> {/* Added input for Freight Class */}
          <input
            type="number"
            value={freightClass}
            onChange={e => setFreightClass(e.target.value)}
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
        {rate.status === 'error' && <p>Error: {rate.error}</p>} {/* Display error message */}
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
              {charge.name}: ${charge.amount.toFixed(2)}
            </li>
          ))}
        </ul>
        {rate.bookUrl && <p><a href={rate.bookUrl}>Book this rate</a></p>}
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



