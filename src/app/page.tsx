"use client";
import React from "react";
import CommonDropdown from "@/app/components/dropdown";
import {Prices} from "@/app/components/inputs";
import DataList from "@/app/components/list";

export default async function Home() {
    const dictList = [
        {name: 'Мужские', 'id': 'rtr'},
        {name: 'Женские', 'id': 'dfr'},
    ];
    const range = Array.from({length: 10 - 1 + 1}, (_, i) => i + 1);
    return (
        <div className="w-full flex items-center flex-col">
            <div className="flex justify-center flex-col sm:flex-row">
                <div className="flex items-center justify-center mt-10 m-1 sm:w-1/2 ">
                    <CommonDropdown
                        number={'1'} name={'Тип'} text={'Выберите несколько типов'}
                        dictList={dictList}></CommonDropdown>
                    <CommonDropdown
                        number={'2'} name={'Сезонность'} text={'Выберите сезон'}
                        dictList={dictList}></CommonDropdown>
                </div>
                <div className="flex  flex-col sm:flex-row mt-2 sm:mt-10 items-center justify-center">
                    <div className="flex ml-2 mr-2">
                        <Prices></Prices>
                        <CommonDropdown
                            number={'3'} name={'Сортировать'} text={'Выберите сортировку'}
                            dictList={dictList}></CommonDropdown>
                    </div>
                </div>
            </div>
            <div className="flex justify-center flex-wrap mt-4">
                {range.map((number) => (
                    <DataList></DataList>
                ))}
            </div>
            <div className="flex w-full justify-center  mt-3 mb-3">
                <button disabled
                        className="flex items-center w-1/7 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor"
                         aria-hidden="true" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
                    </svg>
                    Назад
                </button>
                <div className="flex items-center w-5/7">
                    <button
                        className="relative h-10 max-h-[40px] w-7 max-w-[40px] select-none
                        rounded-lg bg-gray-900 text-center align-middle font-sans text-xs font-medium
                        uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg
                        hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85]
                         active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        1
                      </span>
                    </button>
                    <button
                        className="relative h-10 max-h-[40px] w-7 max-w-[40px] select-none rounded-lg
                        text-center align-middle font-sans text-xs font-medium uppercase text-gray-900
                        transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none
                        disabled:opacity-50 disabled:shadow-none"
                        type="button">
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        2
                      </span>
                    </button>
                    <button
                        className="relative h-10 max-h-[40px] w-7 max-w-[40px] select-none rounded-lg
                        text-center align-middle font-sans text-xs font-medium uppercase text-gray-900
                        transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none
                        disabled:opacity-50 disabled:shadow-none"
                        type="button">
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        3
                      </span>
                    </button>
                    <button
                        className="relative h-10 max-h-[40px] w-7 max-w-[40px] select-none rounded-lg text-center
                        align-middle font-sans text-xs font-medium uppercase text-gray-900 transition-all
                        hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50
                        disabled:shadow-none"
                        type="button">
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        4
                      </span>
                    </button>
                    <button
                        className="relative h-10 max-h-[40px] w-7 max-w-[40px] select-none rounded-lg
                        text-center align-middle font-sans text-xs font-medium uppercase text-gray-900
                        transition-all hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none
                        disabled:opacity-50 disabled:shadow-none"
                        type="button">
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        5
                      </span>
                    </button>
                </div>
                <button
                    className="flex items-center w-1/7 px-6 py-3 font-sans text-xs font-bold text-center
                    text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10
                    active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button">
                    Вперед
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor"
                         aria-hidden="true" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}
