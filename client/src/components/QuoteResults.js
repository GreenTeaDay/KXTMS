import React from 'react';
import '../css/QuoteResults.css';


function QuoteResults({ rates }) {

    console.log('Rates:', rates);

    if (!Array.isArray(rates)) {
        return <p>No quotes available.</p>;
      }
    return (
        <div>
            {rates.map((rates, index) => (
                <div key={index} className="quote-card">
                    {/* Display individual quote details here */}
                    <div className="quote-detail">
                        <p>Mode: {rates.mode}</p>
                        <p>payment Terms: {rates.paymentTerms}</p>
                        <p>Total Cost: ${rates.total ? rates.total.toFixed(2) : 'N/A'}</p>
                        <p>Reference: {rates.ref}</p>
                        <p>Estimated Days: {rates.days}</p>
                        <p>Service Type: {rates.serviceType}</p>
                        <p>Service Description: {rates.serviceDescription}</p>
                        <p>Time: {rates.time}</p>
                        <p>Carrier: {rates.carrier}</p>
</div>
                </div>
            ))}
        </div>
    );
}


export default QuoteResults;