"use client";
import React from 'react';

export function Prices() {
    return (
        <React.Fragment>
            <p className="flex items-center m-a text-gray text-xs">Цена:</p>
            <label className="flex ml-2 items-center text-xs m-a text-gray dark:text-white">от</label>
            <input
                type="number" id="number-input"
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 w-1/2 border ml-2 border-gray-300 text-gray-900 text-xs rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700
                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                            dark:focus:border-blue-500"  required/>
            <label className="ml-3 flex text-xs items-center m-a text-gray dark:text-white">до</label>
            <input
                type="number" id="number-input"
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 w-1/2 border ml-2 border-gray-300 text-gray-900 text-xs rounded-lg
                            focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700
                            dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                            dark:focus:border-blue-500" required/>
        </React.Fragment>
    );
}
