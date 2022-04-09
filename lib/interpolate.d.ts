import type { Tokenizer } from "fsm-tokenizer";
import type { Interpolation } from "./types.js";
export declare function interpolate<T, S>(tokenize: Tokenizer<T, S>, strings: TemplateStringsArray, values: string[]): Iterable<T | Interpolation>;
