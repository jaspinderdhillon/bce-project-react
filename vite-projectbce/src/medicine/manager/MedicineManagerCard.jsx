import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function MedicineManagerCard({email, medname, medtype, medprice, medquantity, 
  dateofexpiry, city, usedfor, meddiscription, medimage, onDelete, onViewBuyers
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    if (showContact) setShowContact(false);
  };

  const toggleContact = () => {
    setShowContact(!showContact);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 w-80">
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{medname}</h3>
            <p className="text-sm text-gray-600 mt-1">{medtype}</p>
            {usedfor && (
              <p className="text-sm text-blue-600 mt-1">
                <span className="font-medium">Use:</span> {usedfor}
              </p>
            )}
          </div>
          
          {medimage && (
            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200 ml-2 flex-shrink-0">
              <img 
                src={medimage} 
                alt={medname} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                }}
              />
            </div>
          )}
        </div>

        {/* Quick Info */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Qty: {medquantity}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            ₹{medprice}
          </span>
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
            Exp: {new Date(dateofexpiry).toLocaleDateString()}
          </span>
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {city}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        <div className="flex justify-between space-x-2">
          <button
            onClick={toggleDetails}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showDetails ? (
              <>
                <ChevronUpIcon className="h-4 w-4 mr-1" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDownIcon className="h-4 w-4 mr-1" />
                View Details
              </>
            )}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onViewBuyers()}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              View Buyers
            </button>
            <button
              onClick={() => onDelete(email, medname)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex">
                <span className="font-medium w-24 text-gray-600">Email:</span>
                <span className="truncate">{email}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24 text-gray-600">Description:</span>
                <p className="flex-1">{meddiscription || 'No description provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineManagerCard;
