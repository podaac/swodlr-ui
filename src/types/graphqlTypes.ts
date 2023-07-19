export type OutputSamplingGridType = 'UTM' | 'GEO'

export interface Granule {
    id: string,
    timestamp: string,
    uri: string
}

export type State = 
    'NEW' |
    'UNAVAILABLE' |
    'GENERATING' |
    'ERROR' |
    'READY' |
    'AVAILABLE'

export interface Status {
    id: string,
    product: Product,
    timestamp: string,
    state: State,
    reason?: string
}

export interface Product {
    id: string,
    timestamp: string
    cycle: number,
    pass: number,
    scene: number,
    outputGranuleExtentFlag: boolean
    outputSamplingGridType: OutputSamplingGridType,
    rasterResolution: number,
    utmZoneAdjust?: number,
    mgrsBandAdjust?: number
    granules: Granule[],
    status: Status[]
}

export interface CurrentUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    products: Product[]
}

export interface CurrentUserData {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
}

export interface CurrentUserProducts {
    products: Product[]
}

export interface UserResponse {
    currentUser: CurrentUser
}