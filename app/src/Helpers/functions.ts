'use strict';
import {config, DotenvParseOutput} from 'dotenv';
import * as fs from 'fs';
import {Core} from '@Core/App';
import {spawn} from 'child_process';


export function inArray(arr:string[] | number[] = [], val:string|number): boolean {
    let len = arr.length;
    let i;

    for (i = 0; i < len; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}

export function env(key: string, defaultValue: any = null): string {
    return process.env[key] ? process.env[key] :  defaultValue;
}

/**
 *
 * @param key
 * @param defaultValue
 * @param radix
 */
export function envNumber(key: string, defaultValue: number = null, radix: number): number {
    return process.env[key] ? parseInt(process.env[key], radix) :  defaultValue;
}


/**
 *
 * @param key
 * @param defaultValue
 */
export function envBoolean(key: string, defaultValue: boolean): boolean {
    let value = process.env[key] ? process.env[key] : defaultValue;
    // @ts-ignore
    switch (value) {
        case true:
        case 'true':
        case '1':
        case 'on':
        case 'yes':
            return true;
        default:
            return false;
    }
}


export function loadEnvFile(path: string): boolean | DotenvParseOutput {
    try {
        fs.accessSync(path, fs.constants.R_OK);
        console.log('Load env vars from file: ' + path);
        const dotEnv = config({ path: path });

        if (dotEnv.error !== undefined) {
            console.log('Can not parse .env file in ');
            console.log(dotEnv.error);
            return false;
        }
        return dotEnv.parsed;
    } catch (err) {
        return true;
    }

}
