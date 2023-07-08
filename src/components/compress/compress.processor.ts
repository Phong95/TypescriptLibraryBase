import { ViralViewerRevitProject } from "../../types";
import * as lzstring from "lz-string";

export class CompressProcessor {
    public async decompressed(path: string) {
        let result: ViralViewerRevitProject | null = null;
        let res = await fetch(path);
        if (res) {
            let text = await res.text();
            let decompress = lzstring.decompressFromEncodedURIComponent(text);

            result = JSON.parse(decompress);
        }
        return result;
    }
}