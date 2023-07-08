
export interface ViewerOptions {
    container: HTMLElement;
    cameraZUp: boolean;
}
export interface ViralViewerRevitProject {
    Materials: RenderMaterial[];
    StructuralGeometries: ViralViewerRevitStructuralGeometry[];
    NoneStructuralGeometries: ViralViewerRevitNoneStructuralGeometry[]
}

export interface RenderMaterial {
    Name: String;
    Opacity: number;
    Metalness: number;
    Roughness: number;
    Red: number;
    Green: number;
    Blue: number;
}
export interface ViralViewerRevitStructuralGeometry {
    MaterialIndex: number;
    Vertices: ViralPoint[];
    Indices: number[];
}
export interface ViralViewerRevitNoneStructuralGeometry {
    MaterialIndex: number;
    Vertices: ViralPoint[];
    Indices: number[];
    Name: string;
    Instances: RevitTransform[];
}
export interface ViralPoint {
    X: number;
    Y: number;
    Z: number;
}
export interface RevitTransform {
    BasisX: ViralPoint;
    BasisY: ViralPoint;
    BasisZ: ViralPoint;
    Offset: ViralPoint;
}
export interface ViralViewerState{
    CameraPoint:ViralPoint;
    TargetPoint:ViralPoint;
}