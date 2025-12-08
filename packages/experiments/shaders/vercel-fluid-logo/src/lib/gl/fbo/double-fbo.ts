import * as THREE from "three";

export class DoubleFbo<
  TTexture extends THREE.Texture | THREE.Texture[] = THREE.Texture,
> {
  private _read: THREE.WebGLRenderTarget<TTexture>;
  private _write: THREE.WebGLRenderTarget<TTexture>;

  constructor(
    width: number,
    height: number,
    options: THREE.RenderTargetOptions = {}
  ) {
    this._read = new THREE.WebGLRenderTarget<TTexture>(width, height, options);
    this._write = new THREE.WebGLRenderTarget<TTexture>(width, height, options);
  }

  get read(): THREE.WebGLRenderTarget<TTexture> {
    return this._read;
  }

  get write(): THREE.WebGLRenderTarget<TTexture> {
    return this._write;
  }

  swap(): void {
    const temp = this._read;
    this._read = this._write;
    this._write = temp;
  }

  /**
   * Sets the size of both internal FBOs.
   * @param width The width of the FBOs.
   * @param height The height of the FBOs.
   */
  setSize(width: number, height: number): void {
    this._read.setSize(width, height);
    this._write.setSize(width, height);
  }

  /**
   * Disposes both internal FBOs. Call this to free WebGL resources.
   */
  dispose(): void {
    this._read.dispose();
    this._write.dispose();
  }

  /**
   * Resets the FBOs with new options. Both read and write FBOs are replaced.
   * @param width The width of the new FBOs.
   * @param height The height of the new FBOs.
   * @param options RenderTargetOptions to use for the new FBOs.
   */
  reset(
    width: number,
    height: number,
    options: THREE.RenderTargetOptions = {}
  ): void {
    this.dispose();
    this._read = new THREE.WebGLRenderTarget<TTexture>(width, height, options);
    this._write = new THREE.WebGLRenderTarget<TTexture>(width, height, options);
  }

  /**
   * Gets the width of the FBOs (using the read FBO).
   */
  get width(): number {
    return this._read.width;
  }

  /**
   * Gets the height of the FBOs (using the read FBO).
   */
  get height(): number {
    return this._read.height;
  }

  /**
   * Gets the texture of the read FBO.
   */
  get texture(): TTexture {
    return this._read.texture;
  }
}
