import { STORAGE_KEYS } from "@constants/storage";
import { User } from "@model/auth";

export default class UserStorage {
    static getToken(storage: Storage = localStorage): string | null {
        return storage.getItem(STORAGE_KEYS.TOKEN) ?? null
    }

    static getUser(storage: Storage = localStorage): User | null {
        const userJSON = localStorage.getItem(STORAGE_KEYS.USER);

        if(!userJSON) {
            throw new Error('FailLoad')      
        }

        return JSON.parse(userJSON);
    }

    static setToken(token: string, storage: Storage = localStorage): void {
        storage.setItem(STORAGE_KEYS.TOKEN, token);
    }

    static setUser(user:User, storage: Storage = localStorage): void {
        storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }

    static clearStorage(): void {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        sessionStorage.removeItem(STORAGE_KEYS.USER);
        sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
}