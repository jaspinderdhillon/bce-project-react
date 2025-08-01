import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

const MedicineFetchCard = ({
  medname,
  medtype,
  medprice,
  medquantity,
  dateofexpiry,
  city,
  usedfor,
  medimage,
  meddiscription,
  email,
  contact,
  address,
  onBuyNow
}) => {
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
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Main Card Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{medname}</h3>
            <p className="text-sm text-gray-600 mt-1">{medtype}</p>
            {usedfor && (
              <p className="text-sm text-blue-600 mt-1">
                <span className="font-medium">Use:</span> {usedfor}
              </p>
            )}
          </div>
          
          {medimage && (
            <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
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
          
          <button
            onClick={onBuyNow}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            Buy Now
          </button>
        </div>

        {/* Contact Button */}
        <button
          onClick={toggleContact}
          className="mt-2 w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          {showContact ? 'Hide Contact' : 'Show Contact'}
        </button>
      </div>

      {/* Details Dropdown */}
      {showDetails && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
          <div className="space-y-2 text-sm text-gray-700">
            {meddiscription && (
              <p><span className="font-medium">Description:</span> {meddiscription}</p>
            )}
            <p><span className="font-medium">Type:</span> {medtype}</p>
            <p><span className="font-medium">City:</span> {city}</p>
            <p><span className="font-medium">Expiry:</span> {new Date(dateofexpiry).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      {/* Contact Info Dropdown */}
      {showContact && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-blue-50">
          <div className="space-y-2 text-sm">
            {email && (
              <div className="flex items-center">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-600" />
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                  {email}
                </a>
              </div>
            )}
            {contact && (
              <div className="flex items-center">
                <PhoneIcon className="h-4 w-4 mr-2 text-blue-600" />
                <a href={`tel:${contact}`} className="text-blue-600 hover:underline">
                  {contact}
                </a>
              </div>
            )}
            {address && (
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineFetchCard;
