declare module 'three/examples/jsm/loaders/GLTFLoader' {
  import { Loader } from 'three';
  export class GLTFLoader extends Loader {
    constructor(manager?: any);
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<any>;
    load(url: string, onLoad?: (gltf: any) => void, onProgress?: (event: ProgressEvent) => void, onError?: (err: any) => void): any;
  }
}

declare module 'three/examples/jsm/utils/SkeletonUtils' {
  const SkeletonUtils: any;
  export { SkeletonUtils };
  export default SkeletonUtils;
}
