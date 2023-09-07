import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useFirebase } from './FirebaseContext';
import axios, { AxiosResponse } from 'axios';

export interface ApiContext {
    get: (url: string, payload: any, headers?: any, abortController?: AbortController) => Promise<AxiosResponse>;
    post: (url: string, payload: any, headers?: any, abortController?: AbortController) => Promise<AxiosResponse>;
    put: (url: string, payload: any, headers?: any, abortController?: AbortController) => Promise<AxiosResponse>;
    delete: (url: string, payload: any, headers?: any, abortController?: AbortController) => Promise<AxiosResponse>;
}

const ApiContext = createContext<ApiContext>({} as ApiContext);
export default ApiContext;

export function useApi() {
    return useContext(ApiContext);
}

export function ApiProvider({ children }: any) {

    const { user } = useFirebase();

    const getUrl = (url: string, payload: any) => {
        let parameterSlice: string[] = [];
        Object.keys(payload).map(key => {
            if (typeof payload[key] === 'object') { //check for apiPayload (input)
                Object.keys(payload[key]).map(k => parameterSlice = [...parameterSlice, k + "=" + encodeURIComponent(payload[key][k])])
            } else { //don't want to map the object; it doesn't work
                parameterSlice = [...parameterSlice, key + "=" + encodeURIComponent(payload[key])]
            }
        })
        const query = parameterSlice.join("&");
        return url + (url.includes("?") ? "&" : "?") + query;
    }

    const functions = () => {
        return {
            get: async (url: string, payload: any, headers?: any, abortController?: AbortController) => {
                let token = await user?.getIdToken();
                return await axios.get(getUrl(url, payload), token ? {
                    signal: abortController?.signal,
                    headers: {
                        ...(headers && { ...headers }),
                        ...(token && { Authorization: token })
                    }
                } : {
                    signal: abortController?.signal
                });
            },
            post: async (url: string, payload: any, headers?: any, abortController?: AbortController) => {
                let token = await user?.getIdToken();
                return await axios.post(url, payload, token ? {
                    signal: abortController?.signal,
                    headers: {
                        ...(headers && { ...headers }),
                        ...(token && { Authorization: token })
                    }
                } : {
                    signal: abortController?.signal
                });
            },
            put: async (url: string, payload: any, headers?: any, abortController?: AbortController) => {
                let token = await user?.getIdToken();
                return await axios.put(url, payload, token ? {
                    signal: abortController?.signal,
                    headers: {
                        ...(headers && { ...headers }),
                        ...(token && { Authorization: token })
                    }
                } : {
                    signal: abortController?.signal
                });
            },
            delete: async (url: string, payload: any, headers?: any, abortController?: AbortController) => {
                let token = await user?.getIdToken();
                return await axios.delete(getUrl(url, payload), token ? {
                    signal: abortController?.signal,
                    headers: {
                        ...(headers && { ...headers }),
                        ...(token && { Authorization: token })
                    }
                } : {
                    signal: abortController?.signal
                });
            }
        }
    }

    const value: ApiContext = functions();

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}
