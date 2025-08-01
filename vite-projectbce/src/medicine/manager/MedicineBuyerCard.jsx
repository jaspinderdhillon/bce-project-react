import React, { useState } from 'react';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const MedicineBuyerCard = ({
  name,
  email,
  contact,
  address,
  city,
  state,
  medicineself,
  medicinedonor,
  quantity,
  durationill,
  disease,
  selfpic,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">{name}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-700 transition-colors duration-200"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <p className="text-blue-100">{email}</p>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{contact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{city}, {state}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm text-gray-500">Address</p>
          <p className="font-medium">{address}</p>
        </div>

        {/* Dropdown Toggle */}
        <button
          onClick={toggleExpand}
          className="w-full flex justify-between items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="text-sm font-medium text-gray-700">View Details</span>
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {/* Dropdown Content */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-fadeIn">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Medicine Needed</span>
                <span className="font-medium">{medicineself}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Donor's Medicine</span>
                <span className="font-medium">{medicinedonor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Quantity</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Illness Duration</span>
                <span className="font-medium">{durationill}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Disease</span>
                <span className="font-medium">{disease}</span>
              </div>
            </div>

            {selfpic && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Document/Proof</p>
                <img
                  src={selfpic}
                  alt="Selfpic/Proof"
                  className="w-full rounded-lg border border-gray-200 object-cover max-h-64"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineBuyerCard;
