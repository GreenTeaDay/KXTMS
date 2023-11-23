import React, { useState } from 'react';
import '../css/QuoteResults.css';

function QuoteResults({ rates }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Adjust this number as needed

    // Check if rates is an array
    if (!Array.isArray(rates) || rates.length === 0) {
        return <p>No quotes available.</p>;
    }

    

    // Calculate Indices for Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentQuotes = rates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(rates.length / itemsPerPage);


    // Render Page Numbers
    const renderPageNumbers = pageNumbers => (
        
        <div className="pagination">
            {pageNumbers.map(number => (
                <button key={number} onClick={() => setCurrentPage(number)}>
                    {number}
                </button>
            ))}
        </div>
    );

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            {currentQuotes.map((rate, index) => (
                <div key={index} className="quote-card">
                    <div className="quote-detail">
                        <p>Mode: {rate.mode}</p>
                        <p>Payment Terms: {rate.paymentTerms}</p>
                        <p>Total Cost: ${rate.total ? rate.total.toFixed(2) : 'N/A'}</p>
                        <p>Reference: {rate.ref}</p>
                        <p>Estimated Days: {rate.days}</p>
                        <p>Service Type: {rate.serviceType}</p>
                        <p>Service Description: {rate.serviceDescription}</p>
                        <p>Time: {rate.time}</p>
                        <p>Carrier: {rate.carrier}</p>
                    </div>
                </div>
            ))}
            {renderPageNumbers(pageNumbers)}
        </div>
    );
}

export default QuoteResults;
