"use client";
import React from 'react';
import 'flowbite';

interface CommonDropdownProps {
  number: string;
  name: string;
  text: string;
  dictList: Record<string, any>[];
}


const CommonDropdown: React.FC<CommonDropdownProps> = (
    { number, name, text, dictList }) =>  {
  return (
      <React.Fragment>
          <button id={`dropdownSearchButton${number}`} data-dropdown-toggle={`dropdownSearch${number}`}
                  className="border border-black inline-flex ml-2
                  items-center px-4 py-2 text-xs focus:outline-none
                  font-medium text-center text-black bg-white-200 rounded-md
                  active::bg-gray-400 focus:ring-black-300 dark:bg-black-600
                  dark:hover:bg-black-700 dark:focus:ring-black-800"
                  type="button">{name}<svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none"
                                         viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="m1 1 4 4 4-4"/>
          </svg></button>

          <div id={`dropdownSearch${number}`} className="hidden z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700">
              <div className="p-3">
                  <p className="text-xs">{text}</p>
              </div>
              <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby={`dropdownSearchButton${number}`}>
                  {dictList.map((item, index) => (
                      <li key={index}>
                          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                              <input id={`checkbox-item-${index}-${number}`} type="checkbox" value={item.id ?? ''}
                                     className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded
                                     focus:ring-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700
                                     dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                              <label htmlFor={`checkbox-item-${index}-${number}`}
                                     className="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                  {item.name}
                              </label>
                          </div>
                      </li>
                  ))}
              </ul>
          </div>
      </React.Fragment>
  );
}

export default CommonDropdown
