import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        this.components = [...source];
    }

    public clone(): Name {
        const cloned = new StringArrayName([...this.components], this.delimiter);
        MethodFailedException.assert(cloned.isEqual(this), "clone must be equal to original");
        return cloned;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.components.length, "index out of bounds");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");
        this.components.push(c);
    }

    public remove(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.components.length, "index out of bounds");
        this.components.splice(i, 1);
    }

}