import React from 'react';
import Link from "next/link";


const DataList = () => {
  return (
      <React.Fragment>
          <div
              className="relative flex w-full sm:w-1/3 md:w-1/4 lg:w-1/5
                    flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-lg ml-3 mt-2">
              <div
                  className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg
                        rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
                  <img
                      src="https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1470&amp;q=80"
                      alt="ui/ux review check"/>
                  <div
                      className="absolute inset-0 w-full h-full to-bg-black-10
                            bg-gradient-to-tr from-transparent via-transparent to-black/60">
                  </div>
                  <button
                      className="!absolute  top-4 right-4 h-8 max-h-[32px] w-8
                            max-w-[32px] select-none rounded-full text-center align-middle
                            font-sans text-xs font-medium uppercase text-white transition-all
                            hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none
                            disabled:opacity-50 disabled:shadow-none"
                      type="button">
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="w-6 h-6">
                                    <path
                                        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z">
                                    </path>
                                </svg>
                            </span>
                  </button>
              </div>
              <div className="p-6 flex-col">
                  <p className="block font-sans text-base antialiased font-light leading-relaxed text-gray-700">
                      Enter a freshly updated and thoughtfully furnished peaceful home
                      surrounded by ancient trees, stone walls, and open meadows.
                  </p>
              </div>
              <div className="p-6 pt-3">
                  <Link href="#"
                        className="block w-full
                      select-none rounded-lg bg-gray-800 py-3.5 px-7
                      text-center align-middle font-sans text-sm font-bold
                      uppercase text-white shadow-md shadow-gray-900/10 transition-all
                      hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85]
                      focus:shadow-none active:opacity-[0.85] active:shadow-none
                      disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  >
                      Подробнее
                  </Link>
                  <button data-modal-target="crud-modal" data-modal-toggle="crud-modal"
                        className="block w-full mt-2
                      select-none rounded-lg bg-indigo-700 py-3.5 px-7
                      text-center align-middle font-sans text-sm font-bold
                      uppercase text-white shadow-md shadow-gray-900/10 transition-all
                      hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85]
                      focus:shadow-none active:opacity-[0.85] active:shadow-none
                      disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                  >
                      Подать заявку
                  </button>
                  <div id="crud-modal" tabIndex={-1} aria-hidden="true"
                       className="hidden fixed top-0 right-0 left-0 z-50 items-center w-full md:inset-0 h-auto">
                      <div className="relative p-4 w-full md:max-w-2xl h-auto">
                          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                              <div
                                  className="flex items-center justify-between p-4 md:p-5
                                  border-b rounded-t dark:border-gray-600">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      Новая заявка
                                  </h3>
                                  <button type="button"
                                          className="text-gray-400 bg-transparent
                                          hover:bg-gray-200 hover:text-gray-900 rounded-lg
                                          text-sm w-8 h-8 ms-auto inline-flex justify-center items-center
                                          dark:hover:bg-gray-600 dark:hover:text-white"
                                          data-modal-toggle="crud-modal">
                                      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                           fill="none" viewBox="0 0 14 14">
                                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                      </svg>
                                      <span className="sr-only">Close modal</span>
                                  </button>
                              </div>
                              <p className="text-sm pr-2 pl-2 text-center"
                              >Рекомендуем измерять размер ноги в конец дня, когда нога более опухшая</p>
                              <form className="p-4 md:p-5">
                                  <div className="overflow-y-auto overflow-x-hidden">
                                      <div
                                          className="flex items-center
                                          sm:justify-between sm:flex-wrap flex-row">
                                          <div className="w-1/2 flex flex-col items-center">
                                              <img className="w-1/2 h-1/2" src="./length.webp"/>
                                              <label htmlFor="name"
                                                     className=" mb-2 text-sm mt-2
                                                 font-medium text-gray-900 dark:text-white">Ширина стопы</label>
                                              <input type="number" name="name" id="name"
                                                     className="bg-gray-50 border border-gray-300
                                                 text-gray-900 text-sm rounded-lg focus:ring-primary-600
                                                 focus:border-primary-600 w-1/2 p-2.5 dark:bg-gray-600
                                                 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white
                                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                     placeholder="см"
                                              />
                                          </div>
                                          <div className="w-1/2 flex flex-col items-center">
                                              <img className="w-1/2 h-1/2" src="./width.webp"/>
                                              <label htmlFor="price"
                                                     className="mb-2 text-sm mt-2
                                                 font-medium text-gray-900 dark:text-white">Длина стопы</label>
                                              <input type="number" name="price" id="price"
                                                     className="bg-gray-50 border border-gray-300 text-gray-900
                                                 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                                                 block w-1/2 p-2.5 dark:bg-gray-600 dark:border-gray-500
                                                 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500
                                                 dark:focus:border-primary-500" placeholder="см"
                                              />
                                          </div>
                                      </div>
                                      <div className="w-full items-center mt-5">
                                          <label htmlFor="message"
                                                 className="block mb-2 text-sm font-medium text-gray-900
                                                 dark:text-white">Комментарий</label>
                                          <textarea id="message" rows={4}
                                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50
                                                    rounded-lg border border-gray-300 focus:ring-blue-500
                                                    focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
                                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                                    dark:focus:border-blue-500"
                                                    placeholder="Введите текст"></textarea>

                                      </div>
                                  </div>
                                  <button type="submit"
                                          className="text-white inline-flex items-center bg-gray-700 mt-4
                                          hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300
                                          font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600
                                          dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                      Отправить
                                  </button>
                              </form>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </React.Fragment>
  );
}

export default DataList
